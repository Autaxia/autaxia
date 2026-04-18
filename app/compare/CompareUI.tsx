'use client'

import { useEffect, useState } from 'react'
import CompareTable from '@/components/compare-table'
import Link from 'next/link'

export default function CompareUI() {
  const [cars, setCars] = useState<any[]>([])

  // =====================
  // LOAD DATA
  // =====================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('compare') || '[]')
    setCars(stored)
  }, [])

  // =====================
  // REMOVE
  // =====================
  function removeCar(index: number) {
    const updated = [...cars]
    updated.splice(index, 1)

    localStorage.setItem('compare', JSON.stringify(updated))
    setCars(updated)
  }

  // =====================
  // CLEAR ALL
  // =====================
  function clearAll() {
    localStorage.removeItem('compare')
    setCars([])
  }

  // =====================
  // EMPTY STATE (MEJORADO)
  // =====================
  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold mb-4">
            Compare Cars
          </h1>

          <p className="text-gray-400 mb-6">
            You haven't selected any cars yet. Explore our database and start comparing real specs, problems and costs.
          </p>

          <Link
            href="/brands"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
          >
            Browse Cars
          </Link>

        </div>

      </div>
    )
  }

  // =====================
  // MAIN
  // =====================
  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-bold">
              Compare Cars
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Compare performance, reliability and real-world problems side by side.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">

            <Link
              href="/brands"
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white"
            >
              + Add car
            </Link>

            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10"
            >
              Clear all
            </button>

          </div>

        </div>

        {/* 🔥 TABLE */}
        <CompareTable cars={cars} onRemove={removeCar} />

        {/* 🔥 EXTRA SEO TEXT */}
        <div className="text-sm text-gray-500 max-w-3xl">
          Compare real-world car reliability, common problems and maintenance costs.
          Data is based on owner reports, forums and aggregated insights.
        </div>

      </div>

    </div>
  )
}