import 'dotenv/config'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
export async function discoverModels() {
  const allModels: any[] = []

  for (const category of brandCategories) {
    const items = await getCategoryMembers(category)

    for (const item of items) {
      const brand = category.split(' ')[0]
      const model = item.title

      allModels.push({
        brand,
        model,
        wiki: item.title
      })
    }
  }

  return allModels // 🔥 ESTO ES LA CLAVE
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

const brandCategories = [
  'BMW vehicles',
  'Audi vehicles',
  'Mercedes-Benz vehicles',
  'Volkswagen vehicles',
  'Toyota vehicles',
  'Ford vehicles'
]

// 🔹 obtener modelos desde Wikipedia
async function getCategoryMembers(category: string) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${category}&cmlimit=200&format=json`

  const res = await fetch(url)
  const json: any = await res.json()

  return json.query?.categorymembers || []
}

// 🔹 limpiar nombres (clave)
function cleanModel(title: string) {
  return title
    .replace(/\(.*?\)/g, '')
    .replace(/List of/g, '')
    .trim()
}

// 🔹 insertar en DB sin duplicados
async function saveModels(models: { brand: string; model: string }[]) {
  for (const m of models) {
    await supabase
      .from('models')
      .upsert(
        { brand: m.brand, model: m.model },
        { onConflict: 'brand,model' }
      )
  }
}

// 🔹 MAIN
async function run() {
  const allModels: { brand: string; model: string }[] = []

  for (const category of brandCategories) {
    console.log('🔍', category)

    const items = await getCategoryMembers(category)

    for (const item of items) {
      const brand = category.split(' ')[0]
      const model = cleanModel(item.title)

      if (!model || model.length < 2) continue

      allModels.push({ brand, model })
    }
  }

  console.log('💾 guardando modelos...')
  await saveModels(allModels)

  console.log('✅ DONE:', allModels.length)
}

run()