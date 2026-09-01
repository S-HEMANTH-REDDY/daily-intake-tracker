import type { Food } from './types'
import { n } from './nutrients'

const zero = n({
  calories: 0,
  totalFatG: 0,
  saturatedFatG: 0,
  sodiumMg: 0,
  carbsG: 0,
  fiberG: 0,
  totalSugarG: 0,
  addedSugarG: 0,
  proteinG: 0,
})

/** Log each 500 mL bottle Sreenidhee finishes — counts toward the daily water goal on Today. */
export const EXTRA_WATER: Food[] = [
  {
    id: 'water-500ml-bottle',
    name: 'Water — 500 mL bottle',
    brand: 'Bottled water',
    category: 'water',
    servingLabel: '1 bottle (500 mL)',
    increment: 1,
    nutrition: zero,
    source: {
      name: 'Plain drinking water',
      notes:
        '0 kcal. Log one serving each time you finish a 500 mL bottle. The Today dashboard tracks bottles toward a 4-bottle (2 L) daily hydration goal.',
    },
    aliases: [
      'water',
      'bottle water',
      '500ml water',
      '500 ml water',
      'half liter water',
      'dasani',
      'aquafina',
      'nestle pure life',
      'bottled water',
    ],
  },
]
