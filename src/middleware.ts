import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Role-based route configuration
const routeConfig = {
  // Routes only landlords can access
  landlordOnly: [
    '/properties',
    '/tenancies', 
    '/compliance',
    '/invite',
  ],
  // Routes only contractors can access
  contractorOnly: [
    '/quotes',
  ],
  // Routes only tenants can access
  tenantOnly: [],
  // Routes accessible by specific roles
  roleAccess: {
    '/tenders': ['landlord', 'contractor'], // Landlords post, contractors browse
    '/issues': ['landlord', 'tenant'], // Both can manage issues
    '/dashboard': ['landlord', 'tenant', 'contractor'],
    '/calendar': ['landlord', 'tenant', 'contractor'],
    '/settings': ['landlord', 'tenant', 'contractor'],
    '/reviews': ['landlord', 'tenant', 'contractor'],
  } as Record<string, string[]>,
  // All protected routes (require authentication)
  protected: [
    '/dashboard',
    '/properties', 
    '/issues',
    '/tenders',
    '/tenancies',
    '/compliance',
    '/quotes',
    '/calendar',
    '/settings',
    '/reviews',
    '/invite',
  ],
  // Auth pages (redirect if already logged in)
  auth: ['/login', '/signup'],
  // Role-specific dashboards/redirects
  roleHomepage: {
    landlord: '/dashboard',
    tenant: '/dashboard',
    contractor: '/tenders',
  } as Record<string, string>,
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if this is a protected path
  const isProtectedPath = routeConfig.protected.some((path) =>
    pathname.startsWith(path)
  )

  // Check if this is an auth path
  const isAuthPath = routeConfig.auth.some((path) =>
    pathname.startsWith(path)
  )

  // Not authenticated - redirect to login for protected routes
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated - redirect away from auth pages
  if (isAuthPath && user) {
    // Get user role to redirect to appropriate homepage
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const role = profile?.role || 'landlord'
    const homepage = routeConfig.roleHomepage[role] || '/dashboard'
    
    const url = request.nextUrl.clone()
    url.pathname = homepage
    return NextResponse.redirect(url)
  }

  // Role-based access control for authenticated users
  if (user && isProtectedPath) {
    // Fetch user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const userRole = profile?.role || 'landlord'

    // Check landlord-only routes
    const isLandlordOnly = routeConfig.landlordOnly.some((path) =>
      pathname.startsWith(path)
    )
    if (isLandlordOnly && userRole !== 'landlord') {
      return redirectToRoleHome(request, userRole, 'This page is for landlords only')
    }

    // Check contractor-only routes
    const isContractorOnly = routeConfig.contractorOnly.some((path) =>
      pathname.startsWith(path)
    )
    if (isContractorOnly && userRole !== 'contractor') {
      return redirectToRoleHome(request, userRole, 'This page is for contractors only')
    }

    // Check tenant-only routes
    const isTenantOnly = routeConfig.tenantOnly.some((path) =>
      pathname.startsWith(path)
    )
    if (isTenantOnly && userRole !== 'tenant') {
      return redirectToRoleHome(request, userRole, 'This page is for tenants only')
    }

    // Check role-specific access
    for (const [path, allowedRoles] of Object.entries(routeConfig.roleAccess)) {
      if (pathname.startsWith(path) && !allowedRoles.includes(userRole)) {
        return redirectToRoleHome(request, userRole, 'You do not have access to this page')
      }
    }
  }

  return supabaseResponse
}

function redirectToRoleHome(request: NextRequest, role: string, message?: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = routeConfig.roleHomepage[role] || '/dashboard'
  if (message) {
    url.searchParams.set('error', message)
  }
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
