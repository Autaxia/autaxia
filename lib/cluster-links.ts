export function buildClusterLinks(car: any) {
  const base = `${car.brand.name}-${car.model.name}-${car.year.year}`
    .toLowerCase()
    .replace(/\s+/g, '-')

  return [
    `${base}-problems`,
    `${base}-reliability`,
    `${base}-maintenance`,
    `${base}-engine-problems`,
    `${base}-repair-cost`,
    `${base}-should-you-buy`
  ]
}