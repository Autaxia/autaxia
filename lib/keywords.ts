import { scrapeForums } from '@/lib/data/forum-scraper'
export async function getGoogleSuggest(q: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`
  const res = await fetch(url)
  const json = await res.json()
  return Array.isArray(json?.[1]) ? json[1] : []
}
export async function getForumKeywords(car: any): Promise<string[]> {
  const issues = await scrapeForums(car)
  return issues.map((i: any) => i.title)
}
export function buildKeywords(car: any) {
  const base = `${car.brand.name} ${car.model.name}`

  return [
    `${base} problems`,
    `${base} reliability`,
    `${base} specs`,
    `${base} fuel consumption`,
    `${base} maintenance cost`,
    `${base} common issues`
  ]
}