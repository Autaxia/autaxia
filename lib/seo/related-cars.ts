import { supabase } from '@/lib/supabase-client'

export async function getRelatedCars({
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

  // 🔥 1. MISMO SEGMENTO (aprox por año)
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
    .limit(20)

  if (!data) return []

  // 🔥 2. SCORING SIMPLE
  const scored = data.map((car) => {

    let score = 0

    // misma marca
    if (car.brand_slug === brand) score += 3

    // cercanía de año
    const diff = Math.abs(car.year - yearNumber)
    score += Math.max(0, 3 - diff)

    return {
      ...car,
      score
    }
  })

  // 🔥 3. ordenar y devolver
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}