import { ACCOUNTS, getAccount, pinFor, type Role } from './accounts'

const COOKIE = 'intake_session'
const MAX_AGE_SEC = 60 * 60 * 24 * 30

export interface Session {
  userId: string
  role: Role
  viewingUserId: string
}

function secret(): string {
  const value = process.env.SESSION_SECRET?.trim()
  if (!value) throw new Error('SESSION_SECRET is not set')
  return value
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return bufferToB64url(sig)
}

function bufferToB64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64url(text: string): string {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromB64url(text: string): string {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4)
  return atob(padded)
}

export async function signSession(session: Session): Promise<string> {
  const payload = b64url(JSON.stringify(session))
  const signature = await hmac(payload)
  return `${payload}.${signature}`
}

export async function readSession(request: Request): Promise<Session | null> {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return null
  const token = decodeURIComponent(match[1])
  const dot = token.lastIndexOf('.')
  if (dot < 0) return null
  const payload = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  const expected = await hmac(payload)
  if (signature !== expected) return null
  try {
    const session = JSON.parse(fromB64url(payload)) as Session
    if (!getAccount(session.userId)) return null
    return session
  } catch {
    return null
  }
}

export function sessionCookie(token: string): string {
  const secure = process.env.VERCEL ? '; Secure' : ''
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secure}`
}

export function clearSessionCookie(): string {
  const secure = process.env.VERCEL ? '; Secure' : ''
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

export function verifyPin(accountId: string, pin: string): { ok: true; role: Role } | { ok: false; error: string } {
  const account = getAccount(accountId)
  if (!account) return { ok: false, error: 'Unknown account' }
  const expected = pinFor(account)
  if (!expected) return { ok: false, error: 'Server PIN is not configured' }
  if (!timingSafeEqual(pin.trim(), expected)) return { ok: false, error: 'That PIN does not match' }
  return { ok: true, role: account.role }
}

export function publicAccounts() {
  return ACCOUNTS.map(({ id, displayName, role }) => ({ id, displayName, role }))
}

export function targetUserId(session: Session, requested?: string | null): string {
  if (session.role === 'admin' && requested && getAccount(requested)) return requested
  if (session.role === 'admin') return session.viewingUserId || session.userId
  return session.userId
}
