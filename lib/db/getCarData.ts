import {
  getBrandBySlug,
  getModelBySlug,
  getYear,
  getEnginesByModel,
} from './queries'

export async function getCarData(params: {
  brand: string
  model: string
  year: string
}) {
  const yearNumber = Number(params.year)

  const brand = await getBrandBySlug(params.brand)
  if (!brand) return null

  const model = await getModelBySlug(brand.id, params.model)
  if (!model) return null

  const yearData = await getYear(model.id, yearNumber)
  if (!yearData) return null

  const engines = await getEnginesByModel(model.id)

  return { brand, model, yearData, engines, yearNumber }
}