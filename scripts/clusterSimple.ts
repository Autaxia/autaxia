import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// reglas simples (pero potentes)
function getCluster(keyword: string) {
  const k = keyword.toLowerCase()

  if (k.includes('problem') || k.includes('issue') || k.includes('fault'))
    return 'problems'

  if (k.includes('reliability') || k.includes('reliable'))
    return 'reliability'

  if (k.includes('maintenance') || k.includes('service') || k.includes('cost'))
    return 'maintenance'

  if (k.includes('spec') || k.includes('hp') || k.includes('engine'))
    return 'specs'

  return 'overview'
}

async function run() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .is('cluster', null)

  if (!jobs) return

  for (const j of jobs) {
    const cluster = getCluster(j.keyword)

    await supabase.from('jobs')
      .update({ cluster })
      .eq('id', j.id)

    console.log('🔗 clustered:', j.keyword, '→', cluster)
  }
}

run()