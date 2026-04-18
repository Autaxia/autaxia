import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildUrl(p: any) {
  return `/cars/${p.brand_slug}/${p.model_slug}/${p.year}/${p.type}`
}

async function run() {

  console.log('🔗 interlinking start')

  const { data: pages } = await supabase
    .from('pages')
    .select('*')

  if (!pages) return

  for (const p of pages) {

    let links: any[] = []

    // =====================
    // 1. MISMO COCHE (TIPOS)
    // =====================
    const sameCar = pages.filter(x =>
      x.brand_slug === p.brand_slug &&
      x.model_slug === p.model_slug &&
      x.year === p.year &&
      x.type !== p.type
    )

    links.push(...sameCar.slice(0, 3))

    // =====================
    // 2. MISMO MODELO (OTROS AÑOS)
    // =====================
    const sameModel = pages.filter(x =>
      x.brand_slug === p.brand_slug &&
      x.model_slug === p.model_slug &&
      x.year !== p.year &&
      x.type === p.type
    )

    links.push(...sameModel.slice(0, 2))

    // =====================
    // 3. MISMA MARCA (OTROS MODELOS)
    // =====================
    const sameBrand = pages.filter(x =>
      x.brand_slug === p.brand_slug &&
      x.model_slug !== p.model_slug &&
      x.type === p.type
    )

    links.push(...sameBrand.slice(0, 2))

    // =====================
    // FORMATO FINAL
    // =====================
    const formatted = links.map(l => ({
      title: `${l.brand_slug} ${l.model_slug} ${l.year} ${l.type}`,
      url: buildUrl(l)
    }))

    // =====================
    // GUARDAR
    // =====================
    await supabase.from('pages').update({
      links: formatted
    }).eq('id', p.id)

    console.log(`✅ links for ${p.slug}`)
  }

  console.log('🔥 interlinking done')
}

run()