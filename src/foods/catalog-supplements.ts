import type { Food } from './types'
import { n } from './nutrients'

const zero = n({ calories: 0 })

const FDA_DV =
  'https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels'

function tablet(input: {
  id: string
  name: string
  brand?: string
  servingLabel?: string
  notes: string
  sourceName: string
  sourceUrl?: string
  aliases?: string[]
  nutrition?: ReturnType<typeof n>
}): Food {
  return {
    id: input.id,
    name: input.name,
    brand: input.brand,
    category: 'supplements',
    servingLabel: input.servingLabel ?? '1 tablet',
    increment: 1,
    nutrition: input.nutrition ?? zero,
    source: {
      name: input.sourceName,
      url: input.sourceUrl ?? FDA_DV,
      notes: input.notes,
    },
    aliases: input.aliases,
  }
}

/** Daily multivitamins and single-nutrient tablets — 0 kcal unless noted. Micronutrient amounts are in notes for reference; the app tracks macros only. */
export const EXTRA_SUPPLEMENTS: Food[] = [
  // —— Multivitamins (1 tablet / day) ——
  tablet({
    id: 'mv-mens',
    name: "Multivitamin — Men's (1 tablet)",
    brand: 'One A Day / Centrum style',
    notes:
      'Typical men’s daily multivitamin (One A Day Men’s, Centrum Men, store brand): ~0 kcal. Per tablet often includes vitamin A 3,500 IU, vitamin C 90 mg, vitamin D 25 mcg (1,000 IU), vitamin E 45 IU, B12 18 mcg, folate 400 mcg DFE, iron 0 mg (men’s formulas are usually iron-free), zinc 15 mg, magnesium 50 mg. Log 1 when taken.',
    sourceName: 'One A Day Men’s / Centrum Men — typical US Supplement Facts',
    sourceUrl: 'https://www.oneaday.com/en-us/products/mens-multivitamin',
    aliases: ['mens multivitamin', 'men multivitamin', 'one a day men', 'centrum men', 'mv men'],
  }),
  tablet({
    id: 'mv-womens',
    name: "Multivitamin — Women's (1 tablet)",
    brand: 'One A Day / Centrum style',
    notes:
      'Typical women’s daily multivitamin: ~0 kcal. Per tablet often includes vitamin A 2,500 IU, vitamin C 75 mg, vitamin D 25 mcg, vitamin E 23 IU, B12 6 mcg, folate 400 mcg DFE, iron 18 mg, calcium 200 mg, magnesium 50 mg, zinc 8 mg. Log 1 when taken.',
    sourceName: 'One A Day Women’s / Centrum Women — typical US Supplement Facts',
    sourceUrl: 'https://www.oneaday.com/en-us/products/womens-multivitamin',
    aliases: ['womens multivitamin', 'women multivitamin', 'one a day women', 'centrum women', 'mv women'],
  }),
  tablet({
    id: 'mv-adult',
    name: 'Multivitamin — Adult / General (1 tablet)',
    brand: 'Centrum / Kirkland style',
    notes:
      'General adult daily multivitamin (Centrum Adults, Kirkland Daily Multi): ~0 kcal. Per tablet often includes vitamin A 3,500 IU, vitamin C 90 mg, vitamin D 25 mcg, vitamin E 30 IU, B12 6 mcg, folate 400 mcg DFE, iron 18 mg, calcium 200 mg, magnesium 50 mg, zinc 11 mg. Log 1 when taken.',
    sourceName: 'Centrum Adult — typical US Supplement Facts',
    sourceUrl: 'https://www.centrum.com/en-us/products/centrum-adults-multivitamin',
    aliases: ['multivitamin', 'daily vitamin', 'centrum', 'adult multivitamin', 'mv', 'multi vitamin'],
  }),
  tablet({
    id: 'mv-50plus',
    name: 'Multivitamin — 50+ (1 tablet)',
    brand: 'Centrum Silver style',
    notes:
      '50+ formulas (Centrum Silver, One A Day 50+): ~0 kcal. Lower iron than standard adult; higher B6 and B12. Typical per tablet: vitamin D 25 mcg, B12 25 mcg, calcium 220 mg, magnesium 50 mg, zinc 11 mg, no iron or low iron. Log 1 when taken.',
    sourceName: 'Centrum Silver Adults 50+ — typical US Supplement Facts',
    sourceUrl: 'https://www.centrum.com/en-us/products/centrum-silver-adults-50-plus-multivitamin',
    aliases: ['centrum silver', '50 plus vitamin', 'senior multivitamin', 'mv 50+'],
  }),
  tablet({
    id: 'mv-prenatal',
    name: 'Multivitamin — Prenatal (1 tablet)',
    brand: 'One A Day / Nature Made style',
    notes:
      'Prenatal daily multivitamin: ~0–10 kcal. Per tablet often includes folate/folic acid 800 mcg DFE, iron 27–28 mg, DHA (if combo) 200 mg, iodine 150 mcg, calcium 200–300 mg, vitamin D 25 mcg. Log 1 when taken.',
    sourceName: 'One A Day Prenatal — typical US Supplement Facts',
    sourceUrl: 'https://www.oneaday.com/en-us/products/prenatal-advanced',
    aliases: ['prenatal vitamin', 'prenatal', 'pregnancy vitamin'],
  }),

  // —— Single-nutrient tablets ——
  tablet({
    id: 'vit-d3-2000iu',
    name: 'Vitamin D3 — 2,000 IU (50 mcg)',
    brand: 'Nature Made / store brand',
    notes: 'Cholecalciferol 50 mcg (2,000 IU) per softgel/tablet. 0 kcal. FDA DV for vitamin D is 20 mcg (800 IU) for labeling; many adults supplement 1,000–2,000 IU daily per clinician guidance.',
    sourceName: 'Nature Made Vitamin D3 2000 IU — US Supplement Facts',
    sourceUrl: 'https://www.naturemade.com/products/vitamin-d3-2000-iu-50-mcg-tablets',
    aliases: ['vitamin d', 'vit d', 'd3', 'cholecalciferol', 'vitamin d 2000'],
  }),
  tablet({
    id: 'vit-d3-1000iu',
    name: 'Vitamin D3 — 1,000 IU (25 mcg)',
    brand: 'Nature Made / store brand',
    notes: 'Cholecalciferol 25 mcg (1,000 IU) per tablet. 0 kcal.',
    sourceName: 'Nature Made Vitamin D3 1000 IU — US Supplement Facts',
    aliases: ['vitamin d 1000', 'd3 1000'],
  }),
  tablet({
    id: 'vit-c-500mg',
    name: 'Vitamin C — 500 mg',
    brand: 'Nature Made / store brand',
    notes: 'Ascorbic acid 500 mg per tablet. 0 kcal. FDA DV is 90 mg (men) / 75 mg (women); 500 mg is a common OTC strength.',
    sourceName: 'Nature Made Vitamin C 500 mg — US Supplement Facts',
    aliases: ['vitamin c', 'vit c', 'ascorbic acid', 'vitamin c 500'],
  }),
  tablet({
    id: 'magnesium-oxide-400mg',
    name: 'Magnesium — 400 mg (oxide)',
    brand: 'Nature Made / store brand',
    notes:
      'Magnesium oxide 400 mg per tablet (~240 mg elemental magnesium). 0 kcal. FDA DV for magnesium is 420 mg (men) / 320 mg (women). Oxide is common but less absorbable than citrate/glycinate.',
    sourceName: 'Nature Made Magnesium Oxide 400 mg — US Supplement Facts',
    sourceUrl: 'https://www.naturemade.com/products/magnesium-oxide-400-mg-tablets',
    aliases: ['magnesium', 'mag oxide', 'magnesium oxide', 'mg supplement'],
  }),
  tablet({
    id: 'magnesium-citrate-200mg',
    name: 'Magnesium — 200 mg (citrate)',
    brand: 'Nature Made / store brand',
    notes:
      'Magnesium citrate 200 mg elemental magnesium per serving (often 2 tablets). Log 1 serving = label dose. 0 kcal. Better absorbed than oxide for many people.',
    sourceName: 'Nature Made Magnesium Citrate — US Supplement Facts',
    aliases: ['magnesium citrate', 'mag citrate'],
  }),
  tablet({
    id: 'iron-ferrous-sulfate',
    name: 'Iron — 65 mg elemental (ferrous sulfate)',
    brand: 'Feosol / store brand',
    notes:
      'Ferrous sulfate 325 mg tablets deliver ~65 mg elemental iron (Fe²⁺). 0 kcal. FDA DV for iron is 18 mg. Take only if deficient or as directed — excess iron is harmful. Often taken with vitamin C for absorption.',
    sourceName: 'Feosol Original 65 mg Iron — US Supplement Facts',
    aliases: ['iron', 'iron pill', 'ferrous sulfate', 'feosol', 'iron tablet'],
  }),
  tablet({
    id: 'calcium-600-d3',
    name: 'Calcium + Vitamin D3 — 600 mg Ca / 20 mcg D',
    brand: 'Caltrate / store brand',
    notes:
      'Calcium carbonate 600 mg elemental calcium + vitamin D3 20 mcg (800 IU) per tablet. 0 kcal. FDA DV for calcium is 1,300 mg (ages 19–50). Space doses if taking >600 mg at once.',
    sourceName: 'Caltrate 600+D3 — US Supplement Facts',
    sourceUrl: 'https://www.caltrate.com/products/caltrate-600d3',
    aliases: ['calcium', 'caltrate', 'calcium vitamin d', 'calcium tablet'],
  }),
  tablet({
    id: 'vit-b12-1000mcg',
    name: 'Vitamin B12 — 1,000 mcg',
    brand: 'Nature Made / store brand',
    notes: 'Cyanocobalamin 1,000 mcg per tablet. 0 kcal. FDA DV is 2.4 mcg; high-dose OTC tablets are common for deficiency or vegan diets.',
    sourceName: 'Nature Made Vitamin B12 1000 mcg — US Supplement Facts',
    aliases: ['b12', 'vitamin b12', 'cyanocobalamin', 'b12 1000'],
  }),
  tablet({
    id: 'zinc-50mg',
    name: 'Zinc — 50 mg',
    brand: 'Nature Made / store brand',
    notes: 'Zinc gluconate or oxide 50 mg elemental zinc per tablet. 0 kcal. FDA DV is 11 mg (men) / 8 mg (women). Do not exceed label dose long-term without medical advice.',
    sourceName: 'Nature Made Zinc 50 mg — US Supplement Facts',
    aliases: ['zinc', 'zinc tablet', 'zinc 50'],
  }),
  tablet({
    id: 'folic-acid-400mcg',
    name: 'Folic Acid — 400 mcg (400 mcg DFE)',
    brand: 'Nature Made / store brand',
    notes: 'Folic acid 400 mcg DFE per tablet. 0 kcal. FDA DV is 400 mcg DFE. Important before/during pregnancy; also used for deficiency.',
    sourceName: 'Nature Made Folic Acid 400 mcg — US Supplement Facts',
    aliases: ['folate', 'folic acid', 'folate 400', 'b9'],
  }),
  tablet({
    id: 'potassium-99mg',
    name: 'Potassium — 99 mg',
    brand: 'Nature Made / store brand',
    notes:
      'Potassium gluconate 99 mg elemental potassium per tablet (OTC supplement strength). 0 kcal. FDA DV is 4,700 mg from food. OTC pills are capped low; prescription KCl is different — do not substitute.',
    sourceName: 'Nature Made Potassium Gluconate 99 mg — US Supplement Facts',
    aliases: ['potassium', 'k supplement', 'potassium gluconate'],
  }),
  tablet({
    id: 'omega3-fish-oil-1000mg',
    name: 'Fish Oil — 1,000 mg (1 softgel)',
    brand: 'Nature Made / Kirkland style',
    servingLabel: '1 softgel',
    notes:
      'Fish oil 1,000 mg per softgel (~300 mg combined EPA+DHA typical). ~10 kcal, 1 g fat per softgel. Supports omega-3 intake; fatty fish remains the dietary gold standard.',
    sourceName: 'Nature Made Fish Oil 1000 mg — US Supplement Facts',
    sourceUrl: 'https://www.naturemade.com/products/fish-oil-1000-mg-softgels',
    nutrition: n({
      calories: 10,
      totalFatG: 1,
      saturatedFatG: 0.2,
      cholesterolMg: 10,
    }),
    aliases: ['fish oil', 'omega 3', 'omega-3', 'dha epa', 'fish oil softgel'],
  }),
  tablet({
    id: 'biotin-10000mcg',
    name: 'Biotin — 10,000 mcg',
    brand: 'Nature’s Bounty / store brand',
    notes: 'Biotin (vitamin B7) 10,000 mcg per tablet. 0 kcal. FDA DV is 30 mcg; high-dose biotin can interfere with some lab tests — tell your clinician.',
    sourceName: 'Nature’s Bounty Biotin 10,000 mcg — US Supplement Facts',
    aliases: ['biotin', 'b7', 'hair skin nails vitamin'],
  }),

  // —— High-potency multivitamins (1 tablet / day) ——
  tablet({
    id: 'mv-mens-max',
    name: "Multivitamin — Men's Max / High Potency (1 tablet)",
    brand: 'One A Day / Centrum Specialist style',
    notes:
      'Extra-strength men’s multi (One A Day Men’s Max, Centrum Specialist Energy): ~5 kcal. Higher B vitamins and minerals than standard — often vitamin D 50 mcg (2,000 IU), B12 18–25 mcg, zinc 15–25 mg, selenium 55–110 mcg, still usually iron-free. Log 1 when taken.',
    sourceName: 'One A Day Men’s Max — typical US Supplement Facts',
    sourceUrl: 'https://www.oneaday.com/en-us/products/mens-max-multivitamin',
    aliases: ['mens max vitamin', 'high potency mens multi', 'mens extra strength', 'one a day max men'],
  }),
  tablet({
    id: 'mv-womens-max',
    name: "Multivitamin — Women's Max / High Potency (1 tablet)",
    brand: 'One A Day / Centrum Specialist style',
    notes:
      'Extra-strength women’s multi: ~5 kcal. Often vitamin D 50 mcg, iron 18 mg, calcium 250 mg, B12 12–25 mcg, biotin 300 mcg, higher antioxidant blend than standard women’s. Log 1 when taken.',
    sourceName: 'One A Day Women’s Max — typical US Supplement Facts',
    sourceUrl: 'https://www.oneaday.com/en-us/products/womens-max-multivitamin',
    aliases: ['womens max vitamin', 'high potency womens multi', 'one a day max women'],
  }),
  tablet({
    id: 'mv-adult-high-potency',
    name: 'Multivitamin — Adult High Potency (1 tablet)',
    brand: 'Kirkland / Nature Made Multi Complete style',
    notes:
      'High-potency general adult (Kirkland Signature Daily Multi, Nature Made Multi Complete): ~5–10 kcal. Often 100%+ DV on most vitamins/minerals in one tablet — vitamin D 25–50 mcg, vitamin C 200–500 mg, B-complex at 100–300% DV, iron 18 mg. Log 1 when taken.',
    sourceName: 'Kirkland Signature Daily Multi — typical US Supplement Facts',
    aliases: ['high potency multivitamin', 'extra strength multi', 'kirkland multivitamin', 'mega multi'],
  }),
  tablet({
    id: 'mv-teen',
    name: 'Multivitamin — Teen (1 tablet)',
    brand: 'One A Day style',
    notes:
      'Teen formulas: ~5 kcal. Higher calories-of-nutrients for growth — often iron 15–18 mg, calcium 300 mg, vitamin D 25 mcg, B12 12 mcg. Log 1 when taken.',
    sourceName: 'One A Day Teen for Him/Her — typical US Supplement Facts',
    aliases: ['teen vitamin', 'teen multivitamin', 'adolescent multi'],
  }),

  // —— High-potency single tablets ——
  tablet({
    id: 'vit-d3-5000iu',
    name: 'Vitamin D3 — 5,000 IU (125 mcg)',
    brand: 'Nature Made / NOW style',
    notes:
      'Cholecalciferol 125 mcg (5,000 IU) per softgel/tablet. 0 kcal. Common high-dose OTC strength for deficiency repletion — use only with lab monitoring or clinician guidance.',
    sourceName: 'Nature Made Vitamin D3 5000 IU — US Supplement Facts',
    aliases: ['vitamin d 5000', 'd3 5000', 'high dose vitamin d', 'd3 125 mcg'],
  }),
  tablet({
    id: 'vit-d3-10000iu',
    name: 'Vitamin D3 — 10,000 IU (250 mcg)',
    brand: 'Nature Made / store brand',
    notes:
      'Cholecalciferol 250 mcg (10,000 IU) per tablet. 0 kcal. Very high OTC dose — typically short-term or prescriber-directed; excess vitamin D can cause hypercalcemia.',
    sourceName: 'High-potency Vitamin D3 10000 IU — typical US Supplement Facts',
    aliases: ['vitamin d 10000', 'd3 10000', 'd3 250 mcg', 'ultra vitamin d'],
  }),
  tablet({
    id: 'vit-c-1000mg',
    name: 'Vitamin C — 1,000 mg',
    brand: 'Nature Made / Emergen-C tablet style',
    notes: 'Ascorbic acid 1,000 mg per tablet. 0 kcal. Double the common 500 mg strength; upper tolerable intake for adults is 2,000 mg/day from supplements.',
    sourceName: 'Nature Made Vitamin C 1000 mg — US Supplement Facts',
    aliases: ['vitamin c 1000', 'vit c 1000', 'high dose vitamin c', 'ascorbic acid 1000'],
  }),
  tablet({
    id: 'vit-e-400iu',
    name: 'Vitamin E — 400 IU (268 mg)',
    brand: 'Nature Made / store brand',
    notes:
      'd-alpha tocopherol 400 IU per softgel. ~5 kcal, 0.5 g fat. FDA DV is 15 mg (22 IU). High-dose vitamin E may increase bleeding risk with anticoagulants.',
    sourceName: 'Nature Made Vitamin E 400 IU — US Supplement Facts',
    nutrition: n({ calories: 5, totalFatG: 0.5, saturatedFatG: 0.1 }),
    servingLabel: '1 softgel',
    aliases: ['vitamin e', 'vit e', 'tocopherol', 'vitamin e 400'],
  }),
  tablet({
    id: 'vit-k2-mk7-100mcg',
    name: 'Vitamin K2 (MK-7) — 100 mcg',
    brand: 'NOW / Life Extension style',
    notes:
      'Menaquinone-7 (MK-7) 100 mcg per tablet. 0 kcal. Often paired with vitamin D for bone/calcium metabolism. Contraindicated with warfarin unless managed by clinician.',
    sourceName: 'NOW Vitamin K-2 MK-7 100 mcg — US Supplement Facts',
    aliases: ['vitamin k2', 'k2 mk7', 'menaquinone', 'vit k2'],
  }),
  tablet({
    id: 'vit-k2-mk7-200mcg',
    name: 'Vitamin K2 (MK-7) — 200 mcg',
    brand: 'NOW / Life Extension style',
    notes: 'Menaquinone-7 (MK-7) 200 mcg per tablet. 0 kcal. High-potency K2 — avoid if on blood thinners without medical clearance.',
    sourceName: 'Life Extension Super K 200 mcg — typical US Supplement Facts',
    aliases: ['vitamin k2 200', 'k2 200', 'high dose k2'],
  }),
  tablet({
    id: 'vit-a-10000iu',
    name: 'Vitamin A — 10,000 IU (3,000 mcg RAE)',
    brand: 'Nature Made / store brand',
    notes:
      'Retinyl palmitate 10,000 IU per softgel. ~5 kcal. FDA DV is 900 mcg RAE (men) / 700 mcg (women). High-dose preformed vitamin A is teratogenic in pregnancy — do not exceed label dose.',
    sourceName: 'Nature Made Vitamin A 10000 IU — US Supplement Facts',
    servingLabel: '1 softgel',
    aliases: ['vitamin a', 'retinol', 'vit a 10000'],
  }),
  tablet({
    id: 'vit-b12-2500mcg',
    name: 'Vitamin B12 — 2,500 mcg',
    brand: 'Nature Made / Jarrow style',
    notes: 'Cyanocobalamin or methylcobalamin 2,500 mcg per sublingual/tablet. 0 kcal. Mid-high OTC dose for deficiency support.',
    sourceName: 'Nature Made Vitamin B12 2500 mcg — US Supplement Facts',
    aliases: ['b12 2500', 'b12 high dose', 'methylcobalamin 2500'],
  }),
  tablet({
    id: 'vit-b12-5000mcg',
    name: 'Vitamin B12 — 5,000 mcg',
    brand: 'Nature Made / Jarrow style',
    notes:
      'Cyanocobalamin or methylcobalamin 5,000 mcg per tablet. 0 kcal. Very high OTC B12 — common for documented deficiency or malabsorption; water-soluble but follow prescriber advice.',
    sourceName: 'Jarrow Methyl B12 5000 mcg — typical US Supplement Facts',
    aliases: ['b12 5000', 'b12 max', 'methyl b12 5000', 'sublingual b12'],
  }),
  tablet({
    id: 'b-complex-high-potency',
    name: 'B-Complex — High Potency (1 tablet)',
    brand: 'Nature Made / Thorne style',
    notes:
      'Full B-complex at 100–800% DV per tablet: B1 25–100 mg, B2 25–50 mg, B3 (niacin) 50–100 mg, B6 25–100 mg, folate 400–800 mcg DFE, B12 100–500 mcg, biotin 300–1,000 mcg, pantothenic acid 50–100 mg. 0–5 kcal. Log 1 when taken.',
    sourceName: 'Nature Made Super B-Complex — typical US Supplement Facts',
    aliases: ['b complex', 'b-complex', 'super b', 'b vitamins', 'stress b'],
  }),
  tablet({
    id: 'niacin-500mg',
    name: 'Niacin (B3) — 500 mg',
    brand: 'Nature Made / Slo-Niacin style',
    notes:
      'Nicotinic acid 500 mg per tablet. 0 kcal. Prescription-strength OTC niacin can cause flushing; used for lipid management only under medical supervision. Not the same as niacinamide.',
    sourceName: 'Nature Made Niacin 500 mg — US Supplement Facts',
    aliases: ['niacin', 'b3', 'nicotinic acid', 'niacin 500', 'flush niacin'],
  }),
  tablet({
    id: 'folate-methylfolate-1000mcg',
    name: 'Folate (L-Methylfolate) — 1,000 mcg DFE',
    brand: 'Jarrow / Metagenics style',
    notes:
      'L-5-methylfolate 1,000 mcg DFE (active folate) per tablet. 0 kcal. High dose for MTHFR variants or deficiency — 2.5× the standard 400 mcg prenatal dose.',
    sourceName: 'Jarrow Methyl Folate 1000 mcg — typical US Supplement Facts',
    aliases: ['methylfolate', 'l-methylfolate', 'folate 1000', 'active folate', '5-mthf'],
  }),
  tablet({
    id: 'magnesium-glycinate-400mg',
    name: 'Magnesium Glycinate — 400 mg elemental',
    brand: 'Doctor\'s Best / Pure Encapsulations style',
    notes:
      'Magnesium bisglycinate ~400 mg elemental magnesium per serving (often 2–4 tablets — log 1 serving = full label dose). 0–5 kcal. High-absorption form; gentler on stomach than oxide.',
    sourceName: 'Doctor\'s Best High Absorption Magnesium — typical US Supplement Facts',
    aliases: ['magnesium glycinate', 'mag glycinate', 'bisglycinate magnesium', 'mag 400'],
  }),
  tablet({
    id: 'magnesium-threonate-2000mg',
    name: 'Magnesium L-Threonate — 2,000 mg',
    brand: 'Life Extension / Magtein style',
    notes:
      'Magnesium L-threonate 2,000 mg per serving (~144 mg elemental Mg). 0–10 kcal. Marketed for cognitive support; log 1 serving per label (often 3 capsules).',
    sourceName: 'Life Extension Neuro-Mag — typical US Supplement Facts',
    servingLabel: '1 serving (per label)',
    aliases: ['magnesium threonate', 'magtein', 'neuro mag', 'brain magnesium'],
  }),
  tablet({
    id: 'iron-bisglycinate-25mg',
    name: 'Iron Bisglycinate — 25 mg elemental',
    brand: 'Thorne / Pure Encapsulations style',
    notes:
      'Iron bisglycinate chelate 25 mg elemental iron per capsule/tablet. 0 kcal. Gentler high-dose form than ferrous sulfate; still monitor ferritin with clinician.',
    sourceName: 'Thorne Iron Bisglycinate 25 mg — typical US Supplement Facts',
    aliases: ['iron bisglycinate', 'gentle iron', 'chelated iron', 'iron 25'],
  }),
  tablet({
    id: 'iron-slow-release-45mg',
    name: 'Iron — 45 mg elemental (slow release)',
    brand: 'Slow Fe style',
    notes:
      'Ferrous sulfate slow-release 45 mg elemental iron per tablet. 0 kcal. Between standard 65 mg and bisglycinate doses; designed to reduce GI upset.',
    sourceName: 'Slow Fe 45 mg Iron — US Supplement Facts',
    aliases: ['slow fe', 'slow release iron', 'iron 45', 'ferrous sulfate slow'],
  }),
  tablet({
    id: 'calcium-1200-d3',
    name: 'Calcium + Vitamin D3 — 1,200 mg Ca / 25 mcg D',
    brand: 'Citracal / Caltrate style',
    notes:
      'Calcium carbonate or citrate 1,200 mg elemental calcium + vitamin D3 25 mcg (1,000 IU) per serving (often 2 tablets). Log 1 serving = label dose. Near daily calcium DV in one dose.',
    sourceName: 'Caltrate 600+D3 Plus Minerals (2 tablets = 1200 mg) — US Supplement Facts',
    servingLabel: '1 serving (per label, often 2 tablets)',
    aliases: ['calcium 1200', 'high dose calcium', 'caltrate 1200'],
  }),
  tablet({
    id: 'zinc-30mg',
    name: 'Zinc — 30 mg',
    brand: 'Nature Made / store brand',
    notes: 'Zinc gluconate 30 mg elemental zinc per tablet. 0 kcal. Moderate-high OTC dose; long-term use >40 mg/day can affect copper absorption.',
    sourceName: 'Nature Made Zinc 30 mg — US Supplement Facts',
    aliases: ['zinc 30', 'zinc gluconate 30'],
  }),
  tablet({
    id: 'selenium-200mcg',
    name: 'Selenium — 200 mcg',
    brand: 'Nature Made / store brand',
    notes:
      'Selenium (selenomethionine or yeast) 200 mcg per tablet. 0 kcal. FDA DV is 55 mcg; upper tolerable intake is 400 mcg/day — do not combine multiple high-selenium products.',
    sourceName: 'Nature Made Selenium 200 mcg — US Supplement Facts',
    aliases: ['selenium', 'selenium 200', 'se supplement'],
  }),
  tablet({
    id: 'iodine-kelp-325mcg',
    name: 'Iodine (Kelp) — 325 mcg',
    brand: 'Nature\'s Way / NOW style',
    notes:
      'Kelp-derived iodine 325 mcg per tablet. 0 kcal. FDA DV is 150 mcg; high dose — avoid if thyroid condition unless directed.',
    sourceName: 'NOW Kelp 325 mcg Iodine — US Supplement Facts',
    aliases: ['iodine', 'kelp', 'iodine 325', 'thyroid supplement'],
  }),
  tablet({
    id: 'chromium-1000mcg',
    name: 'Chromium Picolinate — 1,000 mcg',
    brand: 'Nature Made / store brand',
    notes: 'Chromium picolinate 1,000 mcg per tablet. 0 kcal. FDA DV is 35 mcg; marketed for glucose metabolism — evidence mixed; use cautiously with diabetes meds.',
    sourceName: 'Nature Made Chromium Picolinate 1000 mcg — US Supplement Facts',
    aliases: ['chromium', 'chromium picolinate', 'cr supplement'],
  }),
  tablet({
    id: 'copper-2mg',
    name: 'Copper — 2 mg',
    brand: 'NOW / store brand',
    notes: 'Copper gluconate 2 mg elemental copper per tablet. 0 kcal. FDA DV is 0.9 mg; often taken to balance high-dose zinc supplementation.',
    sourceName: 'NOW Copper Glycinate 2 mg — typical US Supplement Facts',
    aliases: ['copper', 'copper supplement', 'copper 2mg'],
  }),
  tablet({
    id: 'potassium-99mg-x3',
    name: 'Potassium — 99 mg × 3 tablets',
    brand: 'Nature Made / store brand',
    servingLabel: '3 tablets (297 mg K)',
    notes:
      'Three potassium gluconate 99 mg tablets = 297 mg elemental potassium. 0 kcal. Common “take up to 3 daily” OTC labeling; still far below DV from food (4,700 mg).',
    sourceName: 'Nature Made Potassium Gluconate — typical US dosing label',
    aliases: ['potassium 3 tablets', 'potassium high dose otc', 'k 297'],
  }),
  tablet({
    id: 'omega3-fish-oil-1400mg',
    name: 'Fish Oil — 1,400 mg (1 softgel, high EPA/DHA)',
    brand: 'Nordic Naturals / Kirkland style',
    servingLabel: '1 softgel',
    notes:
      'Concentrated fish oil 1,400 mg per softgel (~600–900 mg combined EPA+DHA). ~15 kcal, 1.5 g fat. Higher omega-3 dose than standard 1,000 mg softgels.',
    sourceName: 'Kirkland Signature Fish Oil 1400 mg — US Supplement Facts',
    nutrition: n({
      calories: 15,
      totalFatG: 1.5,
      saturatedFatG: 0.3,
      cholesterolMg: 15,
    }),
    aliases: ['fish oil 1400', 'high epa dha', 'concentrated fish oil', 'omega 3 high dose'],
  }),
  tablet({
    id: 'krill-oil-500mg',
    name: 'Krill Oil — 500 mg (1 softgel)',
    brand: 'MegaRed / store brand',
    servingLabel: '1 softgel',
    notes:
      'Antarctic krill oil 500 mg per softgel (~115 mg EPA+DHA + phospholipids). ~25 kcal, 0.5 g fat. Alternative to fish oil; contains astaxanthin.',
    sourceName: 'MegaRed Krill Oil 500 mg — US Supplement Facts',
    nutrition: n({
      calories: 25,
      totalFatG: 0.5,
      saturatedFatG: 0.1,
      cholesterolMg: 25,
    }),
    aliases: ['krill oil', 'megared', 'krill omega'],
  }),
  tablet({
    id: 'coq10-200mg',
    name: 'CoQ10 (Ubiquinone) — 200 mg',
    brand: 'Qunol / Nature Made style',
    servingLabel: '1 softgel',
    notes:
      'Coenzyme Q10 200 mg per softgel. ~5 kcal. Common high dose for statin-associated muscle symptoms or heart health — evidence mixed; take with fat-containing meal.',
    sourceName: 'Qunol Mega CoQ10 200 mg — US Supplement Facts',
    nutrition: n({ calories: 5, totalFatG: 0.5 }),
    aliases: ['coq10', 'coenzyme q10', 'ubiquinone', 'coq10 200'],
  }),
  tablet({
    id: 'coq10-400mg',
    name: 'CoQ10 (Ubiquinol) — 400 mg',
    brand: 'Qunol / Life Extension style',
    servingLabel: '1 softgel',
    notes: 'Reduced ubiquinol 400 mg per softgel. ~10 kcal. Very high OTC CoQ10 strength.',
    sourceName: 'Qunol Ultra CoQ10 400 mg — typical US Supplement Facts',
    nutrition: n({ calories: 10, totalFatG: 1 }),
    aliases: ['coq10 400', 'ubiquinol', 'coq10 max'],
  }),
  tablet({
    id: 'turmeric-curcumin-1000mg',
    name: 'Turmeric Curcumin — 1,000 mg',
    brand: 'Nature Made / Doctor\'s Best style',
    notes:
      'Turmeric extract standardized to ~95% curcuminoids 1,000 mg per serving (often 2 tablets with black pepper extract). 0–5 kcal. Anti-inflammatory use — may interact with blood thinners.',
    sourceName: 'Doctor\'s Best High Absorption Curcumin — typical US Supplement Facts',
    servingLabel: '1 serving (per label, often 2 tablets)',
    aliases: ['turmeric', 'curcumin', 'turmeric 1000', 'curcuminoids'],
  }),
  tablet({
    id: 'alpha-lipoic-acid-600mg',
    name: 'Alpha Lipoic Acid — 600 mg',
    brand: 'Doctor\'s Best / NOW style',
    notes:
      'ALA 600 mg per tablet. 0 kcal. High-dose antioxidant; sometimes used for neuropathy — discuss with clinician if diabetic.',
    sourceName: 'Doctor\'s Best Alpha-Lipoic Acid 600 mg — US Supplement Facts',
    aliases: ['ala', 'alpha lipoic acid', 'lipoic acid 600', 'r-ala'],
  }),
  tablet({
    id: 'ashwagandha-600mg',
    name: 'Ashwagandha — 600 mg',
    brand: 'Nature Made / KSM-66 style',
    notes:
      'Ashwagandha root extract 600 mg per serving (often 2 × 300 mg tablets). 0–5 kcal. Adaptogen; may affect thyroid and sedatives — not for pregnancy.',
    sourceName: 'Nature Made Ashwagandha KSM-66 — typical US Supplement Facts',
    servingLabel: '1 serving (per label, often 2 tablets)',
    aliases: ['ashwagandha', 'ksm-66', 'adaptogen', 'stress supplement'],
  }),
  tablet({
    id: 'melatonin-5mg',
    name: 'Melatonin — 5 mg',
    brand: 'Natrol / Nature Made style',
    notes:
      'Melatonin 5 mg per tablet. 0 kcal. Higher OTC sleep dose; start low (1–3 mg) if new to melatonin. Short-term use recommended.',
    sourceName: 'Natrol Melatonin 5 mg — US Supplement Facts',
    aliases: ['melatonin', 'melatonin 5', 'sleep aid'],
  }),
  tablet({
    id: 'melatonin-10mg',
    name: 'Melatonin — 10 mg',
    brand: 'Natrol / store brand',
    notes: 'Melatonin 10 mg per tablet. 0 kcal. Maximum common OTC strength — may cause grogginess; not for long-term nightly use without clinician advice.',
    sourceName: 'Natrol Melatonin 10 mg — US Supplement Facts',
    aliases: ['melatonin 10', 'high dose melatonin', 'melatonin max'],
  }),
  tablet({
    id: 'cranberry-500mg',
    name: 'Cranberry Extract — 500 mg',
    brand: 'Nature Made / AZO style',
    notes:
      'Cranberry fruit extract 500 mg per capsule/tablet (often standardized PACs). 0–5 kcal. UTI prevention support — not a substitute for antibiotics when infected.',
    sourceName: 'Nature Made Cranberry 500 mg — US Supplement Facts',
    aliases: ['cranberry', 'cranberry pills', 'uti supplement', 'cranberry extract'],
  }),
  tablet({
    id: 'vitamin-d3-k2-combo',
    name: 'Vitamin D3 + K2 — 5,000 IU D / 100 mcg K2',
    brand: 'Sports Research / NOW style',
    notes:
      'Combo tablet: vitamin D3 125 mcg (5,000 IU) + vitamin K2 MK-7 100 mcg. 0 kcal. Popular high-potency bone stack — avoid with warfarin unless cleared.',
    sourceName: 'Sports Research D3+K2 5000 IU — typical US Supplement Facts',
    aliases: ['d3 k2 combo', 'vitamin d k2', 'd3 and k2', 'bone stack'],
  }),
  tablet({
    id: 'elderberry-1000mg',
    name: 'Elderberry — 1,000 mg',
    brand: 'Nature\'s Way / Sambucol style',
    notes:
      'Black elderberry (Sambucus nigra) extract 1,000 mg per serving. 0–10 kcal. Immune support — evidence limited; not proven to prevent or treat COVID/flu.',
    sourceName: 'Nature\'s Way Sambucus Elderberry 1000 mg — typical US Supplement Facts',
    aliases: ['elderberry', 'sambucus', 'immune supplement', 'elderberry 1000'],
  }),
]
