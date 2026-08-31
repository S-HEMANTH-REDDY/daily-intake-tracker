import { CITATIONS } from '../recommendations/sources'
import { Disclaimer } from '../components/Disclaimer'

export function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Sources & methodology</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Limits in this app are labeled as an established recommendation, a calculated guideline, or an
          app-created tracking threshold. Cookie and soda counts are never presented as medical facts.
        </p>
      </div>

      <section className="card-shadow rounded-3xl bg-card p-5">
        <h2 className="font-display text-2xl">Two layers</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          <li>
            <strong>Nutrient limits and goals</strong> — added sugar, sodium, saturated fat, calories, protein, and
            fiber. These come from FDA Daily Values, the American Heart Association, Dietary Guidelines for
            Americans, and Institute of Medicine DRIs. Upper limits and daily targets are labeled separately.
          </li>
          <li>
            <strong>Food-category tracking thresholds</strong> — cookies, candy, sugary drinks, fast food, desserts,
            snacks. These are app-created so the dashboard can show <span className="num">2 / 5</span> style
            counts. They are derived from typical added sugar (or sodium) per serving versus the nutrient limit,
            and the derivation is printed on each card.
          </li>
        </ol>
      </section>

      <section className="card-shadow rounded-3xl bg-card p-5">
        <h2 className="font-display text-2xl">How calculations work</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>Every food has one nutrition record per serving. Logging multiplies that record by quantity.</li>
          <li>Daily totals are the sum of those scaled records. The same function is used on Today, Log, and History.</li>
          <li>Calories: Mifflin-St Jeor × activity when age, sex, height, and weight are set; otherwise DGA age/sex/activity tables or the FDA 2,000 kcal reference.</li>
          <li>Saturated fat upper limit = 10% of calorie target ÷ 9 kcal/g.</li>
          <li>Added sugar upper limit = AHA 25 g (women) or 36 g (men). FDA 50 g Daily Value is cited as the label reference.</li>
          <li>Sodium upper limit = 2,300 mg (FDA DV / DGA, ages 14+).</li>
          <li>Protein goal = 0.8 g/kg when weight is set; otherwise IOM reference RDAs.</li>
          <li>Fiber goal = IOM Adequate Intake by sex and age (25/38 g for adults 19–50).</li>
          <li>Days reset at local midnight. August 30 and August 31 never share a running total.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Citations</h2>
        {CITATIONS.map((c) => (
          <article key={c.id} className="card-shadow rounded-3xl bg-card p-5">
            <p className="text-xs font-semibold tracking-wide text-sage uppercase">{c.org}</p>
            <h3 className="mt-1 font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{c.usedFor}</p>
            <a href={c.url} className="mt-2 inline-block text-sm font-semibold text-sage" target="_blank" rel="noreferrer">
              Open source
            </a>
          </article>
        ))}
      </section>

      <Disclaimer />
    </div>
  )
}
