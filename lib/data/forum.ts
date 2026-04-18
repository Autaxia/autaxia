type Insight = {
  title: string
  source: 'forum'
}

function clean(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function extractSignals(text: string): string[] {
  const t = text.toLowerCase()

  const signals: string[] = []

  if (t.includes('dpf')) signals.push('DPF clogging issues reported')
  if (t.includes('egr')) signals.push('EGR valve problems mentioned')
  if (t.includes('timing chain')) signals.push('Timing chain issues reported')
  if (t.includes('gearbox') || t.includes('transmission'))
    signals.push('Transmission shifting issues reported')
  if (t.includes('oil')) signals.push('Oil leaks or consumption issues')

  return signals
}

export async function getForumInsights(query: string): Promise<Insight[]> {
  try {
    const search = `${query} problems forum`

    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(search)}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'autaxia-bot',
      },
    })

    const html = await res.text()

    // 🔥 EXTRAER TITULOS (simple regex)
    const matches = html.match(/<a[^>]*class="result__a"[^>]*>(.*?)<\/a>/g) || []

    const results: Insight[] = []

    for (const m of matches.slice(0, 10)) {
      const text = clean(m.replace(/<[^>]+>/g, ''))

      const signals = extractSignals(text)

      for (const s of signals) {
        results.push({
          title: s,
          source: 'forum',
        })
      }
    }

    return results
  } catch (e) {
    console.error('forum error', e)
    return []
  }
}