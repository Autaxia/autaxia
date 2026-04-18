import 'dotenv/config'
import { discoverModels } from './discover-models'
import { scrapeWikipediaEngines } from '../lib/data/wiki-engines'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('🔁 update engines...')

  const models = await discoverModels()

  for (const m of models) {
    try {
      const generations = await scrapeWikipediaEngines(m.wiki)

      for (const g of generations) {
        for (const e of g.engines) {
          await supabase.from('engines').upsert({
            brand: m.brand,
            model: m.wiki,
            generation: g.code,
            year_from: g.from,
            year_to: g.to,
            name: e.name,
            power_hp: e.power_hp,
            fuel_type: e.fuel_type
          })
        }
      }

    } catch {
      console.log(`❌ fallo ${m.wiki}`)
    }
  }

  console.log('✅ update terminado')
}

run()