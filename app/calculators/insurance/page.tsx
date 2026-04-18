'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getEngineById } from '@/lib/db/queries'

type Engine = {
  id: string
  horsepower?: number
  fuel_type?: string
}

type Factor = {
  label: string
  impact: 'positive' | 'negative'
  description: string
}

export default function InsuranceCalculatorPage() {

  const params = useSearchParams()
  const router = useRouter()

  const engineId = params.get('engine') || undefined

  const [engine, setEngine] = useState<Engine | null>(null)

  const [age, setAge] = useState(30)
  const [experience, setExperience] = useState(10)
  const [noClaims, setNoClaims] = useState(5)
  const [kmYear, setKmYear] = useState(15000)
  const [power, setPower] = useState(150)

  /* LOAD ENGINE */
  useEffect(() => {
    async function load() {
      const data = await getEngineById(engineId)
      if (!data) return
      setEngine(data)
      setPower(data.horsepower ?? 150)
    }
    load()
  }, [engineId])

  /* CALCULATION + FACTORS */
  const { result, factors, recommendation } = useMemo(() => {

    let base = 500
    const factors: Factor[] = []

    // AGE
    if (age < 25) {
      base *= 1.8
      factors.push({ label: 'Young driver', impact: 'negative', description: 'Higher risk under 25' })
    } else if (age > 65) {
      base *= 1.2
      factors.push({ label: 'Senior driver', impact: 'negative', description: 'Higher accident probability' })
    }

    // EXPERIENCE
    if (experience > 10) {
      base *= 0.9
      factors.push({ label: 'Experienced driver', impact: 'positive', description: 'Lower risk with experience' })
    }

    // NO CLAIMS
    const discount = Math.min(noClaims * 0.1, 0.5)
    base *= (1 - discount)
    if (noClaims >= 5) {
      factors.push({ label: 'No claims bonus', impact: 'positive', description: `${discount * 100}% discount applied` })
    }

    // POWER
    if (power > 200) {
      base *= 1.4
      factors.push({ label: 'High power engine', impact: 'negative', description: 'More expensive to insure' })
    }

    // KM
    if (kmYear < 8000) {
      base *= 0.9
      factors.push({ label: 'Low mileage', impact: 'positive', description: 'Less exposure to accidents' })
    }

    const third = Math.round(base)
    const plus = Math.round(base * 1.3)
    const full = Math.round(base * 1.8)

    let recommendation = 'Third Party'

    if (full < 1200) recommendation = 'Comprehensive'
    else if (plus < 900) recommendation = 'Third Party Plus'

    return {
      result: { third, plus, full },
      factors,
      recommendation
    }

  }, [age, experience, noClaims, power, kmYear])

  const format = (v: number) => `€${v.toLocaleString()}`

  return (
    <div className="min-h-screen bg-background text-white">

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vehicle
        </button>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Insurance Estimate</h1>
          <p className="text-muted-foreground mt-2">
            Smart premium calculation based on your profile
          </p>

          {engine && (
            <div className="mt-4 text-sm text-orange-400">
              {engine.horsepower} hp • {engine.fuel_type}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* INPUTS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">

            <h2 className="font-semibold">Driver Profile</h2>

            <Input label="Age" value={age} onChange={setAge} />
            <Input label="Experience (years)" value={experience} onChange={setExperience} />
            <Input label="No claims bonus" value={noClaims} onChange={setNoClaims} />
            <Input label="Annual mileage" value={kmYear} onChange={setKmYear} />

          </div>

          {/* RESULTS */}
          <div className="space-y-6">

            <Card title="Third Party" value={format(result.third)} />
            <Card title="Third Party Plus" value={format(result.plus)} highlight={recommendation === 'Third Party Plus'} />
            <Card title="Comprehensive" value={format(result.full)} highlight={recommendation === 'Comprehensive'} />

            {/* RECOMMENDATION */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
              <p className="text-sm text-muted-foreground">Recommended</p>
              <p className="text-lg font-semibold text-orange-400">{recommendation}</p>
            </div>

            {/* FACTORS */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">

              <h3 className="font-semibold">Why this price?</h3>

              {factors.map((f, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className={f.impact === 'positive' ? 'text-green-400' : 'text-orange-400'}>
                    {f.impact === 'positive' ? '✓' : '⚠'}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

/* UI */

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 focus:border-orange-500 outline-none"
      />
    </div>
  )
}

function Card({ title, value, highlight }: any) {
  return (
    <div className={`rounded-xl p-6 border ${highlight ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 bg-white/5'}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}