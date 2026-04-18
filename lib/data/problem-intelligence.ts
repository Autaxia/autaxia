function detectSeverity(text: string) {
  const t = text.toLowerCase()
  if (t.includes('engine failure') || t.includes('fire') || t.includes('stall'))
    return 'critical'
  if (t.includes('chain') || t.includes('turbo') || t.includes('injector'))
    return 'high'
  if (t.includes('sensor') || t.includes('electrical'))
    return 'medium'
  return 'low'
}

function detectMileage(text: string) {
  const match = text.match(/(\d{2,3})[, ]?000 ?km/i)
  return match ? parseInt(match[1]) * 1000 : null
}

export function buildProblemIntelligence(raw: any[]) {
  const map: Record<string, any> = {}

  for (const item of raw) {
    const key = (item.title || '').toLowerCase()

    if (!map[key]) {
      map[key] = {
        title: item.title,
        mentions: 0,
        severity: detectSeverity(item.text || ''),
        mileage: detectMileage(item.text || ''),
      }
    }

    map[key].mentions++
  }

  return Object.values(map)
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 6)
}