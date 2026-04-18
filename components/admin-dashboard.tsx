'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const TABLES = [
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'problems', label: 'Problems' },
  { key: 'ownership_cost', label: 'Ownership' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'tires', label: 'Tires' },
]

export default function AdminDashboard() {
  const [table, setTable] = useState('maintenance')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  // ===== LOAD =====
  useEffect(() => {
    loadData()
  }, [table])

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })

    setData(data || [])
    setLoading(false)
  }

  // ===== FILTER =====
  const filtered = useMemo(() => {
    if (!query) return data
    return data.filter((i) =>
      `${i.title} ${i.description}`.toLowerCase().includes(query.toLowerCase())
    )
  }, [data, query])

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  // ===== DELETE =====
  async function handleDelete(id: string) {
    if (!confirm('Delete?')) return
    await supabase.from(table).delete().eq('id', id)
    loadData()
  }

  // ===== EDIT =====
  function startEdit(item: any) {
    setEditingId(item.id)
    setForm(item)
  }

  async function uploadImage() {
    if (!imageFile) return null

    const fileName = `${Date.now()}-${imageFile.name}`

    await supabase.storage
      .from('car-images')
      .upload(fileName, imageFile)

    const { data } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function saveEdit() {
    let imageUrl = form.image_url

    if (imageFile) {
      const uploaded = await uploadImage()
      if (uploaded) imageUrl = uploaded
    }

    await supabase
      .from(table)
      .update({
        title: form.title,
        description: form.description,
        image_url: imageUrl,
      })
      .eq('id', editingId)

    setEditingId(null)
    setImageFile(null)
    loadData()
  }

  // ===== KPI =====
  const totalItems = data.length

  return (
    <div className="mt-10 space-y-8">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <select
          value={table}
          onChange={(e) => {
            setTable(e.target.value)
            setPage(1)
          }}
          className="bg-black border border-white/20 p-2 rounded-xl"
        >
          {TABLES.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* ===== KPI ===== */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <p className="text-gray-400 text-sm">Total items</p>
          <p className="text-xl font-semibold">{totalItems}</p>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-xl bg-black border border-white/10"
      />

      {/* ===== LIST ===== */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-4">

          {paginated.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur"
            >
              {editingId === item.id ? (
                <div className="space-y-3">

                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 bg-black border border-white/20 rounded"
                  />

                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2 bg-black border border-white/20 rounded"
                  />

                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />

                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 bg-green-500 rounded">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-600 rounded">
                      Cancel
                    </button>
                  </div>

                </div>
              ) : (
                <div className="flex justify-between items-start">

                  <div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>

                    {item.image_url && (
                      <img src={item.image_url} className="mt-3 w-40 rounded-lg" />
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => startEdit(item)} className="text-yellow-400">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400">
                      Delete
                    </button>
                  </div>

                </div>
              )}
            </div>
          ))}

        </div>
      )}

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-white/10 rounded"
        >
          Prev
        </button>

        <p className="text-sm text-gray-400">
          Page {page} / {totalPages || 1}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-white/10 rounded"
        >
          Next
        </button>
      </div>

    </div>
  )
}