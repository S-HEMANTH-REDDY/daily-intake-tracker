export function ShutdownPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="card-shadow w-full max-w-lg rounded-[2rem] bg-card px-8 py-12 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-ink-soft uppercase">
          Daily Intake Tracker
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
          This site is offline for now
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink-soft">
          Hemanth has temporarily shut down Daily Intake Tracker.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Your data is safe. The site can be started again anytime — please check back later.
        </p>
        <div className="mt-8 rounded-2xl bg-sage-soft px-4 py-3 text-sm font-medium text-sage">
          Status: paused · can be restarted
        </div>
      </div>
    </main>
  )
}
