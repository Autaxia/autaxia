export default function StatBar({ label, value, max = 100, inverse = false }: any) {

  if (!value) return null

  const percentage = inverse
    ? Math.max(0, 100 - (value / max) * 100)
    : Math.min(100, (value / max) * 100)

  return (
    <div>
      <div className="flex justify-between text-gray-400 text-xs mb-1">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>

      <div className="w-full bg-white/10 h-2 rounded">
        <div
          className="h-2 bg-orange-400 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}