import { supabase } from '@/lib/supabase-client'

export async function getAutoCompareCars({
  brand,
  model,
  year,
  limit = 3
}: {
  brand: string
  model: string
  year: number | string
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
      model_slug
    `)
    .neq('model_slug', model)
    .gte('year', yearNumber - 2)
    .lte('year', yearNumber + 2)
    .limit(15)

  if (!data) return []

  // 🔥 priorizar otras marcas (comparaciones más interesantes)
  const scored = data.map((car) => {
    let score = 0

    if (car.brand_slug !== brand) score += 3

    const diff = Math.abs(car.year - yearNumber)
    score += Math.max(0, 3 - diff)

    return { ...car, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}