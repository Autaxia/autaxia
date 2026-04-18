import 'dotenv/config'
import { getOrCreateCar } from '../lib/data/get-or-create-car'

const cars = [
  ['audi', 'a4'],
  ['audi', 'a3'],
  ['bmw', '3 series'],
  ['bmw', '5 series'],
  ['mercedes', 'c class'],
  ['mercedes', 'e class'],
  ['volkswagen', 'golf'],
  ['toyota', 'corolla'],
]

// 🔥 años clave SEO (no solo uno)
const years = [2018, 2019, 2020, 2021, 2022, 2023]

// 🔧 CONTROL
const DELAY = 1200 // ms (no bajes de 1000)
const DRY_RUN = false // true = no genera (solo logs)

// =========================
// 💤 SLEEP
// =========================
function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

// =========================
// 🚀 RUN
// =========================
async function run() {
  console.log('🚀 generating cars...\n')

  let success = 0
  let failed = 0

  for (const [brand, model] of cars) {
    for (const year of years) {

      const label = `${brand} ${model} ${year}`

      try {
        console.log(`⚡ ${label}`)

        if (!DRY_RUN) {
          const result = await getOrCreateCar(brand, model, year)

          // 🔍 sanity check
          if (result?.engines?.length) {
            console.log(`✅ OK → ${result.engines.length} engines`)
            success++
          } else {
            console.log(`⚠️ saved but empty engines`)
            failed++
          }
        }

        await sleep(DELAY)

      } catch (e) {
        console.log(`❌ error → ${label}`)
        failed++
      }
    }
  }

  console.log('\n🏁 DONE')
  console.log(`✅ success: ${success}`)
  console.log(`❌ failed: ${failed}`)
}

run()