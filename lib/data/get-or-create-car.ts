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
// 🔁 RETRY AI (CLAVE)
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
    // 🔒 LOCK WAIT
    // =========================
    if (existing?.processing) {
      console.log('⏳ waiting other process...', slug)

      await new Promise(r => setTimeout(r, 1200))

      const { data: retry } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', slug)
        .maybeSingle()

      if (retry?.content) {
        const parsed =
          typeof retry.content === 'string'
            ? JSON.parse(retry.content)
            : retry.content

        if (parsed?.engines?.length > 0) {
          console.log('📦 loaded after wait:', slug)
          return parsed
        }
      }
    }

    // =========================
    // 🔒 LOCK WRITE
    // =========================
    await supabase.from('pages').upsert(
      { slug, processing: true },
      { onConflict: 'slug' }
    )

    if (!ENABLE_AI) {
      return fallbackCar(brand, model, year)
    }

    console.log('⚡ generating:', slug)

    // =========================
    // 🤖 AI + RETRY
    // =========================
    const ai = await getAIWithRetry(brand, model, year)

    // =========================
    // 🧠 DECISION
    // =========================
    let data

    if (ai) {
      console.log('🤖 AI success')

      data = {
        brand: { name: brand, slug: slugify(brand) },
        model: { name: model, slug: slugify(model) },
        year,

        engines: ai.engines,
        performance: ai.performance || {},
        efficiency: ai.efficiency || {},

        maintenance: ai.maintenance_items || [],
        tires: ai.tires ? [ai.tires] : [],

        problems: ai.problems || [],

        reliability:
          typeof ai?.reliability?.score === 'number'
            ? ai.reliability.score
            : 60,

        summary:
          ai?.seo?.intro ||
          `${brand} ${model} ${year} specs and performance.`
      }

    } else {
      console.log('⚠️ AI failed after retries → fallback')

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
console.log('→ engines:', data.engines.length)
console.log('→ problems:', data.problems.length)
console.log('→ maintenance:', data.maintenance.length)
console.log('→ reliability:', data.reliability)
console.log('→ summary:', data.summary)

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