'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ExplorePage() {

  const [cars, setCars] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])

  // filtros
  const [minReliability, setMinReliability] = useState(0)
  const [maxConsumption, setMaxConsumption] = useState(20)
  const [maxAcceleration, setMaxAcceleration] = useState(20)

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    async function load() {
      const { data } = await supabase
  .from('pages')
  .select('content')

const safeData = data ?? []

const parsed = safeData.map((d: any) =>
  typeof d.content === 'string'
    ? JSON.parse(d.content)
    : d.content
)

      setCars(parsed)
      setFiltered(parsed)
    }

    load()
  }, [])

  // =========================
  // FILTER
  // =========================
  useEffect(() => {

    const result = cars.filter(c => {

      return (
        (c.reliability_score || 0) >= minReliability &&
        (c.efficiency?.consumption_l_100km || 999) <= maxConsumption &&
        (c.performance?.acceleration_0_100 || 999) <= maxAcceleration
      )

    })

    setFiltered(result)

  }, [minReliability, maxConsumption, maxAcceleration, cars])

  return (
    <div className="min-h-screen bg-[#020203] text-white p-10">

      <h1 className="text-3xl mb-10">Explore Cars</h1>

      {/* 🔥 FILTERS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <Filter label="Min Reliability" value={minReliability} setValue={setMinReliability} max={100} />
        <Filter label="Max Consumption" value={maxConsumption} setValue={setMaxConsumption} max={20} />
        <Filter label="Max 0-100" value={maxAcceleration} setValue={setMaxAcceleration} max={15} />

      </div>

      {/* 🔥 RESULTS */}
      <div className="grid md:grid-cols-3 gap-6">

        {filtered.map((c, i) => (
          <div key={i} className="p-5 border border-white/10 rounded-xl">

            <h2 className="font-bold mb-2">
              {c.brand} {c.model} {c.year}
            </h2>

            <p>Reliability: {c.reliability_score}</p>
            <p>0-100: {c.performance?.acceleration_0_100}s</p>
            <p>Consumption: {c.efficiency?.consumption_l_100km}</p>

          </div>
        ))}

      </div>

    </div>
  )
}

// =========================
// FILTER COMPONENT
// =========================
function Filter({ label, value, setValue, max }: any) {
  return (
    <div className="p-5 border border-white/10 rounded-xl">
      <p className="text-gray-400 text-sm mb-2">{label}</p>

      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />

      <p className="mt-2">{value}</p>
    </div>
  )
}