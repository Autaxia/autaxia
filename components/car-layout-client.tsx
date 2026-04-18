'use client'

import { useEffect, useState } from 'react'
import { EngineProvider } from '@/components/engine-context'

export default function CarLayoutClient({
  children,
  brand,
  model,
  year,
  engines,
}: {
  children: React.ReactNode
  brand: any
  model: any
  year: number
  engines: any[]
}) {
  const [selectedEngine, setSelectedEngine] = useState<any>(null)

  useEffect(() => {
    if (engines.length > 0 && !selectedEngine) {
      setSelectedEngine(engines[0])
    }
  }, [engines])

  return (
    <EngineProvider
      engines={engines}
      selectedEngine={selectedEngine}
      setSelectedEngine={setSelectedEngine}
    >
      <div className="relative space-y-10">

        {/* 🔥 HERO / HEADER */}
        <div className="flex justify-between items-start">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {brand?.name} {model?.name} {year}
            </h1>

            <p className="text-gray-400 mt-2">
              Select an engine version
            </p>
          </div>

          {/* 🔥 TARJETA NARANJA (CLAVE DE TU DISEÑO) */}
          {selectedEngine && (
            <div className="rounded-2xl border border-orange-500 bg-gradient-to-br from-orange-500/20 to-orange-600/10 px-6 py-4 shadow-lg shadow-orange-500/10">

              <p className="text-xs text-gray-300 mb-1">
                Selected
              </p>

              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Power:</span> {selectedEngine.horsepower} hp</p>
                <p><span className="text-gray-400">Torque:</span> {selectedEngine.torque} Nm</p>
                <p><span className="text-gray-400">Transmission:</span> {selectedEngine.transmission ?? '-'}</p>
                <p><span className="text-gray-400">Drivetrain:</span> {selectedEngine.drivetrain ?? '-'}</p>
              </div>

            </div>
          )}

        </div>

        {/* 🔥 ENGINE SELECTOR (COMO ANTES) */}
        <div className="flex gap-3 flex-wrap">

          {engines.map((engine) => {
            const active = selectedEngine?.id === engine.id

            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all
                  ${active
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:border-orange-400'}
                `}
              >
                {engine.horsepower} hp · {engine.torque} Nm
              </button>
            )
          })}

        </div>

        {/* 🔥 NAVBAR EXACTA */}
        <div className="flex gap-8 text-sm border-b border-white/10 pb-3">

          {[
            'Specifications',
            'Maintenance',
            'Problems',
            'Ownership Cost',
            'Insurance',
            'Tires',
            'Before You Buy',
          ].map((item, i) => (
            <span
              key={i}
              className={`
                cursor-pointer transition
                ${i === 0
                  ? 'text-white border-b-2 border-orange-500 pb-1'
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              {item}
            </span>
          ))}

        </div>

        {/* 🔥 CONTENT */}
        <div className="pt-6">
          {children}
        </div>

      </div>
    </EngineProvider>
  )
}