'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Phone,
  Shield,
  Award,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Quote, ContractorProfile, TradeCategory, TradeCategoryInfo } from '@/lib/supabase/types'

// Mock data
const mockIssue = {
  id: '1',
  title: 'Leaking tap in kitchen',
  trade_category: 'plumbing' as TradeCategory,
  budget_min: 50,
  budget_max: 150,
  tender_deadline: '2026-02-03',
  tender_status: 'quoted'
}

const mockQuotes = [
  {
    id: 'q1',
    amount: 85,
    description: 'Will inspect the tap, replace washers if possible. If tap needs full replacement, will discuss options with you first. Labour only - parts extra if needed.',
    estimated_hours: 1.5,
    materials_included: false,
    materials_cost: null,
    availability_date: '2026-01-30',
    availability_notes: 'Available any morning this week',
    warranty_days: 60,
    status: 'pending' as const,
    created_at: '2026-01-27T10:30:00Z',
    contractor: {
      id: 'c1',
      company_name: 'Swift Plumbing Services',
      rating: 4.9,
      total_reviews: 47,
      total_jobs_completed: 156,
      verified: true,
      trades: ['plumbing', 'heating'] as TradeCategory[]
    }
  },
  {
    id: 'q2',
    amount: 120,
    description: 'Full tap replacement included in price. Will install new Bristan mixer tap (parts included). Old tap removed and disposed of.',
    estimated_hours: 2,
    materials_included: true,
    materials_cost: 45,
    availability_date: '2026-02-01',
    availability_notes: 'Saturday afternoon preferred',
    warranty_days: 365,
    status: 'pending' as const,
    created_at: '2026-01-27T14:15:00Z',
    contractor: {
      id: 'c2',
      company_name: 'Premier Plumbing & Gas',
      rating: 4.7,
      total_reviews: 89,
      total_jobs_completed: 312,
      verified: true,
      trades: ['plumbing', 'gas', 'heating'] as TradeCategory[]
    }
  },
  {
    id: 'q3',
    amount: 65,
    description: 'Washer replacement. If tap needs replacing will quote separately.',
    estimated_hours: 1,
    materials_included: true,
    materials_cost: 5,
    availability_date: '2026-01-29',
    availability_notes: 'Can come tomorrow',
    warranty_days: 30,
    status: 'pending' as const,
    created_at: '2026-01-27T16:45:00Z',
    contractor: {
      id: 'c3',
      company_name: 'Dave\'s Handyman Services',
      rating: 4.2,
      total_reviews: 12,
      total_jobs_completed: 34,
      verified: false,
      trades: ['plumbing', 'general'] as TradeCategory[]
    }
  }
]

export default function QuotesPage() {
  const params = useParams()
  const router = useRouter()
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [quotes, setQuotes] = useState(mockQuotes)

  const handleAccept = async (quoteId: string) => {
    setActionLoading(quoteId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setQuotes(prev => prev.map(q => ({
      ...q,
      status: q.id === quoteId ? 'accepted' as const : 'rejected' as const
    })))
    setActionLoading(null)
  }

  const handleReject = async (quoteId: string) => {
    setActionLoading(quoteId)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setQuotes(prev => prev.map(q => 
      q.id === quoteId ? { ...q, status: 'rejected' as const } : q
    ))
    setActionLoading(null)
  }

  const sortedQuotes = [...quotes].sort((a, b) => {
    // Accepted first, then pending, then rejected
    const statusOrder = { accepted: 0, pending: 1, rejected: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link 
        href={`/dashboard/issues/${params.id}`}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to issue
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
            {TradeCategoryInfo[mockIssue.trade_category].displayName}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
            {quotes.length} Quotes
          </span>
        </div>
        <h1 className="text-2xl font-bold">{mockIssue.title}</h1>
        <p className="text-slate-400 mt-1">
          Budget: £{mockIssue.budget_min} - £{mockIssue.budget_max} • 
          Deadline: {mockIssue.tender_deadline}
        </p>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {sortedQuotes.map((quote, index) => (
          <div 
            key={quote.id}
            className={`bg-slate-800/50 rounded-xl border transition-colors ${
              quote.status === 'accepted' 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : quote.status === 'rejected'
                ? 'border-slate-700/50 opacity-60'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            {/* Quote Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 && quote.status === 'pending' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{quote.contractor.company_name}</h3>
                      {quote.contractor.verified && (
                        <Shield className="h-4 w-4 text-blue-400" title="Verified" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        {quote.contractor.rating} ({quote.contractor.total_reviews} reviews)
                      </span>
                      <span>•</span>
                      <span>{quote.contractor.total_jobs_completed} jobs completed</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-400">£{quote.amount}</p>
                  {quote.materials_included && (
                    <p className="text-xs text-slate-400">inc. £{quote.materials_cost} materials</p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {quote.status !== 'pending' && (
                <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  quote.status === 'accepted' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {quote.status === 'accepted' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Quote Accepted
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Quote Rejected
                    </>
                  )}
                </div>
              )}

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-4 w-4" />
                  {quote.estimated_hours}h estimated
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Available: {quote.availability_date}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Award className="h-4 w-4" />
                  {quote.warranty_days} day warranty
                </span>
              </div>

              {/* Expand/Collapse */}
              <button
                onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 mt-4"
              >
                {expandedQuote === quote.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show details
                  </>
                )}
              </button>
            </div>

            {/* Expanded Details */}
            {expandedQuote === quote.id && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Work Description</h4>
                    <p className="text-slate-200">{quote.description}</p>
                  </div>
                  
                  {quote.availability_notes && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-1">Availability Notes</h4>
                      <p className="text-slate-200">{quote.availability_notes}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Trades</h4>
                    <div className="flex flex-wrap gap-2">
                      {quote.contractor.trades.map(trade => (
                        <span 
                          key={trade}
                          className="px-2 py-1 bg-slate-700 rounded text-xs"
                        >
                          {TradeCategoryInfo[trade].displayName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {quote.status === 'pending' && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => handleAccept(quote.id)}
                  disabled={actionLoading === quote.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {actionLoading === quote.id ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Accept Quote
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(quote.id)}
                  disabled={actionLoading !== null}
                  className="px-6 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  Reject
                </button>
                <button
                  disabled={actionLoading !== null}
                  className="px-6 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {quotes.length === 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
          <Clock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No quotes yet</h3>
          <p className="text-slate-400">
            Contractors matching this trade will see your job and submit quotes.
          </p>
        </div>
      )}
    </div>
  )
}
