import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(req: Request) {
  try {
    const { ids } = await req.json()

    if (!ids || !ids.length) {
      return NextResponse.json([])
    }

    const results: any[] = []

    for (const c of ids) {
      try {
        // 🔥 buscamos por modelo + año (no solo año)
        const { data, error } = await supabase
          .from('years')
          .select(`
            id,
            year,
            models (
              id,
              name,
              slug,
              brand_id
            ),
            engines (
              power_hp,
              fuel,
              transmission
            )
          `)
          .eq('year', Number(c.year))
          .eq('models.slug', c.model_slug) // 🔥 CLAVE
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error('❌ compare query error:', error)
          continue
        }

        if (!data) continue

        // 🔥 elegir mejor motor (más potente)
        const engine =
          data.engines?.sort(
            (a: any, b: any) => (b.power_hp || 0) - (a.power_hp || 0)
          )[0]

        const power = engine?.power_hp ?? 120

        // =========================
        // 🔥 CALCULOS REALISTAS
        // =========================
        const topSpeed = Math.round(power * 0.65 + 130)
        const accel = Math.max(3.2, 13 - power / 50)
        const consumption = Math.max(4.2, 11 - power / 55)

        // 🔥 reliability más coherente
        const reliabilityScore = Math.max(
          60,
          Math.min(90, 80 - power / 20)
        )

        results.push({
          id: data.id,

          // 🔥 NORMALIZACIÓN FRONT
          brand: {
            name: c.brand_slug,
            slug: c.brand_slug
          },

          model: {
            name: (data.models as any)?.name || 'Model',
            slug: c.model_slug
          },

          year: data.year,

          // 🔥 DATOS EXTRA (muy importante para UI futura)
          engine: {
            power_hp: power,
            fuel: engine?.fuel ?? 'petrol',
            transmission: engine?.transmission ?? 'auto'
          },

          performance: {
            top_speed_kmh: topSpeed,
            acceleration_0_100: Number(accel.toFixed(1))
          },

          efficiency: {
            consumption_l_100km: Number(consumption.toFixed(1))
          },

          reliability: {
            score: Math.round(reliabilityScore)
          }
        })

      } catch (err) {
        console.error('❌ loop error:', err)
        continue
      }
    }

    return NextResponse.json(results)

  } catch (err) {
    console.error('❌ compare api crash', err)
    return NextResponse.json([], { status: 500 })
  }
}