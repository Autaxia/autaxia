import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { engines } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'

// ===============================
// TYPES
// ===============================
type DBEngine = {
  id: string
  model_id: string
  year_id: string | null
  power: number | null
  torque: number | null
  acceleration: number | null
  fuel_type: string | null
  transmission: string | null
}

type Engine = {
  id: string
  modelId: string
  power: number
  torque: number
  acceleration: number
  fuel: string
  transmission: string
  score: number
}

// ===============================
// HELPERS
// ===============================
function safeNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === 'number' && !isNaN(value) ? value : fallback
}

// 🔥 normalizar fuel
function normalizeFuel(fuel: string | null | undefined) {
  const f = (fuel || '').toLowerCase()

  if (f.includes('diesel') || f.includes('tdi')) return 'diesel'
  if (f.includes('electric') || f.includes('ev')) return 'electric'
  if (f.includes('hybrid')) return 'hybrid'

  return 'petrol'
}

// 🔥 selección inteligente (no solo potencia)
function pickBestEngine(list: DBEngine[]): DBEngine {
  return list.sort((a, b) => {
    const aPower = safeNumber(a.power)
    const bPower = safeNumber(b.power)

    // penalizar motores absurdos (>300hp para uso real)
    const aScore = aPower - (aPower > 300 ? 40 : 0)
    const bScore = bPower - (bPower > 300 ? 40 : 0)

    return bScore - aScore
  })[0]
}

// 🔥 SCORE PRO REAL
function computeScore(e: DBEngine) {
  const power = safeNumber(e.power)
  const torque = safeNumber(e.torque)
  const accel = safeNumber(e.acceleration, 10)
  const fuel = normalizeFuel(e.fuel_type)

  // ⚡ PERFORMANCE
  const performance =
    power * 0.5 +
    torque * 0.2 +
    (10 - accel) * 15

  // 🔧 RELIABILITY
  let reliability = 70
  if (fuel === 'diesel') reliability += 5
  if (fuel === 'electric') reliability += 12
  if (power > 300) reliability -= 10

  // 🛢️ EFFICIENCY
  let efficiency = 60
  if (fuel === 'diesel') efficiency += 10
  if (fuel === 'electric') efficiency += 25
  if (power > 250) efficiency -= 10

  // 💸 VALUE
  const value = 100 - power * 0.18

  const score =
    performance * 0.45 +
    reliability * 0.2 +
    efficiency * 0.2 +
    value * 0.15

  return Math.max(0, Math.min(100, score))
}

// ===============================
// ROUTE
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const modelIds: string[] = Array.isArray(body?.models)
      ? body.models.filter((id: unknown): id is string => typeof id === 'string')
      : []

    if (modelIds.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    const rows = await db
      .select()
      .from(engines)
      .where(inArray(engines.model_id, modelIds))

    if (!rows || rows.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    // ===============================
    // GROUP BY MODEL
    // ===============================
    const grouped: Record<string, DBEngine[]> = {}

    for (const row of rows as DBEngine[]) {
      if (!row.model_id) continue

      if (!grouped[row.model_id]) {
        grouped[row.model_id] = []
      }

      grouped[row.model_id].push(row)
    }

    // ===============================
    // BUILD RESULT
    // ===============================
    const result: Engine[] = []

    for (const modelId of Object.keys(grouped)) {
      const enginesList = grouped[modelId]

      if (!enginesList || enginesList.length === 0) continue

      const best = pickBestEngine(enginesList)

      const fuel = normalizeFuel(best.fuel_type)

      result.push({
        id: best.id,
        modelId: best.model_id,

        power: safeNumber(best.power),
        torque: safeNumber(best.torque),
        acceleration: safeNumber(best.acceleration),

        fuel,
        transmission: best.transmission ?? 'unknown',

        score: computeScore(best)
      })
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ SPECS API ERROR:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}