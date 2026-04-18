type Insight = {
  title: string
  source: 'reddit'
  score?: number
}

function clean(text: string) {
  return text
    .replace(/http\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSignals(text: string): string[] {
  const t = text.toLowerCase()

  const signals: string[] = []

  if (t.includes('dpf')) signals.push('DPF clogging issues reported')
  if (t.includes('egr')) signals.push('EGR valve carbon buildup')
  if (t.includes('timing chain')) signals.push('Timing chain wear reports')
  if (t.includes('oil consumption')) signals.push('Oil consumption complaints')
  if (t.includes('gearbox') || t.includes('transmission'))
    signals.push('Transmission shifting issues mentioned')
  if (t.includes('battery'))
    signals.push('Battery drain or electrical issues reported')

  return signals
}

export async function getRedditInsights(query: string): Promise<Insight[]> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
      query
    )}&limit=12`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'autaxia-bot' },
      cache: 'no-store',
    })

    const json = await res.json()

    const posts = json?.data?.children || []

    const results: Insight[] = []

    for (const p of posts) {
      const title = clean(p?.data?.title || '')
      const signals = extractSignals(title)

      for (const s of signals) {
        results.push({
          title: s,
          source: 'reddit',
          score: p?.data?.score || 0,
        })
      }
    }

    // ordenar por score (popularidad)
    return results.sort((a, b) => (b.score || 0) - (a.score || 0))
  } catch (e) {
    console.error('reddit error', e)
    return []
  }
}