
import {
  getBrandBySlug,
  getModelBySlug,
  getYear
} from '@/lib/db/queries'
export async function getCore(params: {
  brand: string
  model: string
  year: string
}) {
  const { brand, model, year } = await params

  const brandData = await getBrandBySlug(brand)
  const modelData = brandData
    ? await getModelBySlug(brandData.id, model)
    : null

  const yearData = modelData
    ? await getYear(modelData.id, Number(year))
    : null

  return { brandData, modelData, yearData }
}