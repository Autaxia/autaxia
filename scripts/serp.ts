import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export async function getSERP(keyword: string) {

  const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  })

  const html = await res.text()
  const $ = cheerio.load(html)

  const results: any[] = []

  $('h3').each((i, el) => {
    const title = $(el).text()

    if (title) {
      results.push({ title })
    }
  })

  return results.slice(0, 5)
}