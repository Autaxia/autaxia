import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* =========================
   WIKIPEDIA
========================= */
async function getWiki(query: string) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.extract || null
  } catch {
    return null
  }
}

/* =========================
   BRAND DNA
========================= */
const brandDNA: any = {
  audi: {
    engines: ['TFSI', 'TDI', 'Quattro AWD'],
    problems: ['oil consumption', 'timing chain wear', 'electronic faults'],
    character: 'premium performance with complex electronics'
  },
  volkswagen: {
    engines: ['TSI', 'TDI'],
    problems: ['carbon buildup', 'DSG gearbox issues', 'turbo wear'],
    character: 'balanced reliability with occasional drivetrain issues'
  },
  seat: {
    engines: ['TSI', 'TDI'],
    problems: ['suspension wear', 'interior aging'],
    character: 'sporty feel with affordable maintenance'
  },
  skoda: {
    engines: ['TSI', 'TDI'],
    problems: ['minor electronics', 'wear-related faults'],
    character: 'practical and reliable with low ownership cost'
  }
}

/* =========================
   HELPERS
========================= */
function pick(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function normalizeType(type: string) {
  const t = type.toLowerCase()

  if (t.includes('problem')) return 'problems'
  if (t.includes('maintenance')) return 'maintenance'
  if (t.includes('insurance')) return 'insurance'
  if (t.includes('tire')) return 'tires'
  if (t.includes('ownership')) return 'ownership'

  return type
}

function getYearFactor(year: number) {
  if (year >= 2021) return 'low'
  if (year >= 2017) return 'medium'
  return 'high'
}

function estimatePerformance(power: number) {
  return {
    acceleration_0_100: Math.max(3.5, (12 - power / 30)).toFixed(1),
    top_speed: Math.round(160 + power * 0.9)
  }
}

/* =========================
   CONTENT BUILDERS
========================= */

function buildIntro(job: any, wiki: string | null) {
  const brand = brandDNA[job.brand] || {}

  return `
${wiki || ''}

The ${job.brand} ${job.model} ${job.year} is known for ${brand.character || 'balanced performance'}.

${pick([
  'It delivers a solid ownership experience overall.',
  'It offers a mix of reliability and performance.',
  'It is considered a dependable option in its segment.',
  'Owners report a balanced driving experience.'
])}
`
}

function buildEngines(job: any) {
  const basePower = 110 + Math.floor(Math.random() * 130)
  const perf = estimatePerformance(basePower)

  return [
    {
      id: `${job.model}-engine-1`,
      power: basePower,
      torque: Math.round(basePower * 2.1),

      fuel_type: pick(['petrol', 'diesel']),
      transmission: pick(['manual', 'automatic']),
      drivetrain: pick(['FWD', 'AWD']),

      acceleration_0_100: perf.acceleration_0_100,
      top_speed: perf.top_speed
    }
  ]
}

function buildMaintenance() {
  return [
    {
      id: 1,
      interval: '10,000 km',
      task: 'Oil and filter change'
    },
    {
      id: 2,
      interval: '30,000 km',
      task: 'Brake pads replacement'
    },
    {
      id: 3,
      interval: '60,000 km',
      task: 'Major service inspection'
    }
  ]
}

function buildProblems(job: any) {
  const brand = brandDNA[job.brand] || {}
  const base = brand.problems || ['general wear issues']
  const factor = getYearFactor(job.year)

  return base.map((p: string, i: number) => ({
    id: i,
    title:
      factor === 'low'
        ? `Minor ${p} may appear occasionally`
        : factor === 'medium'
        ? `${p} reported after medium mileage`
        : `Frequent ${p} in high mileage vehicles`
  }))
}

function buildOwnership(job: any) {
  return [
    {
      id: 1,
      title: 'Fuel economy depends on engine choice'
    },
    {
      id: 2,
      title: 'Maintenance costs increase with mileage'
    },
    {
      id: 3,
      title: `Overall ownership is ${pick(['balanced', 'moderate', 'reasonable'])}`
    }
  ]
}

function buildInsurance() {
  return [
    { id: 1, title: 'Average insurance group depending on engine' },
    { id: 2, title: 'Premium models may cost more to insure' }
  ]
}

function buildTires() {
  return [
    { id: 1, title: 'Typical size ranges between 16" and 19"' },
    { id: 2, title: 'Performance versions use wider tires' }
  ]
}

function buildBeforeBuy() {
  return [
    { id: 1, title: 'Check full service history' },
    { id: 2, title: 'Inspect engine and gearbox condition' },
    { id: 3, title: 'Look for signs of previous repairs' }
  ]
}

async function getRelatedLinks(job: any) {
  const { data } = await supabase
    .from('pages')
    .select('brand_slug, model_slug, year, type')
    .limit(50)

  if (!data) return []

  return data
    .filter((p: any) =>
      p.brand_slug === job.brand &&
      p.model_slug === job.model &&
      p.year !== job.year
    )
    .slice(0, 6)
    .map((p: any) => ({
      title: `${p.brand_slug} ${p.model_slug} ${p.year} ${p.type}`,
      url: `/cars/${p.brand_slug}/${p.model_slug}/${p.year}/${p.type}`
    }))
}

/* =========================
   FINAL CONTENT
========================= */

function buildContent(job: any, wiki: string | null, links: any[]) {
  return {
    intro: buildIntro(job, wiki),

    engines: buildEngines(job),
    maintenance: buildMaintenance(),
    problems: buildProblems(job),
    ownership: buildOwnership(job),
    insurance: buildInsurance(),
    tires: buildTires(),
    beforeBuy: buildBeforeBuy(),

    links
  }
}

/* =========================
   MAIN PIPELINE
========================= */

async function run() {
  console.log('🚀 START PIPELINE')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .limit(100)

  if (!jobs || jobs.length === 0) {
    console.log('❌ no jobs')
    return
  }

  for (const job of jobs) {

    const type = normalizeType(job.type)

    await supabase
      .from('jobs')
      .update({ status: 'processing' })
      .eq('id', job.id)

    try {

      const { data: existing } = await supabase
        .from('pages')
        .select('*')
        .eq('brand_slug', job.brand)
        .eq('model_slug', job.model)
        .eq('year', job.year)
        .eq('type', type)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('jobs')
          .update({ status: 'done' })
          .eq('id', job.id)
        continue
      }

      const wiki = await getWiki(`${job.brand} ${job.model}`)
      const links = await getRelatedLinks(job)

      const content = buildContent(
        { ...job, type },
        wiki,
        links
      )

      await supabase.from('pages').upsert({
        brand_slug: job.brand,
        model_slug: job.model,
        year: job.year,
        type,
        title: job.keyword,
        description: `Complete guide about ${job.keyword}`,
        content
      })

      await supabase
        .from('jobs')
        .update({ status: 'done' })
        .eq('id', job.id)

      console.log('✅ done:', job.keyword)

    } catch (err) {

      console.log('❌ error:', err)

      await supabase
        .from('jobs')
        .update({ status: 'error' })
        .eq('id', job.id)
    }
  }

  console.log('🔥 PIPELINE FINISHED')
}

run()