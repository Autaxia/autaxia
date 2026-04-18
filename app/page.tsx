import type { Metadata } from 'next'
import Link from 'next/link'
import { CarSearch } from '@/components/car-search'
import { getTrendingCars, getLatestCars } from '@/lib/db/queries'

// ======================
// SEO PRO
// ======================
export const metadata: Metadata = {
  title: 'Autaxia - Car Problems, Reliability & Costs',
  description:
    'Discover real car problems, reliability data, engine specs and maintenance costs for thousands of vehicles.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Autaxia - Car Ownership Guide',
    description:
      'Explore real car problems, maintenance costs, reliability ratings and specs.',
    type: 'website',
  },
}

// ======================
// HELPERS
// ======================
function formatName(slug: string) {
  return slug
    ?.split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ======================
// PAGE
// ======================
export default async function Home() {
  const trending = await getTrendingCars()
  const latest = await getLatestCars()

  return (
    <main className="space-y-20">

      {/* ====================== */}
      {/* HERO */}
      {/* ====================== */}
      <section className="relative text-center py-24 px-4 bg-gradient-to-b from-black via-[#050505] to-[#020203] rounded-b-3xl">

        <div className="absolute inset-0 -z-10 blur-[120px] opacity-30 bg-orange-500/20"></div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Your Complete <span className="text-orange-400">Car Ownership</span> Guide
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Discover everything about maintenance, reliability, costs and specifications for any car.
        </p>

        <div className="mt-10 max-w-3xl mx-auto">
          <CarSearch variant="inline" />
        </div>

        {/* STATS dinámico */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-xl font-bold text-orange-400">10+</p>
            <p className="text-xs text-gray-400">Brands</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-xl font-bold text-orange-400">500+</p>
            <p className="text-xs text-gray-400">Models</p>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-xl font-bold text-orange-400">20K+</p>
            <p className="text-xs text-gray-400">Pages</p>
          </div>
        </div>

      </section>

      {/* ====================== */}
      {/* TRENDING */}
      {/* ====================== */}
      <section className="px-4 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">🔥 Trending cars</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trending.map((car: any) => (
            <Link
              key={car.id}
              href={`/cars/${car.brand_slug}/${car.model_slug}/${car.year}`}
              className="p-4 border border-white/10 rounded-xl bg-white/5 hover:border-orange-500 transition"
            >
              <h3 className="font-semibold">
                {formatName(car.brand_slug)} {formatName(car.model_slug)}
              </h3>
              <p className="text-xs text-gray-400">{car.year}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================== */}
      {/* LATEST */}
      {/* ====================== */}
      <section className="px-4 max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">🆕 Latest car pages</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {latest.map((car: any) => (
            <Link
              key={car.id}
              href={`/cars/${car.brand_slug}/${car.model_slug}/${car.year}`}
              className="p-4 border border-white/10 rounded-xl bg-white/5 hover:border-orange-500 transition"
            >
              <h3 className="font-semibold">
                {formatName(car.brand_slug)} {formatName(car.model_slug)}
              </h3>
              <p className="text-xs text-gray-400">{car.year}</p>
            </Link>
          ))}
        </div>
      </section>
{/* ====================== */}
{/* BLOG / ARTICLES (SEO BOOST) */}
{/* ====================== */}
<section className="px-4 max-w-6xl mx-auto">
  <div className="flex items-center justify-between mb-6">

    <h2 className="text-xl font-semibold">
      📚 Car Guides
    </h2>

    <Link
      href="/blog"
      className="text-sm text-orange-400 hover:underline"
    >
      View all →
    </Link>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <Link
      href="/blog/best-reliable-cars"
      className="p-5 border border-white/10 rounded-xl bg-white/5 hover:border-orange-500 transition"
    >
      <h3 className="font-semibold">
        Best Reliable Cars
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        Discover the most dependable cars based on real data.
      </p>
    </Link>

    <Link
      href="/blog/cars-with-cheap-maintenance"
      className="p-5 border border-white/10 rounded-xl bg-white/5 hover:border-orange-500 transition"
    >
      <h3 className="font-semibold">
        Cheap Maintenance Cars
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        Save money with low maintenance vehicles.
      </p>
    </Link>

    <Link
      href="/blog/most-common-car-problems"
      className="p-5 border border-white/10 rounded-xl bg-white/5 hover:border-orange-500 transition"
    >
      <h3 className="font-semibold">
        Common Car Problems
      </h3>
      <p className="text-xs text-gray-400 mt-2">
        Learn what issues to expect before buying.
      </p>
    </Link>

  </div>
</section>
      {/* ====================== */}
      {/* SEO TEXT */}
      {/* ====================== */}
      <section className="px-4 max-w-3xl mx-auto text-sm text-gray-400 text-center leading-relaxed">
        Autaxia provides detailed insights into car reliability, maintenance costs, engine specs and ownership experience. 
        Browse thousands of vehicles and discover real-world issues before buying.
      </section>

      {/* ====================== */}
      {/* CORE LINKS (SEO CLUSTER) */}
      {/* ====================== */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="mt-10 flex flex-wrap gap-4 text-sm justify-center">

          <Link href="/cars" className="text-orange-400 hover:underline">
            Browse all car brands
          </Link>

          <Link href="/compare" className="text-orange-400 hover:underline">
            Compare cars
          </Link>

          <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
            Most reliable cars
          </Link>

          <Link href="/best-cars/low-maintenance" className="text-orange-400 hover:underline">
            Low maintenance cars
          </Link>
          <Link href="/blog" className="text-orange-400 hover:underline">
  Car guides & articles
</Link>

        </div>
      </section>

      {/* ====================== */}
      {/* SEO CLUSTER EXPANSION */}
      {/* ====================== */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="mt-10 text-center">

          <h2 className="text-xl font-semibold mb-4">
            Explore Top Cars
          </h2>

          <div className="flex flex-wrap gap-4 justify-center text-sm">

            <Link href="/best-cars/reliable" className="text-orange-400 hover:underline">
              Best reliable cars →
            </Link>

            <Link href="/best-cars/diesel" className="text-orange-400 hover:underline">
              Best diesel cars →
            </Link>

            <Link href="/best-cars/few-problems" className="text-orange-400 hover:underline">
              Cars with fewer problems →
            </Link>

          </div>
        </div>
      </section>

    </main>
  )
}