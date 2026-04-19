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
        // =========================
        // 🔥 1. COGER DATA REAL (IA CACHEADA)
        // =========================
        const slug = `${c.brand_slug}-${c.model_slug}-${c.year}`

        const { data: page, error } = await supabase
          .from('pages')
          .select('content')
          .eq('slug', slug)
          .maybeSingle()

        if (error) {
          console.error('❌ compare query error:', error)
          continue
        }

        if (!page?.content) {
          console.log('⚠️ no content for:', slug)
          continue
        }

        const content =
          typeof page.content === 'string'
            ? JSON.parse(page.content)
            : page.content

        // =========================
        // 🔥 2. ENGINE REAL (IA)
        // =========================
        const engine = content?.engines?.[0]

        const power =
          engine?.power_hp ??
          engine?.power ??
          120

        const fuel =
          engine?.fuel ??
          engine?.fuel_type ??
          'petrol'

        const transmission =
          engine?.transmission ??
          'manual'

        // =========================
        // 🔥 3. FACTORES
        // =========================
        const fuelFactor =
          fuel === 'diesel' ? -0.6 :
          fuel === 'electric' ? -1.8 :
          0

        const transmissionFactor =
          transmission === 'automatic' ? -0.2 : 0.2

        // =========================
        // 🔥 4. PERFORMANCE
        // =========================
        const topSpeed =
          content?.performance?.top_speed_kmh ??
          Math.round(power * 0.62 + 135 + transmissionFactor * 8)

        const accel =
          content?.performance?.acceleration_0_100 ??
          Math.max(
            3.0,
            12.8 - power / 55 + fuelFactor + transmissionFactor
          )

        const consumption =
          content?.efficiency?.consumption_l_100km ??
          Math.max(
            3.5,
            10.5 - power / 60 +
            (fuel === 'diesel' ? -1.2 : fuel === 'electric' ? -3 : 0.6)
          )

        // =========================
        // 🔥 5. RELIABILITY
        // =========================
        const reliabilityScore =
          content?.reliability?.score ??
          (fuel === 'electric'
            ? 85
            : fuel === 'diesel'
            ? 80
            : 72 + Math.max(0, 18 - power / 12))

        // =========================
        // 🔥 6. RESULT FINAL
        // =========================
        results.push({
          id: slug,

          brand: content?.brand || {
            name: c.brand_slug.replace(/-/g, ' '),
            slug: c.brand_slug
          },

          model: content?.model || {
            name: c.model_slug.replace(/-/g, ' '),
            slug: c.model_slug
          },

          year: content?.year || c.year,

          engine: {
            power_hp: power,
            fuel,
            transmission
          },

          performance: {
            top_speed_kmh: Math.round(topSpeed),
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