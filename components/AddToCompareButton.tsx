'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCompareButton({ car }: any) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAdd = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('compare') || '[]')

      // 🔥 VALIDACIÓN REAL
      if (!car?.brand_slug || !car?.model_slug || !car?.year) {
        console.error('❌ Car missing required fields:', car)
        return
      }

      // 🔥 FORMATO QUE NECESITA /api/compare
      const item = {
        id: `${car.brand_slug}-${car.model_slug}-${car.year}`, // solo para UI
        brand_slug: car.brand_slug,
        model_slug: car.model_slug,
        year: car.year
      }

      // 🔥 evitar duplicados
      const filtered = existing.filter(
        (c: any) =>
          !(c.brand_slug === item.brand_slug &&
            c.model_slug === item.model_slug &&
            c.year === item.year)
      )

      let updated = [...filtered, item]

      // 🔥 límite PRO (3 coches)
      if (updated.length > 3) {
        updated = updated.slice(1)
      }

      localStorage.setItem('compare', JSON.stringify(updated))

      // 🔥 actualizar compare en vivo
      window.dispatchEvent(new Event('compareUpdated'))

      setAdded(true)

      setTimeout(() => {
        setAdded(false)
        router.push('/compare')
      }, 400)

    } catch (e) {
      console.error('❌ ERROR SAVING COMPARE', e)
    }
  }

  return (
    <>
      <button
        onClick={handleAdd}
        className="
          px-6 py-3
          rounded-xl
          bg-gradient-to-r from-orange-400 to-yellow-300
          text-black font-semibold
          shadow-[0_0_20px_rgba(255,140,0,0.4)]
          hover:scale-105
          transition
          active:scale-[0.98]
        "
      >
        Add to Compare
      </button>

      {added && (
        <div className="
          fixed bottom-6 right-6
          bg-black/80
          border border-orange-400/40
          text-orange-300
          px-5 py-3
          rounded-xl
          shadow-lg
          backdrop-blur-md
        ">
          <span className="font-medium">
            {car.brand} {car.model}
          </span>{' '}
          added to compare 🚀
        </div>
      )}
    </>
  )
}