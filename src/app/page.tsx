'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Camera,
  ArrowRight,
  Check,
  Shield,
  Smartphone
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold gradient-text">LetLog</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Property Management
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            The all-in-one platform for landlords, letting agents, and tenants. 
            Track properties, manage tenancies, stay compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-lg transition-all border border-slate-700"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            From property inventories to compliance tracking, LetLog has you covered.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Building2 className="h-6 w-6" />}
              title="Property Portfolio"
              description="Manage unlimited properties with detailed information, photos, and documents all in one place."
            />
            <FeatureCard 
              icon={<Camera className="h-6 w-6" />}
              title="Photo Inventories"
              description="Take timestamped, geotagged photos for move-in/move-out inventories. Generate PDF reports instantly."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Tenancy Management"
              description="Track tenancies, rent payments, deposit schemes, and tenant communications."
            />
            <FeatureCard 
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Issue Tracking"
              description="Log maintenance issues, assign to contractors, and track resolution status."
            />
            <FeatureCard 
              icon={<Bell className="h-6 w-6" />}
              title="Compliance Reminders"
              description="Never miss a gas safety check, EICR, or EPC renewal with automatic reminders."
            />
            <FeatureCard 
              icon={<FileText className="h-6 w-6" />}
              title="Document Storage"
              description="Securely store tenancy agreements, certificates, and receipts linked to each property."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-slate-400 text-center mb-12">
            Start free, upgrade when you need more.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Free"
              price="£0"
              period="forever"
              description="Perfect for tenants"
              features={[
                "1 property",
                "Photo inventories",
                "Issue reporting",
                "Document storage (100MB)"
              ]}
            />
            <PricingCard 
              name="Pro"
              price="£9.99"
              period="per month"
              description="For landlords & agents"
              features={[
                "Up to 10 properties",
                "Unlimited photos",
                "Compliance reminders",
                "PDF reports",
                "Document storage (5GB)",
                "Priority support"
              ]}
              highlighted
            />
            <PricingCard 
              name="Business"
              price="£29.99"
              period="per month"
              description="For agencies"
              features={[
                "Unlimited properties",
                "Team members",
                "API access",
                "Custom branding",
                "Document storage (50GB)",
                "Dedicated support"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to simplify your property management?</h2>
          <p className="text-slate-400 mb-8">
            Join thousands of landlords and agents who trust LetLog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            >
              Start Your Free Trial
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-500" />
              <span className="font-bold gradient-text">LetLog</span>
            </div>
            <div className="flex gap-6 text-slate-400 text-sm">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">iOS & Android apps available</span>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-500 text-sm">
            © 2026 LetLog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 card-hover">
      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}

function PricingCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  highlighted = false 
}: { 
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean 
}) {
  return (
    <div className={`p-6 rounded-xl border ${
      highlighted 
        ? 'bg-emerald-900/20 border-emerald-500/50 scale-105' 
        : 'bg-slate-900/50 border-slate-800'
    }`}>
      {highlighted && (
        <div className="text-xs font-semibold text-emerald-400 uppercase mb-2">Most Popular</div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-slate-400 text-sm">/{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
        highlighted 
          ? 'bg-emerald-600 hover:bg-emerald-500' 
          : 'bg-slate-800 hover:bg-slate-700'
      }`}>
        Get Started
      </button>
    </div>
  )
}
