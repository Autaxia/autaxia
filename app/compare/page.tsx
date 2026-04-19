'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import StatBar from '@/components/StatBar'
import CompareSelector from '@/components/CompareSelector'

export default function ComparePage() {

  const [cars, setCars] = useState<any[]>([])

  // =========================
  // LOAD + FETCH
  // =========================
  useEffect(() => {
    async function loadCars() {
      try {
        const raw = localStorage.getItem('compare') || '[]'
        const stored = JSON.parse(raw)

        if (!stored.length) {
          setCars([])
          return
        }

        const res = await fetch('/api/compare', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ids: stored // 🔥 IMPORTANTE: mandar todo
  })
})

        const data = await res.json()

        // 🔥 NORMALIZACIÓN CLAVE
        const normalized = data.map((c: any) => ({
          ...c,
          brand: {
            name: c.brand?.name || c.brand || 'Unknown',
            slug: c.brand?.slug || c.brand_slug || c.brand || 'unknown'
          },
          model: {
            name: c.model?.name || c.model || 'Model',
            slug: c.model?.slug || c.model_slug || c.model || 'model'
          }
        }))

        setCars(normalized)

      } catch (err) {
        console.error(err)
        setCars([])
      }
    }

    loadCars()

    // 🔥 live update
    window.addEventListener('compareUpdated', loadCars)
    return () => window.removeEventListener('compareUpdated', loadCars)

  }, [])

  // =========================
  // SCORE
  // =========================
  const enriched = cars.map(c => {

    const reliability = c?.reliability?.score ?? c?.reliability ?? 70

    const consumption =
      c?.efficiency?.consumption_l_100km ?? 6.5

    const accel =
      c?.performance?.acceleration_0_100 ?? 8.5

    const speed =
      c?.performance?.top_speed_kmh ?? 200

    const score =
      reliability * 0.6 +
      (100 - consumption * 5) * 0.2 +
      (100 - accel * 6) * 0.2

    return {
      ...c,
      score: Math.max(0, Math.min(100, score)),
      speed
    }
  })

  const winner =
    enriched.length > 1
      ? [...enriched].sort((a, b) => b.score - a.score)[0]
      : null

  // =========================
  // REMOVE
  // =========================
  const removeCar = (id: string) => {
    const raw = JSON.parse(localStorage.getItem('compare') || '[]')
    const updated = raw.filter((c: any) => c.id !== id)

    localStorage.setItem('compare', JSON.stringify(updated))
    window.dispatchEvent(new Event('compareUpdated'))
  }

  // =========================
  // SLUG SAFE
  // =========================
  const compareSlug = cars
    .map(c => `${c.brand?.slug}-${c.model?.slug}-${c.year}`)
    .join('-vs-')

  // =========================
  // EMPTY
  // =========================
  if (!cars.length) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Compare Cars</h1>
          <p className="text-gray-400 mb-6">
            Select cars to compare performance, reliability and ownership costs.
          </p>
          <Link
            href="/brands"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
          >
            Browse cars
          </Link>
        </div>
      </div>
    )
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

  <div>
    <h1 className="text-4xl font-bold">Compare cars</h1>
    <p className="text-gray-400 mt-2">
      Compare real-world performance, efficiency and reliability
    </p>
  </div>

  <Link
    href="/brands"
    className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold hover:scale-105 transition"
  >
    + Browse brands
  </Link>

</div>
{/* 🔥 INLINE SELECTOR */}
<CompareSelector />

        {/* CTA */}
        {cars.length >= 2 && (
          <div className="text-center">
            <Link
              href={`/compare/${compareSlug}`}
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold hover:scale-105 transition"
            >
              🔥 Full comparison
            </Link>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

  {enriched.map(car => {

    const isWinner = winner && car.id === winner.id

    return (
      <div
        key={car.id}
        className={`
          relative p-6 rounded-2xl border backdrop-blur-xl transition
          ${isWinner
            ? 'border-orange-400 bg-orange-500/5'
            : 'border-white/10 bg-white/[0.04]'
          }
        `}
      >

        {isWinner && (
          <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-orange-400 text-black font-semibold">
            BEST
          </div>
        )}

        <h2 className="text-lg font-semibold">
          {car.brand?.name} {car.model?.name}
        </h2>

        <p className="text-gray-400 text-sm">{car.year}</p>

        {/* 🔥 BARRAS PREMIUM */}
        <div className="mt-4 space-y-3">

          <StatBar
            label="Top speed"
            value={car.performance?.top_speed_kmh}
            max={320}
          />

          <StatBar
            label="Acceleration"
            value={car.performance?.acceleration_0_100}
            max={12}
            inverse
          />

          <StatBar
            label="Consumption"
            value={car.efficiency?.consumption_l_100km}
            max={12}
            inverse
          />

        </div>

        {/* SCORE */}
        <div className="mt-4 text-sm text-orange-400 font-semibold">
          Score: {car.score.toFixed(1)}
        </div>

        <Link
          href={`/cars/${car.brand.slug}/${car.model.slug}/${car.year}`}
          className="block mt-4 text-center py-2 rounded-xl bg-orange-400 text-black font-semibold"
        >
          View car
        </Link>

        <button
          onClick={() => removeCar(car.id)}
          className="mt-3 text-xs text-gray-400 hover:text-red-400"
        >
          Remove
        </button>

      </div>
    )
  })}

</div>
        {/* WINNER */}
        {winner && (
          <div className="text-center pt-6">
            <p className="text-gray-400 text-sm">Best overall choice</p>
            <p className="text-lg font-semibold text-orange-400 mt-1">
              🏆 {winner.brand.name} {winner.model.name} {winner.year}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}