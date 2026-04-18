import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('🚀 generating compare jobs...')

  const { data: models } = await supabase
    .from('models')
    .select('*')

  if (!models) return

  let created = 0

  for (let i = 0; i < models.length; i++) {
    for (let j = i + 1; j < models.length; j++) {

      const a = models[i]
      const b = models[j]

      // 🔥 evitar comparaciones absurdas (opcional)
      if (a.brand_slug === b.brand_slug) continue

      const slug = `${a.brand_slug}-${a.slug}-vs-${b.brand_slug}-${b.slug}`

      const { error } = await supabase.from('jobs').upsert({
        type: 'compare',
        slug,
        brand_slug: a.brand_slug,
        model_slug: a.slug,
        status: 'pending'
      }, {
        onConflict: 'slug'
      })

      if (!error) created++
    }
  }

  console.log(`🔥 ${created} compare jobs creados`)
}

run()