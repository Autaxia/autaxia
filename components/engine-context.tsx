'use client'

import { createContext, useContext, useState } from 'react'

type Engine = {
  id: string
  power: number
  torque: number
  fuel_type: string
  transmission: string
  drivetrain: string
}

type EngineContextType = {
  engine: Engine | null
  setEngine: (e: Engine) => void
}

const EngineContext = createContext<EngineContextType | null>(null)

export function EngineProvider({
  children,
  initialEngine,
}: {
  children: React.ReactNode
  initialEngine: Engine | null
}) {
  const [engine, setEngine] = useState<Engine | null>(initialEngine)

  return (
    <EngineContext.Provider value={{ engine, setEngine }}>
      {children}
    </EngineContext.Provider>
  )
}

export function useEngine() {
  const ctx = useContext(EngineContext)
  if (!ctx) throw new Error('useEngine must be used inside EngineProvider')
  return ctx
}