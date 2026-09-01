import { calorieTarget } from '../calculations/energy'
import type { CategoryGuideline, NutrientTarget } from '../calculations/status'
import type { FoodCategory } from '../foods/types'
import type { UserProfile } from '../users/types'

const AHA_ADDED_SUGAR = {
  female: 25,
  male: 36,
} as const

const FDA = {
  addedSugarG: 50,
  saturatedFatG: 20,
  sodiumMg: 2300,
  fiberG: 28,
  proteinG: 50,
  calories: 2000,
} as const

const LINKS = {
  fdaDv:
    'https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels',
  fdaAddedSugar:
    'https://www.fda.gov/food/nutrition-facts-label/added-sugars-nutrition-facts-label',
  ahaSugar: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/how-much-sugar-is-too-much',
  dga: 'https://www.dietaryguidelines.gov/',
  whoSugar: 'https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children',
  mifflin: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
}

export function ahaAddedSugarLimitG(user: UserProfile): number {
  if (user.sex === 'male') return AHA_ADDED_SUGAR.male
  if (user.sex === 'female') return AHA_ADDED_SUGAR.female
  return AHA_ADDED_SUGAR.female
}

export function buildNutrientTargets(user: UserProfile): NutrientTarget[] {
  const energy = calorieTarget(user)
  const satFatG = Math.round((0.1 * energy.kcal) / 9)
  const proteinG =
    user.weightKg != null ? Math.round(0.8 * user.weightKg) : user.sex === 'male' ? 56 : 46
  const fiberG = fiberGoal(user, energy.kcal)

  return [
    {
      id: 'calories',
      label: 'Calories',
      emoji: '🔥',
      unit: 'kcal',
      value: energy.kcal,
      role: 'daily_target',
      kind: energy.kind,
      sourceSummary: energy.method,
      sourceUrl: energy.kind === 'calculated' ? LINKS.mifflin : LINKS.fdaDv,
    },
    {
      id: 'addedSugar',
      label: 'Added sugar',
      emoji: '🍬',
      unit: 'g',
      value: ahaAddedSugarLimitG(user),
      role: 'upper_limit',
      kind: 'established',
      sourceSummary:
        user.sex === 'male'
          ? 'American Heart Association upper limit: no more than 36 g (9 tsp / 150 kcal) of added sugar per day for most men. FDA Daily Value on labels is 50 g based on a 2,000 kcal diet.'
          : 'American Heart Association upper limit: no more than 25 g (6 tsp / 100 kcal) of added sugar per day for most women. FDA Daily Value on labels is 50 g based on a 2,000 kcal diet. Sex is used only when set; otherwise the 25 g AHA value is shown until the profile is completed.',
      sourceUrl: LINKS.ahaSugar,
    },
    {
      id: 'saturatedFat',
      label: 'Saturated fat',
      emoji: '🥓',
      unit: 'g',
      value: satFatG,
      role: 'upper_limit',
      kind: 'calculated',
      sourceSummary: `Dietary Guidelines for Americans: saturated fat should not exceed 10% of total daily calories. At ${energy.kcal.toLocaleString()} kcal that is ${satFatG} g (calories × 10% ÷ 9 kcal/g). The FDA Daily Value on labels is 20 g for a 2,000 kcal diet.`,
      sourceUrl: LINKS.dga,
    },
    {
      id: 'sodium',
      label: 'Sodium',
      emoji: '🧂',
      unit: 'mg',
      value: FDA.sodiumMg,
      role: 'upper_limit',
      kind: 'established',
      sourceSummary:
        'Dietary Guidelines for Americans and FDA Daily Value: less than 2,300 mg sodium per day for people ages 14 and older. This is an upper limit, not a target to reach.',
      sourceUrl: LINKS.fdaDv,
    },
    {
      id: 'protein',
      label: 'Protein',
      emoji: '🥚',
      unit: 'g',
      value: proteinG,
      role: 'goal',
      kind: user.weightKg != null ? 'calculated' : 'established',
      sourceSummary:
        user.weightKg != null
          ? `Institute of Medicine RDA: 0.8 g protein per kg body weight (${user.weightKg} kg × 0.8 = ${proteinG} g). This is a goal, not an upper limit.`
          : `Institute of Medicine reference RDA using standard adult weights (about 46 g for women, 56 g for men). Add body weight in the profile for a personal 0.8 g/kg calculation. This is a goal, not an upper limit.`,
      sourceUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK56068/table/summarytables.t4/?report=objectonly',
    },
    {
      id: 'fiber',
      label: 'Fiber',
      emoji: '🌾',
      unit: 'g',
      value: fiberG,
      role: 'goal',
      kind: 'established',
      sourceSummary:
        'Institute of Medicine Adequate Intake: 14 g fiber per 1,000 kcal, commonly expressed as 25 g/day for women 19–50 and 38 g/day for men 19–50. This is a goal to work toward, not an upper limit.',
      sourceUrl: LINKS.dga,
    },
  ]
}

