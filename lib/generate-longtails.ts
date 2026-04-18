import { createClient } from '@supabase/supabase-js'
import { getGoogleSuggest, getForumKeywords } from './keywords'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateLongtail(car: any) {
  const base = `${car.brand} ${car.model} ${car.year}`

  const suggest = await getGoogleSuggest(base)
  const forum = await getForumKeywords(car)

  const all = [...suggest, ...forum]

  const rows = all.map((q) => ({
    brand: car.brand,
    model: car.model,
    year: car.year,
    type: 'longtail',
    keyword: q
  }))

  if (rows.length) {
    await supabase.from('jobs').upsert(rows, {
      onConflict: 'brand,model,year,keyword'
    })
  }
}