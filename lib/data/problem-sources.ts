export async function scrapeReddit(car: any) {
  try {
    const q = `${car.brand} ${car.model} ${car.year} problems`
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=10`
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const json = await res.json()

    return (json?.data?.children || []).map((p: any) => ({
      source: 'reddit',
      title: p.data.title,
      text: p.data.selftext || '',
    }))
  } catch {
    return []
  }
}

export async function scrapeNHTSA(car: any) {
  try {
    const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${car.brand}&model=${car.model}`
    const res = await fetch(url)
    const json = await res.json()

    return (json?.results || []).slice(0, 10).map((r: any) => ({
      source: 'nhtsa',
      title: r.Component,
      text: r.Summary,
    }))
  } catch {
    return []
  }
}