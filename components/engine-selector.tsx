'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function EngineSelector({ engines }: { engines: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentEngine = searchParams.get('engine')

  return (
    <select
      className="input-dark p-3 w-full"
      value={currentEngine || ''}
      onChange={(e) => {
        const engineId = e.target.value

        const params = new URLSearchParams(searchParams.toString())
        params.set('engine', engineId)

        router.push(`?${params.toString()}`)
      }}
    >
      <option value="">Select engine</option>

      {engines.map((e) => (
        <option key={e.id} value={e.id}>
          {e.power}hp • {e.fuel_type} • {e.transmission}
        </option>
      ))}
    </select>
  )
}