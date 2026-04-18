import 'dotenv/config'
import { discoverModels } from '../scripts/discover-models'
import { generateJobs } from '../scripts/generate-jobs'
import { processJobs } from '../scripts/process-jobs'

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function run() {
  console.log('🚀 SYSTEM STARTED')

  while (true) {
    console.log('🔄 new cycle\n')

    try {
      // 1. DISCOVER
      const models = await discoverModels()
      console.log(`📦 ${models.length} models`)

      // 2. GENERATE JOBS
      await generateJobs(models)
      console.log('🧠 jobs created')

      // 3. PROCESS JOBS (IMPORTANT)
      await processJobs(50) // batch
      console.log('⚙️ jobs processed')

    } catch (err) {
      console.log('❌ error:', err)
    }

    console.log('⏳ waiting...\n')
    await sleep(60 * 1000) // 1 min (NO 1 hora)
  }
}

run()