import type { Food } from './types'
import { n } from './nutrients'

function cfaMilkshake(input: {
  id: string
  flavor: string
  nutrition: ReturnType<typeof n>
  sugarsG: number
  path: string
  aliases?: string[]
  seasonal?: boolean
}): Food {
  const name = `Chick-fil-A ${input.flavor} Milkshake`
  return {
    id: input.id,
    name,
    brand: 'Chick-fil-A',
    category: 'desserts',
    servingLabel: '1 milkshake (hand-spun)',
    increment: 0.125,
    fractionalPortions: true,
    nutrition: { ...input.nutrition, totalSugarG: input.sugarsG, addedSugarG: input.sugarsG },
    source: {
      name: `Chick-fil-A ${input.flavor} Milkshake nutrition`,
      url: `https://www.chick-fil-a.com/menu/treats/${input.path}`,
      notes: `Official US menu nutrition (whipped cream + cherry). Same at UF-area Chick-fil-A outlets. Log ⅛, ¼, ½, ¾, or a full shake. Sugars ${input.sugarsG} g per full shake; added sugar is not listed separately and is estimated from total sugars.${input.seasonal ? ' Seasonal item — may not be available year-round.' : ''}`,
    },
    aliases: [
      `cfa ${input.flavor.toLowerCase()} shake`,
      `chick fil a ${input.flavor.toLowerCase()} milkshake`,
      `chick-fil-a ${input.flavor.toLowerCase()} shake`,
      ...(input.aliases ?? []),
    ],
  }
}

/** Hand-spun milkshakes — standard at US Chick-fil-A locations including Gainesville / UF area. */
export const EXTRA_CFA_SHAKES: Food[] = [
  cfaMilkshake({
    id: 'cfa-shake-vanilla',
    flavor: 'Vanilla',
    path: 'vanilla-milkshake',
    sugarsG: 80,
    nutrition: n({
      calories: 580,
      totalFatG: 23,
      saturatedFatG: 15,
      cholesterolMg: 90,
      sodiumMg: 390,
      carbsG: 82,
      fiberG: 1,
      proteinG: 13,
    }),
    aliases: ['vanilla shake', 'cfa vanilla'],
  }),
  cfaMilkshake({
    id: 'cfa-shake-chocolate',
    flavor: 'Chocolate',
    path: 'chocolate-milkshake',
    sugarsG: 90,
    nutrition: n({
      calories: 600,
      totalFatG: 22,
      saturatedFatG: 14,
      cholesterolMg: 85,
      sodiumMg: 350,
      carbsG: 93,
      fiberG: 1,
      proteinG: 12,
    }),
    aliases: ['chocolate shake', 'cfa chocolate'],
  }),
  cfaMilkshake({
    id: 'cfa-shake-strawberry',
    flavor: 'Strawberry',
    path: 'strawberry-milkshake',
    sugarsG: 87,
    nutrition: n({
      calories: 560,
      totalFatG: 18,
      saturatedFatG: 11,
      cholesterolMg: 70,
      sodiumMg: 370,
      carbsG: 92,
      fiberG: 1,
      proteinG: 10,
    }),
    aliases: ['strawberry shake', 'cfa strawberry'],
  }),
  cfaMilkshake({
    id: 'cfa-shake-cookies-cream',
    flavor: 'Cookies & Cream',
    path: 'cookies-cream-milkshake',
    sugarsG: 84,
    nutrition: n({
      calories: 630,
      totalFatG: 25,
      saturatedFatG: 15,
      cholesterolMg: 85,
      sodiumMg: 430,
      carbsG: 91,
      fiberG: 1,
      proteinG: 13,
    }),
    aliases: ['cookies and cream shake', 'oreo shake', 'cfa cookies cream'],
  }),
  cfaMilkshake({
    id: 'cfa-shake-peach',
    flavor: 'Peach',
    path: 'peach-milkshake',
    sugarsG: 86,
    seasonal: true,
    nutrition: n({
      calories: 600,
      totalFatG: 20,
      saturatedFatG: 12,
      cholesterolMg: 80,
      sodiumMg: 380,
      carbsG: 94,
      fiberG: 1,
      proteinG: 11,
    }),
    aliases: ['peach shake', 'cfa peach'],
  }),
]
