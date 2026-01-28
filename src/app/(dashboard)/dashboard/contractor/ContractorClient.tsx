'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle,
  FileText,
  TrendingUp,
  Filter
} from 'lucide-react'
import { TradeCategory, TradeCategoryInfo } from '@/lib/supabase/types'

interface Stats {
  activeQuotes: number
  jobsCompleted: number
  rating: number
  totalEarnings: number
}

interface Quote {
  id: string
  issue_title: string
  amount: number
  status: string
  submitted_at: string
  property_postcode: string
}

interface Job {
  id: string
  title: string
  description: string
  trade_category: TradeCategory
  priority: string
  budget_min: number
  budget_max: number
  tender_deadline: string | null
  property_postcode: string
  quotes_count: number
  created_at: string
}

interface ContractorClientProps {
  stats: Stats
  myQuotes: Quote[]
  availableJobs: Job[]
  myTrades: TradeCategory[]
}

export default function ContractorClient({ 
  stats, 
  myQuotes, 
  availableJobs, 
  myTrades 
}: ContractorClientProps) {
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory | 'all'>('all')

  const filteredJobs = selectedTrade === 'all' 
    ? availableJobs
    : availableJobs.filter(job => job.trade_category === selectedTrade)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
        <p className="text-slate-400 mt-1">Find jobs, submit quotes, and manage your work</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeQuotes}</p>
              <p className="text-sm text-slate-400">Active Quotes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.jobsCompleted}</p>
              <p className="text-sm text-slate-400">Jobs Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
              <p className="text-sm text-slate-400">Average Rating</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">£{stats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Quotes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Quotes</h2>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          {myQuotes.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No quotes submitted yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {myQuotes.map(quote => (
                <div key={quote.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div>
                    <h3 className="font-medium">{quote.issue_title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {quote.property_postcode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quote.submitted_at}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">£{quote.amount}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      quote.status === 'accepted' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : quote.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Jobs</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value as TradeCategory | 'all')}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All My Trades</option>
              {myTrades.map(trade => (
                <option key={trade} value={trade}>
                  {TradeCategoryInfo[trade]?.displayName || trade}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No jobs available matching your trades</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <Link 
                key={job.id} 
                href={`/dashboard/tenders/${job.id}`}
                className="block bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        job.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        job.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {job.priority.toUpperCase()}
                      </span>
                      {job.trade_category && TradeCategoryInfo[job.trade_category] && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                          {TradeCategoryInfo[job.trade_category].displayName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.property_postcode}
                      </span>
                      {job.tender_deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Deadline: {job.tender_deadline}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {job.quotes_count} quotes
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-sm text-slate-400">Budget</p>
                    <p className="text-xl font-bold text-emerald-400">
                      £{job.budget_min} - £{job.budget_max}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
