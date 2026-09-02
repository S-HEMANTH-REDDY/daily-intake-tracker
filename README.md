# Daily Intake — Junk Food & Nutrition Tracker

A polished web app for tracking **daily junk/processed food and overall nutrition**. Cookies are one category, not the product.

Core loop:

**Log what you eat → calculate nutrition → compare intake to recommended daily limits → show `EATEN / LIMIT` → warn when limits are exceeded.**

This is an educational tracker, not a medical device.

## Live app

**https://daily-intake-tracker.vercel.app**

GitHub: [S-HEMANTH-REDDY/daily-intake-tracker](https://github.com/S-HEMANTH-REDDY/daily-intake-tracker)

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Shared Postgres (Neon) so both people see the same logs on the same link

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

Local API needs the same env vars as production (see `.env.example`). Copy to `.env.local` — never commit PINs.

## Profiles

Two fixed accounts. There is no signup and no “add person.”

1. **Hemanth (Admin)** — can view either log and reset today or all logs.


Logs live in the shared database, so the same public URL is consistent on every phone and browser. PIN values are server env vars, not in this repo.

## Two-layer limits

### 1. Nutrient limits (research-backed)

| Nutrient | Role | Default used in-app | Kind |
| --- | --- | --- | --- |
| Added sugar | Upper limit | AHA: 25 g/day most women, 36 g/day most men | Established |
| Sodium | Upper limit | 2,300 mg/day (FDA DV / DGA, ages 14+) | Established |
| Saturated fat | Upper limit | 10% of calorie target ÷ 9 kcal/g | Calculated from DGA |
| Calories | Daily target | Mifflin-St Jeor × activity, or DGA tables, or FDA 2,000 kcal reference | Calculated / established |
| Protein | Goal | 0.8 g/kg when weight is set | Established / calculated |
| Fiber | Goal | IOM AI: 25 g women 19–50, 38 g men 19–50 | Established |

FDA label Daily Values (50 g added sugar, 20 g saturated fat, 2,000 kcal) are cited as the Nutrition Facts reference diet. They are **not** silently used as everyone’s personal target.

There is **no official medical limit** of “5 cookies” or “2 sodas.”

### 2. Food-category tracking thresholds (app-created)

These exist so the dashboard can show `2 / 5 cookies` style counts. Each card explains the derivation.

- **Cookies** — AHA added-sugar limit ÷ ~5 g added sugar in a typical packaged sandwich cookie (one Oreo). For 25 g that is **5 cookies**. A Chick-fil-A cookie (~26 g sugar) can use most of that budget in one serving; the nutrient layer is the meaningful check.
- **Candy** — AHA sugar limit ÷ ~8 g per small serving.
- **Sugary drinks** — **1 drink** tracking threshold. DGA 2025–2030 recommends *avoiding* sugar-sweetened beverages. A 12 oz cola (~39 g sugar) already exceeds the AHA daily sugar limit.
- **Fast food** — 1 serving tracking threshold. Sodium/calories are the evidence-based checks.
- **Desserts** — AHA sugar limit ÷ ~15 g per typical serving.
- **Snacks** — 2 servings for packaged salty snacks.

Status colors (neutral language only):

- 🟢 Within guideline
- 🟡 Approaching (80%+)
- 🔴 Exceeded

## Architecture

```text
src/
  users/            profiles + seed users
  foods/            catalog, search, custom foods
  nutrition/        NutrientProfile + scale/sum (single source of truth)
  calculations/     dates, energy, status, daily totals
  recommendations/  personalization + citations
  daily-log/        day view hook
  history/          snapshots, averages
  statistics/       days over/under guidelines
  components/       FoodCard, IntakeCounter, ProgressBar, NutrientCard, …
  storage/          AppProvider + API client
  server/           PIN session, Postgres, API router
  api/              Vercel functions
  pages/            Today, Log, History, Profile, Sources, Custom food
```

Nutrition is never duplicated in UI components. `scaleNutrition(food.nutrition, quantity)` is the only multiplier. `computeDailyTotals` is used on Today, Log, and History.

## Persistence

Food logs, custom foods, and profiles are stored in Neon Postgres. Sign-in is a per-person PIN in an httpOnly cookie. PINs and `SESSION_SECRET` are Vercel environment variables (sensitive). They are not shipped in client JavaScript.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Attach Neon (`npx vercel integration add neon`) and set `PIN_HEMANTH`, `PIN_SREENIDHEE`, and `SESSION_SECRET`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. `vercel.json` sends non-API routes to `index.html`.

```bash
npx vercel --prod
```

## Health & safety

- Nutrition needs vary.
- Daily values are estimates unless labeled as an established guideline.
- Overall dietary patterns matter more than one food or one day.
- The app does not diagnose or treat medical conditions.
- Personalized advice should come from a qualified professional.

## License

Private / personal use unless you add a license.
