export async function getGoogleSuggestions(query: string): Promise<string[]> {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    const res = await fetch(url)

    if (!res.ok) return []

    const data = await res.json()

    // formato: [query, [suggestions]]
    return data[1] || []

  } catch {
    return []
  }
}