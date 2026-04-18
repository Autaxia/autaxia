export function getInternalLinks({
  brand,
  model,
  year,
  locale = 'en'
}: {
  brand: string
  model: string
  year: string | number
  locale?: string
}) {

  const base =
    locale === 'es'
      ? `/es/coches/${brand}/${model}/${year}`
      : `/cars/${brand}/${model}/${year}`

  return [
    {
      label: 'Common problems',
      href: `${base}/problems`
    },
    {
      label: 'Reliability',
      href: `${base}/reliability`
    },
    {
      label: 'Maintenance cost',
      href: `${base}/maintenance`
    },
    {
      label: 'Ownership cost',
      href: `${base}/ownership`
    },
    {
      label: 'Before buying',
      href: `${base}/before-buy`
    },
    {
      label: 'High mileage guide',
      href: `${base}/high-mileage`
    }
  ]
}