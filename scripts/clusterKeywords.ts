import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getIntent(type: string) {

  if (type.includes('problem') || type.includes('issue'))
    return 'problems'

  if (type.includes('reliability'))
    return 'reliability'

  if (type.includes('mpg') || type.includes('fuel'))
    return 'fuel'

  if (type.includes('maintenance') || type.includes('cost'))
    return 'maintenance'

  return 'general'
}

async function run() {

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')

  // 👇 FIX AQUÍ
  if (!jobs) {
    console.log('❌ no jobs found')
    return
  }

  for (const j of jobs) {

    const intent = getIntent(j.type)

    await supabase.from('jobs').update({
      cluster: intent
    }).eq('id', j.id)

    console.log(`🧠 ${j.keyword} → ${intent}`)
  }

  console.log('🔥 clustering done')
}

run()