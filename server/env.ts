export function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> }
  }
  return runtime.process?.env?.[name]
}
