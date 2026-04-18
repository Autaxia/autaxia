export async function scoreKeywordCompetition(keyword: string) {
  try {
    const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const html = await res.text()

    // señales simples (baratas pero útiles)
    const hasReddit = html.includes('reddit.com')
    const hasQuora = html.includes('quora.com')
    const hasForums = html.includes('forum')
    const hasWeakSites = hasReddit || hasQuora || hasForums

    // longitud keyword = menos competencia
    const wordCount = keyword.split(' ').length

    let score = 0

    if (hasWeakSites) score += 2
    if (wordCount >= 5) score += 2
    if (keyword.includes('cost')) score += 2
    if (keyword.includes('problems')) score += 2
    if (keyword.includes('reliability')) score += 1

    return score // cuanto mayor → más fácil

  } catch {
    return 0
  }
}