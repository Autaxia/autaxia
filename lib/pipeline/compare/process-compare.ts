import { getCarBySlug } from '@/lib/db/queries'

function buildDiff(a: any, b: any) {
  const diffs = []

  if (a.power && b.power) {
    if (a.power > b.power) {
      diffs.push(`${a.model} has more power (${a.power}hp vs ${b.power}hp)`)
    } else {
      diffs.push(`${b.model} is more powerful (${b.power}hp vs ${a.power}hp)`)
    }
  }

  if (a.fuel_type !== b.fuel_type) {
    diffs.push(`${a.model} uses ${a.fuel_type}, while ${b.model} uses ${b.fuel_type}`)
  }

  if (a.transmission !== b.transmission) {
    diffs.push(`Different transmission types: ${a.transmission} vs ${b.transmission}`)
  }

  return diffs
}

function scoreCar(car: any) {
  let score = 70

  if (car.power) score += Math.min(car.power / 10, 10)
  if (car.fuel_type === 'diesel') score += 5
  if (car.transmission === 'automatic') score += 5

  return Math.round(score)
}

export async function processCompareJob(job: any, supabase: any) {
  try {
    if (!job.slug) return null

    const [aSlug, bSlug] = job.slug.split('-vs-')

    if (!aSlug || !bSlug) return null

    // 🔥 obtener coches reales
    const a = await getCarBySlugSafe(aSlug)
    const b = await getCarBySlugSafe(bSlug)

    if (!a || !b) return null

    const scoreA = scoreCar(a)
    const scoreB = scoreCar(b)

    const winner = scoreA > scoreB ? a : b

    const content = {
      title: `${a.brand} ${a.model} vs ${b.brand} ${b.model}`,
      intro: `Compare ${a.brand} ${a.model} vs ${b.brand} ${b.model}. Performance, reliability and ownership costs.`,

      cars: [a, b],

      scores: [scoreA, scoreB],

      winner: {
        brand: winner.brand,
        model: winner.model
      },

      differences: buildDiff(a, b)
    }

    await supabase.from('compare_pages').upsert({
      slug: job.slug,
      content,
      updated_at: new Date().toISOString()
    })

    return content

  } catch (err) {
    console.log('❌ compare job error', err)
    return null
  }
}

// =====================
// SAFE WRAPPER
// =====================
async function getCarBySlugSafe(slug: string) {
  try {
    const parts = slug.split('-')
    const brand = parts[0]
    const model = parts.slice(1).join('-')

    if (!brand || !model) return null

    return await getCarBySlug(brand, model, 2018)
  } catch {
    return null
  }
}