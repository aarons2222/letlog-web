'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Smartphone,
  Star,
  ChevronDown,
  Wrench,
  Calendar,
  PoundSterling,
  Lock
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">LetLog</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition-colors">FAQ</a>
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
            <Star className="h-4 w-4" />
            <span>Trusted by 2,000+ UK landlords</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Property Management
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The all-in-one platform for landlords, letting agents, and tenants. 
            Track properties, manage tenancies, and stay compliant — all from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/demo"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-lg transition-all border border-slate-700 hover:border-slate-600"
            >
              View Demo
            </Link>
          </div>
          
          {/* App Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-emerald-500/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-slate-400">LetLog Dashboard</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <Building2 className="h-6 w-6 text-emerald-500 mb-2" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-slate-400">Properties</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <Users className="h-6 w-6 text-cyan-500 mb-2" />
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-slate-400">Tenants</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mb-2" />
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-slate-400">Open Issues</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <Bell className="h-6 w-6 text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-slate-400">Reminders</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-32" />
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">2,000+</div>
              <div className="text-slate-400">Active Landlords</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">15,000+</div>
              <div className="text-slate-400">Properties Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">4.9★</div>
              <div className="text-slate-400">App Store Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From property inventories to compliance tracking, LetLog has you covered.
            </p>
          </div>
          
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
              icon={<Wrench className="h-6 w-6" />}
              title="Issue Tracking & Tenders"
              description="Log maintenance issues, send to contractors for quotes, and track resolution status."
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

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400">Get started in minutes, not hours.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <span className="text-2xl font-bold text-emerald-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Properties</h3>
              <p className="text-slate-400">Enter property details, upload photos, and set up rooms in just a few clicks.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <span className="text-2xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Invite Tenants</h3>
              <p className="text-slate-400">Send invite links to tenants so they can report issues and access documents.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <span className="text-2xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Organised</h3>
              <p className="text-slate-400">Get reminders, track issues, and generate reports — all automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Landlords</h2>
            <p className="text-slate-400">See what our users have to say.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="LetLog has completely transformed how I manage my properties. The compliance reminders alone have saved me from missing deadlines."
              author="Sarah M."
              role="Landlord, 8 properties"
              rating={5}
            />
            <TestimonialCard 
              quote="As a letting agent, I needed something that worked for multiple landlords. LetLog's team features are exactly what I was looking for."
              author="James T."
              role="Letting Agent"
              rating={5}
            />
            <TestimonialCard 
              quote="The tenant portal is brilliant. My tenants can report issues with photos and I can track everything in one place."
              author="Michelle R."
              role="Landlord, 3 properties"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Start free, upgrade when you need more.</p>
          </div>
          
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
                "Contractor tender system",
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Got questions? We've got answers.</p>
          </div>
          
          <div className="space-y-4">
            <FAQItem 
              question="Is my data secure?"
              answer="Absolutely. We use bank-level encryption (AES-256) and all data is stored on UK-based servers. We're fully GDPR compliant and never share your data with third parties."
            />
            <FAQItem 
              question="Can tenants use LetLog too?"
              answer="Yes! Tenants can download the app for free and use it to report issues, view documents, and communicate with their landlord. They just need an invite link from you."
            />
            <FAQItem 
              question="Do you have mobile apps?"
              answer="Yes, we have native iOS and Android apps available on the App Store and Google Play. They sync seamlessly with the web dashboard."
            />
            <FAQItem 
              question="Can I cancel anytime?"
              answer="Yes, you can cancel your subscription at any time. Your data remains accessible for 30 days after cancellation, giving you time to export everything."
            />
            <FAQItem 
              question="Do you integrate with other tools?"
              answer="We integrate with popular accounting software and are constantly adding new integrations. Contact us if you need a specific integration."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Ready to simplify your property management?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of landlords and agents who trust LetLog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-emerald-500" />
                <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">LetLog</span>
              </div>
              <p className="text-slate-400 text-sm">Property management made simple for UK landlords and letting agents.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-400">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">iOS & Android apps available</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 LetLog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role, rating }: { quote: string, author: string, role: string, rating: number }) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-300 mb-6 leading-relaxed">"{quote}"</p>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-slate-400">{role}</div>
      </div>
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
    <div className={`p-8 rounded-2xl border transition-all ${
      highlighted 
        ? 'bg-gradient-to-b from-emerald-900/30 to-slate-900 border-emerald-500/50 scale-105 shadow-xl shadow-emerald-500/10' 
        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
    }`}>
      {highlighted && (
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Most Popular</div>
      )}
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-5xl font-bold">{price}</span>
        <span className="text-slate-400">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/signup"
        className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
          highlighted 
            ? 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105' 
            : 'bg-slate-800 hover:bg-slate-700'
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}
