export interface Citation {
  id: string
  title: string
  org: string
  url: string
  usedFor: string
}

export const CITATIONS: Citation[] = [
  {
    id: 'fda-dv',
    title: 'Daily Value on the Nutrition and Supplement Facts Labels',
    org: 'U.S. Food and Drug Administration',
    url: 'https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels',
    usedFor:
      'Label Daily Values: added sugars 50 g, saturated fat 20 g, sodium 2,300 mg, dietary fiber 28 g, protein 50 g, 2,000 kcal reference diet.',
  },
  {
    id: 'fda-added-sugar',
    title: 'Added Sugars on the Nutrition Facts Label',
    org: 'U.S. Food and Drug Administration',
    url: 'https://www.fda.gov/food/nutrition-facts-label/added-sugars-nutrition-facts-label',
    usedFor:
      'Defines added sugars and the 50 g Daily Value based on the Dietary Guidelines 10% of calories example on a 2,000 kcal diet.',
  },
  {
    id: 'aha-sugar',
    title: 'How Much Sugar Is Too Much?',
    org: 'American Heart Association',
    url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/how-much-sugar-is-too-much',
    usedFor:
      'Primary added-sugar upper limit used in the tracker: 25 g/day for most women, 36 g/day for most men.',
  },
  {
    id: 'dga-2025',
    title: 'Dietary Guidelines for Americans, 2025–2030',
    org: 'U.S. Department of Agriculture and U.S. Department of Health and Human Services',
    url: 'https://www.dietaryguidelines.gov/',
    usedFor:
      'Saturated fat < 10% of calories; sodium < 2,300 mg (ages 14+); avoid sugar-sweetened beverages and highly processed salty/sweet foods; estimated calorie needs by age, sex, and activity.',
  },
  {
    id: 'who-sugar',
    title: 'Guideline: Sugars intake for adults and children',
    org: 'World Health Organization',
    url: 'https://www.who.int/publications/i/item/9789241549028',
    usedFor:
      'Free sugars < 10% of total energy, with a further reduction to < 5% suggested for additional benefit. Used as supporting context, not the on-screen default limit.',
  },
  {
    id: 'mifflin',
    title: 'A new predictive equation for resting energy expenditure in healthy individuals (Mifflin-St Jeor)',
    org: 'American Journal of Clinical Nutrition, 1990',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    usedFor:
      'Personalized calorie target when age, sex, height, and weight are provided: BMR × activity factor.',
  },
  {
    id: 'iom-protein-fiber',
    title: 'Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids',
    org: 'Institute of Medicine / National Academies',
    url: 'https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids',
    usedFor:
      'Protein RDA 0.8 g/kg; fiber Adequate Intake 14 g/1,000 kcal (25 g women 19–50, 38 g men 19–50).',
  },
]
