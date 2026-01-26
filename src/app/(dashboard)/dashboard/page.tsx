'use client'

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

export default function DashboardPage() {
  // Mock data - replace with real data from Supabase
  const stats = {
    properties: 5,
    activeTenancies: 4,
    openIssues: 3,
    upcomingReminders: 2
  }

  const recentIssues = [
    { id: 1, title: 'Leaking tap in bathroom', property: '12 Oak Street', priority: 'medium', status: 'open' },
    { id: 2, title: 'Heating not working', property: '45 Elm Avenue', priority: 'high', status: 'in_progress' },
    { id: 3, title: 'Broken door lock', property: '12 Oak Street', priority: 'urgent', status: 'open' },
  ]

  const upcomingReminders = [
    { id: 1, title: 'Gas Safety Certificate', property: '12 Oak Street', dueDate: '2026-02-15', type: 'gas_safety' },
    { id: 2, title: 'EICR Due', property: '45 Elm Avenue', dueDate: '2026-03-01', type: 'eicr' },
  ]

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
          trend={{ value: 2, positive: true }}
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
          trend={{ value: 1, positive: false }}
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
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{issue.title}</div>
                  <div className="text-slate-400 text-xs">{issue.property}</div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={issue.priority} />
                  <StatusBadge status={issue.status} />
                </div>
              </div>
            ))}
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
            {upcomingReminders.map((reminder) => (
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
            ))}
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
  trend, 
  href, 
  alert = false 
}: { 
  title: string
  value: number
  icon: React.ReactNode
  trend?: { value: number, positive: boolean }
  href: string
  alert?: boolean
}) {
  return (
    <Link href={href} className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className={`${alert ? 'text-amber-500' : 'text-slate-400'}`}>{icon}</span>
        {trend && (
          <span className={`flex items-center text-xs ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
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
