export function scoreCar(car: any) {
  let score = 100

  const problems = car.problems || []

  for (const p of problems) {
    if (p.frequency === 'high') score -= 15
    if (p.frequency === 'medium') score -= 8
    if (p.frequency === 'low') score -= 3

    if (p.mentions) {
      score -= Math.min(p.mentions, 10)
    }
  }

  // 🔥 bonus por menos problemas
  score += Math.max(0, 10 - problems.length * 2)

  return Math.max(score, 0)
}

export function rankCars(cars: any[]) {
  return cars
    .map(car => ({
      ...car,
      score: scoreCar(car),
    }))
    .sort((a, b) => b.score - a.score)
}