import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientId } from '@/lib/rate-limit';
import { InventoryReport, PropertyData, Room, Photo } from '@/lib/pdf/inventory-template';
import React from 'react';

export async function POST(req: NextRequest) {
  // Rate limit: 10 exports per minute per IP
  const clientId = getClientId(req.headers);
  const { success } = rateLimit(`inventory-export:${clientId}`, { 
    limit: 10, 
    windowSeconds: 60 
  });
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId, reportType = 'check-in' } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Fetch property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select(`
        id,
        address_line_1,
        address_line_2,
        city,
        postcode,
        property_type,
        bedrooms,
        bathrooms,
        landlord_id,
        profiles!properties_landlord_id_fkey (
          full_name
        )
      `)
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Fetch rooms with photos
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        id,
        name,
        condition,
        notes,
        photos (
          id,
          url,
          caption,
          created_at
        )
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: true });

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
    }

    // Fetch active tenancy
    const { data: tenancy } = await supabase
      .from('tenancies')
      .select(`
        id,
        start_date,
        tenant_id,
        profiles!tenancies_tenant_id_fkey (
          full_name
        )
      `)
      .eq('property_id', propertyId)
      .eq('status', 'active')
      .single();

    // Build property data for PDF
    const address = [
      property.address_line_1,
      property.address_line_2,
      property.city,
    ].filter(Boolean).join(', ');

    const propertyData: PropertyData = {
      id: property.id,
      address,
      postcode: property.postcode || '',
      propertyType: property.property_type || 'Residential',
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      landlordName: (property.profiles as any)?.full_name || 'Unknown',
      tenantName: tenancy ? (tenancy.profiles as any)?.full_name : undefined,
      tenancyStartDate: tenancy?.start_date,
      rooms: (rooms || []).map((room: any): Room => ({
        id: room.id,
        name: room.name,
        condition: room.condition || 'good',
        notes: room.notes,
        photos: (room.photos || []).map((photo: any): Photo => ({
          id: photo.id,
          url: photo.url,
          caption: photo.caption,
          timestamp: photo.created_at,
        })),
      })),
    };

    // Get user's name for "prepared by"
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const preparedBy = userProfile?.full_name || user.email || 'Unknown';

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(InventoryReport, {
        property: propertyData,
        reportType: reportType as 'check-in' | 'check-out' | 'interim',
        reportDate: new Date().toISOString(),
        preparedBy,
      })
    );

    // Generate filename
    const sanitizedAddress = address.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `LetLog-${reportType}-${sanitizedAddress}-${dateStr}.pdf`;

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
