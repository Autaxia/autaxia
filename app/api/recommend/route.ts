import { NextResponse } from 'next/server'

// ===============================
// TYPES
// ===============================
type Car = {
  power?: number
  torque?: number
  fuel?: string
}

// ===============================
// HELPERS
// ===============================
function safeNumber(v: unknown, fallback = 0): number {
  return typeof v === 'number' && !isNaN(v) ? v : fallback
}

function normalizeFuel(fuel?: string): string {
  const f = (fuel || '').toLowerCase()

  if (f.includes('diesel')) return 'diesel'
  if (f.includes('electric') || f.includes('ev')) return 'electric'
  if (f.includes('hybrid')) return 'hybrid'

  return 'petrol'
}

// ===============================
// INTENT DETECTION (🔥 IA GRATIS)
// ===============================
function detectIntent(prompt: string) {
  const p = (prompt || '').toLowerCase()

  if (p.includes('cheap') || p.includes('budget') || p.includes('affordable')) return 'budget'
  if (p.includes('fast') || p.includes('performance') || p.includes('speed')) return 'performance'
  if (p.includes('reliable') || p.includes('daily') || p.includes('comfort')) return 'daily'

  return 'balanced'
}

// ===============================
// SCORING
// ===============================
function scoreDaily(c: Car) {
  const power = safeNumber(c.power)
  const fuel = normalizeFuel(c.fuel)

  let score = 60

  if (fuel === 'electric') score += 25
  if (fuel === 'diesel') score += 10
  if (power < 150) score += 10
  if (power > 250) score -= 15

  return score
}

function scorePerformance(c: Car) {
  return safeNumber(c.power) * 1.3 + safeNumber(c.torque) * 0.3
}

function scoreBudget(c: Car) {
  const power = safeNumber(c.power)
  return 100 - power * 0.2
}

function scoreBalanced(c: Car) {
  const power = safeNumber(c.power)
  const fuel = normalizeFuel(c.fuel)

  let score = power * 0.6

  if (fuel === 'electric') score += 20
  if (fuel === 'diesel') score += 10

  return score
}

// ===============================
// ROUTE
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const cars: Car[] = Array.isArray(body?.cars) ? body.cars : []
    const prompt: string = typeof body?.prompt === 'string' ? body.prompt : ''

    if (cars.length === 0) {
      return NextResponse.json({}, { status: 200 })
    }

    const intent = detectIntent(prompt)

    // ===============================
    // SELECT SCORING FUNCTION
    // ===============================
    let scorer: (c: Car) => number

    switch (intent) {
      case 'performance':
        scorer = scorePerformance
        break
      case 'budget':
        scorer = scoreBudget
        break
      case 'daily':
        scorer = scoreDaily
        break
      default:
        scorer = scoreBalanced
    }

    // ===============================
    // CALCULATE BEST
    // ===============================
    const best = [...cars].sort((a, b) => scorer(b) - scorer(a))[0]

    // ===============================
    // EXTRA INSIGHT (🔥 UX)
    // ===============================
    const explanation =
      intent === 'performance'
        ? 'Best for speed and power'
        : intent === 'budget'
        ? 'Best value for money'
        : intent === 'daily'
        ? 'Best for daily driving and reliability'
        : 'Best overall balance'

    return NextResponse.json({
      best,
      intent,
      explanation
    })

  } catch (error) {
    console.error('❌ RECOMMEND ERROR:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}