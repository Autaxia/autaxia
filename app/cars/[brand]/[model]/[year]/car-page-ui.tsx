'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AddToCompareButton from '@/components/AddToCompareButton'

// ==============================
// TYPES
// ==============================
type Engine = {
  name: string
  power_hp: number
  fuel: string
  transmission: string
}

type Props = {
  carId?: string
  brand: { name: string; slug: string }
  model: { name: string; slug: string }
  year: string

  engines: Engine[]
  maintenance?: any[]
  problems?: any[]
  tires?: any[]

  performance?: any
  efficiency?: any
  reliability?: any
  seo?: any
}

// ==============================
// UTILS
// ==============================
function getEngineId(engine: Engine, i: number) {
  return `${engine.name}-${engine.power_hp}-${i}`
}

// ==============================
// COMPONENT
// ==============================
export default function CarPageUI({
  carId,
  brand,
  model,
  year,
  engines = [],
  maintenance = [],
  problems = [],
  tires = [],
  performance,
  efficiency,
  reliability,
  seo
}: Props) {

  const router = useRouter()
  const searchParams = useSearchParams()

  const engineParam = searchParams.get('engine')
  const tabParam = searchParams.get('tab') || 'specs'

  const [selected, setSelected] = useState<any>(null)
  const [tab, setTab] = useState(tabParam)

  const selectedPower = selected?.power_hp

  // ==============================
  // 🔥 CAR OBJECT (FIX REAL)
  // ==============================
  const car = {
    id: carId,
    brand: brand.name,
    model: model.name,
    year,
    brand_slug: brand.slug,
    model_slug: model.slug
  }

  // ==============================
  // ENGINES IDS
  // ==============================
  const enginesWithId = useMemo(() => {
    return engines.map((e, i) => ({
      ...e,
      _id: getEngineId(e, i)
    }))
  }, [engines])

  // ==============================
  // SELECT ENGINE
  // ==============================
  useEffect(() => {
    if (!enginesWithId.length) return

    const found = enginesWithId.find(e => e._id === engineParam)
    setSelected(found || enginesWithId[0])
  }, [enginesWithId, engineParam])

  // ==============================
  // SYNC URL
  // ==============================
  useEffect(() => {
    if (!selected) return

    const params = new URLSearchParams()
    params.set('engine', selected._id)
    params.set('tab', tab)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [selected, tab, router])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[#020203]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_20%_-10%,rgba(255,115,0,0.12),transparent),radial-gradient(600px_300px_at_80%_0%,rgba(255,115,0,0.08),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* BREADCRUMB */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap items-center">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/brands">Brands</Link>
          <span>›</span>
          <Link href={`/cars/${brand.slug}`}>{brand.name}</Link>
          <span>›</span>
          <Link href={`/cars/${brand.slug}/${model.slug}`}>{model.name}</Link>
          <span>›</span>
          <span className="text-white">{year}</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10">

          <p className="text-sm text-gray-400 uppercase">
            {brand.name}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            {model.name} {year}
          </h1>

          {seo?.intro && (
            <p className="text-gray-400 mt-3 max-w-2xl">
              {seo.intro}
            </p>
          )}

          {reliability?.score && (
            <div className="mt-4 text-sm text-gray-400">
              Reliability:
              <span className="text-white font-semibold ml-1">
                {reliability.score}/100
              </span>
            </div>
          )}

        </div>

        {/* COMPARE BUTTON */}
        <div className="flex justify-end mb-8">
          <AddToCompareButton car={car} />
        </div>

        {/* ENGINES */}
        {enginesWithId.length > 0 && (
          <>
            <h2 className="text-sm text-gray-400 mb-4">
              Available Engines
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {enginesWithId.map(engine => {
                const active = selected?._id === engine._id

                return (
                  <motion.div
                    key={engine._id}
                    onClick={() => setSelected(engine)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`cursor-pointer p-5 rounded-2xl border transition backdrop-blur-xl ${
                      active
                        ? 'border-orange-400 bg-white/[0.06]'
                        : 'border-white/10 bg-white/[0.02] hover:border-orange-400/40'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">
                        {engine.power_hp} hp
                      </span>

                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">
                        {engine.fuel}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                      <p>{engine.transmission}</p>
                      <p className="text-gray-500">{engine.name}</p>
                    </div>

                    {active && (
                      <p className="text-xs text-orange-400 mt-2">
                        Selected
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {/* TABS */}
        <div className="flex gap-6 border-b border-white/10 mb-8 text-sm">
          {['specs','maintenance','problems','tires'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 relative ${
                tab === t
                  ? 'text-orange-400'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {t}

              {tab === t && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">

          {tab === 'specs' && (
            <motion.div key="specs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <Stat
                  label="0-100 km/h"
                  value={
                    selectedPower
                      ? `${Math.max(5, 12 - selectedPower / 50).toFixed(1)}s`
                      : '—'
                  }
                />
                <Stat
                  label="Top Speed"
                  value={performance?.top_speed_kmh ? `${performance.top_speed_kmh} km/h` : '—'}
                />
                <Stat
                  label="Consumption"
                  value={efficiency?.consumption_l_100km ? `${efficiency.consumption_l_100km} L/100km` : '—'}
                />
                <Stat
                  label="Reliability"
                  value={reliability?.score ? `${reliability.score}/100` : '—'}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}

// ==============================
// UI
// ==============================
function Stat({ label, value }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-semibold mt-2 text-lg">{value}</p>
    </div>
  )
}