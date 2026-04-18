import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (magA * magB)
}

async function run() {

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .not('embedding', 'is', null)

  // ✅ FIX
  if (!jobs || jobs.length === 0) {
    console.log('❌ no jobs for clustering')
    return
  }

  const clusters: any[] = []

  for (const job of jobs) {

    let assigned = false

    for (const cluster of clusters) {

      const sim = cosineSimilarity(job.embedding, cluster.embedding)

      if (sim > 0.85) {
        cluster.items.push(job)
        assigned = true
        break
      }
    }

    if (!assigned) {
      clusters.push({
        embedding: job.embedding,
        items: [job]
      })
    }
  }

  console.log('🔥 clusters creados:', clusters.length)
}

run()