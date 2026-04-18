'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export default function AdminForm() {
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [years, setYears] = useState<any[]>([])
  const [engines, setEngines] = useState<any[]>([])

  const [brandId, setBrandId] = useState('')
  const [modelId, setModelId] = useState('')
  const [yearId, setYearId] = useState('')
  const [engineId, setEngineId] = useState('')

  const [table, setTable] = useState('maintenance')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 🔥 LOAD BRANDS
  useEffect(() => {
    supabase.from('brands').select('*').then(res => setBrands(res.data || []))
  }, [])

  // 🔥 LOAD MODELS
  useEffect(() => {
    if (!brandId) return
    supabase.from('models').select('*').eq('brand_id', brandId)
      .then(res => setModels(res.data || []))
  }, [brandId])

  // 🔥 LOAD YEARS
  useEffect(() => {
    if (!modelId) return
    supabase.from('model_years').select('*').eq('model_id', modelId)
      .then(res => setYears(res.data || []))
  }, [modelId])

  // 🔥 LOAD ENGINES
  useEffect(() => {
    if (!yearId) return
    supabase.from('engines').select('*').eq('year_id', yearId)
      .then(res => setEngines(res.data || []))
  }, [yearId])

  async function handleSubmit(e: any) {
    e.preventDefault()

    const payload: any = {
      year_id: yearId,
      title,
      description,
    }

    if (engineId) payload.engine_id = engineId

    const { error } = await supabase.from(table).insert(payload)

    if (error) {
      alert(error.message)
    } else {
      alert('Saved 🚀')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

      <select onChange={(e) => setBrandId(e.target.value)}>
        <option>Select Brand</option>
        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <select onChange={(e) => setModelId(e.target.value)}>
        <option>Select Model</option>
        {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>

      <select onChange={(e) => setYearId(e.target.value)}>
        <option>Select Year</option>
        {years.map(y => <option key={y.id} value={y.id}>{y.year}</option>)}
      </select>

      <select onChange={(e) => setEngineId(e.target.value)}>
        <option>Select Engine (optional)</option>
        {engines.map(e => <option key={e.id} value={e.id}>{e.power} hp</option>)}
      </select>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-orange-500 px-6 py-2 rounded">
        Save
      </button>
    </form>
  )
}