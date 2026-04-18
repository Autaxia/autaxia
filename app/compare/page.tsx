'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ComparePage() {

  const [cars, setCars] = useState<any[]>([])

  // =========================
  // LOAD STORAGE
  // =========================
  useEffect(() => {
    const raw = localStorage.getItem('compare') || '[]'
    const parsed = JSON.parse(raw)
    setCars(parsed)
  }, [])

  // =========================
  // ENRICH + SCORE
  // =========================
  const enriched = cars.map(c => {

    const reliability = c.reliability || 0
    const consumption = c.efficiency?.consumption_l_100km || 10
    const accel = c.performance?.acceleration_0_100 || 10
    const speed = c.performance?.top_speed_kmh || 0

    const score =
      reliability
      - consumption * 2
      - accel * 1.5

    return {
      ...c,
      score,
      speed
    }
  })

  // =========================
  // GLOBAL STATS
  // =========================
  const maxScore = Math.max(0, ...enriched.map(c => c.score))
  const maxSpeed = Math.max(0, ...enriched.map(c => c.speed))

  const winner =
    enriched.length > 1
      ? [...enriched].sort((a, b) => b.score - a.score)[0]
      : null

  // =========================
  // BADGES
  // =========================
  const getBadges = (car: any) => {
    const badges: string[] = []

    if (car.speed === maxSpeed && maxSpeed > 0) {
      badges.push('🏎 Fastest')
    }

    if (car.score === maxScore && maxScore > 0) {
      badges.push('🏆 Best overall')
    }

    if (car.efficiency?.consumption_l_100km < 5) {
      badges.push('⚡ Efficient')
    }

    if ((car.performance?.acceleration_0_100 ?? 10) < 7) {
      badges.push('🔥 Quick')
    }

    return badges
  }

  // =========================
  // REMOVE
  // =========================
  const removeCar = (id: string) => {
    const updated = cars.filter(c => c.id !== id)
    localStorage.setItem('compare', JSON.stringify(updated))
    setCars(updated)
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 
        bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,115,0,0.10),transparent),
             radial-gradient(700px_400px_at_90%_0%,rgba(255,115,0,0.06),transparent)]" 
      />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">Compare cars</h1>
          <p className="text-gray-400 mt-2">Real data comparison</p>
        </div>

        {cars.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            No cars selected yet
          </div>
        )}

        {cars.length > 0 && (
          <>
            {/* CARDS */}
            <div className="grid gap-6 md:grid-cols-3">

              {enriched.map(car => (
                <div key={car.id} className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">

                  <h2 className="text-lg font-semibold">
                    {car.brand.name} {car.model.name} {car.year}
                  </h2>

                  {/* BADGES */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {getBadges(car).map(b => (
                      <span key={b} className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* SCORE */}
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-1">Overall score</div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-orange-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, car.score)}%` }}
                      />
                    </div>

                    <div className="text-sm mt-1 text-orange-400 font-semibold">
                      {car.score.toFixed(1)}
                    </div>
                  </div>

                  {/* PERFORMANCE BAR */}
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-1">
                      Relative speed
                    </div>

                    <div className="w-full bg-white/10 h-2 rounded">
                      <div
                        className="h-2 bg-orange-400 rounded"
                        style={{
                          width: `${(car.speed / (maxSpeed || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* DATA */}
                  <div className="mt-4 text-sm space-y-1 text-gray-300">
                    <div>⚡ {car.performance?.top_speed_kmh ?? '--'} km/h</div>
                    <div>⏱ {car.performance?.acceleration_0_100 ?? '--'}s 0-100</div>
                    <div>⛽ {car.efficiency?.consumption_l_100km ?? '--'} L/100km</div>
                    <div>🛠 {car.maintenance?.cost_level ?? '--'}</div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/cars/${car.brand.slug}/${car.model.slug}/${car.year}`}
                    className="block mt-4 text-center py-2 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-300 text-black font-semibold hover:scale-105 transition"
                  >
                    View car
                  </Link>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeCar(car.id)}
                    className="absolute top-3 right-3 text-xs text-gray-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}

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

          </>
        )}

        {/* SEO LINKS */}
        <div className="pt-10 flex flex-wrap gap-4 text-sm justify-center">

          <Link href="/cars" className="text-orange-400 hover:underline">
            Browse all brands
          </Link>

          <Link href="/explore" className="text-orange-400 hover:underline">
            Explore cars
          </Link>

          <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
            Most reliable cars
          </Link>

        </div>

      </div>
    </div>
  )
}

<div className="pt-10 flex flex-wrap gap-4 text-sm justify-center">

  <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
    Best reliable cars
  </Link>

  <Link href="/best-cars/fast" className="text-orange-400 hover:underline">
    Fastest cars
  </Link>

  <Link href="/best-cars/low-consumption" className="text-orange-400 hover:underline">
    Low consumption cars
  </Link>

  <Link href="/best-cars/cheap-maintenance" className="text-orange-400 hover:underline">
    Cheap maintenance cars
  </Link>

</div>