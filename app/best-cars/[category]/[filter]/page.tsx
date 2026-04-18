import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

import { SEO_CATEGORIES, SEO_FILTERS } from '@/lib/seo/combos'
import { generateSeoText } from '@/lib/seo/seo-text'

// =====================
// HELPERS (ANTI CRASH)
// =====================
function safe(str?: string) {
  return str?.replace(/-/g, ' ') || ''
}

// =====================
// STATIC PARAMS
// =====================
export function generateStaticParams() {
  const params: { category: string; filter: string }[] = []

  for (const category of SEO_CATEGORIES) {
    for (const filter of SEO_FILTERS) {

      if (category === 'fast' && filter === 'cheap') continue
      if (category === 'low-consumption' && String(filter) === 'fast') continue

      params.push({ category, filter })
    }
  }

  return params
}

// =====================
// SUPABASE
// =====================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================
// SEO META (FIXED)
// =====================
export async function generateMetadata({ params }: any) {
  const resolvedParams = await params

  const category = resolvedParams?.category || ''
  const filter = resolvedParams?.filter || ''

  const readableCategory = safe(category)
  const readableFilter = safe(filter)

  return {
    title: `Best ${readableCategory} cars for ${readableFilter} (2026)`,
    description: `Discover the best ${readableCategory} cars for ${readableFilter}. Real data: reliability, performance and ownership cost.`,
  }
}

// =====================
// PAGE
// =====================
export default async function Page({ params }: any) {
  const resolvedParams = await params

  const category = resolvedParams?.category || ''
  const filter = resolvedParams?.filter || ''

  // 🔥 GUARD (evita crash en build)
  if (!category || !filter) {
    return <div className="text-center py-20 text-gray-400">Invalid page</div>
  }

  const readableCategory = safe(category)
  const readableFilter = safe(filter)

  const seo = generateSeoText(category, filter)

  // =====================
  // FETCH
  // =====================
  const { data } = await supabase
    .from('pages')
    .select('content')
    .limit(2000)

  const cars = (data ?? [])
    .map((d: any) => {
      try {
        return typeof d.content === 'string'
          ? JSON.parse(d.content)
          : d.content
      } catch {
        return null
      }
    })
    .filter(Boolean)

  let filtered = cars

  // =====================
  // FILTERS (MEJORADOS)
  // =====================
  if (filter === 'students') {
    filtered = cars.filter(c =>
      (c?.reliability ?? 0) > 75 &&
      (c?.efficiency?.consumption_l_100km ?? 10) < 6
    )
  }

  if (filter === 'city') {
    filtered = cars.filter(c =>
      (c?.performance?.acceleration_0_100 ?? 20) < 10
    )
  }

  if (filter === 'cheap') {
    filtered = cars.filter(c =>
      (c?.maintenance?.[0]?.cost_eur ?? 999) < 300
    )
  }

  if (filter === 'under-10k') {
    filtered = cars.filter(c =>
      (c?.price ?? 99999) <= 10000
    )
  }

  if (filter === 'under-20k') {
    filtered = cars.filter(c =>
      (c?.price ?? 99999) <= 20000
    )
  }

  if (filter === 'electric') {
    filtered = cars.filter(c =>
      c?.engines?.some((e: any) =>
        (e?.fuel || '').toLowerCase().includes('electric')
      )
    )
  }

  // =====================
  // RANKING
  // =====================
  const ranked = filtered
    .sort((a, b) => (b?.reliability ?? 0) - (a?.reliability ?? 0))
    .slice(0, 30)

  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold capitalize">
          {seo.title}
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Discover the best {readableCategory} cars for {readableFilter}.
          Real-world data: reliability, maintenance cost and performance.
        </p>
      </div>

      {/* INTRO */}
      <div className="max-w-3xl mx-auto mb-10 text-gray-400 space-y-4 text-center leading-relaxed">
        <p>{seo.intro}</p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {ranked.map((car: any, i: number) => (
          <Link
            key={`${car?.brand?.slug}-${car?.model?.slug}-${car?.year}-${i}`}
            href={`/cars/${car?.brand?.slug}/${car?.model?.slug}/${car?.year}`}
            className="group p-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-orange-400 transition backdrop-blur-xl"
          >
            <p className="text-xs text-orange-400 mb-2">
              #{i + 1} ranked
            </p>

            <h2 className="font-semibold text-lg">
              {car?.brand?.name} {car?.model?.name} {car?.year}
            </h2>

            <div className="text-sm text-gray-400 mt-3 space-y-1">
              <p>
                Reliability: <span className="text-white">{car?.reliability ?? '--'}</span>
              </p>
              <p>
                0-100: <span className="text-white">{car?.performance?.acceleration_0_100 ?? '--'}s</span>
              </p>
              <p>
                Consumption: <span className="text-white">{car?.efficiency?.consumption_l_100km ?? '--'}</span>
              </p>
            </div>

            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400"
                style={{
                  width: `${Math.min(100, car?.reliability ?? 0)}%`
                }}
              />
            </div>
          </Link>
        ))}

      </div>

      {/* OUTRO */}
      <div className="max-w-3xl mx-auto mt-12 text-gray-400 text-center leading-relaxed">
        <p>{seo.outro}</p>
      </div>

      {/* INTERNAL LINKS */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm justify-center">

        <Link href={`/best-cars/${category}`} className="text-orange-400 hover:underline">
          ← Back to {readableCategory}
        </Link>

        <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
          Reliable cars
        </Link>

        <Link href="/best-cars/fast" className="text-orange-400 hover:underline">
          Fast cars
        </Link>

        <Link href="/best-cars/low-consumption" className="text-orange-400 hover:underline">
          Low consumption
        </Link>

      </div>

    </div>
  )
}