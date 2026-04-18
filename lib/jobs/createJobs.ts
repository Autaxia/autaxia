import { supabase } from '@/lib/supabase-client'

export async function createJobsBatch(limit = 200) {
  // 🔥 solo coches reales que no tienen página
  const { data: cars } = await supabase
    .from('cars_master')
    .select('*')
    .eq('is_active', true)
    .limit(limit)

  if (!cars) return

  const jobs = cars.map((c) => ({
    brand_slug: c.brand_slug,
    model_slug: c.model_slug,
    year: c.year,
    locale: 'en',
    priority: 0,
  }))

  await supabase
    .from('jobs')
    .upsert(jobs, {
      onConflict: 'brand_slug,model_slug,year,locale',
      ignoreDuplicates: true,
    })
}