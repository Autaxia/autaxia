import { getRedditInsights } from '@/lib/data/reddit'
import { getForumInsights } from '@/lib/data/forum'

type Item = {
  id: number
  title: string
  severity?: 'low' | 'medium' | 'high'
  frequency?: 'low' | 'medium' | 'high'
  mentions?: number
  source?: 'community' | 'generated'
}

// =====================
// HELPERS
// =====================
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function detect(title: string) {
  const t = title.toLowerCase()

  return {
    diesel: t.includes('tdi') || t.includes('diesel'),
    automatic: t.includes('auto') || t.includes('dsg'),
    premium:
      t.includes('audi') ||
      t.includes('bmw') ||
      t.includes('mercedes'),
  }
}

// =====================
// 🔥 RANK REAL PROBLEMS
// =====================
function rankProblems(signals: string[]) {
  const map: Record<string, number> = {}

  for (const s of signals) {
    map[s] = (map[s] || 0) + 1
  }

  return Object.entries(map)
    .map(([title, mentions]) => ({
      title,
      mentions,
      frequency:
        mentions >= 6
          ? 'high'
          : mentions >= 3
          ? 'medium'
          : 'low',
      severity:
        mentions >= 6
          ? 'high'
          : mentions >= 3
          ? 'medium'
          : 'low',
    }))
    .sort((a, b) => b.mentions - a.mentions)
}

// =====================
// GENERATED PROBLEMS
// =====================
function buildProblems(title: string): Item[] {
  const f = detect(title)

  const base = [
    'Electrical sensor failures over time',
    'Suspension wear on higher mileage units',
    'Battery drain issues in older vehicles',
  ]

  const diesel = [
    'DPF clogging in city driving',
    'EGR valve carbon buildup',
  ]

  const automatic = [
    'Delayed gear shifts',
    'Transmission fluid degradation',
  ]

  const premium = [
    'Higher repair costs due to complex components',
  ]

  const selected = [
    ...base,
    ...(f.diesel ? diesel : []),
    ...(f.automatic ? automatic : []),
    ...(f.premium ? premium : []),
  ]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)

  return selected.map((p, i) => ({
    id: i + 1,
    title: p,
    severity: pickRandom(['low', 'medium']),
    frequency: pickRandom(['low', 'medium']),
    source: 'generated',
  }))
}

// =====================
// MAINTENANCE (MEJORADO)
// =====================
function buildMaintenance(title: string): Item[] {
  const f = detect(title)

  const base = [
    'Oil and filter change every 10,000–15,000 km',
    'Brake inspection every 20,000 km',
    'Air and cabin filter replacement yearly',
  ]

  const extra = []

  if (f.diesel) {
    extra.push('DPF monitoring for urban driving')
  }

  if (f.automatic) {
    extra.push('Transmission service every 60,000 km')
  }

  return [...base, ...extra].slice(0, 4).map((m, i) => ({
    id: i + 1,
    title: m,
  }))
}

// =====================
// OWNERSHIP (SEO BOOST)
// =====================
function buildOwnership(title: string): Item[] {
  return [
    {
      id: 1,
      title: 'Annual maintenance cost varies based on mileage and usage',
    },
    {
      id: 2,
      title: 'Fuel consumption depends on engine type and driving style',
    },
    {
      id: 3,
      title: 'Unexpected repairs increase with higher mileage',
    },
  ]
}

// =====================
// MERGE REAL + GENERATED
// =====================
function mergeProblems(real: any[], generated: Item[]): Item[] {
  const seen = new Set<string>()
  const combined: Item[] = []

  // 🔥 REAL FIRST (CLAVE SEO)
  for (const r of real) {
    if (!seen.has(r.title)) {
      combined.push({
        id: combined.length + 1,
        title: r.title,
        mentions: r.mentions,
        frequency: r.frequency,
        severity: r.severity,
        source: 'community',
      })
      seen.add(r.title)
    }
  }

  // 🔥 GENERATED SECOND
  for (const g of generated) {
    if (!seen.has(g.title)) {
      combined.push({
        ...g,
        id: combined.length + 1,
      })
      seen.add(g.title)
    }
  }

  return combined.slice(0, 6)
}

// =====================
// MAIN
// =====================
export async function enrichWithAI(base: any) {
  const title = base.title || ''

  const [reddit, forum] = await Promise.all([
    getRedditInsights(title),
    getForumInsights(title),
  ])

  const signals = [
    ...reddit.map(r => r.title),
    ...forum.map(f => f.title),
  ]

  const ranked = rankProblems(signals)

  const realTop = ranked.slice(0, 3)

  const generated = buildProblems(title)

  const merged = mergeProblems(realTop, generated)

  return {
    ...base,

    // 🔥 CORE SEO DATA
    problems: merged,

    maintenance: buildMaintenance(title),
    ownership: buildOwnership(title),

    insurance: [
      {
        id: 1,
        title: 'Insurance cost depends on driver profile and location',
      },
    ],

    tires: [
      {
        id: 1,
        title: 'Tire size varies by trim and configuration',
      },
    ],

    before_buy: [
      {
        id: 1,
        title: 'Check service history and maintenance records',
      },
      {
        id: 2,
        title: 'Inspect gearbox, engine and suspension condition',
      },
    ],

    // 🔥 EXTRA SEO SIGNAL
    stats: {
      issues_count: merged.length,
      top_issue: merged[0]?.title,
    }
  }
}