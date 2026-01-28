'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Check, ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: 'basic' | 'premium') => {
    setLoading(plan)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error === 'Unauthorized' 
          ? 'Please sign up or log in first to subscribe.' 
          : data.error)
        if (data.error === 'Unauthorized') {
          window.location.href = '/signup'
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const prices = {
    basic: { monthly: '£4.99', yearly: '£49.99', savings: '£9.89' },
    premium: { monthly: '£9.99', yearly: '£99.99', savings: '£19.89' },
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">LetLog</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-400 text-lg mb-8">Start with a 14-day free trial. No credit card required.</p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-slate-800 rounded-xl">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billing === 'monthly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  billing === 'yearly' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  Save 2 months
                </span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-slate-400 text-sm mb-4">Perfect for tenants</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">£0</span>
                <span className="text-slate-400">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '1 property',
                  'Photo inventories',
                  'Issue reporting',
                  'Document storage (100MB)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup"
                className="block w-full py-3 rounded-xl font-medium text-center transition-all bg-slate-800 hover:bg-slate-700"
              >
                Get Started
              </Link>
            </div>

            {/* Basic Tier */}
            <div className="p-8 rounded-2xl border bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
              <h3 className="text-2xl font-bold">Basic</h3>
              <p className="text-slate-400 text-sm mb-4">For small landlords</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">{prices.basic[billing]}</span>
                <span className="text-slate-400">/{billing === 'monthly' ? 'month' : 'year'}</span>
                {billing === 'yearly' && (
                  <div className="text-sm text-emerald-400 mt-1">Save {prices.basic.savings}/year</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 properties',
                  'Tenant management',
                  'Issue/maintenance tracking',
                  'Document storage (1GB)',
                  'Email support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout('basic')}
                disabled={loading === 'basic'}
                className="block w-full py-3 rounded-xl font-medium text-center transition-all bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'basic' ? 'Loading...' : 'Start Free Trial'}
              </button>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-2xl border bg-gradient-to-b from-emerald-900/30 to-slate-900 border-emerald-500/50 scale-105 shadow-xl shadow-emerald-500/10 transition-all">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Most Popular</div>
              <h3 className="text-2xl font-bold">Premium</h3>
              <p className="text-slate-400 text-sm mb-4">For serious investors</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">{prices.premium[billing]}</span>
                <span className="text-slate-400">/{billing === 'monthly' ? 'month' : 'year'}</span>
                {billing === 'yearly' && (
                  <div className="text-sm text-emerald-400 mt-1">Save {prices.premium.savings}/year</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 50 properties',
                  'Everything in Basic',
                  'Advanced reporting & analytics',
                  'Contractor marketplace access',
                  'Compliance tracking',
                  'Document storage (10GB)',
                  'Priority support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleCheckout('premium')}
                disabled={loading === 'premium'}
                className="block w-full py-3 rounded-xl font-medium text-center transition-all bg-emerald-600 hover:bg-emerald-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'premium' ? 'Loading...' : 'Start Free Trial'}
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 text-center">
            <p className="text-slate-400">
              All plans include a 14-day free trial. Cancel anytime.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Questions? Email <a href="mailto:support@letlog.co.uk" className="text-emerald-400 hover:underline">support@letlog.co.uk</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
