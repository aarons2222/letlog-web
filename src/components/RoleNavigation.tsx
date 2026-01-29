'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Building2, Users, Wrench, Briefcase, Receipt,
  AlertTriangle, Star, Calendar, Settings, FileText
} from 'lucide-react';

type Role = 'landlord' | 'tenant' | 'contractor';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['landlord', 'tenant', 'contractor'] },
  { href: '/properties', icon: Building2, label: 'Properties', roles: ['landlord'] },
  { href: '/tenancies', icon: Users, label: 'Tenancies', roles: ['landlord'] },
  { href: '/issues', icon: Wrench, label: 'Issues', roles: ['landlord', 'tenant'] },
  { href: '/tenders', icon: Briefcase, label: 'Tenders', roles: ['landlord', 'contractor'] },
  { href: '/quotes', icon: Receipt, label: 'My Quotes', roles: ['contractor'] },
  { href: '/compliance', icon: AlertTriangle, label: 'Compliance', roles: ['landlord'] },
  { href: '/reviews', icon: Star, label: 'Reviews', roles: ['landlord', 'tenant', 'contractor'] },
  { href: '/calendar', icon: Calendar, label: 'Calendar', roles: ['landlord', 'tenant', 'contractor'] },
  { href: '/settings', icon: Settings, label: 'Settings', roles: ['landlord', 'tenant', 'contractor'] },
];

interface RoleNavigationProps {
  role: Role;
  variant?: 'sidebar' | 'mobile';
}

export function RoleNavigation({ role, variant = 'sidebar' }: RoleNavigationProps) {
  const pathname = usePathname();
  
  // Filter nav items based on user role
  const filteredItems = navItems.filter(item => item.roles.includes(role));

  if (variant === 'mobile') {
    return (
      <nav className="flex overflow-x-auto gap-1 p-2 bg-white border-b">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex flex-col items-center px-4 py-2 rounded-lg whitespace-nowrap ${
                isActive 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}>
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        
        return (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

// Role-specific quick actions
interface QuickAction {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: Role[];
}

const quickActions: QuickAction[] = [
  { href: '/properties/new', icon: Building2, label: 'Add Property', roles: ['landlord'] },
  { href: '/tenancies', icon: Users, label: 'Manage Tenancies', roles: ['landlord'] },
  { href: '/issues/new', icon: Wrench, label: 'Report Issue', roles: ['landlord', 'tenant'] },
  { href: '/tenders/new', icon: Briefcase, label: 'Post Job', roles: ['landlord'] },
  { href: '/tenders', icon: Briefcase, label: 'Browse Jobs', roles: ['contractor'] },
  { href: '/quotes', icon: Receipt, label: 'View My Quotes', roles: ['contractor'] },
  { href: '/compliance', icon: AlertTriangle, label: 'Check Compliance', roles: ['landlord'] },
  { href: '/reviews', icon: Star, label: 'View Reviews', roles: ['landlord', 'tenant', 'contractor'] },
];

export function RoleQuickActions({ role }: { role: Role }) {
  const filteredActions = quickActions.filter(action => action.roles.includes(role));

  return (
    <div className="space-y-2">
      {filteredActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
              <span className="font-medium text-slate-700">{action.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Role display badge
export function RoleBadge({ role }: { role: Role }) {
  const config = {
    landlord: { label: 'Landlord', color: 'bg-blue-100 text-blue-700', icon: Building2 },
    tenant: { label: 'Tenant', color: 'bg-green-100 text-green-700', icon: FileText },
    contractor: { label: 'Contractor', color: 'bg-orange-100 text-orange-700', icon: Wrench },
  };

  const { label, color, icon: Icon } = config[role];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

export default RoleNavigation;
