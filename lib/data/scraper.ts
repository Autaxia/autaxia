export async function scrapeWikipedia(car: any) {
  try {
    const query = `${car.brand.name} ${car.model.name}`

    console.log('🔍 wiki search:', query)

    // ========================
    // SEARCH
    // ========================
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`

    const searchRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!searchRes.ok) {
      console.log('❌ wiki search HTTP error:', searchRes.status)
      return null
    }

    const searchData = await searchRes.json()

    const results = searchData?.query?.search || []

    if (!results.length) {
      console.log('⚠️ wiki no results for:', query)
      return null
    }

    const title = results[0].title

    console.log('✅ wiki match:', title)

    // ========================
    // SUMMARY
    // ========================
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`

    const summaryRes = await fetch(summaryUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; CarDBBot/1.0)'
  }
})

    if (!summaryRes.ok) {
  console.log('❌ wiki summary HTTP error:', summaryRes.status)
  return null
}

console.log('✅ wiki summary OK')

    const data = await summaryRes.json()

    return {
      title: data.title,
      summary: data.extract
    }

  } catch (err) {
    console.log('🔥 wiki crash:', err)
    return null
  }
}