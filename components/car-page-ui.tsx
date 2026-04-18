'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import CompareFloating from '@/components/compare-floating'
import { typeToES } from '@/lib/type-map'
import { getInternalLinks } from '@/lib/seo/internal-links'
import { getRelatedCars } from '@/lib/seo/related-cars'
import { getAutoCompareCars } from '@/lib/seo/auto-compare'




function formatName(str: string) {
  if (!str) return ''

  const special: Record<string, string> = {
    bmw: 'BMW',
    audi: 'Audi',
    volkswagen: 'Volkswagen',
    mercedes: 'Mercedes-Benz',
    'mercedes-benz': 'Mercedes-Benz',
    toyota: 'Toyota',
    honda: 'Honda',
    ford: 'Ford',
    nissan: 'Nissan'
  }

  const lower = str.toLowerCase().trim()

  if (special[lower]) return special[lower]

  return lower
    .split(/[\s-]+/) // 🔥 FIX REAL (espacios + guiones)
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}



type Props = {
  brand: { name: string; slug: string }
  model: { name: string; slug: string }
  year: number | string

  engines?: any[]

  maintenance?: any[]
  problems?: any[]
  ownership?: any[]
  insurance?: any[]
  tires?: any[]
  beforeBuy?: any[]

  locale?: string
  initialTab?: string
}

