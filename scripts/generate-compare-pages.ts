import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data: carsRaw } = await supabase
  .from('pages')
  .select('*')
  .eq('type', 'overview')
  .limit(100)

// 🔥 FIX TS + seguridad
const cars = carsRaw || []

if (!cars.length) {
  console.log('⚠️ No cars found')
  return
}

  for (let i = 0; i < cars.length - 1; i++) {
    const a = cars[i]
    const b = cars[i + 1]

    const slug = `${a.slug}-vs-${b.slug}`

    await supabase.from('pages').insert({
      slug,
      type: 'compare',
      content: JSON.stringify({
        carA: a,
        carB: b
      })
    })
  }

  console.log('✅ compare pages created')
}

run()