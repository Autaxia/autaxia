import 'dotenv/config'
import fs from 'fs'
import csv from 'csv-parser'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const results: any[] = []

function normalizeBrand(b: string) {
  if (!b) return ''

  const map: any = {
    merc: 'mercedes-benz',
    hyundi: 'hyundai',
    bmw: 'bmw',
    volkswagen: 'volkswagen',
    ford: 'ford',
    toyota: 'toyota',
    skoda: 'skoda'
  }

  const lower = b.toLowerCase()
  return map[lower] || lower
}

function slugifyModel(model: string) {
  return model.toLowerCase().replace(/\s+/g, '-')
}

fs.createReadStream('./data/cars.csv')
  .pipe(csv())
  .on('data', (row) => {
    try {
      const brand = normalizeBrand(row.Manufacturer)
      const model = slugifyModel(row.model)

      results.push({
        brand,
        model,
        year: Number(row.year),
        engine: `${row.engineSize}L`,
        power: Math.round(Number(row.engineSize) * 70), // estimación realista
        fuel: row.fuelType,
        mpg: Number(row.mpg)
      })
    } catch (e) {
      console.log('skip row')
    }
  })
  .on('end', async () => {
    console.log(`📦 importing ${results.length} rows`)

    // 🔥 evitar duplicados masivos
    const unique = Array.from(
      new Map(results.map(r => [`${r.brand}-${r.model}-${r.year}`, r])).values()
    )

    console.log(`📊 unique cars: ${unique.length}`)

    for (const r of unique) {
      await supabase.from('car_real_data').insert(r)
    }

    console.log('✅ import done')
  })