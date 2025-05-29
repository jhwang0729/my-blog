import type { Database } from '@/types/database'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication (DO NOT include login page here)
const protectedRoutes = [
  '/admin/', // Only match /admin/ and paths that start with /admin/
  '/notes/edit',
  '/resume/upload',
  '/resume/edit',
  '/api/admin',
]

// Routes that should redirect to admin if user is already authenticated
const authRoutes = ['/admin-login']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname

  // More precise route matching
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.endsWith('/')) {
      // For routes ending with /, match exactly or starting with that path
      return currentPath === route.slice(0, -1) || currentPath.startsWith(route)
    }
    // For other routes, exact match or starting with route + '/'
    return currentPath === route || currentPath.startsWith(route + '/')
  })

  const isAuthRoute = authRoutes.includes(currentPath)

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes (like login page)
  if (isAuthRoute && user) {
    const redirectUrl = new URL('/admin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
