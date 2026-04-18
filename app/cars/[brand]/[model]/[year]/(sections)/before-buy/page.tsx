import { notFound } from 'next/navigation'

import {
  getBrandBySlug,
  getModelBySlug,
  getYear,
  getEnginesByYear,
  getMaintenance,
  getProblems,
  getOwnership,
  getInsurance,
  getTires,
  getBeforeBuy
} from '@/lib/db/queries'

import CarPageUI from '@/components/car-page-ui'

type Props = {
  params: {
    brand: string
    model: string
    year: string
  }
}

export default async function Page({ params }: Props) {

  const { brand: brandSlug, model: modelSlug, year } = await params

  const yearNumber = Number(year)
  if (isNaN(yearNumber)) return notFound()

  // =====================
  // BRAND
  // =====================
  const brand = await getBrandBySlug(brandSlug)
  if (!brand) return notFound()

  // =====================
  // MODEL
  // =====================
  const model = await getModelBySlug(brand.id, modelSlug)
  if (!model) return notFound()

  // =====================
  // YEAR
  // =====================
  const yearData = await getYear(model.id, yearNumber)
  if (!yearData) return notFound()

  // =====================
  // DATA (SAFE)
  // =====================
  const [
    engines,
    maintenance,
    problems,
    ownership,
    insurance,
    tires,
    beforeBuy
  ] = await Promise.all([
    getEnginesByYear(yearData.id),
    getMaintenance(yearData.id),
    getProblems(yearData.id),
    getOwnership(yearData.id),
    getInsurance(yearData.id),
    getTires(yearData.id),
    getBeforeBuy(yearData.id)
  ])

  return (
    <CarPageUI
      brand={brand}
      model={model}
      year={year}
      engines={engines || []}
      maintenance={maintenance || []}
      problems={problems || []}
      ownership={ownership || []}
      insurance={insurance || []}
      tires={tires || []}
      beforeBuy={beforeBuy || []}
    />
  )
}