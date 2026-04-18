import { supabase } from '@/lib/supabase-client'

export async function getRankingCars(type: string, limit = 12) {

  const { data } = await supabase
    .from('cars')
    .select(`
      brand,
      model,
      year,
      brand_slug,
      model_slug,
      engines (*),
      problems (*)
    `)
    .limit(50)

  if (!data) return []

  const scored = data.map((car) => {

    const engine = car.engines?.[0]
    const problems = car.problems || []

    let score = 50

    // 🔥 RELIABILITY
    if (type === 'reliable') {
      score += Math.max(0, 20 - problems.length * 2)
    }

    // 🔥 CHEAP
    if (type === 'cheap') {
      score += engine?.fuel_type === 'diesel' ? 5 : 0
      score += 15 - problems.length
    }

    // 🔥 PERFORMANCE
    if (type === 'performance') {
      score += engine?.power || 0
    }

    return {
      ...car,
      score
    }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}