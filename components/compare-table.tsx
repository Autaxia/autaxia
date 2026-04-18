'use client'

type Props = {
  cars: any[]
  onRemove: (index: number) => void
}

// =====================
// HELPERS
// =====================

function getBestIndex(values: number[]) {
  const max = Math.max(...values)
  return values.indexOf(max)
}

function diffText(value: number, best: number) {
  const diff = value - best
  if (diff === 0) return 'Best'
  return diff > 0 ? `+${diff}` : `${diff}`
}

// =====================
// 🔥 REAL SCORE ENGINE
// =====================
function buildScore(car: any) {
  let score = 100

  // 🔥 penalización por problemas reales
  if (car.problems?.length) {
    score -= car.problems.length * 6
  }

  // 🔥 eficiencia
  if (car.fuel_type === 'diesel') score += 2
  if (car.transmission === 'automatic') score += 2

  // 🔥 potencia balanceada
  if (car.power > 200) score += 3
  if (car.power < 90) score -= 3

  return Math.max(50, Math.min(score, 100))
}

// =====================
// MAIN
// =====================
export default function CompareTable({ cars, onRemove }: Props) {

  const powers = cars.map(c => c.power || 0)
  const bestPowerIndex = getBestIndex(powers)

  const scores = cars.map(buildScore)
  const bestScoreIndex = getBestIndex(scores)

  return (
    <div className="overflow-x-auto">

      <table className="w-full border border-white/10 rounded-xl overflow-hidden">

        {/* HEADER */}
        <thead>
          <tr className="bg-white/5">

            <th className="p-4 text-left text-gray-400">
              Spec
            </th>

            {cars.map((car, i) => (
              <th key={i} className="p-4 text-left">

                <div className="flex flex-col gap-2">

                  <span className="font-semibold text-sm">
                    {car.brand} {car.model} {car.year}
                  </span>

                  <button
                    onClick={() => onRemove(i)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </th>
            ))}

          </tr>
        </thead>

        {/* BODY */}
        <tbody className="text-sm">

          {/* 🔥 POWER */}
          <tr className="border-t border-white/10">
            <td className="p-4 text-gray-400">Power</td>

            {cars.map((car, i) => {
              const isBest = i === bestPowerIndex

              return (
                <td
                  key={i}
                  className={`p-4 ${
                    isBest ? 'text-green-400 font-semibold' : ''
                  }`}
                >
                  {car.power || '—'} hp

                  {car.power && (
                    <span className="block text-xs text-gray-500">
                      {diffText(car.power, powers[bestPowerIndex])}
                    </span>
                  )}

                  {isBest && (
                    <span className="block text-xs text-green-400">
                      ⭐ Best
                    </span>
                  )}
                </td>
              )
            })}
          </tr>

          {/* 🔥 FUEL */}
          <tr className="border-t border-white/10">
            <td className="p-4 text-gray-400">Fuel</td>

            {cars.map((car, i) => (
              <td key={i} className="p-4">
                {car.fuel_type || '—'}
              </td>
            ))}
          </tr>

          {/* 🔥 TRANSMISSION */}
          <tr className="border-t border-white/10">
            <td className="p-4 text-gray-400">Transmission</td>

            {cars.map((car, i) => (
              <td key={i} className="p-4">
                {car.transmission || '—'}
              </td>
            ))}
          </tr>

          {/* 🔥 PROBLEMS (REAL DATA) */}
          <tr className="border-t border-white/10">
            <td className="p-4 text-gray-400">Common Problems</td>

            {cars.map((car, i) => (
              <td key={i} className="p-4 space-y-1">

                {car.problems?.length > 0 ? (
                  car.problems.map((p: any, idx: number) => (
                    <div key={idx} className="text-xs text-red-400">
                      • {p.title}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">
                    No major issues reported
                  </span>
                )}

              </td>
            ))}
          </tr>

          {/* 🔥 RELIABILITY */}
          <tr className="border-t border-white/10">
            <td className="p-4 text-gray-400">Reliability</td>

            {cars.map((car, i) => {
              const reliability =
                100 - (car.problems?.length || 0) * 10

              return (
                <td key={i} className="p-4">
                  {reliability}/100
                </td>
              )
            })}
          </tr>

          {/* 🔥 SCORE */}
          <tr className="border-t border-white/10 bg-white/5">
            <td className="p-4 text-gray-300 font-semibold">
              Overall Score
            </td>

            {cars.map((car, i) => {
              const isBest = i === bestScoreIndex

              return (
                <td
                  key={i}
                  className={`p-4 ${
                    isBest ? 'text-green-400 font-bold text-lg' : ''
                  }`}
                >
                  {scores[i]}/100

                  {isBest && (
                    <span className="block text-xs text-green-400">
                      🏆 Best Overall
                    </span>
                  )}
                </td>
              )
            })}
          </tr>

        </tbody>

      </table>

      {/* 🔥 INSIGHT REAL */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">

        <p className="text-sm text-gray-300">
          🔥 <strong>Insight:</strong>{' '}
          {cars[bestScoreIndex]?.brand} {cars[bestScoreIndex]?.model} has fewer reported issues
          and offers a better balance between performance and reliability compared to the others.
        </p>

      </div>

    </div>
  )
}