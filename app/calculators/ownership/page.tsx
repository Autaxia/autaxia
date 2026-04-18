'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getEngineById } from '@/lib/db/queries'

type Engine = {
  id: string
  horsepower?: number
  fuel_type?: string
  consumption?: number
  insurance_standard?: number
  maintenance_cost_year?: number
}

export default function OwnershipCalculatorPage() {

  const params = useSearchParams()
  const router = useRouter()

  // 🔥 ahora nunca rompe TS
  const engineId = params.get('engine') || undefined

  const [engine, setEngine] = useState<Engine | null>(null)

  // inputs
  const [kmYear, setKmYear] = useState(15000)
  const [years, setYears] = useState(5)

  const [consumption, setConsumption] = useState(7)
  const [insurance, setInsurance] = useState(800)
  const [maintenance, setMaintenance] = useState(600)

  /* =============================
     LOAD ENGINE (AUTO)
  ============================== */
  useEffect(() => {

    async function load() {
      const data = await getEngineById(engineId)

      if (!data) return

      setEngine(data)

      setConsumption(data.consumption ?? 7)
      setInsurance(data.insurance_standard ?? 800)
      setMaintenance(data.maintenance_cost_year ?? 600)
    }

    load()

  }, [engineId])

  /* =============================
     CALCULATION
  ============================== */
  const data = useMemo(() => {

    const totalKm = kmYear * years

    const fuelCost =
      (consumption / 100) * 1.7 * totalKm

    const maintenanceTotal = maintenance * years
    const insuranceTotal = insurance * years

    const total =
      fuelCost +
      maintenanceTotal +
      insuranceTotal

    return {
      fuel: fuelCost,
      maintenance: maintenanceTotal,
      insurance: insuranceTotal,
      total,
      perMonth: total / (years * 12),
      perKm: total / totalKm
    }

  }, [kmYear, years, consumption, insurance, maintenance])

  const format = (v: number) =>
    `€${Math.round(v).toLocaleString()}`

  return (
    <div className="min-h-screen bg-background text-white">

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vehicle
        </button>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Ownership Cost Calculator
          </h1>

          <p className="text-muted-foreground mt-2">
            Estimate the real cost of owning this vehicle.
          </p>

          {engine && (
            <div className="mt-4 text-sm text-orange-400">
              {engine.horsepower ?? '-'} hp • {engine.fuel_type ?? '-'}
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* INPUTS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">

            <h2 className="text-lg font-semibold">
              Usage
            </h2>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Annual mileage (km)
              </p>

              <input
                type="number"
                value={kmYear}
                onChange={(e) => setKmYear(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Ownership period (years)
              </p>

              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
              />
            </div>

          </div>

          {/* RESULTS */}
          <div className="space-y-6">

            {/* TOTAL */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">

              <p className="text-sm text-muted-foreground">
                Total ownership cost
              </p>

              <p className="text-3xl font-bold text-orange-400 mt-2">
                {format(data.total)}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <Stat label="Per month" value={format(data.perMonth)} />
                <Stat label="Per km" value={`€${data.perKm.toFixed(2)}`} />
              </div>

            </div>

            {/* BREAKDOWN */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">

              <h2 className="text-lg font-semibold">
                Cost breakdown
              </h2>

              <Row label="Fuel" value={format(data.fuel)} />
              <Row label="Maintenance" value={format(data.maintenance)} />
              <Row label="Insurance" value={format(data.insurance)} />

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

/* UI COMPONENTS */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}