'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCompareButton({ model, brand }: any) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAdd = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('compare') || '[]')

      const cleanItem = {
        id: String(model.id),
        modelId: String(model.id),
        name: model.name,
        brandName: brand.name,
        brandSlug: brand.slug
      }

      // 🔥 eliminar duplicados
      const filtered = existing.filter((c: any) => c.modelId !== cleanItem.modelId)

      // 🔥 añadir nuevo
      let updated = [...filtered, cleanItem]

      // 🔥 límite PRO (3 coches)
      if (updated.length > 3) {
        updated = updated.slice(1)
      }

      localStorage.setItem('compare', JSON.stringify(updated))

      // 🔥 CLAVE: avisar a otras páginas
      window.dispatchEvent(new Event('compareUpdated'))

      console.log('✅ SAVED:', updated)

      setAdded(true)

      setTimeout(() => {
        setAdded(false)
        router.push('/compare')
      }, 500)

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
            {brand.name} {model.name}
          </span>{' '}
          added to compare 🚀
        </div>
      )}
    </>
  )
}