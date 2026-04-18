import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase-client'
import { rankingConfigs } from '@/lib/seo/ranking-config'
import { SEO_CATEGORIES, SEO_FILTERS } from '@/lib/seo/combos'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tu-dominio.com'

const SEO_BRANDS = [
  'bmw',
  'audi',
  'mercedes',
  'toyota',
  'volkswagen',
  'ford',
  'seat',
  'honda'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const urls: MetadataRoute.Sitemap = []
// =====================
// 🔥 GUIDES (ARTÍCULOS)
// =====================
const guides = [
  'best-reliable-cars-2025',
  'lowest-maintenance-cars',
  'common-car-problems',
  'best-cars-under-10000',
  'cars-that-last-300000-km',
  'most-reliable-diesel-cars',
  'cars-with-lowest-fuel-consumption',
  'worst-car-engines-to-avoid',
  'best-first-cars-for-beginners',
  'cars-with-fewest-problems',
  'cheap-cars-to-insure',
  'manual-vs-automatic-reliability',
  'how-to-maintain-your-car'
]

for (const slug of guides) {
  urls.push({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly'
  })
}
  const now = new Date()

  // =====================
  // 🔥 CORE PAGES
  // =====================
  urls.push(
    { url: `${BASE_URL}/`, lastModified: now, priority: 1, changeFrequency: 'daily' },
    { url: `${BASE_URL}/brands`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/compare`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/explore`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/guides`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' }
  )

  // =====================
  // 🔥 RANKING BASE (category)
  // =====================
  const rankingPages = Object.keys(rankingConfigs).map(type => ({
    url: `${BASE_URL}/best-cars/${type}`,
    lastModified: now,
    priority: 0.95,
    changeFrequency: 'daily' as const
  }))

  urls.push(...rankingPages)

  // =====================
  // 🔥 LONG TAIL SEO (CLAVE)
  // =====================
  for (const category of SEO_CATEGORIES) {
    for (const filter of SEO_FILTERS) {

      urls.push({
        url: `${BASE_URL}/best-cars/${category}/${filter}`,
        lastModified: now,
        priority: 0.8,
        changeFrequency: 'weekly'
      })

    }
  }
SEO_BRANDS.forEach(b => {
  urls.push({
    url: `${BASE_URL}/best-cars/brand/${b}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: 'weekly'
  })
})

  // =====================
  // 🔥 CAR PAGES (CORE SEO)
  // =====================
  const { data: pages } = await supabase
  .from('pages')
  .select('brand_slug, model_slug, year, type, locale, updated_at, content')
  .eq('type', 'car')
  .not('content', 'is', null)
  .limit(2000)

if (pages) {
  for (const p of pages) {

    if (!p.brand_slug || !p.model_slug || !p.year) continue

    const base =
      p.locale === 'es'
        ? `${BASE_URL}/es/coches`
        : `${BASE_URL}/cars`

    const url = `${base}/${p.brand_slug}/${p.model_slug}/${p.year}`

    urls.push({
      url,
      lastModified: new Date(p.updated_at || now),
      priority: 0.9,
      changeFrequency: 'weekly'
    })
  }
}

  // =====================
  // 🔥 COMPARE PAGES
  // =====================
  const { data: compareJobs } = await supabase
    .from('jobs')
    .select('slug')
    .eq('type', 'compare')
    .limit(500)

  if (compareJobs) {
    for (const job of compareJobs) {

      if (!job.slug) continue

      urls.push({
        url: `${BASE_URL}/compare/${job.slug}`,
        lastModified: now,
        priority: 0.6,
        changeFrequency: 'weekly'
      })
    }
  }

  return urls
}

