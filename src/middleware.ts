import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const adminId = await verifySession(token)

    // No valid (signed) session cookie → redirect to the login page
    if (!adminId) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
