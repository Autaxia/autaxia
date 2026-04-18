import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { enhanceSEO } from '../lib/seo'
import { CarData } from '../lib/types'
import { enrichRealData } from '../lib/data/real-data'
import { MODEL_DATABASE } from '../lib/data/model-database'
import { getRealCarData } from '../lib/data/data-sources'
import { generateInsights } from '../lib/data/insights-engine'

// =========================
// HELPERS
// =========================
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatName(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// =========================
// BRAND PROFILE
// =========================
function getBrandProfile(brand: string, model: string) {
  const b = brand.toLowerCase()

  return {
    isPerformance:
      ['bmw', 'audi', 'mercedes', 'porsche', 'nissan'].includes(b) ||
      model.includes('gt'),
    isReliable: ['toyota', 'honda', 'lexus'].includes(b),
    isBudget: ['dacia', 'kia', 'hyundai'].includes(b),
    isLuxury: ['mercedes', 'bmw', 'audi'].includes(b),
  }
}

// =========================
// SEO LINKS
// =========================
function buildSEOLinks(job: any) {
  const TYPES = ['overview', 'specs', 'problems', 'maintenance', 'reliability']

  return {
    siblings: TYPES
      .filter(t => t !== job.type)
      .map(t => ({
        title: `${job.brand_slug} ${job.model_slug} ${job.year} ${t}`,
        slug: `${job.brand_slug}-${job.model_slug}-${job.year}-${t}`
      })),
    years: Array.from({ length: 5 }).map((_, i) => {
      const y = job.year - 2 + i
      if (y === job.year) return null
      return {
        title: `${job.brand_slug} ${job.model_slug} ${y}`,
        slug: `${job.brand_slug}-${job.model_slug}-${y}-${job.type}`
      }
    }).filter(Boolean),
    modelPage: {
      title: `${job.brand_slug} ${job.model_slug}`,
      slug: `${job.brand_slug}-${job.model_slug}`
    },
    brandPage: {
      title: job.brand_slug,
      slug: job.brand_slug
    }
  }
}

// =========================
// SUPABASE
// =========================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =========================
// PROCESS ONE JOB
// =========================
async function processOneJob(job: any) {
  try {
    const brandName = formatName(job.brand_slug)
    const modelName = formatName(job.model_slug)
    const name = `${brandName} ${modelName} ${job.year}`

    console.log(`🚗 ${name}`)

    let data: CarData = {
      brand: { name: brandName },
      model: { name: modelName },
      year: { year: job.year },
      seo: {}
    }

    const key = `${job.brand_slug}-${job.model_slug}-${job.year}`

    // =========================
    // CACHE
    // =========================
    const { data: cached } = await supabase
      .from('wiki_cache')
      .select('data')
      .eq('key', key)
      .maybeSingle()

    if (cached?.data) {
      data = cached.data
    } else {

      const profile = getBrandProfile(job.brand_slug, job.model_slug)
      const modelKey = `${job.brand_slug}-${job.model_slug}`

      let reliability = 70

      // =========================
      // 1. 🔥 TOP MODELS (REAL)
      // =========================
      if (MODEL_DATABASE[modelKey]) {
        const real = MODEL_DATABASE[modelKey]

        data.engines = real.engines
        data.problems = real.problems
        reliability = real.reliability || 80

      } else {

        // =========================
        // 2. 🔥 KAGGLE REAL DATA
        // =========================
        const realData = await getRealCarData(
          job.brand_slug,
          job.model_slug,
          job.year
        )

        if (realData) {
          data.engines = realData.engines?.map((e: any) => ({
            ...e,
            mpg: realData.mpg
          }))
        }

        // =========================
        // 3. 🔥 FALLBACK STRUCTURE
        // =========================
        data = enrichRealData(data)

        reliability =
          profile.isReliable ? 85 :
          profile.isPerformance ? 65 :
          70
      }

      // =========================
      // INSIGHTS ENGINE (FASE 7)
      // =========================
      const insightData = generateInsights(data, job)

      data.problems = insightData.problems
      ;(data as any).insights = insightData.insights

      // asegurar arrays
      data.problems = data.problems || []
      data.engines = data.engines || []

      const d: any = data

      // =========================
      // CONTENT GENERATION
      // =========================
      d.summary = `${name} has a reliability score of ${reliability}/100 and is considered ${
        reliability > 85
          ? 'highly reliable'
          : reliability > 70
          ? 'moderately reliable'
          : 'less reliable than competitors'
      }.`

      d.intro = `The ${name} is a ${
        profile.isPerformance
          ? 'performance-oriented vehicle'
          : profile.isReliable
          ? 'highly reliable car'
          : 'well-balanced model'
      }. This guide covers specs, problems, maintenance and ownership.`

      d.ownership = [
        reliability > 85
          ? 'Excellent long-term ownership experience'
          : 'Ownership depends on maintenance history'
      ]

      d.insurance = [
        profile.isPerformance
          ? 'Higher insurance cost'
          : 'Moderate insurance cost'
      ]

      d.tires = ['All-season tires recommended']

      d.pros = profile.isReliable
        ? ['Excellent reliability', 'Low maintenance costs']
        : profile.isPerformance
        ? ['Strong performance', 'Good handling']
        : ['Balanced driving', 'Comfortable ride']

      d.cons = profile.isPerformance
        ? ['Higher fuel consumption']
        : ['Average performance']

      d.owner_experience = [
        'Owners report consistent usability',
        'Driving comfort depends on configuration'
      ]

      d.longtail = [
        `${name} reliability`,
        `${name} problems`,
        `${name} maintenance cost`
      ]

      d.faq = [
        {
          q: `Is the ${name} reliable?`,
          a: `This model has an estimated reliability score of ${reliability}/100.`
        },
        {
          q: `What are common problems with ${name}?`,
          a: data.problems.join(', ')
        }
      ]

      // =========================
      // CACHE SAVE
      // =========================
      await supabase.from('wiki_cache').upsert({
        key,
        data
      })
    }

    // =========================
    // SEO
    // =========================
    data = enhanceSEO(data)
    data.seo = data.seo || {}

    data.seo.title = `${name} ${job.type} – Problems & Reliability (${job.year})`
    data.seo.description = `Full guide about ${name}: specs, problems, maintenance and ownership.`

    // =========================
    // LINKS
    // =========================
    const links = buildSEOLinks(job)
    const d: any = data

    d.internal_links = [
      ...links.siblings.slice(0, 3),
      links.modelPage,
      links.brandPage
    ]

    // =========================
    // SAVE PAGE
    // =========================
    const slug = slugify(
      `${job.brand_slug} ${job.model_slug} ${job.year} ${job.type}`
    )

    await supabase.from('pages').insert({
      slug,
      brand: brandName,
      model: modelName,
      year: job.year,
      type: job.type,
      content: JSON.stringify(data)
    })

    await supabase
      .from('jobs')
      .update({ status: 'done' })
      .eq('id', job.id)

    return 1

  } catch (e) {
    console.error('❌ error job', job.id)

    await supabase
      .from('jobs')
      .update({ status: 'error' })
      .eq('id', job.id)

    return 0
  }
}

// =========================
// RUN
// =========================
async function run() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .limit(200)

  if (!jobs?.length) return

  for (const job of jobs) {
    await processOneJob(job)
  }

  console.log('🏁 DONE')
}

run()