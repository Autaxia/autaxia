import type { Metadata } from 'next'
import type { BrandRecord } from '@/lib/db/database.types'

import { BrandCard } from '@/components/brand-card'
import { getBrands } from '@/lib/data'

// =====================
// SEO
// =====================
export const metadata: Metadata = {
  title: 'All Car Brands | Autaxia',
  description:
    'Explore all car brands worldwide. Compare models, reliability, maintenance costs and real ownership insights.',
  robots: {
    index: true,
    follow: true,
  },
}

// =====================
// PAGE
// =====================
export default async function Page() {
  const brands = (await getBrands()) as BrandRecord[]

  const brandsByCountry = brands.reduce<Record<string, BrandRecord[]>>(
    (acc, brand) => {
      const country = brand.country || 'Other'

      if (!acc[country]) {
        acc[country] = []
      }

      acc[country].push(brand)
      return acc
    },
    {}
  )

  const countries = Object.keys(brandsByCountry).sort()

  return (
    <div className="min-h-screen bg-[#020203] text-white">

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-6">

          {/* HERO */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Car Brands Database
            </h1>

            <p className="mt-4 text-gray-400 max-w-2xl">
              Explore {brands.length} car manufacturers worldwide.
              Discover models, reliability insights and ownership costs.
            </p>
          </div>

          {/* LISTADO */}
          {countries.map((country) => (
            <section key={country} className="mb-14">

              <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-sm">
                  {getFlag(country)}
                </span>
                {country}
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {brandsByCountry[country].map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>

            </section>
          ))}

        </div>
      </main>

    </div>
  )
}

// =====================
// FLAGS
// =====================
function getFlag(country: string) {
  switch (country) {
    case 'Germany': return '🇩🇪'
    case 'Japan': return '🇯🇵'
    case 'USA': return '🇺🇸'
    case 'France': return '🇫🇷'
    case 'Italy': return '🇮🇹'
    case 'UK': return '🇬🇧'
    default: return '🌍'
  }
}