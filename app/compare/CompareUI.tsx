'use client'

import { useEffect, useState } from 'react'
import CompareTable from '@/components/compare-table'
import Link from 'next/link'

export default function CompareUI({ initialCars = [] }: any) {
  const [cars, setCars] = useState<any[]>(initialCars)

  // =====================
  // FALLBACK LOCAL (si no viene SSR)
  // =====================
  useEffect(() => {
    if (initialCars?.length) return

    try {
      const stored = JSON.parse(localStorage.getItem('compare') || '[]')

      const normalized = stored.map((c: any) => ({
        ...c,
        brand:
          typeof c.brand === 'string'
            ? { name: c.brand, slug: c.brand_slug || c.brand }
            : c.brand,
        model:
          typeof c.model === 'string'
            ? { name: c.model, slug: c.model_slug || c.model }
            : c.model,
      }))

      setCars(normalized)
    } catch {
      setCars([])
    }
  }, [initialCars])

  // =====================
  // REMOVE
  // =====================
  function removeCar(index: number) {
    const updated = [...cars]
    updated.splice(index, 1)

    localStorage.setItem('compare', JSON.stringify(updated))
    setCars(updated)
  }

  // =====================
  // CLEAR ALL
  // =====================
  function clearAll() {
    localStorage.removeItem('compare')
    setCars([])
  }

  // =====================
  // SCORE PRO
  // =====================
  const scored = cars.map(c => {
    const reliability = c.reliability || 0
    const consumption = c.efficiency?.consumption_l_100km || 10
    const accel = c.performance?.acceleration_0_100 || 10

    const score =
      reliability
      - consumption * 2
      - accel * 1.5

    return { ...c, score }
  })

  const winner =
    scored.length > 1
      ? [...scored].sort((a, b) => b.score - a.score)[0]
      : null

  // =====================
  // EMPTY STATE
  // =====================
  if (!cars.length) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">
            Compare Cars
          </h1>

          <p className="text-gray-400 mb-6">
            You haven't selected any cars yet. Start comparing real data and insights.
          </p>

          <Link
            href="/brands"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    )
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              Compare Cars
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Performance, reliability and real ownership insights.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/brands"
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white"
            >
              + Add car
            </Link>

            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-6">

          {cars.map((car, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-orange-400/30 transition"
            >
              <h2 className="text-xl font-semibold">
                {car?.brand?.name} {car?.model?.name}
              </h2>

              <p className="text-gray-400 text-sm">
                {car.year}
              </p>

              <div className="mt-4 space-y-1 text-sm text-gray-300">
                <p>⚡ {car.performance?.top_speed_kmh ?? '--'} km/h</p>
                <p>⏱ {car.performance?.acceleration_0_100 ?? '--'}s</p>
                <p>⛽ {car.efficiency?.consumption_l_100km ?? '--'} L/100km</p>
              </div>
            </div>
          ))}

        </div>

        {/* VS */}
        <div className="text-center text-3xl font-bold text-orange-400">
          VS
        </div>

        {/* TABLE */}
        <CompareTable cars={cars} onRemove={removeCar} />

        {/* WINNER */}
        {winner && (
          <div className="text-center p-6 rounded-xl border border-orange-400/20 bg-orange-500/5">
            <p className="text-gray-400 text-sm">
              Best overall
            </p>

            <p className="text-lg font-semibold text-orange-400 mt-1">
              🏆 {winner?.brand?.name} {winner?.model?.name} {winner?.year}
            </p>
          </div>
        )}

        {/* SEO */}
        <div className="max-w-3xl mx-auto text-center text-sm text-gray-500">
          Compare real-world reliability, maintenance costs and performance based on aggregated ownership data.
        </div>

      </div>
    </div>
  )
}