export default function CarPageUI({
  brand,
  model,
  year,
  engines = [],
  maintenance = [],
  problems = [],
  ownership = [],
  insurance = [],
  tires = [],
  beforeBuy = [],
  locale = 'en',
  initialTab
}: Props) {

  const brandName = formatName(brand.name)
const modelName = formatName(model.name)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const engineParam = searchParams.get('engine')

  // =====================
  // TAB DETECTION
  // =====================
  const reverseMap: Record<string, string> = {
    problemas: 'problems',
    mantenimiento: 'maintenance',
    propiedad: 'ownership',
    seguro: 'insurance',
    neumaticos: 'tires',
    'antes-de-comprar': 'before-buy'
  }

  const tab = useMemo(() => {
    if (initialTab) return initialTab

    const parts = pathname.split('/')
    const last = parts[parts.length - 1]

    if (last === String(year)) return 'specs'

    return locale === 'es'
      ? reverseMap[last] || last
      : last
  }, [pathname, year, locale, initialTab])

  // =====================
  // ENGINE
  // =====================
  const [selected, setSelected] = useState<any>(
    engines.find((e) => e.id === engineParam) || engines[0] || null
  )

  const [added, setAdded] = useState(false)

  // =====================
  // INTERNAL LINKS
  // =====================
  const internalLinks = useMemo(() => {
    return getInternalLinks({
      brand: brand.slug,
      model: model.slug,
      year,
      locale
    }) || []
  }, [brand.slug, model.slug, year, locale])

  // =====================
  // RELATED CARS
  // =====================
  const [relatedCars, setRelatedCars] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      const cars = await getRelatedCars({
        brand: brand.slug,
        model: model.slug,
        year,
        fuel_type: selected?.fuel_type
      })

      if (mounted) setRelatedCars(cars || [])
    }

    load()

    return () => { mounted = false }
  }, [brand.slug, model.slug, year, selected?.fuel_type])

  // =====================
  // AUTO COMPARE
  // =====================
  const [compareCars, setCompareCars] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    async function loadCompare() {
      const cars = await getAutoCompareCars({
        brand: brand.slug,
        model: model.slug,
        year
      })

      if (mounted) setCompareCars(cars || [])
    }

    loadCompare()

    return () => { mounted = false }
  }, [brand.slug, model.slug, year])

  // =====================
  // TRACK
  // =====================
  async function trackCTA() {
    try {
      await fetch('/api/track', {
        method: 'POST',
        body: JSON.stringify({
          slug: `${brand.slug}-${modelName}-${year}`,
          locale
        })
      })
    } catch {}
  }

  // =====================
  // COMPARE
  // =====================
  const handleCompare = async () => {
    if (!selected) return

    await trackCTA()

    const stored = JSON.parse(localStorage.getItem('compare') || '[]')

    const newItem = {
      brand: brand.name,
      model: model.name,
      year,
      engine_id: selected.id,
      power: selected.power,
      fuel_type: selected.fuel_type,
      transmission: selected.transmission,
      problems: problems?.slice(0, 3) || []
    }

    const exists = stored.find(
      (c: any) =>
        c.engine_id === newItem.engine_id &&
        c.model === newItem.model &&
        c.year === newItem.year
    )

    if (!exists) {
      localStorage.setItem('compare', JSON.stringify([...stored, newItem]))
      setAdded(true)
    }

    router.push('/compare')
  }

  // =====================
  // SYNC URL
  // =====================
  useEffect(() => {
    if (!selected?.id) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('engine', selected.id)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [selected, searchParams, router])

  if (!brand || !model || !year) return null

  // =====================
  // DATA
  // =====================
  const tabData = getTabData(tab, {
    maintenance,
    problems,
    ownership,
    insurance,
    tires,
    beforeBuy
  }) || []

  const mostCommon = problems?.find((p: any) => p.frequency === 'high')

  // =====================
  // RENDER
  // =====================
  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden pb-24 md:pb-0">

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_20%_-10%,rgba(255,115,0,0.15),transparent),radial-gradient(800px_400px_at_80%_0%,rgba(255,115,0,0.08),transparent)]" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 space-y-10">

        {/* HEADER */}
        
                <div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight normal-case">
            {brandName} {modelName} {year}
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl text-sm">
            Real-world problems, maintenance costs and reliability insights based on owner reports.
          </p>

          {selected && (
            <p className="text-gray-500 text-xs mt-2">
              {selected.power} hp • {selected.fuel_type} • {selected.transmission}
            </p>
          )}

          {mostCommon && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-red-400 mb-1">🔥 Most reported issue</p>
              <p className="text-sm font-semibold">{mostCommon.title}</p>
            </div>
          )}

          <button
            onClick={handleCompare}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
          >
            {added ? 'Added ✓' : 'Compare this car'}
          </button>

        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          {tabData.map((item: any) => (
            <div key={item.id} className="p-4 border border-white/10 rounded-xl">
              <div className="flex justify-between items-start gap-4">
                <p className="text-sm">{item.task || item.title}</p>

                {item.frequency === 'high' && (
                  <span className="text-red-400 text-xs">🔥 common</span>
                )}
              </div>
            </div>
          ))}

          {/* CONTEXT SEO */}
          {internalLinks.length >= 2 && (
            <div className="mt-6 text-sm text-gray-400">
              Learn more about{' '}
              <Link href={internalLinks[0].href} className="text-orange-400">
                {internalLinks[0].label.toLowerCase()}
              </Link>{' '}
              and{' '}
              <Link href={internalLinks[1].href} className="text-orange-400">
                {internalLinks[1].label.toLowerCase()}
              </Link>.
            </div>
          )}

          {/* 🔥 BEST CARS LINK (CRÍTICO SEO) */}
          <div className="mt-4 text-sm text-gray-400">
            Looking for top picks? See{' '}
            <Link href="/best-cars/reliable" className="text-orange-400">
              best reliable cars
            </Link>
          </div>

          {/* INTERNAL LINKS */}
          {internalLinks.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold mb-4">Explore more</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {internalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-orange-400">
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* RELATED */}
          {relatedCars.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold mb-4">Similar cars</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {relatedCars.map((car, i) => (
                  <Link
                    key={i}
                    href={`/cars/${car.brand_slug}/${car.model_slug}/${car.year}`}
                    className="p-3 rounded-xl border border-white/10 hover:border-orange-400 transition"
                  >
                    {car.brand} {car.model} {car.year}
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-sm">
                <Link
                  href={`/cars/${brand.slug}/${model.slug}/${year}/alternatives`}
                  className="text-orange-400 hover:text-orange-300"
                >
                  🔥 See best alternatives →
                </Link>
              </div>
            </div>
          )}

          {/* AUTO COMPARE */}
          {compareCars.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold mb-4">
                Compare with similar cars
              </h3>

              <div className="space-y-2 text-sm">
                {compareCars.map((car, i) => {
                  const slug =
                    `${brand.slug}-${model.slug}-${year}-vs-${car.brand_slug}-${car.model_slug}-${car.year}`

                  return (
                    <Link
                      key={i}
                      href={`/compare/${slug}`}
                      className="block text-orange-400 hover:text-orange-300"
                    >
                      Compare {brand.name} {model.name} vs {car.brand} {car.model} →
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      <CompareFloating />

    </div>
  )
}

// =====================
// DATA
// =====================
function getTabData(tab: string, data: any) {
  if (tab === 'maintenance') return data.maintenance
  if (tab === 'problems') return data.problems
  if (tab === 'ownership') return data.ownership
  if (tab === 'insurance') return data.insurance
  if (tab === 'tires') return data.tires
  if (tab === 'before-buy') return data.beforeBuy
  return []
}