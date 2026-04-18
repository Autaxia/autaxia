import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================
// SEO META
// =====================
export async function generateMetadata(props: any) {

  const params = await props?.params

  const category = params?.category

  // 🔥 protección total
  if (!category || typeof category !== 'string') {
    return {
      title: 'Best cars',
      description: 'Explore the best cars ranked by reliability, cost and performance.'
    }
  }

  const readable = category.replace(/-/g, ' ')

  return {
    title: `Best ${readable} cars (2026)`,
    description: `Discover the best ${readable} cars ranked by performance, reliability and real ownership data.`,
  }
}

// =====================
// RANKING
// =====================
function rankCars(cars: any[], category: string) {

  switch (category) {

    case 'reliable':
      return cars
        .filter(c => c.reliability > 0)
        .sort((a, b) => b.reliability - a.reliability)

    case 'fast':
      return cars
        .filter(c => c.performance?.top_speed_kmh)
        .sort((a, b) =>
          (b.performance?.top_speed_kmh ?? 0) -
          (a.performance?.top_speed_kmh ?? 0)
        )

    case 'low-consumption':
      return cars
        .filter(c => c.efficiency?.consumption_l_100km)
        .sort((a, b) =>
          (a.efficiency?.consumption_l_100km ?? 999) -
          (b.efficiency?.consumption_l_100km ?? 999)
        )

    case 'cheap-maintenance':
      return cars
        .sort((a, b) =>
          (a.maintenance?.cost_level ?? 5) -
          (b.maintenance?.cost_level ?? 5)
        )

    default:
      return cars
  }
}

// =====================
// PAGE
// =====================
export default async function Page(props: any) {

  const params = await props?.params

  const category = params?.category

  // 🔥 HARD GUARD (esto evita el crash SIEMPRE)
  if (!category || typeof category !== 'string') {
    console.log('❌ category undefined:', params)
    return <div>Category not found</div>
  }

  const readable = category.replace(/-/g, ' ')

  const { data } = await supabase
    .from('pages')
    .select('content')

  const safeData = data ?? []

const cars = safeData.map((d: any) => {
  try {
    return typeof d.content === 'string'
      ? JSON.parse(d.content)
      : d.content
  } catch {
    return null
  }
}).filter(Boolean)

  const ranked = rankCars(cars, category).slice(0, 30)

  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12 text-center">

        <h1 className="text-4xl md:text-5xl font-bold capitalize">
          Best {readable} cars
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Discover the best {readable} cars based on real-world performance,
          reliability and ownership cost. These vehicles represent the top options
          available today.
        </p>

      </div>

      {/* 🔥 CONTENT SEO */}
      <div className="max-w-3xl mx-auto mb-10 text-gray-400 space-y-4 text-center">

        <p>
          Our ranking is based on multiple factors including performance metrics,
          fuel efficiency and long-term reliability. This allows us to highlight
          vehicles that deliver consistent value over time.
        </p>

        <p>
          Whether you are looking for a daily driver or a long-term investment,
          this list provides a clear overview of the best cars in this category.
        </p>

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {ranked.map((car, i) => (
          <Link
            key={i}
            href={`/cars/${car.brand.slug}/${car.model.slug}/${car.year}`}
            className="p-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-orange-400 transition"
          >
            <h2 className="font-semibold">
              {car.brand.name} {car.model.name} {car.year}
            </h2>

            <div className="text-sm text-gray-400 mt-2 space-y-1">
              <p>Reliability: {car.reliability ?? '--'}</p>
              <p>0-100: {car.performance?.acceleration_0_100 ?? '--'}s</p>
              <p>Consumption: {car.efficiency?.consumption_l_100km ?? '--'}</p>
            </div>
          </Link>
        ))}

      </div>

      {/* 🔥 INTERNAL LINKS */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm justify-center">

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

    </div>
  )
}