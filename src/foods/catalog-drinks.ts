import type { Food } from './types'
import type { NutrientProfile } from '../nutrition/types'
import { n, scaleNutrients } from './nutrients'

const BASE_ML = 355

const SODA_SIZES = [
  { ml: 200, label: '200 mL' },
  { ml: 222, label: '222 mL (7.5 fl oz mini can)' },
  { ml: 250, label: '250 mL' },
  { ml: 330, label: '330 mL can' },
  { ml: 355, label: '355 mL (12 fl oz can)' },
  { ml: 473, label: '473 mL (16 fl oz)' },
  { ml: 500, label: '500 mL (16.9 fl oz bottle)' },
  { ml: 591, label: '591 mL (20 fl oz bottle)' },
] as const

function sodaFamily(input: {
  idPrefix: string
  name: string
  brand: string
  per355: NutrientProfile
  sourceName: string
  sourceUrl: string
  notes: string
  aliases?: string[]
  skipMl?: number[]
  officialByMl?: Partial<Record<number, NutrientProfile>>
}): Food[] {
  return SODA_SIZES.filter((size) => !input.skipMl?.includes(size.ml)).map((size) => ({
    id: `${input.idPrefix}-${size.ml}`,
    name: input.name,
    brand: input.brand,
    category: 'sugary_drinks' as const,
    servingLabel: size.label,
    increment: 1,
    fluidMl: size.ml,
    nutrition: input.officialByMl?.[size.ml] ?? scaleNutrients(input.per355, size.ml / BASE_ML),
    source: {
      name: input.sourceName,
      url: input.sourceUrl,
      notes: `${input.notes} ${size.ml === 355 ? 'This is the labeled 12 fl oz (355 mL) serving.' : `This ${size.ml} mL serving is scaled from the 12 fl oz (355 mL) Nutrition Facts unless an official bottle size is noted.`}`,
    },
    aliases: [
      ...(input.aliases ?? []),
      `${input.name} ${size.ml}`,
      `${input.name} ${size.ml}ml`,
      `${input.name} ${size.ml} ml`,
    ],
  }))
}

const cokeClassic355 = n({
  calories: 140,
  sodiumMg: 45,
  carbsG: 39,
  totalSugarG: 39,
  addedSugarG: 39,
})

const dietCoke355 = n({
  calories: 0,
  sodiumMg: 40,
  carbsG: 0,
  totalSugarG: 0,
  addedSugarG: 0,
})

const cokeZero355 = n({
  calories: 0,
  sodiumMg: 40,
  carbsG: 0,
  totalSugarG: 0,
  addedSugarG: 0,
})

