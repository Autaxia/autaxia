export function buildInternalLinks(car: any) {
  const base = `${car.brand.name} ${car.model.name}`

  return [
    `${base} reliability`,
    `${base} problems`,
    `${base} specs`,
    `${base} fuel consumption`,
    `${base} maintenance cost`
  ]
}