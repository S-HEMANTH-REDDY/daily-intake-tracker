export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body != null
  const response = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(hasBody ? { 'content-type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  const text = await response.text()
  const data = text ? (JSON.parse(text) as { error?: string } & T) : ({} as T)
  if (!response.ok) {
    throw new ApiError(
      (data as { error?: string }).error || 'Request failed',
      response.status,
    )
  }
  return data
}
