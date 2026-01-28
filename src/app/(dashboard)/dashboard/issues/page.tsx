import { createClient } from '@/lib/supabase/server'
import IssuesClient from './IssuesClient'

export default async function IssuesPage() {
  const supabase = await createClient()
  
  // Fetch all issues with property info
  const { data: issues } = await supabase
    .from('issues')
    .select(`
      id,
      title,
      description,
      priority,
      status,
      trade_category,
      tender_status,
      created_at,
      updated_at,
      properties!inner (
        id,
        address_line1,
        city,
        postcode
      ),
      rooms (
        name
      )
    `)
    .order('created_at', { ascending: false })

  const formattedIssues = (issues || []).map((issue: any) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description || '',
    priority: issue.priority,
    status: issue.status,
    trade_category: issue.trade_category,
    tender_status: issue.tender_status,
    created_at: issue.created_at,
    property: {
      id: issue.properties.id,
      address: `${issue.properties.address_line1}, ${issue.properties.city}`,
      postcode: issue.properties.postcode
    },
    room: issue.rooms?.name || null
  }))

  return <IssuesClient issues={formattedIssues} />
}
