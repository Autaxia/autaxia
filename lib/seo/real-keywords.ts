import { getGoogleSuggestions } from './suggest'
import { scoreKeywordCompetition } from './competition'

export async function generateRealKeywords(job: any) {

  const base = `${job.brand} ${job.model} ${job.year}`

  const seeds = [
    `${base} problems`,
    `${base} reliability`,
    `${base} maintenance`,
    `${base} cost`
  ]

  let allKeywords: string[] = []

  for (const seed of seeds) {
    const suggestions = await getGoogleSuggestions(seed)
    allKeywords.push(...suggestions)
  }

  // limpiar duplicados
  allKeywords = Array.from(new Set(allKeywords))

  // 🔥 score competencia
  const scored = []

  for (const k of allKeywords) {
    const score = await scoreKeywordCompetition(k)
    scored.push({ keyword: k, score })
  }

  // 🔥 ordenar por facilidad
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 10).map(k => k.keyword)
}