import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('brand_slug, model_slug, year, type')

  if (error) {
    console.log('❌ error fetching pages', error)
    return []
  }

  return data || []
}