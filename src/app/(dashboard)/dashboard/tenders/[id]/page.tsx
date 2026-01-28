'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar,
  PoundSterling,
  Camera,
  FileText,
  AlertTriangle,
  Send,
  CheckCircle
} from 'lucide-react'
import { TradeCategory, TradeCategoryInfo } from '@/lib/supabase/types'

// Mock job data
const mockJob = {
  id: '1',
  title: 'Leaking tap in kitchen',
  description: `Kitchen sink tap has been dripping for a week. It's a mixer tap, appears to be the hot water side that's leaking. 

The tenant has tried tightening it but the leak persists. May need new washers or full tap replacement.

Access: Tenant is home Mon-Fri after 6pm and all day weekends.`,
  trade_category: 'plumbing' as TradeCategory,
  priority: 'medium',
  budget_min: 50,
  budget_max: 150,
  tender_deadline: '2026-02-03',
  property: {
    address: '45 High Street',
    city: 'Lincoln',
    postcode: 'LN1 3BN'
  },
  photos: [
    '/placeholder-leak-1.jpg',
    '/placeholder-leak-2.jpg'
  ],
  quotes_count: 2,
  created_at: '2026-01-27',
  landlord: {
    name: 'John Smith',
    properties_count: 5,
    avg_response_time: '< 24 hours'
  }
}

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [quote, setQuote] = useState({
    amount: '',
    description: '',
    estimated_hours: '',
    materials_included: false,
    materials_cost: '',
    availability_date: '',
    availability_notes: '',
    warranty_days: '30'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Quote Submitted!</h1>
        <p className="text-slate-400 mb-6">
          The landlord will review your quote and get back to you soon.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/dashboard/contractor"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link 
            href="/dashboard/tenders"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
          >
            View More Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link 
        href="/dashboard/contractor"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to available jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                mockJob.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                mockJob.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                mockJob.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {mockJob.priority.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                {TradeCategoryInfo[mockJob.trade_category].displayName}
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-4">{mockJob.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {mockJob.property.address}, {mockJob.property.city}, {mockJob.property.postcode}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Posted: {mockJob.created_at}
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-slate-300 whitespace-pre-line">{mockJob.description}</p>
            </div>

            {/* Photos */}
            {mockJob.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {mockJob.photos.map((photo, i) => (
                    <div 
                      key={i} 
                      className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center"
                    >
                      <Camera className="h-8 w-8 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Quote Form */}
          <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit Your Quote
            </h2>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quote Amount (£) *
                </label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={quote.amount}
                    onChange={(e) => setQuote({ ...quote, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your quote"
                    required
                    min="1"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Budget range: £{mockJob.budget_min} - £{mockJob.budget_max}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Work Description *
                </label>
                <textarea
                  value={quote.description}
                  onChange={(e) => setQuote({ ...quote, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Describe what work you'll do, parts needed, etc."
                  required
                />
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={quote.estimated_hours}
                  onChange={(e) => setQuote({ ...quote, estimated_hours: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g. 2"
                />
              </div>

              {/* Materials */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="materials"
                  checked={quote.materials_included}
                  onChange={(e) => setQuote({ ...quote, materials_included: e.target.checked })}
                  className="w-5 h-5 bg-slate-900 border-slate-700 rounded"
                />
                <label htmlFor="materials" className="text-sm">
                  Materials included in quote
                </label>
              </div>

              {quote.materials_included && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Materials Cost (£)
                  </label>
                  <input
                    type="number"
                    value={quote.materials_cost}
                    onChange={(e) => setQuote({ ...quote, materials_cost: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Cost of materials"
                  />
                </div>
              )}

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Earliest Availability
                </label>
                <input
                  type="date"
                  value={quote.availability_date}
                  onChange={(e) => setQuote({ ...quote, availability_date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Availability Notes
                </label>
                <input
                  type="text"
                  value={quote.availability_notes}
                  onChange={(e) => setQuote({ ...quote, availability_notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g. Available mornings only"
                />
              </div>

              {/* Warranty */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Warranty (days)
                </label>
                <select
                  value={quote.warranty_days}
                  onChange={(e) => setQuote({ ...quote, warranty_days: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="0">No warranty</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Quote
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Card */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold mb-3">Budget Range</h3>
            <p className="text-3xl font-bold text-emerald-400">
              £{mockJob.budget_min} - £{mockJob.budget_max}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {mockJob.quotes_count} quotes submitted
            </p>
          </div>

          {/* Deadline Card */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Quote Deadline
            </h3>
            <p className="text-xl font-bold">{mockJob.tender_deadline}</p>
            <p className="text-sm text-slate-400 mt-1">
              Submit before this date
            </p>
          </div>

          {/* Landlord Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold mb-3">About the Landlord</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-400">Name:</span> {mockJob.landlord.name}</p>
              <p><span className="text-slate-400">Properties:</span> {mockJob.landlord.properties_count}</p>
              <p><span className="text-slate-400">Response time:</span> {mockJob.landlord.avg_response_time}</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Tips for Winning
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Be detailed in your description</li>
              <li>• Offer a competitive warranty</li>
              <li>• Show availability flexibility</li>
              <li>• Price fairly within budget</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
