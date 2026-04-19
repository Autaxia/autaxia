import CarPageUI from './car-page-ui'
import { getOrCreateCar } from '@/lib/data/get-or-create-car'
import { supabase } from '@/lib/supabase-client'

// =====================
// 🔥 GET YEAR ID (CLAVE)
// =====================
async function getYearId(brand: string, model: string, year: number) {
  const { data } = await supabase
    .from('years')
    .select(`
      id,
      models!inner (slug)
    `)
    .eq('year', year)
    .eq('models.slug', model)
    .limit(1)
    .maybeSingle()

  return data?.id || null
}

// =====================
// 🔥 METADATA
// =====================
export async function generateMetadata(props: any) {
  const params = await props.params

  const brand = params?.brand
  const model = params?.model
  const year = params?.year

  if (!brand || !model || !year) {
    return {
      title: 'Car specs, problems & reliability',
      description: 'Explore real car data, reliability and maintenance costs.'
    }
  }

  const title = `${brand} ${model} ${year} specs, problems & reliability`
  const description = `Real data for ${brand} ${model} ${year}: engines, maintenance costs, reliability score and common problems.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://autaxia.com/cars/${brand}/${model}/${year}`,
      type: 'article'
    }
  }
}

// =====================
// FORMAT NAME
// =====================
function formatName(str: string) {
  if (!str) return ''

  return str
    .split(/[\s-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// =====================
// PAGE
// =====================
export default async function Page(props: any) {
  const params = await props.params

  const brand = params?.brand
  const model = params?.model
  const year = params?.year

  if (!brand || !model || !year) {
    return <div>Invalid params</div>
  }

  // 🔥 FIX CRÍTICO
  const yearNum = Number(year)

  // 🔥 ID REAL PARA COMPARE
  const yearId = await getYearId(brand, model, yearNum)

  const brandName = formatName(brand)
  const modelName = formatName(model)

  // =====================
  // 🔥 DATA
  // =====================
  const data = await getOrCreateCar(
    brand,
    model,
    yearNum
  )

  // =====================
  // 🔥 NORMALIZACIÓN
  // =====================
  const engines = Array.isArray(data?.engines) ? data.engines : []
  const problems = Array.isArray(data?.problems) ? data.problems : []
  const maintenance = Array.isArray(data?.maintenance) ? data.maintenance : []
  const tires = Array.isArray(data?.tires) ? data.tires : []

  const performance = data?.performance || {}
  const efficiency = data?.efficiency || {}

  const reliability =
    typeof data?.reliability === 'number'
      ? { score: data.reliability }
      : data?.reliability || null

  const summary =
    data?.summary ||
    `${brandName} ${modelName} ${year} specs, reliability and common problems.`

  // =====================
  // RENDER
  // =====================
  return (
    <CarPageUI
      carId={yearId} // 🔥 CLAVE TOTAL
      brand={{ name: brandName, slug: brand }}
      model={{ name: modelName, slug: model }}
      year={year}

      engines={engines}
      maintenance={maintenance}
      problems={problems}
      tires={tires}

      performance={performance}
      efficiency={efficiency}
      reliability={reliability}
      seo={{ intro: summary }}
    />
  )
}