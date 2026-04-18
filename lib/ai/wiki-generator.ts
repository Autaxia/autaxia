export async function generateFromWiki({
  brand,
  model,
  year,
}: {
  brand: string
  model: string
  year: number
}) {
  const query = `${brand} ${model}`

  // ===============================
  // SAFE FETCH WIKI
  // ===============================
  async function fetchWiki(retries = 2): Promise<any> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&format=json&titles=${encodeURIComponent(query)}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CarDataBot/1.0 (chasearriba@gmail.com)'
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const json = await res.json()

    const pages = json.query.pages
    const page = Object.values(pages)[0] as any

    return {
      extract: page?.extract || ''
    }

  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 800))
      return fetchWiki(retries - 1)
    }

    throw e
  }
}

  try {
    const data = await fetchWiki()

    const summary = data?.extract || ''
    const text = summary.toLowerCase()

    const engines: string[] = []
    const maintenance: string[] = []
    const problems: string[] = []
    const ownership: string[] = []
    const insurance: string[] = []
    const tires: string[] = []

    // ===============================
    // ENGINE DETECTION
    // ===============================
    if (text.includes('diesel')) engines.push('Diesel engine options available')
    if (text.includes('petrol') || text.includes('gasoline')) engines.push('Petrol engine options available')
    if (text.includes('electric')) engines.push('Electric version available')
    if (text.includes('hybrid')) engines.push('Hybrid version available')

    // ===============================
    // MAINTENANCE
    // ===============================
    if (text.includes('luxury')) maintenance.push('Higher maintenance costs expected')
    if (text.includes('compact')) maintenance.push('Affordable maintenance')
    if (text.includes('premium')) maintenance.push('Premium service costs')

    // ===============================
    // PROBLEMS
    // ===============================
    if (text.includes('diesel')) problems.push('DPF and EGR issues possible')
    if (text.includes('turbo')) problems.push('Turbo wear over time')
    if (text.includes('automatic')) problems.push('Transmission maintenance required')

    // ===============================
    // OWNERSHIP
    // ===============================
    if (text.includes('family')) ownership.push('Good family car')
    if (text.includes('compact')) ownership.push('Easy to drive in city')
    if (text.includes('sedan') || text.includes('saloon')) ownership.push('Comfortable long-distance driving')

    // ===============================
    // INSURANCE
    // ===============================
    if (text.includes('performance')) insurance.push('Higher insurance costs')
    else insurance.push('Moderate insurance costs')

    // ===============================
    // TIRES
    // ===============================
    if (text.includes('sport')) tires.push('Performance tires recommended')
    else tires.push('Standard all-season tires')

    return {
      title: `${brand} ${model} ${year}`,
      summary,
      engines,
      maintenance,
      problems,
      ownership,
      insurance,
      tires,
      before_buy: [
        'Check service history',
        'Inspect engine condition',
        'Verify mileage',
        'Test drive recommended',
      ],
    }

  } catch (e) {
    console.log('⚠️ Wiki fallback')

    return {
      title: `${brand} ${model} ${year}`,
      summary: 'General vehicle information based on similar models',

      engines: [],
      maintenance: [],
      problems: [],
      ownership: [],
      insurance: [],
      tires: [],
      before_buy: [],
    }
  }
}