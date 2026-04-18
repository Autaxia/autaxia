import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { SEO_BRANDS } from '@/lib/seo/combos'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function generateStaticParams() {
  return SEO_BRANDS.map(b => ({ brand: b }))
}

export async function generateMetadata({ params }: any) {
  return {
    title: `Best ${params.brand} cars (2026)`,
    description: `Discover the best ${params.brand} cars ranked by real data.`
  }
}

export default async function Page({ params }: any) {

  const { brand } = params

  const { data } = await supabase
  .from('pages')
  .select('content')

// 🔥 SAFE DATA
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

  const filtered = cars.filter(c =>
    c.brand.slug === brand
  )

  return (
    <div className="p-10 text-white bg-[#020203] min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        Best {brand} cars
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((car, i) => (
          <Link key={i}
            href={`/cars/${car.brand.slug}/${car.model.slug}/${car.year}`}
            className="p-5 border border-white/10 rounded-xl"
          >
            {car.brand.name} {car.model.name}
          </Link>
        ))}
      </div>
    </div>
  )
}