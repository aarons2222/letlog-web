import { createClient } from '@/lib/supabase/server'
import ContractorClient from './ContractorClient'
import { TradeCategory } from '@/lib/supabase/types'

export default async function ContractorDashboard() {
  const supabase = await createClient()
  
  // Fetch contractor profile for current user
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: contractorProfile } = await supabase
    .from('contractor_profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  // Fetch stats
  const [quotesRes, acceptedQuotesRes] = await Promise.all([
    supabase
      .from('quotes')
      .select('id, status, amount', { count: 'exact' })
      .eq('contractor_id', contractorProfile?.id),
    supabase
      .from('quotes')
      .select('amount')
      .eq('contractor_id', contractorProfile?.id)
      .eq('status', 'accepted')
  ])

  const activeQuotes = (quotesRes.data || []).filter(q => q.status === 'pending').length
  const totalEarnings = (acceptedQuotesRes.data || []).reduce((sum, q) => sum + (q.amount || 0), 0)

  const stats = {
    activeQuotes,
    jobsCompleted: contractorProfile?.total_jobs_completed || 0,
    rating: contractorProfile?.rating || 0,
    totalEarnings
  }

  // Fetch my quotes with issue details
  const { data: myQuotes } = await supabase
    .from('quotes')
    .select(`
      id,
      amount,
      status,
      created_at,
      issues!inner (
        title,
        properties!inner (
          postcode
        )
      )
    `)
    .eq('contractor_id', contractorProfile?.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const formattedQuotes = (myQuotes || []).map((q: any) => ({
    id: q.id,
    issue_title: q.issues?.title || 'Unknown',
    amount: q.amount,
    status: q.status,
    submitted_at: new Date(q.created_at).toISOString().split('T')[0],
    property_postcode: q.issues?.properties?.postcode || ''
  }))

  // Fetch available jobs matching contractor's trades
  const myTrades = (contractorProfile?.trades || []) as TradeCategory[]
  
  const { data: availableJobs } = await supabase
    .from('issues')
    .select(`
      id,
      title,
      description,
      trade_category,
      priority,
      budget_min,
      budget_max,
      tender_deadline,
      tender_status,
      created_at,
      properties!inner (
        postcode
      ),
      quotes (
        id
      )
    `)
    .eq('tender_status', 'open')
    .in('trade_category', myTrades.length > 0 ? myTrades : ['general'])
    .order('created_at', { ascending: false })
    .limit(20)

  const formattedJobs = (availableJobs || []).map((job: any) => ({
    id: job.id,
    title: job.title,
    description: job.description || '',
    trade_category: job.trade_category as TradeCategory,
    priority: job.priority,
    budget_min: job.budget_min || 0,
    budget_max: job.budget_max || 0,
    tender_deadline: job.tender_deadline,
    property_postcode: job.properties?.postcode || '',
    quotes_count: (job.quotes || []).length,
    created_at: job.created_at
  }))

  return (
    <ContractorClient 
      stats={stats}
      myQuotes={formattedQuotes}
      availableJobs={formattedJobs}
      myTrades={myTrades}
    />
  )
}
