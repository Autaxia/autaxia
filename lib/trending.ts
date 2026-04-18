import { createClient } from '@supabase/supabase-js'

export async function getTrendingCars() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('pages')
    .select('brand, model, year')
    .limit(20)

  return data || []
}