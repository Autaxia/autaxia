import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import { processJob } from '@/lib/pipeline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =====================
// GET NEXT JOB (PRIORITY)
// =====================
async function getNextJob() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .limit(1)

  if (error) {
    console.log('❌ error fetching job', error)
    return null
  }

  return data?.[0] || null
}

// =====================
// LOCK JOB (ANTI DUPLICATE)
// =====================
async function lockJob(id: string) {
  const { data } = await supabase
    .from('jobs')
    .update({ status: 'processing' })
    .eq('id', id)
    .eq('status', 'pending') // 🔥 evita duplicados
    .select()

  return (data ?? []).length > 0
}

// =====================
// MARKS
// =====================
async function markDone(id: string) {
  await supabase.from('jobs').update({
    status: 'done',
    updated_at: new Date().toISOString()
  }).eq('id', id)
}

async function markFailed(id: string, attempts = 0) {
  await supabase.from('jobs').update({
    status: attempts > 2 ? 'failed' : 'pending',
    attempts: attempts + 1
  }).eq('id', id)
}

// =====================
// WORKER
// =====================
async function runWorker() {
  console.log('🚀 WORKER START')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  while (true) {

    const job = await getNextJob()

    if (!job) {
      console.log('😴 no jobs, esperando...')
      await sleep(5000)
      continue
    }

    // 🔥 LOCK REAL
    const locked = await lockJob(job.id)
    if (!locked) continue

    console.log(`🔥 ${job.brand_slug} ${job.model_slug} ${job.year} → ${job.type}`)

    try {

      const result = await processJob(job, page, supabase)

      if (!result) {
        await markFailed(job.id, job.attempts || 0)
        continue
      }

      await markDone(job.id)

      console.log('✅ job completado')

    } catch (err) {
      console.log('❌ error job', err)
      await markFailed(job.id, job.attempts || 0)
    }

    // 🔥 CONTROL DE VELOCIDAD (IMPORTANTE)
    await sleep(2000)
  }
}

// =====================
// HELPERS
// =====================
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

runWorker()