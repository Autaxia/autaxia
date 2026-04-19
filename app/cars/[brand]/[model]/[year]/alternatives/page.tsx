import Link from 'next/link'
import { getAlternatives } from '@/lib/seo/alternatives'
import { getCarBySlug } from '@/lib/db/queries'

export default async function Page({ params }: any) {

  const { brand, model, year } = params

  const car = await getCarBySlug(brand, model, year)

  if (!car) return null

  // =========================
  // 🔥 FUEL TYPE FIX
  // =========================
  const mainEngine =
    car.engines?.sort((a: any, b: any) => (b.power ?? 0) - (a.power ?? 0))[0]

  const fuelType = mainEngine?.fuel_type ?? 'petrol'

  // =========================
  // GET ALTERNATIVES
  // =========================
  const alternatives = await getAlternatives({
    brand,
    model,
    year,
    fuel_type: fuelType
  })

  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Best alternatives to {car.brand} {car.model} {year}
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Looking for similar cars? Here are the best alternatives based on performance,
            reliability and ownership costs.
          </p>
        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-2 gap-5">

          {alternatives.map((alt: any, i: number) => {

            // 🔥 SLUG ROBUSTO
            const compareSlug =
              `${brand}-${model}-${year}-vs-${alt.brand_slug}-${alt.model_slug}-${alt.year}`

            return (
              <div
                key={i}
                className="
                  p-5 rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  backdrop-blur-xl
                  hover:border-orange-400/40
                  transition
                "
              >

                <h3 className="font-semibold text-lg">
                  {alt.brand} {alt.model} {alt.year}
                </h3>

                {/* 🔥 MINI DATA */}
                <div className="mt-2 text-xs text-gray-400">
                  Similar segment • {fuelType} engine
                </div>

                <div className="mt-4 flex gap-4 text-sm">

                  <Link
                    href={`/cars/${alt.brand_slug}/${alt.model_slug}/${alt.year}`}
                    className="text-orange-400 hover:underline"
                  >
                    View →
                  </Link>

                  <Link
                    href={`/compare/${compareSlug}`}
                    className="text-orange-400 hover:underline"
                  >
                    Compare →
                  </Link>

                </div>

              </div>
            )
          })}

        </div>

        {/* SEO TEXT */}
        <div className="max-w-3xl text-sm text-gray-500">
          Explore alternatives to {car.brand} {car.model}. These vehicles offer
          similar performance, fuel efficiency and ownership experience.
        </div>

      </div>

    </div>
  )
}