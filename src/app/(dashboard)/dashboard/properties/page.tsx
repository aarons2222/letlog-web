'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Building2, 
  MapPin, 
  Bed, 
  Bath,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data - replace with Supabase query
const mockProperties = [
  {
    id: '1',
    address_line1: '12 Oak Street',
    city: 'Lincoln',
    postcode: 'LN1 3AB',
    property_type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    user_role: 'landlord',
    activeIssues: 2,
    activeTenancy: true
  },
  {
    id: '2',
    address_line1: '45 Elm Avenue',
    address_line2: 'Flat 4',
    city: 'Lincoln',
    postcode: 'LN2 4CD',
    property_type: 'flat',
    bedrooms: 2,
    bathrooms: 1,
    user_role: 'landlord',
    activeIssues: 1,
    activeTenancy: true
  },
  {
    id: '3',
    address_line1: '78 Maple Drive',
    city: 'Newark',
    postcode: 'NG24 5EF',
    property_type: 'house',
    bedrooms: 4,
    bathrooms: 2,
    user_role: 'landlord',
    activeIssues: 0,
    activeTenancy: false
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'tenanted' | 'vacant'>('all')

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = 
      property.address_line1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.postcode.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'tenanted' && property.activeTenancy) ||
      (filter === 'vacant' && !property.activeTenancy)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-slate-400">Manage your property portfolio</p>
        </div>
        <Link 
          href="/dashboard/properties/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors w-fit"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'tenanted', 'vacant'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No properties found</h3>
          <p className="text-slate-400 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first property'}
          </p>
          {!searchQuery && (
            <Link 
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function PropertyCard({ property }: { property: typeof mockProperties[0] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden card-hover">
      {/* Property Image Placeholder */}
      <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <Building2 className="h-12 w-12 text-slate-700" />
      </div>

      <div className="p-4">
        {/* Address */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold">{property.address_line1}</h3>
            {property.address_line2 && (
              <p className="text-slate-400 text-sm">{property.address_line2}</p>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-slate-800 rounded"
            >
              <MoreVertical className="h-5 w-5 text-slate-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-10">
                <Link href={`/dashboard/properties/${property.id}`} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-sm">
                  <Eye className="h-4 w-4" /> View Details
                </Link>
                <Link href={`/dashboard/properties/${property.id}/edit`} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-sm">
                  <Edit className="h-4 w-4" /> Edit
                </Link>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-sm w-full text-red-400">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span>{property.city}, {property.postcode}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1 text-slate-400">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <span className="px-2 py-0.5 bg-slate-800 rounded text-xs capitalize">
            {property.property_type}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            property.activeTenancy 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {property.activeTenancy ? 'Tenanted' : 'Vacant'}
          </span>
          
          {property.activeIssues > 0 && (
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{property.activeIssues} issue{property.activeIssues !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
