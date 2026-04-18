import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getRealCarData(
  brand: string,
  model: string,
  year: number
) {
  const { data } = await supabase
    .from('car_real_data')
    .select('*')
    .ilike('brand', brand)
    .ilike('model', model)
    .limit(3)

  if (!data || data.length === 0) return null

  return {
    engines: data.map((d) => ({
      name: d.engine,
      power: d.power,
      fuel: d.fuel
    })),
    mpg: data[0].mpg
  }
}