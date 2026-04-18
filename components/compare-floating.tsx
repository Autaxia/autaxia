'use client'

import { useEffect, useState } from 'react'

export default function CompareFloating() {
  const [cars, setCars] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('compare') || '[]')
    setCars(stored)
  }, [])

  if (!cars.length) return null

  return (
    <a
      href={`/compare?cars=${cars
        .map(
          (c) => `${c.brand}-${c.model}-${c.year}-${c.slug}`
        )
        .join(',')}`}
      className="
        fixed bottom-6 right-6
        bg-orange-500 text-black font-semibold
        px-6 py-3 rounded-full
        shadow-lg
        hover:scale-105 transition
        z-50
      "
    >
      Compare ({cars.length})
    </a>
  )
}