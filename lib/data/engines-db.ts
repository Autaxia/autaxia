import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getRealEngines(car: any) {
  const { data } = await supabase
    .from('engines')
    .select('*')
    .eq('brand', car.brand.toLowerCase())
    .eq('model', car.model.toLowerCase())

  if (!data || data.length === 0) return null

  return data.map(e => ({
    name: e.name,
    power_hp: e.power_hp,
    fuel_type: e.fuel_type
  }))
}