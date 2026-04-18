async function getAutocomplete(query: string) {
  const res = await fetch(
    `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
  )

  const json = await res.json()

  return json[1] || []
}