import { getCarBySlug } from '@/lib/db/queries'
import Link from 'next/link'

// =====================
// PARSER (ROBUSTO)
// =====================
function parseSlug(slug: string) {
  const parts = slug.split('-vs-')

  const parseCar = (str: string) => {
    const arr = str.split('-')
    const year = arr.pop()
    const brand = arr.shift()
    const model = arr.join('-')

    return { brand, model, year }
  }

  return parts.map(parseCar)
}

// =====================
// SEO META
// =====================
export async function generateMetadata({ params }: any) {
  const slug = params.slug || ''
  const readable = slug.replace(/-/g, ' ')

  return {
    title: `${readable} comparison (2026)`,
    description: `Compare ${readable} in performance, efficiency and reliability.`,
  }
}

// =====================
// SCORE (NUEVO)
// =====================
function getScore(car: any) {
  const reliability = car?.reliability?.score ?? 70
  const consumption = car?.efficiency?.consumption_l_100km ?? 6.5
  const accel = car?.performance?.acceleration_0_100 ?? 8

  return (
    reliability * 0.6 +
    (100 - consumption * 5) * 0.2 +
    (100 - accel * 6) * 0.2
  )
}

// =====================
// PAGE
// =====================
export default async function Page({ params }: any) {

  const { slug } = params
  const [a, b] = parseSlug(slug)

  const carA = await getCarBySlug(a.brand, a.model, a.year)
  const carB = await getCarBySlug(b.brand, b.model, b.year)

  if (!carA || !carB) return null

  const scoreA = getScore(carA)
  const scoreB = getScore(carB)

  const winner =
    scoreA > scoreB ? carA :
    scoreB > scoreA ? carB :
    null

  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      {/* BG */}
      <div className="absolute inset-0 -z-10 
        bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,115,0,0.10),transparent),
             radial-gradient(700px_400px_at_90%_0%,rgba(255,115,0,0.06),transparent)]" 
      />

      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            {carA.brand} {carA.model} vs {carB.brand} {carB.model}
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Compare performance, efficiency and real-world driving experience.
          </p>
        </div>

        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-8">

          {[carA, carB].map((car, i) => {

            const isWinner = winner && car === winner

            return (
              <div
                key={i}
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

                <h2 className="text-xl font-semibold">
                  {car.brand} {car.model} {car.year}
                </h2>

                {/* 🔥 STATS NUEVAS */}
                <div className="mt-4 space-y-2 text-sm text-gray-300">

                  <p>
                    ⚡ Top speed:
                    <span className="text-white ml-1">
                      {car.performance?.top_speed_kmh ?? '--'} km/h
                    </span>
                  </p>

                  <p>
                    ⏱ 0-100:
                    <span className="text-white ml-1">
                      {car.performance?.acceleration_0_100 ?? '--'} s
                    </span>
                  </p>

                  <p>
                    ⛽ Consumption:
                    <span className="text-white ml-1">
                      {car.efficiency?.consumption_l_100km ?? '--'} L/100km
                    </span>
                  </p>

                  <p>
                    🛠 Reliability:
                    <span className="text-white ml-1">
                      {car.reliability?.score ?? '--'}/100
                    </span>
                  </p>

                </div>

                {/* SCORE */}
                <div className="mt-5">
                  <div className="text-xs text-gray-400 mb-1">
                    Overall score
                  </div>

                  <div className="w-full bg-white/10 h-2 rounded">
                    <div
                      className="h-2 bg-orange-400 rounded"
                      style={{
                        width: `${Math.min(100, getScore(car))}%`
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/cars/${car.brand_slug}/${car.model_slug}/${car.year}`}
                  className="block mt-6 text-center py-2 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-300 text-black font-semibold hover:scale-105 transition"
                >
                  View full specs
                </Link>

              </div>
            )
          })}

        </div>

        {/* VS */}
        <div className="text-center text-3xl font-bold text-orange-400">
          VS
        </div>

        {/* WINNER */}
        {winner && (
          <div className="text-center p-6 rounded-xl border border-orange-400/20 bg-orange-500/5">
            <p className="text-gray-400 text-sm">Best overall choice</p>
            <p className="text-lg font-semibold text-orange-400 mt-1">
              🏆 {winner.brand} {winner.model} {winner.year}
            </p>
          </div>
        )}

        {/* SEO TEXT */}
        <div className="max-w-3xl mx-auto text-gray-400 text-sm text-center leading-relaxed">
          Compare {carA.brand} {carA.model} vs {carB.brand} {carB.model}. 
          Discover differences in performance, fuel efficiency and reliability.
        </div>

      </div>
    </div>
  )
}