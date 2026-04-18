import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

// =====================
// HELPERS
// =====================
function parseHP(text: string): number {
  if (!text) return 0

  const clean = text.replace(/\n/g, ' ').toLowerCase()

  // hp / ps
  const hpMatch = clean.match(/(\d{2,4})\s*(hp|ps)/i)
  if (hpMatch) return parseInt(hpMatch[1])

  // kW → hp
  const kwMatch = clean.match(/(\d{2,4})\s*kW/i)
  if (kwMatch) {
    const kw = parseInt(kwMatch[1])
    return Math.round(kw * 1.341)
  }

  return 0
}

function detectFuel(text: string) {
  const t = text.toLowerCase()
  if (t.includes('diesel') || t.includes('tdi')) return 'diesel'
  if (t.includes('electric') || t.includes('ev')) return 'electric'
  if (t.includes('hybrid')) return 'hybrid'
  return 'petrol'
}

// =====================
// SCRAPER PRO
// =====================
export async function scrapeWikipediaEngines(query: string) {
  try {
    const slug = query.replace(/ /g, '_')
    const url = `https://en.wikipedia.org/wiki/${slug}`

    console.log('🌍 Scraping:', url)

    const res = await fetch(url)
    if (!res.ok) {
      console.log('❌ No wiki page:', query)
      return []
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const engines: any[] = []

    // =====================
    // MÉTODO PRINCIPAL (TABLAS)
    // =====================
    $('table').each((_, table) => {
      $(table).find('tr').each((_, row) => {
        const cols = $(row).find('td, th')

        if (cols.length < 2) return

        const name = $(cols[0]).text().trim()
        const specs = $(cols[1]).text().trim()

        if (!name || !specs) return

        const power = parseHP(specs)

        // 🔥 filtro fuerte → evita basura
        if (power < 80 || power > 1000) return

        engines.push({
          name,
          power_hp: power,
          fuel_type: detectFuel(name + ' ' + specs)
        })
      })
    })

    // =====================
    // LIMPIEZA
    // =====================
    const unique = new Map<string, any>()

    for (const e of engines) {
      const key = `${e.name}-${e.power_hp}`

      if (!unique.has(key)) {
        unique.set(key, e)
      }
    }

    const cleaned = Array.from(unique.values())

    if (cleaned.length === 0) {
      console.log('⚠️ No engines parsed for:', query)
      return []
    }

    console.log(`✅ ${cleaned.length} engines found for ${query}`)

    // =====================
    // FORMATO COMPATIBLE
    // =====================
    return [
      {
        code: 'main',
        from: 2000,
        to: 2024,
        engines: cleaned
      }
    ]

  } catch (err) {
    console.log('❌ wiki crash:', err)
    return []
  }
}