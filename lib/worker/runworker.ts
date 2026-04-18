import { supabase } from '@/lib/supabase-client'

import { generateFromWiki } from '@/lib/ai/wiki-generator'
import { enrichWithAI } from '@/lib/ai/enricher'

// =====================
// GET NEXT JOB
// =====================
async function getNextJob() {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

// =====================
// LOCK JOB
// =====================
async function lockJob(id: string) {
  const { data } = await supabase
    .from('jobs')
    .update({ status: 'processing' })
    .eq('id', id)
    .select()

  return (data ?? []).length > 0
}

// =====================
// SAVE PAGE
// =====================
async function savePage(page: any) {
  const { error } = await supabase
    .from('pages')
    .upsert(page, {
      onConflict: 'brand_slug,model_slug,year,locale',
    })

  if (error) {
    console.error('savePage error', error)
  }
}

// =====================
// PROCESS JOB (REAL)
// =====================
async function processJob(job: any) {
  // 🔥 1. DATA BASE (WIKI)
  const base = await generateFromWiki({
    brand: job.brand_slug,
    model: job.model_slug,
    year: job.year,
  })

  // 🔥 2. ENRICH (REDDIT + FOROS + LÓGICA)
  const enriched = await enrichWithAI(base)

  // 🔥 3. BUILD FINAL PAGE
  const page = {
    brand_slug: job.brand_slug,
    model_slug: job.model_slug,
    year: job.year,
    locale: job.locale || 'en',

    title: enriched.title,
    summary: enriched.summary,

    maintenance: enriched.maintenance,
    problems: enriched.problems,
    ownership: enriched.ownership,
    insurance: enriched.insurance,
    tires: enriched.tires,
    before_buy: enriched.before_buy,

    updated_at: new Date().toISOString(),
  }

  // 🔥 4. SAVE
  await savePage(page)
}

// =====================
// WORKER MAIN
// =====================
export async function runWorker(batchSize = 10) {
  let processed = 0

  while (processed < batchSize) {
    const job = await getNextJob()
    if (!job) break

    const locked = await lockJob(job.id)
    if (!locked) continue

    try {
      await processJob(job)

      await supabase
        .from('jobs')
        .update({
          status: 'done',
          updated_at: new Date().toISOString(),
        })
        .eq('id', job.id)

      processed++

    } catch (e) {
      console.error('Worker error:', e)

      await supabase
        .from('jobs')
        .update({
          status: 'failed',
          attempts: (job.attempts || 0) + 1,
        })
        .eq('id', job.id)
    }
  }

  return { processed }
}