import { createClient } from '@supabase/supabase-js'
import { enrichWithAI } from './ai-enrich'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =========================
// 🔧 UTILS
// =========================
function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-')
}

// 🔥 NORMALIZADORES (CLAVE)
function extractKm(text: string = '') {
  const match = text.match(/(\d{4,6})\s?km/i)
  return match ? Number(match[1]) : 15000
}

function estimateCost(text: string = '') {
  const t = text.toLowerCase()
  if (t.includes('oil')) return 120
  if (t.includes('brake')) return 300
  if (t.includes('filter')) return 80
  return 150
}

function estimateTireCost(text: string = '') {
  if (text.includes('19')) return 800
  if (text.includes('18')) return 600
  return 400
}

// =========================
// 💸 CONTROL COSTE
// =========================
const ENABLE_AI = true

let lastCall = 0
async function safeAI(fn: () => Promise<any>) {
  const now = Date.now()

  if (now - lastCall < 1000) {
    await new Promise(r => setTimeout(r, 1000))
  }

  lastCall = Date.now()
  return fn()
}

// =========================
// 🔁 RETRY AI
// =========================
async function getAIWithRetry(
  brand: string,
  model: string,
  year: number
) {
  let attempts = 0

  while (attempts < 3) {
    const ai = await safeAI(() =>
  enrichWithAI(brand, model, year)
)

    if (ai && Array.isArray(ai.engines) && ai.engines.length > 0) {
      return ai
    }

    console.log(`🔁 retry ${attempts + 1}...`)
    attempts++

    await new Promise(r => setTimeout(r, 800))
  }

  return null
}

// =========================
// 🚀 MAIN
// =========================
export async function getOrCreateCar(
  brand: string,
  model: string,
  year: number
) {
  const slug = slugify(`${brand}-${model}-${year}`)

  try {
    // =========================
    // 🔍 CACHE
    // =========================
    const { data: existing } = await supabase
      .from('pages')
      .select('content, processing')
      .eq('slug', slug)
      .maybeSingle()

    if (existing?.content) {
      const parsed =
        typeof existing.content === 'string'
          ? JSON.parse(existing.content)
          : existing.content

      if (parsed?.engines?.length > 0) {
        console.log('✅ cache hit:', slug)
        return parsed
      }
    }

    // =========================
    // 🔒 LOCK
    // =========================
    await supabase.from('pages').upsert(
      { slug, processing: true },
      { onConflict: 'slug' }
    )

    if (!ENABLE_AI) {
      return fallbackCar(brand, model, year)
    }

    console.log('⚡ generating:', slug)

    const ai = await getAIWithRetry(brand, model, year)

    let data

    if (ai) {
      console.log('🤖 AI success')

      data = {
        brand: { name: brand, slug: slugify(brand) },
        model: { name: model, slug: slugify(model) },
        year,

        // =========================
        // 🔥 CORE
        // =========================
        engines: ai.engines || [],
        performance: ai.performance || {},
        efficiency: ai.efficiency || {},

        // =========================
        // 🔥 NORMALIZACIÓN CLAVE
        // =========================
        maintenance: (ai.maintenance_items || ai.maintenance || []).map((m: any) => ({
          item: m.item ?? m.title ?? '',
          interval_km: m.interval_km ?? extractKm(m.title),
          cost_eur: m.cost_eur ?? estimateCost(m.title)
        })),

        problems: (ai.problems || []).map((p: any) => ({
          issue: p.issue ?? p.title ?? '',
          description: p.description ?? '',
          severity: p.severity,
          frequency: p.frequency
        })),

        tires: (ai.tires || []).map((t: any) => ({
          type: t.type ?? t.title ?? '',
          replacement_cost_eur: t.replacement_cost_eur ?? estimateTireCost(t.title)
        })),

        reliability:
          typeof ai?.reliability?.score === 'number'
            ? ai.reliability.score
            : 60,

        summary:
          ai?.seo?.intro ||
          `${brand} ${model} ${year} specs and performance.`
      }

    } else {
      console.log('⚠️ AI failed → fallback')
      data = fallbackCar(brand, model, year)
    }

    // =========================
    // 💾 SAVE
    // =========================
    await supabase.from('pages').upsert(
      {
        slug,
        brand_slug: slugify(brand),
        model_slug: slugify(model),
        year,
        type: 'car',
        processing: false,
        content: data
      },
      { onConflict: 'slug' }
    )

    console.log('✅ SAVED:', slug)

    return data

  } catch (e) {
    console.error('❌ getOrCreateCar error', e)

    await supabase
      .from('pages')
      .update({ processing: false })
      .eq('slug', slug)

    return fallbackCar(brand, model, year)
  }
}

// =========================
// 🛟 FALLBACK
// =========================
function fallbackCar(
  brand: string,
  model: string,
  year: number
) {
  return {
    brand: { name: brand, slug: slugify(brand) },
    model: { name: model, slug: slugify(model) },
    year,

    engines: [],
    performance: {},
    efficiency: {},
    maintenance: [],
    tires: [],
    problems: [],
    reliability: null,
    summary: null
  }
}