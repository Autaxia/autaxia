import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function getCar(brand: string, model: string, year: string) {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('brand', brand)
    .eq('model', model)
    .eq('year', Number(year))
    .single()

  return data
}