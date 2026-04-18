export function pickViralCandidates(pages: any[]) {
  return pages
    .map(p => {
      const text = JSON.stringify(p.content || '').toLowerCase()

      let score = 0

      if (text.includes('engine failure')) score += 3
      if (text.includes('turbo')) score += 2
      if (text.includes('timing chain')) score += 3
      if (text.includes('problems')) score += 1

      return { ...p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}