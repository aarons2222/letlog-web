import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendComplianceReminderEmail } from '@/lib/notifications/email';

// Use service role for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/compliance/reminders
 * 
 * Checks for expiring compliance items and sends reminder emails.
 * Should be called daily via cron job (e.g., Vercel Cron).
 * 
 * Headers:
 * - Authorization: Bearer <CRON_SECRET> (for security)
 */
export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, refresh all compliance statuses
    await supabase.rpc('refresh_all_compliance_statuses');

    // Find items expiring in the next 30 days that haven't been reminded recently
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: expiringItems, error } = await supabase
      .from('compliance_with_property')
      .select('*')
      .lte('expiry_date', thirtyDaysFromNow.toISOString().split('T')[0])
      .gte('expiry_date', new Date().toISOString().split('T')[0])
      .or(`last_reminder_at.is.null,last_reminder_at.lt.${sevenDaysAgo.toISOString()}`);

    if (error) {
      console.error('Error fetching expiring items:', error);
      return NextResponse.json({ error: 'Failed to fetch compliance items' }, { status: 500 });
    }

    if (!expiringItems || expiringItems.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No reminders needed',
        sent: 0 
      });
    }

    // Group by landlord
    const byLandlord = expiringItems.reduce((acc: Record<string, any[]>, item) => {
      const landlordId = item.landlord_id;
      if (!acc[landlordId]) acc[landlordId] = [];
      acc[landlordId].push(item);
      return acc;
    }, {});

    let sentCount = 0;
    const errors: string[] = [];

    // Send reminder emails per landlord
    for (const [landlordId, items] of Object.entries(byLandlord)) {
      // Get landlord profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', landlordId)
        .single();

      if (!profile?.email) continue;

      try {
        await sendComplianceReminderEmail({
          to: profile.email,
          name: profile.full_name || 'Landlord',
          items: items.map(item => ({
            propertyAddress: item.property_address,
            type: formatComplianceType(item.compliance_type),
            expiryDate: new Date(item.expiry_date).toLocaleDateString('en-GB'),
            daysRemaining: Math.ceil(
              (new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
          })),
        });

        // Mark items as reminded
        const itemIds = items.map(i => i.id);
        await supabase
          .from('compliance_items')
          .update({ 
            reminder_sent: true, 
            last_reminder_at: new Date().toISOString() 
          })
          .in('id', itemIds);

        sentCount += items.length;
      } catch (emailError: any) {
        console.error(`Failed to send reminder to ${profile.email}:`, emailError);
        errors.push(`Failed to notify ${profile.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${expiringItems.length} expiring items`,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Compliance reminder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process reminders' },
      { status: 500 }
    );
  }
}

function formatComplianceType(type: string): string {
  const types: Record<string, string> = {
    gas_safety: 'Gas Safety Certificate',
    eicr: 'EICR (Electrical Safety)',
    epc: 'EPC Certificate',
    legionella: 'Legionella Risk Assessment',
    smoke_co: 'Smoke & CO Alarms',
    other: 'Compliance Certificate',
  };
  return types[type] || type;
}

/**
 * GET /api/compliance/reminders
 * 
 * Returns upcoming compliance items for the current user
 */
export async function GET(req: NextRequest) {
  const { createClient: createServerClient } = await import('@/lib/supabase/server');
  const supabaseClient = await createServerClient();
  
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30');

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabaseClient
    .from('compliance_items')
    .select(`
      *,
      properties!inner (
        address_line_1,
        city,
        landlord_id
      )
    `)
    .lte('expiry_date', futureDate.toISOString().split('T')[0])
    .order('expiry_date', { ascending: true });

  if (error) {
    console.error('Error fetching compliance:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}