export const EXTRA_DRINKS: Food[] = [
  ...sodaFamily({
    idPrefix: 'coke',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    per355: cokeClassic355,
    sourceName: 'The Coca-Cola Company — Coca-Cola Original Nutrition Facts',
    sourceUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola/products/original',
    notes:
      'US 12 fl oz can: 140 kcal, 39 g added sugar, 45 mg sodium. 20 fl oz bottle uses the official label (240 kcal, 65 g added sugar, 75 mg sodium). Mini 7.5 fl oz uses the official 90 kcal / 25 g sugar panel.',
    aliases: ['coke', 'coca cola', 'cocacola', 'cocoola', 'cola'],
    skipMl: [355],
    officialByMl: {
      222: n({ calories: 90, sodiumMg: 30, carbsG: 25, totalSugarG: 25, addedSugarG: 25 }),
      591: n({ calories: 240, sodiumMg: 75, carbsG: 65, totalSugarG: 65, addedSugarG: 65 }),
    },
  }),
  ...sodaFamily({
    idPrefix: 'diet-coke',
    name: 'Diet Coke',
    brand: 'Coca-Cola',
    per355: dietCoke355,
    sourceName: 'The Coca-Cola Company — Diet Coke Nutrition Facts',
    sourceUrl: 'https://www.coca-cola.com/us/en/brands/diet-coke/products',
    notes:
      'Diet Coke is 0 kcal and 0 g sugar on the US label. Sweetness is from aspartame. Sodium is 40 mg per 12 fl oz (355 mL) and scales with volume. Logged for your record; not counted in the sugar-sweetened drink limit.',
    aliases: ['diet coke', 'diet cola', 'diet cocacola'],
  }),
  ...sodaFamily({
    idPrefix: 'coke-zero',
    name: 'Coca-Cola Zero Sugar',
    brand: 'Coca-Cola',
    per355: cokeZero355,
    sourceName: 'The Coca-Cola Company — Coca-Cola Zero Sugar Nutrition Facts',
    sourceUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola/products/zero',
    notes:
      'Coke Zero Sugar is 0 kcal and 0 g sugar on the US label (aspartame + acesulfame K). Sodium is 40 mg per 12 fl oz (355 mL). Logged for your record; not counted in the sugar-sweetened drink limit.',
    aliases: ['coke zero', 'zero coke', 'coca cola zero'],
  }),
  {
    id: 'coke-cherry-355',
    name: 'Cherry Coke',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 150, sodiumMg: 45, carbsG: 42, totalSugarG: 42, addedSugarG: 42 }),
    source: {
      name: 'Coca-Cola Cherry 12 fl oz Nutrition Facts',
      url: 'https://www.coca-cola.com/us/en/brands/coca-cola/products/original',
      notes: 'Typical US 12 fl oz Cherry Coke panel: 150 kcal and 42 g added sugar.',
    },
    aliases: ['cherry coke', 'coca-cola cherry'],
  },
  {
    id: 'coke-cherry-591',
    name: 'Cherry Coke',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '591 mL (20 fl oz bottle)',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 150, sodiumMg: 45, carbsG: 42, totalSugarG: 42, addedSugarG: 42 }), 591 / 355),
    source: {
      name: 'Coca-Cola Cherry scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.coca-cola.com/us/en/brands/coca-cola/products/original',
    },
    aliases: ['cherry coke 20 oz'],
  },
  {
    id: 'coke-vanilla-355',
    name: 'Vanilla Coke',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 150, sodiumMg: 45, carbsG: 42, totalSugarG: 42, addedSugarG: 42 }),
    source: {
      name: 'Coca-Cola Vanilla 12 fl oz Nutrition Facts',
      url: 'https://www.coca-cola.com/',
      notes: 'Typical US 12 fl oz Vanilla Coke panel: 150 kcal and 42 g added sugar.',
    },
    aliases: ['vanilla coke'],
  },
  {
    id: 'coke-mexico-355',
    name: 'Mexican Coca-Cola (cane sugar)',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL bottle',
    increment: 1,
    nutrition: n({ calories: 150, sodiumMg: 85, carbsG: 39, totalSugarG: 39, addedSugarG: 39 }),
    source: {
      name: 'The Coca-Cola Company — Coca-Cola Mexico 355 mL Nutrition Facts',
      url: 'https://www.coca-cola.com/us/en/brands/coca-cola/products/original',
      notes: 'Official Mexico bottle: 150 kcal, 39 g added cane sugar, 85 mg sodium per 355 mL.',
    },
    aliases: ['mexican coke', 'coke mexico', 'cane sugar coke'],
  },
  {
    id: 'diet-cherry-coke-355',
    name: 'Diet Cherry Coke',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 0, sodiumMg: 30, carbsG: 0, totalSugarG: 0, addedSugarG: 0 }),
    source: {
      name: 'The Coca-Cola Company — Diet Cherry Coke Nutrition Facts',
      url: 'https://www.coca-cola.com/us/en/brands/diet-coke/products',
      notes: '0 kcal, 0 g sugar, 30 mg sodium per 12 fl oz.',
    },
    aliases: ['diet cherry coke'],
  },
  {
    id: 'fanta-orange-355',
    name: 'Fanta Orange',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 160, sodiumMg: 55, carbsG: 44, totalSugarG: 44, addedSugarG: 44 }),
    source: {
      name: 'Fanta Orange 12 fl oz Nutrition Facts',
      url: 'https://www.fanta.com/',
    },
    aliases: ['fanta'],
  },
  {
    id: 'fanta-orange-500',
    name: 'Fanta Orange',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '500 mL bottle',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 160, sodiumMg: 55, carbsG: 44, totalSugarG: 44, addedSugarG: 44 }), 500 / 355),
    source: {
      name: 'Fanta Orange scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.fanta.com/',
    },
  },
  {
    id: 'dr-pepper-355',
    name: 'Dr Pepper',
    brand: 'Keurig Dr Pepper',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 150, sodiumMg: 55, carbsG: 40, totalSugarG: 40, addedSugarG: 40 }),
    source: {
      name: 'Dr Pepper 12 fl oz Nutrition Facts',
      url: 'https://www.drpepper.com/',
    },
    aliases: ['drpepper'],
  },
  {
    id: 'dr-pepper-591',
    name: 'Dr Pepper',
    brand: 'Keurig Dr Pepper',
    category: 'sugary_drinks',
    servingLabel: '591 mL (20 fl oz bottle)',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 150, sodiumMg: 55, carbsG: 40, totalSugarG: 40, addedSugarG: 40 }), 591 / 355),
    source: {
      name: 'Dr Pepper scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.drpepper.com/',
    },
  },
  {
    id: 'diet-dr-pepper-355',
    name: 'Diet Dr Pepper',
    brand: 'Keurig Dr Pepper',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 0, sodiumMg: 55, carbsG: 0, totalSugarG: 0, addedSugarG: 0 }),
    source: {
      name: 'Diet Dr Pepper 12 fl oz Nutrition Facts',
      url: 'https://www.drpepper.com/',
    },
  },
  {
    id: 'sprite-zero-355',
    name: 'Sprite Zero',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 0, sodiumMg: 35, carbsG: 0, totalSugarG: 0, addedSugarG: 0 }),
    source: {
      name: 'Sprite Zero Sugar 12 fl oz Nutrition Facts',
      url: 'https://www.sprite.com/',
    },
    aliases: ['sprite zero sugar'],
  },
  {
    id: 'pepsi-zero-355',
    name: 'Pepsi Zero Sugar',
    brand: 'PepsiCo',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 0, sodiumMg: 40, carbsG: 0, totalSugarG: 0, addedSugarG: 0 }),
    source: {
      name: 'Pepsi Zero Sugar 12 fl oz Nutrition Facts',
      url: 'https://www.pepsi.com/',
    },
    aliases: ['pepsi zero', 'diet pepsi zero'],
  },
  {
    id: 'diet-pepsi-355',
    name: 'Diet Pepsi',
    brand: 'PepsiCo',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 0, sodiumMg: 35, carbsG: 0, totalSugarG: 0, addedSugarG: 0 }),
    source: {
      name: 'Diet Pepsi 12 fl oz Nutrition Facts',
      url: 'https://www.pepsi.com/',
    },
  },
  {
    id: 'pepsi-500',
    name: 'Pepsi',
    brand: 'PepsiCo',
    category: 'sugary_drinks',
    servingLabel: '500 mL bottle',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 150, sodiumMg: 30, carbsG: 41, totalSugarG: 41, addedSugarG: 41 }), 500 / 355),
    source: {
      name: 'Pepsi scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.pepsi.com/',
    },
  },
  {
    id: 'sprite-500',
    name: 'Sprite',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '500 mL bottle',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 140, sodiumMg: 65, carbsG: 38, totalSugarG: 38, addedSugarG: 38 }), 500 / 355),
    source: {
      name: 'Sprite scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.sprite.com/',
    },
  },
  {
    id: 'mountain-dew-591',
    name: 'Mountain Dew',
    brand: 'PepsiCo',
    category: 'sugary_drinks',
    servingLabel: '591 mL (20 fl oz bottle)',
    increment: 1,
    nutrition: scaleNutrients(n({ calories: 170, sodiumMg: 60, carbsG: 46, totalSugarG: 46, addedSugarG: 46 }), 591 / 355),
    source: {
      name: 'Mountain Dew scaled from 12 fl oz Nutrition Facts',
      url: 'https://www.mountaindew.com/',
    },
  },
  {
    id: 'barqs-root-beer-355',
    name: "Barq's Root Beer",
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 160, sodiumMg: 70, carbsG: 44, totalSugarG: 44, addedSugarG: 44 }),
    source: {
      name: "Barq's Root Beer 12 fl oz Nutrition Facts",
      url: 'https://www.barqs.com/',
    },
    aliases: ['root beer', 'barqs'],
  },
  {
    id: 'seven-up-355',
    name: '7UP',
    brand: 'Keurig Dr Pepper',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 140, sodiumMg: 40, carbsG: 38, totalSugarG: 38, addedSugarG: 38 }),
    source: {
      name: '7UP 12 fl oz Nutrition Facts',
      url: 'https://www.7up.com/',
    },
    aliases: ['7 up', 'seven up'],
  },
  {
    id: 'ginger-ale-355',
    name: 'Canada Dry Ginger Ale',
    brand: 'Keurig Dr Pepper',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz can)',
    increment: 1,
    nutrition: n({ calories: 140, sodiumMg: 50, carbsG: 36, totalSugarG: 36, addedSugarG: 36 }),
    source: {
      name: 'Canada Dry Ginger Ale 12 fl oz Nutrition Facts',
      url: 'https://www.canadadry.com/',
    },
    aliases: ['ginger ale'],
  },
  {
    id: 'minute-maid-lemonade-355',
    name: 'Minute Maid Lemonade',
    brand: 'Coca-Cola',
    category: 'sugary_drinks',
    servingLabel: '355 mL (12 fl oz)',
    increment: 1,
    nutrition: n({ calories: 140, sodiumMg: 20, carbsG: 37, totalSugarG: 36, addedSugarG: 36 }),
    source: {
      name: 'Minute Maid Lemonade typical 12 fl oz Nutrition Facts',
      url: 'https://www.minutemaid.com/',
    },
    aliases: ['lemonade'],
  },
]
