import { supabase } from '@/lib/supabase-client'

export async function getAlternatives({
  brand,
  model,
  year,
  fuel_type,
  limit = 6
}: {
  brand: string
  model: string
  year: number | string
  fuel_type?: string
  limit?: number
}) {

  const yearNumber = Number(year)

  const { data } = await supabase
    .from('cars')
    .select(`
      brand,
      model,
      year,
      brand_slug,
      model_slug,
      engines (*)
    `)
    .neq('model_slug', model)
    .gte('year', yearNumber - 2)
    .lte('year', yearNumber + 2)
    .limit(20)

  if (!data) return []

  const scored = data.map((car) => {

    const engine = car.engines?.[0]

    let score = 0

    // 🔥 misma categoría indirecta
    if (car.brand_slug !== brand) score += 2

    // 🔥 año cercano
    const diff = Math.abs(car.year - yearNumber)
    score += Math.max(0, 3 - diff)

    // 🔥 mismo combustible
    if (fuel_type && engine?.fuel_type === fuel_type) {
      score += 3
    }

    return { ...car, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}