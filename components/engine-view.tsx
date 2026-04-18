'use client'

import { useState } from 'react'

type Engine = {
  id: string
  power: number
  torque: number
  fuel_type: string
  transmission: string
  drivetrain: string
}

export function EngineView({ engines }: { engines: Engine[] }) {
  const [selected, setSelected] = useState(engines[0])

  return (
    <>
      {/* SELECT */}
      <div className="mt-6">
        <select
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
          onChange={(e) => {
            const engine = engines.find(e2 => e2.id === e.target.value)
            if (engine) setSelected(engine)
          }}
        >
          {engines.map((e) => (
            <option key={e.id} value={e.id}>
              {e.power}hp • {e.fuel_type} • {e.transmission}
            </option>
          ))}
        </select>
      </div>

      {/* SPECS */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Spec label="Power" value={`${selected.power} hp`} />
        <Spec label="Torque" value={`${selected.torque} Nm`} />
        <Spec label="Fuel" value={selected.fuel_type} />
        <Spec label="Transmission" value={selected.transmission} />
        <Spec label="Drivetrain" value={selected.drivetrain} />
      </div>
    </>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  )
}