'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Brand = {
  id: string
  name: string
  slug: string
}

type Model = {
  id: string
  name: string
  slug: string
  brand_id: string
}

type YearRecord = {
  id: string
  year: number
}

export function CarSearch({ variant = 'default' }: { variant?: string }) {

  const router = useRouter()

  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [years, setYears] = useState<YearRecord[]>([])

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)

  // 🔥 SAFE FETCH
  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url)

      if (!res.ok) throw new Error('Fetch error')

      const text = await res.text()
      if (!text) return []

      return JSON.parse(text)
    } catch (err) {
      console.error('Fetch failed:', url, err)
      return []
    }
  }

  // 🔥 LOAD BRANDS
  useEffect(() => {
    setLoadingBrands(true)

    safeFetch('/api/brands').then((data) => {
      setBrands(data)
      setLoadingBrands(false)
    })
  }, [])

  // 🔥 LOAD MODELS
  useEffect(() => {
    if (!selectedBrand) return

    setLoadingModels(true)

    safeFetch(`/api/models?brandId=${selectedBrand.id}`).then((data) => {
      setModels(data)
      setSelectedModel(null)
      setYears([])
      setSelectedYear(null)
      setLoadingModels(false)
    })
  }, [selectedBrand])

  // 🔥 LOAD YEARS
  useEffect(() => {
    if (!selectedModel) return

    setLoadingYears(true)

    safeFetch(`/api/years?modelId=${selectedModel.id}`).then((data) => {
      setYears(data)
      setSelectedYear(null)
      setLoadingYears(false)
    })
  }, [selectedModel])

  const handleSearch = () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return

    router.push(
      `/cars/${selectedBrand.slug}/${selectedModel.slug}/${selectedYear}?tab=specs`
    )
  }

  return (
    <div className="relative w-full">

      {/* GLOW */}
      <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-2xl -z-10"></div>

      <div className={cn(
        "grid gap-4 w-full p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl",
        variant === 'inline' ? "grid-cols-4" : "grid-cols-1 md:grid-cols-4"
      )}>

        {/* BRAND */}
        <select
          className="w-full h-12 rounded-lg border border-white/10 bg-black/40 text-white px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          value={selectedBrand?.id || ''}
          onChange={(e) => {
            const brand = brands.find(b => b.id === e.target.value)
            setSelectedBrand(brand || null)
          }}
        >
          <option value="">
            {loadingBrands ? 'Loading brands...' : 'Brand'}
          </option>

          {brands.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* MODEL */}
        <select
          className="w-full h-12 rounded-lg border border-white/10 bg-black/40 text-white px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:opacity-40"
          value={selectedModel?.id || ''}
          onChange={(e) => {
            const model = models.find(m => m.id === e.target.value)
            setSelectedModel(model || null)
          }}
          disabled={!models.length || loadingModels}
        >
          <option value="">
            {loadingModels
              ? 'Loading models...'
              : selectedBrand
                ? 'Model'
                : 'Select brand first'}
          </option>

          {models.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* YEAR */}
        <select
          className="w-full h-12 rounded-lg border border-white/10 bg-black/40 text-white px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:opacity-40"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          disabled={!years.length || loadingYears}
        >
          <option value="">
            {loadingYears
              ? 'Loading years...'
              : selectedModel
                ? 'Year'
                : 'Select model first'}
          </option>

          {years.map(y => (
            <option key={y.id} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>

        {/* BUTTON */}
        <Button
          onClick={handleSearch}
          disabled={!selectedBrand || !selectedModel || !selectedYear}
          className={cn(
            "h-12 rounded-lg font-semibold transition-all",
            "bg-orange-500 hover:bg-orange-600",
            "shadow-lg shadow-orange-500/20",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          Search Car
        </Button>

      </div>
    </div>
  )
}