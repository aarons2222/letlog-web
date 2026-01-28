'use client'

import Link from 'next/link'
import { Building2, ArrowLeft, Clock } from 'lucide-react'

export default function BlogPage() {
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
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Blog Content */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">LetLog Blog</h1>
            <p className="text-slate-400 text-lg">Tips, guides, and news for UK landlords</p>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-16">
            <Clock className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              We're working on helpful content for landlords. Check back soon for guides on property management, compliance tips, and industry news.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-all"
            >
              Get Started with LetLog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
