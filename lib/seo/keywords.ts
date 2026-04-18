export function generateKeywords(job: any) {

  const base = `${job.brand} ${job.model} ${job.year}`

  // 🔥 ALTA INTENCIÓN (DINERO)
  const moneyKeywords = [
    'problems',
    'common problems',
    'repair cost',
    'maintenance cost',
    'is it reliable',
    'should I buy',
    'ownership cost',
    'insurance cost'
  ]

  // 🔥 LONG TAIL (FÁCIL RANKING)
  const longTail = [
    'high mileage problems',
    'issues after 100k miles',
    'engine reliability',
    'turbo failure',
    'oil consumption',
    'gearbox problems'
  ]

  // 🔥 ENGINE (MUY POTENTE)
  const engines = [
    '1.6 tdi',
    '2.0 tdi',
    '1.4 tsi',
    '2.0 tsi'
  ]

  const keywords: string[] = []

  // base
  for (const k of moneyKeywords) {
    keywords.push(`${base} ${k}`)
  }

  // long tail
  for (const k of longTail) {
    keywords.push(`${base} ${k}`)
  }

  // engine-specific
  for (const e of engines) {
    for (const k of moneyKeywords) {
      keywords.push(`${base} ${e} ${k}`)
    }
  }

  return keywords
}