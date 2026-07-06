import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySession } from './session'

// Returns the authenticated admin id, or null when there is no valid session.
export async function getSessionAdminId(): Promise<string | null> {
  const cookieStore = await cookies()
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value)
}

// Guard for API route handlers. Returns a 401 NextResponse when unauthenticated,
// or null when the request is authorized:
//
//   const denied = await requireAdmin()
//   if (denied) return denied
export async function requireAdmin(): Promise<NextResponse | null> {
  const adminId = await getSessionAdminId()
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
