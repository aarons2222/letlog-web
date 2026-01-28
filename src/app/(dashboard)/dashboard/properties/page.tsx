import { createClient } from '@/lib/supabase/server'
import PropertiesClient from './PropertiesClient'

export default async function PropertiesPage() {
  const supabase = await createClient()
  
  // Fetch properties with issue counts and tenancy status
  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      address_line1,
      address_line2,
      city,
      postcode,
      property_type,
      bedrooms,
      bathrooms,
      user_role,
      tenancies!left (
        id,
        status
      ),
      issues!left (
        id,
        status
      )
    `)
    .order('created_at', { ascending: false })

  // Transform data
  const transformedProperties = (properties || []).map((property: any) => ({
    id: property.id,
    address_line1: property.address_line1,
    address_line2: property.address_line2,
    city: property.city,
    postcode: property.postcode,
    property_type: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    user_role: property.user_role,
    activeIssues: (property.issues || []).filter((i: any) => 
      i.status === 'open' || i.status === 'in_progress'
    ).length,
    activeTenancy: (property.tenancies || []).some((t: any) => t.status === 'active')
  }))

  return <PropertiesClient properties={transformedProperties} />
}
