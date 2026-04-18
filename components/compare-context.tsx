'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CompareItem = {
  id: string
  brand: string
  model: string
  year: string
  engine: {
    id: string
    slug: string
    power: number
    torque: number
    fuel_type: string
    transmission: string
    drivetrain: string
  }
}

type Ctx = {
  items: CompareItem[]
  add: (item: CompareItem) => void
  remove: (id: string) => void
  clear: () => void
  isIn: (id: string) => boolean
}

const CompareContext = createContext<Ctx | null>(null)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([])

  // load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('compare')
    if (raw) setItems(JSON.parse(raw))
  }, [])

  // persist
  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(items))
  }, [items])

  function add(item: CompareItem) {
    setItems((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev
      if (prev.length >= 4) return prev // límite 4
      return [...prev, item]
    })
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function clear() {
    setItems([])
  }

  function isIn(id: string) {
    return items.some((p) => p.id === id)
  }

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, isIn }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used inside provider')
  return ctx
}