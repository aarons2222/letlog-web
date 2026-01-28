'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  AlertTriangle,
  MapPin,
  Clock,
  Filter,
  ArrowUpRight
} from 'lucide-react'
import { IssueStatus, IssuePriority, TenderStatus, TradeCategoryInfo, TradeCategory } from '@/lib/supabase/types'

interface Issue {
  id: string
  title: string
  description: string
  priority: IssuePriority
  status: IssueStatus
  trade_category: TradeCategory | null
  tender_status: TenderStatus
  created_at: string
  property: {
    id: string
    address: string
    postcode: string
  }
  room: string | null
}

interface IssuesClientProps {
  issues: Issue[]
}

export default function IssuesClient({ issues }: IssuesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all')

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const statusCounts = {
    all: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Issues</h1>
          <p className="text-slate-400">Track and manage property issues</p>
        </div>
        <Link 
          href="/dashboard/issues/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors w-fit"
        >
          <Plus className="h-5 w-5" />
          Report Issue
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            <span className="ml-2 text-xs opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as IssuePriority | 'all')}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
            <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No issues found</h3>
            <p className="text-slate-400 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters' 
                : 'No issues have been reported yet'}
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <Link 
                href="/dashboard/issues/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-5 w-5" />
                Report Issue
              </Link>
            )}
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const priorityColors: Record<string, string> = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-amber-500/20 text-amber-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
  }

  const statusColors: Record<string, string> = {
    open: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    resolved: 'bg-emerald-500/20 text-emerald-400',
    closed: 'bg-slate-500/20 text-slate-400',
  }

  const statusLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  }

  const tenderLabels: Record<string, string> = {
    not_tendered: '',
    open: 'Tender Open',
    quoted: 'Has Quotes',
    assigned: 'Assigned',
    completed: 'Work Done'
  }

  return (
    <Link 
      href={`/dashboard/issues/${issue.id}`}
      className="block bg-slate-900/50 rounded-xl border border-slate-800 p-6 hover:border-emerald-500/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[issue.status]}`}>
              {statusLabels[issue.status]}
            </span>
            {issue.trade_category && TradeCategoryInfo[issue.trade_category] && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                {TradeCategoryInfo[issue.trade_category].displayName}
              </span>
            )}
            {issue.tender_status !== 'not_tendered' && tenderLabels[issue.tender_status] && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                {tenderLabels[issue.tender_status]}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-1 truncate">{issue.title}</h3>
          
          {issue.description && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{issue.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {issue.property.address}
            </span>
            {issue.room && (
              <span className="text-slate-500">• {issue.room}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(issue.created_at)}
            </span>
          </div>
        </div>
        
        <ArrowUpRight className="h-5 w-5 text-slate-500 flex-shrink-0" />
      </div>
    </Link>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
