import { withClerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/ag-ui-demo',
  '/livekit-demo',
  '/auth-test',
  '/api/health',
  '/api/metrics',
  '/api/copilotkit',
  '/api/livekit/token',
  '/api/webhooks',
  '/sign-in',
  '/sign-up',
]

const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '')
      return pathname.startsWith(baseRoute)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

export default withClerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  // If route is public, allow access
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, check if user is authenticated
  const { userId } = await auth()

  if (!userId) {
    // Redirect unauthenticated users to sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  // If user is signed in and trying to access home page, redirect to admin
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
