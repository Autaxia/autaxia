import { supabase } from '@/lib/supabase-client'
import CompareTable from '@/components/compare-table'

export default async function Page({ params }: any) {

  const { data } = await supabase
    .from('compare_pages')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!data) return <div>Not found</div>

  const content = data.content

  return (
    <div className="min-h-screen bg-[#020203] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold">
          {content.title}
        </h1>

        <p className="text-gray-400">
          {content.intro}
        </p>

        <CompareTable cars={content.cars || []} onRemove={() => {}} />

        {/* 🔥 diferencias */}
        <div className="mt-10 space-y-3">
          {content.differences.map((d: any, i: number) => (
            <p key={i} className="text-sm text-gray-300">
              • {d}
            </p>
          ))}
        </div>

      </div>

    </div>
  )
}