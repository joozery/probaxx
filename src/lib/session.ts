// Signed session tokens. Runtime-agnostic (Web Crypto) so this works in both
// the Edge middleware and the Node API routes.

const SESSION_COOKIE = 'admin_session'
const encoder = new TextEncoder()

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not defined')
  return secret
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return toBase64Url(sig)
}

export async function signSession(adminId: string): Promise<string> {
  return `${adminId}.${await hmac(adminId)}`
}

// Returns the admin id when the token is present and its signature is valid,
// otherwise null. A forged or tampered token fails here.
export async function verifySession(token: string | undefined | null): Promise<string | null> {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const adminId = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = await hmac(adminId)
  if (sig.length !== expected.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0 ? adminId : null
}

export { SESSION_COOKIE }
