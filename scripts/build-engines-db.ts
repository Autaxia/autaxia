import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { scrapeWikipediaEngines } from '../lib/data/wiki-engines'
import { discoverModels } from './discover-models'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizeModel(wiki: string) {
  return wiki.toLowerCase().replace(/_/g, ' ')
}

async function run() {
  const models = await discoverModels()

  console.log(`🚀 ${models.length} modelos detectados`)

  for (const m of models) {
    try {
      console.log(`🚗 ${m.wiki}`)

      const generations = await scrapeWikipediaEngines(m.wiki)

      if (!generations || generations.length === 0) {
        console.log('⚠️ sin datos')
        continue
      }

      for (const g of generations) {
        for (const e of g.engines) {
          await supabase.from('engines').insert({
            brand: m.brand,
            model: normalizeModel(m.wiki),
            generation: g.code,
            year_from: g.from,
            year_to: g.to,
            name: e.name,
            power_hp: e.power_hp,
            fuel_type: e.fuel_type
          })
        }
      }

    } catch (err) {
      console.log(`❌ fallo ${m.wiki}`)
    }
  }

  console.log('🔥 DB COMPLETA')
}

run()