function fiberGoal(user: UserProfile, kcal: number): number {
  if (user.sex === 'female') return user.age != null && user.age >= 51 ? 21 : 25
  if (user.sex === 'male') return user.age != null && user.age >= 51 ? 30 : 38
  return Math.round((14 * kcal) / 1000)
}

/**
 * Typical added sugar (grams) per logged unit, used only to derive app tracking
 * thresholds. These are not official serving recommendations.
 */
const TYPICAL_ADDED_SUGAR_G: Record<FoodCategory, number> = {
  water: 0,
  cookies: 5,
  chocolate_candy: 8,
  fast_food: 12,
  sugary_drinks: 39,
  desserts: 15,
  snacks: 3,
  other: 10,
}

/** 500 mL bottles per day — 4 bottles = 2 L (about eight 8-oz glasses). */
export const WATER_BOTTLE_GOAL = 4

export function buildCategoryGuidelines(user: UserProfile): CategoryGuideline[] {
  const sugarLimit = ahaAddedSugarLimitG(user)

  const cookies = Math.max(1, Math.round(sugarLimit / TYPICAL_ADDED_SUGAR_G.cookies))
  const candy = Math.max(1, Math.round(sugarLimit / TYPICAL_ADDED_SUGAR_G.chocolate_candy))
  const desserts = Math.max(1, Math.round(sugarLimit / TYPICAL_ADDED_SUGAR_G.desserts))

  return [
    {
      category: 'water',
      label: 'Water',
      emoji: '💧',
      unit: 'bottles',
      value: WATER_BOTTLE_GOAL,
      role: 'goal',
      kind: 'app_guideline',
      derivation: `Log each 500 mL bottle you finish. Goal is ${WATER_BOTTLE_GOAL} bottles (${WATER_BOTTLE_GOAL * 500} mL ≈ 2 L) per day — about eight 8-oz glasses. Dietary Guidelines recommend water as your main drink; this is an app hydration goal, not a medical prescription.`,
    },
    {
      category: 'cookies',
      label: 'Cookies',
      emoji: '🍪',
      unit: 'cookies',
      value: cookies,
      kind: 'app_guideline',
      derivation: `There is no official medical limit of “${cookies} cookies per day.” This threshold uses size-weighted cookie units (not just how many you ate): 1 regular packaged cookie ≈ 1 unit (~5 g added sugar). Mini cookies ≈ 0.4 unit. Large bakery Oreo-style (FSCOREO) ≈ 3+ units. Two big bakery cookies can exceed this ${cookies}-unit guideline even though you only ate “2.” Added sugar on the nutrient cards is the stronger check.`,
    },
    {
      category: 'chocolate_candy',
      label: 'Candy',
      emoji: '🍫',
      unit: 'servings',
      value: candy,
      kind: 'app_guideline',
      derivation: `No official body recommends a set number of candy servings. This threshold is derived from the AHA added-sugar upper limit (${sugarLimit} g) divided by ~8 g added sugar in a typical fun-size or small candy serving.`,
    },
    {
      category: 'sugary_drinks',
      label: 'Sugar-sweetened drinks',
      emoji: '🥤',
      unit: 'drinks',
      value: 1,
      kind: 'app_guideline',
      derivation:
        'The Dietary Guidelines for Americans (2025–2030) recommend avoiding sugar-sweetened beverages such as regular sodas, fruit drinks, and energy drinks. A typical 12 fl oz cola contains about 39 g added sugar, which already exceeds the AHA daily upper limit for most women and most men. Diet Coke, Coke Zero, and other 0 g sugar sodas still appear in your log but are not counted here.',
    },
    {
      category: 'fast_food',
      label: 'Fast food',
      emoji: '🍟',
      unit: 'servings',
      value: 1,
      kind: 'app_guideline',
      derivation:
        'There is no official “1 fast-food item per day” recommendation. Dietary Guidelines advise limiting highly processed packaged and restaurant foods that are high in sodium, added sugars, and saturated fat. One serving is an app tracking threshold so a meal is visible on the dashboard; sodium, saturated fat, and calories are the evidence-based checks.',
    },
    {
      category: 'desserts',
      label: 'Desserts',
      emoji: '🍦',
      unit: 'servings',
      value: desserts,
      kind: 'app_guideline',
      derivation: `No official dessert-count limit exists. This threshold is derived from the AHA added-sugar upper limit (${sugarLimit} g) divided by ~15 g added sugar in a typical dessert serving (½ cup ice cream or a small pastry).`,
    },
    {
      category: 'snacks',
      label: 'Snacks',
      emoji: '🍿',
      unit: 'servings',
      value: 2,
      kind: 'app_guideline',
      derivation:
        'There is no official daily chip or cracker count. Two servings is an app threshold for tracking salty packaged snacks. Sodium and calorie totals are the evidence-based limits.',
    },
  ]
}

export { FDA, LINKS, TYPICAL_ADDED_SUGAR_G }
