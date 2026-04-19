'use client'

import { useEffect, useState } from 'react'

export default function CompareSelector() {
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [selectedBrand, setSelectedBrand] = useState<any>(null)

  // 🔹 cargar marcas
  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(setBrands)
  }, [])

  // 🔹 cargar modelos al elegir marca
  async function loadModels(brandId: string) {
    const res = await fetch(`/api/models?brandId=${brandId}`)
    const data = await res.json()
    setModels(data)
  }

  // 🔹 añadir al compare
  function addToCompare(model: any) {
  try {
    const existing = JSON.parse(localStorage.getItem('compare') || '[]')

    const item = {
      id: String(model.id),

      // 🔥 CLAVE: usar la marca seleccionada
      brand_slug: selectedBrand.slug,

      model_slug: model.slug,

      // 🔥 temporal (luego mejoramos)
      year: 2020
    }

    const filtered = existing.filter((c: any) => c.id !== item.id)

    const updated = [...filtered, item].slice(-3)

    localStorage.setItem('compare', JSON.stringify(updated))

    // 🔥 esto hace que la página se actualice
    window.dispatchEvent(new Event('compareUpdated'))

  } catch (err) {
    console.error('❌ compare selector error', err)
  }
}

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">

      <h3 className="font-semibold">Add car</h3>

      {/* 🔹 brands */}
      <div className="flex flex-wrap gap-2">
        {brands.map(b => (
          <button
            key={b.id}
            onClick={() => {
              setSelectedBrand(b)
              loadModels(b.id)
            }}
            className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-orange-500/20"
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* 🔹 models */}
      {models.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => addToCompare(m)}
              className="px-3 py-1 text-xs rounded-full bg-orange-500/20 hover:bg-orange-500/40"
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}