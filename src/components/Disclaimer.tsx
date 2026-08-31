import { Link } from 'react-router-dom'

export function Disclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-ink-soft">
        Educational tracking only — not medical advice.{' '}
        <Link to="/sources" className="font-semibold text-sage underline-offset-2 hover:underline">
          Sources & limits
        </Link>
      </p>
    )
  }

  return (
    <aside className="rounded-3xl border border-line bg-card/70 p-5 text-sm leading-relaxed text-ink-soft">
      <p className="font-semibold text-ink">This is an educational tracker, not a medical device.</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>Nutrition needs vary between people.</li>
        <li>Daily values are estimates unless they come from an established guideline, which is labeled on each card.</li>
        <li>Overall dietary patterns matter more than one food or one day.</li>
        <li>This app does not diagnose or treat medical conditions.</li>
        <li>Personalized medical or nutrition advice should come from a qualified professional.</li>
      </ul>
      <p className="mt-3">
        Cookie, candy, drink, and snack counts are <strong>app tracking thresholds</strong>, not official medical limits.
        Nutrient numbers (added sugar, sodium, saturated fat) are grounded in FDA, AHA, and Dietary Guidelines sources.
      </p>
    </aside>
  )
}
