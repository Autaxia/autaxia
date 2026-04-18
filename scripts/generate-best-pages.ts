import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .limit(5000)

  const cars = pages
    ?.filter(p => p.type === 'overview')
    .map(p => ({
      slug: p.slug,
      data: JSON.parse(p.content || '{}')
    })) || []

  // 🔥 RANKING REAL (heurístico)
  const ranked = cars
    .map(c => {
      const d: any = c.data

      let score = 0

      if (d.problems?.length <= 2) score += 3
      if (d.maintenance?.length <= 2) score += 2
      if (d.insurance?.[0]?.includes('Moderate')) score += 1

      return { ...c, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)

  const content = {
    title: 'Best Reliable Cars',
    description: 'Discover the most reliable cars with low maintenance and fewer problems.',
    cars: ranked
  }

  await supabase.from('pages').insert({
    slug: 'best-reliable-cars',
    type: 'seo',
    content: JSON.stringify(content)
  })

  console.log('✅ BEST PAGE CREATED')
}

run()