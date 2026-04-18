import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =====================
// AUTOCOMPLETE
// =====================
async function getAutocomplete(query: string) {
  const res = await fetch(
    `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
  )

  const json = await res.json()
  return json[1] || []
}

// =====================
// FILTRO INTELIGENTE 🔥
// =====================
function isValidKeyword(type: string) {

  if (!type) return false

  if (type.length < 3) return false

  const banned = [
    'price',
    'for sale',
    'lease',
    'deal',
    'cheap'
  ]

  return !banned.some(b => type.includes(b))
}

// =====================
// MAIN
// =====================
async function run() {
  console.log('🚀 generating keywords')

  const { data: models, error } = await supabase
    .from('models')
    .select('*')

  // 🔴 AQUÍ VA LA OPCIÓN 1
  if (error) {
    console.log('❌ error fetching models', error)
    return
  }

  if (!models || models.length === 0) {
    console.log('❌ no models found')
    return
  }

  // ✅ AHORA YA ES SEGURO
  for (const m of models) {

    for (let year = 2015; year <= 2024; year++) {

      const base = `${m.brand} ${m.model} ${year}`

      const suggestions = await getAutocomplete(base)

      for (const kw of suggestions) {

        const type = kw.replace(base, '').trim()

        if (!isValidKeyword(type)) continue

        await supabase.from('jobs').upsert({
          brand: m.brand,
          model: m.model,
          year,
          type,
          keyword: kw,
          status: 'pending'
        }, {
          onConflict: 'keyword'
        })

        console.log('🔥', kw)
      }
    }
  }

  console.log('✅ DONE')
}

run()