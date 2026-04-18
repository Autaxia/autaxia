import Link from 'next/link'
import { getBrands } from '@/lib/db/queries'

export default async function CarsPage() {

  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden">

      {/* 🔥 GLOW */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,115,0,0.10),transparent),radial-gradient(700px_400px_at_90%_0%,rgba(255,115,0,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
{/* 🔥 BACK TO HOME */}
<Link
  href="/"
  className="
    inline-flex items-center gap-2
    text-sm
    text-gray-400
    hover:text-orange-400
    transition
  "
>
  ← Back to home
</Link>
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Car Brands Database
          </h1>

          <p className="text-gray-400 mt-2">
            Explore car manufacturers worldwide. Discover models, reliability insights and ownership costs.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">

          {brands?.map((brand: any) => (
            <Link
              key={brand.id}
              href={`/cars/${brand.slug}`}
              className="
                group
                p-5
                rounded-2xl
                bg-white/[0.04]
                backdrop-blur-xl
                border border-white/10
                text-left
                transition-all duration-300
                hover:border-orange-400/40
                hover:bg-white/[0.06]
                hover:shadow-[0_0_40px_rgba(255,115,0,0.15)]
              "
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    {brand.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Explore models
                  </p>
                </div>

                <span className="text-gray-500 group-hover:text-orange-400 transition">
                  →
                </span>
              </div>
            </Link>
          ))}

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