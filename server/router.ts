import { getAccount } from './accounts'
import {
  clearSessionCookie,
  publicAccounts,
  readSession,
  sessionCookie,
  signSession,
  targetUserId,
  verifyPin,
} from './auth'
import {
  addOrMergeLog,
  deleteLog,
  insertCustomFood,
  loadCustomFoods,
  loadLogs,
  loadUsers,
  resetLogs,
  updateLogQuantity,
  updateProfile,
} from './data'
import type { Food } from '../src/foods/types'
import type { UserProfile } from '../src/users/types'

function json(data: unknown, status = 200, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })
}

function unauthorized(): Response {
  return json({ error: 'PIN required' }, 401)
}

function forbidden(): Response {
  return json({ error: 'Admin only' }, 403)
}

async function statePayload(userId: string, sessionUserId: string, role: 'admin' | 'member') {
  const allUsers = await loadUsers()
  const users = role === 'admin' ? allUsers : allUsers.filter((u) => u.id === sessionUserId)
  const logs = await loadLogs(userId)
  const customFoods = await loadCustomFoods(userId)
  return {
    users,
    activeUserId: userId,
    sessionUserId,
    customFoods,
    logs,
  }
}

export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '') || '/'
  const method = request.method.toUpperCase()

  try {
    if (path === '/api/accounts' && method === 'GET') {
      return json({ accounts: publicAccounts() })
    }

    if (path === '/api/login' && method === 'POST') {
      const body = (await request.json()) as { accountId?: string; pin?: string }
      const result = verifyPin(body.accountId ?? '', body.pin ?? '')
      if (!result.ok) return json({ error: result.error }, 401)
      const token = await signSession({
        userId: body.accountId!,
        role: result.role,
        viewingUserId: result.role === 'admin' ? 'user-sreenidhee' : body.accountId!,
      })
      return json(
        { ok: true, role: result.role, userId: body.accountId },
        200,
        { 'set-cookie': sessionCookie(token) },
      )
    }

    if (path === '/api/logout' && method === 'POST') {
      return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() })
    }

    const session = await readSession(request)
    if (!session) return unauthorized()

    if (path === '/api/me' && method === 'GET') {
      const account = getAccount(session.userId)
      return json({
        userId: session.userId,
        role: session.role,
        viewingUserId: targetUserId(session),
        displayName: account?.displayName,
      })
    }

    if (path === '/api/view' && method === 'POST') {
      if (session.role !== 'admin') return forbidden()
      const body = (await request.json()) as { userId?: string }
      if (!body.userId || !getAccount(body.userId)) return json({ error: 'Unknown user' }, 400)
      const token = await signSession({
        userId: session.userId,
        role: 'admin',
        viewingUserId: body.userId,
      })
      const payload = await statePayload(body.userId, session.userId, session.role)
      return json(payload, 200, { 'set-cookie': sessionCookie(token) })
    }

    if (path === '/api/state' && method === 'GET') {
      const userId = targetUserId(session, url.searchParams.get('userId'))
      return json(await statePayload(userId, session.userId, session.role))
    }

    if (path === '/api/logs' && method === 'POST') {
      const body = (await request.json()) as {
        foodId?: string
        quantity?: number
        date?: string
        userId?: string
      }
      const userId = targetUserId(session, body.userId)
      if (session.role !== 'admin' && userId !== session.userId) return forbidden()
      if (!body.foodId || !body.date || !body.quantity) return json({ error: 'Missing fields' }, 400)
      const logs = await addOrMergeLog({
        userId,
        foodId: body.foodId,
        quantity: Number(body.quantity),
        date: body.date,
      })
      return json({ logs })
    }

    if (path === '/api/logs' && method === 'PATCH') {
      const body = (await request.json()) as { id?: string; quantity?: number; userId?: string }
      const userId = targetUserId(session, body.userId)
      if (session.role !== 'admin' && userId !== session.userId) return forbidden()
      if (!body.id || body.quantity == null) return json({ error: 'Missing fields' }, 400)
      const logs = await updateLogQuantity(userId, body.id, Number(body.quantity))
      return json({ logs })
    }

    if (path === '/api/logs' && method === 'DELETE') {
      const body = (await request.json()) as { id?: string; userId?: string }
      const userId = targetUserId(session, body.userId)
      if (session.role !== 'admin' && userId !== session.userId) return forbidden()
      if (!body.id) return json({ error: 'Missing id' }, 400)
      const logs = await deleteLog(userId, body.id)
      return json({ logs })
    }

    if (path === '/api/foods' && method === 'POST') {
      const body = (await request.json()) as { food?: Omit<Food, 'id' | 'isCustom' | 'ownerUserId'>; userId?: string }
      const userId = targetUserId(session, body.userId)
      if (session.role !== 'admin' && userId !== session.userId) return forbidden()
      if (!body.food?.name) return json({ error: 'Missing food' }, 400)
      const created: Food = {
        ...body.food,
        id: `food-${crypto.randomUUID()}`,
        isCustom: true,
        ownerUserId: userId,
      }
      const customFoods = await insertCustomFood(userId, created)
      return json({ food: created, customFoods })
    }

    if (path === '/api/profile' && method === 'PATCH') {
      const body = (await request.json()) as { userId?: string; patch?: Partial<UserProfile> }
      const userId = targetUserId(session, body.userId)
      if (session.role !== 'admin' && userId !== session.userId) return forbidden()
      if (!body.patch) return json({ error: 'Missing patch' }, 400)
      const users = await updateProfile(userId, body.patch)
      return json({ users })
    }

    if (path === '/api/admin/reset' && method === 'POST') {
      if (session.role !== 'admin') return forbidden()
      const body = (await request.json()) as { userId?: string; scope?: 'today' | 'all'; today?: string }
      if (!body.userId || !getAccount(body.userId)) return json({ error: 'Unknown user' }, 400)
      if (body.scope !== 'today' && body.scope !== 'all') return json({ error: 'Invalid scope' }, 400)
      await resetLogs(body.userId, body.scope, body.today ?? '')
      return json({ ok: true })
    }

    return json({ error: 'Not found' }, 404)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return json({ error: message }, 500)
  }
}
