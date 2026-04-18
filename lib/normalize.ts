export function normalizeAIResponse(data: any) {
  return {
    ...data,
    brand: {
      name: data.brand?.name || '',
      slug: data.brand?.slug || ''
    },
    model: {
      name: data.model?.name || '',
      slug: data.model?.slug || ''
    },
    year: {
      year: Number(data.year?.year || 0)
    },
    engines: data.engines || [],
    maintenance: data.maintenance || [],
    problems: data.problems || []
  }
}