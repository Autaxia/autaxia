import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ===============================
// CONFIG
// ===============================
const TYPES = ['overview', 'specs', 'problems', 'maintenance']

const START_YEAR = 2003
const END_YEAR = 2024

const COMPARE_YEARS = [2015, 2018, 2020]
const MAX_COMPARE_PER_MODEL = 5

const BATCH_SIZE = 500

// ===============================
// MAIN
// ===============================
async function run() {
  console.log('🚀 START generate jobs')

  // =====================
  // FETCH MODELS
  // =====================
  const { data: models, error } = await supabase
    .from('models')
    .select('id, slug, brand_slug')

  if (error || !models) {
    console.log('❌ error fetching models', error)
    return
  }

  console.log(`📊 modelos encontrados: ${models.length}`)

  // =====================
  // GENERATE PAGE JOBS
  // =====================
  const jobs: any[] = []

  for (const m of models) {
    // 🔥 filtro crítico (evita tus invalid jobs)
    if (!m.brand_slug || !m.slug) continue

    for (let year = START_YEAR; year <= END_YEAR; year++) {
      for (const type of TYPES) {
        jobs.push({
          brand_slug: m.brand_slug,
          model_slug: m.slug,
          year,
          type,
          status: 'pending'
        })
      }
    }
  }

  console.log(`🧠 jobs generados: ${jobs.length}`)

  // =====================
  // INSERT PAGE JOBS
  // =====================
  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const chunk = jobs.slice(i, i + BATCH_SIZE)

    const { error } = await supabase
      .from('jobs')
      .upsert(chunk, {
        onConflict: 'brand_slug,model_slug,year,type'
      })

    if (error) {
      console.log('❌ insert error:', error)
    }

    console.log(`⚡ ${i + chunk.length}/${jobs.length}`)
  }

  // =====================
  // GENERATE COMPARE JOBS
  // =====================
  const compareJobs: any[] = []

  for (const year of COMPARE_YEARS) {
    for (let i = 0; i < models.length; i++) {
      const a = models[i]
      if (!a.brand_slug || !a.slug) continue

      let count = 0

      for (let j = i + 1; j < models.length; j++) {
        const b = models[j]
        if (!b.brand_slug || !b.slug) continue

        if (a.slug === b.slug) continue
        if (count >= MAX_COMPARE_PER_MODEL) break

        const slug = `${a.brand_slug}-${a.slug}-${year}-vs-${b.brand_slug}-${b.slug}-${year}`

        compareJobs.push({
          slug,
          type: 'compare',
          status: 'pending'
        })

        count++
      }
    }
  }

  console.log(`⚔️ compare jobs: ${compareJobs.length}`)

  // =====================
  // INSERT COMPARE JOBS
  // =====================
  for (let i = 0; i < compareJobs.length; i += BATCH_SIZE) {
    const chunk = compareJobs.slice(i, i + BATCH_SIZE)

    const { error } = await supabase
      .from('jobs')
      .upsert(chunk, {
        onConflict: 'slug'
      })

    if (error) {
      console.log('❌ compare insert error:', error)
    }

    console.log(`⚡ compare ${i + chunk.length}/${compareJobs.length}`)
  }

  console.log('🔥 DONE')
}

run()