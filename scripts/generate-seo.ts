import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SEO_PAGES = [
  {
    slug: 'best-reliable-cars',
    title: 'Best Reliable Cars',
    description: 'Discover the most reliable cars with lowest maintenance costs.',
    content: 'List of most reliable cars based on long-term ownership.'
  },
  {
    slug: 'cars-with-least-problems',
    title: 'Cars With Least Problems',
    description: 'Cars known for having fewer mechanical issues.',
    content: 'These cars have a reputation for durability and reliability.'
  },
  {
    slug: 'low-maintenance-cars',
    title: 'Low Maintenance Cars',
    description: 'Cars with the lowest maintenance costs.',
    content: 'Affordable cars to maintain over time.'
  }
]

async function run() {
  for (const page of SEO_PAGES) {
    await supabase.from('pages').upsert({
      slug: page.slug,
      type: 'seo',
      content: JSON.stringify(page)
    })
  }

  console.log('🔥 SEO pages created')
}

run()