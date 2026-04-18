import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getBrandBySlug,
  getModelBySlug,
  getYearsByModel
} from '@/lib/db/queries'

import AddToCompareButton from '@/components/AddToCompareButton'

// ===============================
// 🔥 SEO METADATA
// ===============================
export async function generateMetadata({ params }: any) {
  const brand = params.brand.replace('-', ' ')
  const model = params.model.replace('-', ' ')

  return {
    title: `${brand} ${model} specs, reliability, problems & performance`,
    description: `Complete guide about ${brand} ${model}: specs, engines, reliability, common problems and model years.`,
  }
}

type Props = {
  params: {
    brand: string
    model: string
  }
}

// ===============================
// PAGE
// ===============================
export default async function ModelPage({ params }: Props) {

  const { brand, model } = params

  if (!brand || !model) return notFound()

  const brandSlug = brand.toLowerCase()
  const modelSlug = model.toLowerCase()

  const brandData = await getBrandBySlug(brandSlug)
  if (!brandData) return notFound()

  const modelData = await getModelBySlug(brandData.id, modelSlug)
  if (!modelData) return notFound()

  const years = await getYearsByModel(modelData.id)

  // ===============================
  // 🔥 AGGREGATED DATA (SEO GOLD)
  // ===============================
  const totalYears = years.length
  const newest = years[0]?.year
  const oldest = years[years.length - 1]?.year

  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,115,0,0.10),transparent),radial-gradient(700px_400px_at_90%_0%,rgba(255,115,0,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* 🔙 NAV */}
        <div className="flex gap-4 text-sm text-gray-400">
          <Link href="/cars" className="hover:text-orange-400 transition">
            ← Brands
          </Link>

          <Link href={`/cars/${brandSlug}`} className="hover:text-orange-400 transition">
            ← Models
          </Link>
        </div>

        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between gap-6 flex-wrap">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {brandData.name} {modelData.name}
            </h1>

            <p className="text-gray-400 mt-2">
              Specs, reliability, problems & model years
            </p>
          </div>

          <AddToCompareButton
            model={modelData}
            brand={brandData}
          />
        </div>

        {/* 🔥 QUICK STATS (NUEVO) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <Stat label="Years available" value={totalYears} />
          <Stat label="Latest model" value={newest || '--'} />
          <Stat label="First model" value={oldest || '--'} />
          <Stat label="Category" value="Passenger car" />

        </div>

        {/* 🔥 YEARS GRID */}
        <div>

          <h2 className="text-lg text-gray-400 mb-4">
            Available years
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">

            {years.length > 0 ? (
              years.map((year: any) => (
                <Link
                  key={year.id}
                  href={`/cars/${brandSlug}/${modelSlug}/${year.year}`}
                  className="
                    group
                    p-5
                    rounded-2xl
                    bg-white/[0.04]
                    backdrop-blur-xl
                    border border-white/10
                    text-center
                    font-semibold
                    transition-all duration-300
                    hover:border-orange-400/40
                    hover:bg-white/[0.06]
                  "
                >
                  <span className="group-hover:text-orange-400 transition">
                    {year.year}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">
                No years available.
              </p>
            )}

          </div>
        </div>

        {/* 🔥 SEO CONTENT (MEJORADO) */}
        <div className="max-w-3xl text-gray-300 space-y-4 leading-relaxed">

          <h2 className="text-xl font-semibold text-white">
            {brandData.name} {modelData.name} specs, reliability & performance
          </h2>

          <p>
            The {brandData.name} {modelData.name} is one of the most popular models
            in its segment, offering a strong balance between performance, efficiency
            and everyday usability.
          </p>

          <p>
            Across its different generations, this model has featured a wide range
            of engines, including petrol, diesel and hybrid options depending on the market.
            Power outputs vary significantly, making it suitable for both economical driving
            and more performance-oriented use.
          </p>

          <p>
            Reliability is a key factor when choosing the right model year.
            Newer versions tend to offer improved fuel efficiency, lower emissions
            and updated technology, while older versions may be more affordable
            but require more maintenance.
          </p>

          <p>
            When evaluating the {modelData.name}, it's important to compare different
            years to understand maintenance costs, known issues and overall ownership experience.
          </p>

        </div>

        {/* 🔥 INTERNAL LINKS SEO */}
        <div className="pt-10 border-t border-white/10">

          <h3 className="text-lg font-semibold mb-4">
            Explore more
          </h3>

          <div className="flex flex-wrap gap-4 text-sm">

            <Link href="/compare" className="text-orange-400 hover:underline">
              Compare cars
            </Link>

            <Link href={`/cars/${brandSlug}`} className="text-orange-400 hover:underline">
              More {brandData.name} models
            </Link>

            <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
              Most reliable cars
            </Link>

            <Link href="/best-cars/low-maintenance" className="text-orange-400 hover:underline">
              Low maintenance cars
            </Link>

            <Link href="/best-cars/few-problems" className="text-orange-400 hover:underline">
              Cars with fewer problems
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}

// ===============================
// UI
// ===============================
function Stat({ label, value }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-semibold mt-2 text-lg">{value}</p>
    </div>
  )
}