import { 
  Building2, 
  Users, 
  AlertTriangle, 
  Bell,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch real data from Supabase
  const [propertiesRes, tenanciesRes, issuesRes, remindersRes] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact' }),
    supabase.from('tenancies').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('issues').select('id', { count: 'exact' }).in('status', ['open', 'in_progress']),
    supabase.from('compliance_reminders').select('id', { count: 'exact' })
      .is('completed_at', null)
      .lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  ])

  // Fetch recent issues with property info
  const { data: recentIssues } = await supabase
    .from('issues')
    .select(`
      id,
      title,
      priority,
      status,
      properties!inner (
        address_line1,
        city
      )
    `)
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch upcoming reminders with property info
  const { data: upcomingReminders } = await supabase
    .from('compliance_reminders')
    .select(`
      id,
      title,
      reminder_type,
      due_date,
      properties!inner (
        address_line1,
        city
      )
    `)
    .is('completed_at', null)
    .gte('due_date', new Date().toISOString().split('T')[0])
    .order('due_date', { ascending: true })
    .limit(5)

  const stats = {
    properties: propertiesRes.count || 0,
    activeTenancies: tenanciesRes.count || 0,
    openIssues: issuesRes.count || 0,
    upcomingReminders: remindersRes.count || 0
  }

  // Transform data for display
  const formattedIssues = (recentIssues || []).map((issue: any) => ({
    id: issue.id,
    title: issue.title,
    property: `${issue.properties.address_line1}, ${issue.properties.city}`,
    priority: issue.priority,
    status: issue.status
  }))

  const formattedReminders = (upcomingReminders || []).map((reminder: any) => ({
    id: reminder.id,
    title: reminder.title,
    property: `${reminder.properties.address_line1}, ${reminder.properties.city}`,
    dueDate: reminder.due_date,
    type: reminder.reminder_type
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's an overview of your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Properties"
          value={stats.properties}
          icon={<Building2 className="h-5 w-5" />}
          href="/dashboard/properties"
        />
        <StatCard 
          title="Active Tenancies"
          value={stats.activeTenancies}
          icon={<Users className="h-5 w-5" />}
          href="/dashboard/properties"
        />
        <StatCard 
          title="Open Issues"
          value={stats.openIssues}
          icon={<AlertTriangle className="h-5 w-5" />}
          href="/dashboard/issues"
          alert={stats.openIssues > 0}
        />
        <StatCard 
          title="Due Reminders"
          value={stats.upcomingReminders}
          icon={<Bell className="h-5 w-5" />}
          href="/dashboard/reminders"
          alert={stats.upcomingReminders > 0}
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Issues</h2>
            <Link href="/dashboard/issues" className="text-emerald-500 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {formattedIssues.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No open issues</p>
            ) : (
              formattedIssues.map((issue) => (
                <Link 
                  key={issue.id} 
                  href={`/dashboard/issues/${issue.id}`}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{issue.title}</div>
                    <div className="text-slate-400 text-xs">{issue.property}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
            <Link href="/dashboard/reminders" className="text-emerald-500 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {formattedReminders.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No upcoming reminders</p>
            ) : (
              formattedReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{reminder.title}</div>
                    <div className="text-slate-400 text-xs">{reminder.property}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-amber-400">{formatDate(reminder.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction href="/dashboard/properties/new" label="Add Property" icon={<Building2 />} />
          <QuickAction href="/dashboard/issues/new" label="Report Issue" icon={<AlertTriangle />} />
          <QuickAction href="/dashboard/reminders/new" label="Add Reminder" icon={<Bell />} />
          <QuickAction href="/dashboard/documents/upload" label="Upload Document" icon={<TrendingUp />} />
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  href, 
  alert = false 
}: { 
  title: string
  value: number
  icon: React.ReactNode
  href: string
  alert?: boolean
}) {
  return (
    <Link href={href} className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className={`${alert ? 'text-amber-500' : 'text-slate-400'}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </Link>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-amber-500/20 text-amber-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    resolved: 'bg-emerald-500/20 text-emerald-400',
    closed: 'bg-slate-500/20 text-slate-400',
  }
  const labels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.open}`}>
      {labels[status] || status}
    </span>
  )
}

function QuickAction({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
    >
      <span className="text-emerald-500">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
