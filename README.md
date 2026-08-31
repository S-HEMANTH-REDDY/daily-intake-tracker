# Daily Intake — Junk Food & Nutrition Tracker

A polished web app for tracking **daily junk/processed food and overall nutrition**. Cookies are one category, not the product.

Core loop:

**Log what you eat → calculate nutrition → compare intake to recommended daily limits → show `EATEN / LIMIT` → warn when limits are exceeded.**

This is an educational tracker, not a medical device.

## Live app

Production URL will be added after Vercel deploy.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- LocalStorage persistence (storage adapter is isolated so login/cloud sync can replace it later)

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

No environment variables are required for the current localStorage version.

## Profiles

Two starter profiles ship with the app:

1. **Hemanth** — editable “my profile.” Complete age, sex, height, weight, and activity for personalized calorie/protein math.
2. **Sreenidhee** — age 23, female. Calorie estimate uses Dietary Guidelines age/sex/activity tables until height and weight are added.

Each profile has isolated food logs, daily totals, nutrition targets, custom foods, and history. Add more people from **You**.

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
  storage/          schema, localStorage adapter, AppProvider
  pages/            Today, Log, History, Profile, Sources, Custom food
```

Nutrition is never duplicated in UI components. `scaleNutrition(food.nutrition, quantity)` is the only multiplier. `computeDailyTotals` is used on Today, Log, and History.

## Persistence & future sync

Data lives in `localStorage` under `daily-intake-tracker:v1`, keyed by user id.

The `StorageAdapter` interface (`load` / `save`) is the seam for later:

- login
- cloud sync
- multi-device
- a real database

No secrets or API keys are used today.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel (framework: Vite).
3. Build command: `npm run build`
4. Output directory: `dist`
5. `vercel.json` already rewrites all routes to `index.html` for client-side routing.

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
