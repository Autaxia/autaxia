'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ModelCard({ model, brand }: any) {
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    const existing = JSON.parse(localStorage.getItem('compare') || '[]')

    // 🔥 evitar duplicados
    const exists = existing.find((c: any) => c.id === model.id)

    let updated = exists
      ? existing
      : [
          ...existing,
          {
            id: model.id,
            modelId: model.id,
            name: model.name,
            brandName: brand.name,
            brandSlug: brand.slug
          }
        ]

    // 🔥 límite PRO (máx 3 coches)
    if (updated.length > 3) {
      updated = updated.slice(1)
    }

    localStorage.setItem('compare', JSON.stringify(updated))

    // 🔥 toast
    setShow(true)

    setTimeout(() => {
      setShow(false)
      router.push('/compare')
    }, 600)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="
          w-full
          group
          p-5
          rounded-2xl
          bg-white/[0.04]
          backdrop-blur-xl
          border border-white/10
          text-center
          font-semibold
          transition-all duration-300
          hover:border-orange-400/40
          hover:bg-white/[0.06]
          hover:shadow-[0_0_40px_rgba(255,115,0,0.15)]
          active:scale-[0.98]
        "
      >
        <span className="group-hover:text-orange-400 transition">
          {model.name}
        </span>
      </button>

      {/* 🔥 TOAST PRO */}
      {show && (
        <div
          className="
            fixed bottom-6 right-6
            bg-black/80
            border border-orange-400/40
            text-orange-300
            px-5 py-3
            rounded-xl
            shadow-lg
            backdrop-blur-md
            animate-[fadeIn_.3s_ease]
          "
        >
          <span className="font-medium">
            {brand.name} {model.name}
          </span>{' '}
          added to compare 🚀
        </div>
      )}
    </>
  )
}