import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // Only these routes are public - everything else requires authentication
  publicRoutes: [
    '/',
    '/ag-ui-demo',
    '/livekit-demo',
    '/auth-test',
    '/api/health',
    '/api/metrics',
    '/api/copilotkit',
    '/api/livekit/token',
    '/api/webhooks/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],

  afterAuth(auth, req) {
    const { pathname } = req.nextUrl

    // Debug logging
    console.log(`[MIDDLEWARE] ${pathname} - User: ${auth.userId ? 'authenticated' : 'not authenticated'}`)

    // If user is signed in and trying to access home page, redirect to admin
    if (auth.userId && pathname === '/') {
      console.log(`[MIDDLEWARE] Redirecting authenticated user from / to /admin`)
      return Response.redirect(new URL('/admin', req.url))
    }

    // If user is not signed in and trying to access protected routes, redirect to sign-in
    if (!auth.userId && pathname.startsWith('/admin')) {
      console.log(`[MIDDLEWARE] Redirecting unauthenticated user from ${pathname} to /sign-in`)
      return Response.redirect(new URL('/sign-in', req.url))
    }

    console.log(`[MIDDLEWARE] Allowing access to ${pathname}`)
  }
})

export const config = {
  matcher: [
    // Explicitly match admin routes
    '/admin/:path*',
    // Match auth routes
    '/sign-in/:path*',
    '/sign-up/:path*',
    // Match API routes
    '/api/:path*',
    // Match root
    '/',
  ],
}
