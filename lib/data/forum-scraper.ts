export async function scrapeForums(car: any) {
  try {
    const query = `${car.brand.name} ${car.model.name} problems`

    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=10`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://www.reddit.com/'
      }
    })

    if (!res.ok) {
      console.log('❌ reddit HTTP error:', res.status)
      return []
    }

    const json = await res.json()

    const posts = json?.data?.children || []

    const issues = posts.map((p: any) => ({
      title: p.data.title,
      description: p.data.selftext?.slice(0, 200) || ''
    }))

    if (!issues.length) {
      console.log('⚠️ reddit no results')
    }

    return issues

  } catch (err) {
    console.log('⚠️ reddit fail hard')
    return []
  }
}