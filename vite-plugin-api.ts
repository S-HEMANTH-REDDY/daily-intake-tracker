import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleApi } from './server/router'

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api')) {
          next()
          return
        }
        try {
          const host = req.headers.host ?? 'localhost'
          const method = (req.method ?? 'GET').toUpperCase()
          const body =
            method === 'GET' || method === 'HEAD' ? undefined : await readBody(req)
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (!value) continue
            headers.set(key, Array.isArray(value) ? value.join(', ') : value)
          }
          const request = new Request(`http://${host}${url}`, {
            method,
            headers,
            body: body && body.length > 0 ? new Uint8Array(body) : undefined,
          })
          const response = await handleApi(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') return
            res.setHeader(key, value)
          })
          const cookies = response.headers.getSetCookie()
          if (cookies.length > 0) res.setHeader('Set-Cookie', cookies)
          const payload = Buffer.from(await response.arrayBuffer())
          res.end(payload)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          const message = error instanceof Error ? error.message : 'Server error'
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}
