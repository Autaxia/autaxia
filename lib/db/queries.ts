import { db } from '@/lib/db'
import { brands, models, years, engines, pages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { supabase } from '@/lib/supabase-client'
import { inArray } from 'drizzle-orm'

/* =====================================================
   TYPES
===================================================== */

export type Brand = typeof brands.$inferSelect
export type Model = typeof models.$inferSelect
export type Year = typeof years.$inferSelect
export type Engine = typeof engines.$inferSelect
export type Page = typeof pages.$inferSelect

/* =====================================================
   BRANDS / MODELS
===================================================== */

export async function getBrands(): Promise<Brand[]> {
  return db.select().from(brands)
}

export async function getBrandBySlug(slug: string) {
  try {
    const res = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1)

    return res[0] ?? null
  } catch (error) {
    console.error('🔥 DB ERROR getBrandBySlug:', error)
    return null
  }
}

export async function getModelsByBrand(brandId: string) {
  try {
    const res = await db
      .select()
      .from(models)
      .where(eq(models.brand_id, brandId))

    console.log('🔥 MODELS FOUND:', res.length)

    return res
  } catch (err) {
    console.error('❌ DB ERROR getModelsByBrand:', err)
    return []
  }
}

/* =====================================================
   MODEL / YEAR
===================================================== */

export async function getModelBySlug(
  brandId: string,
  slug: string
): Promise<Model | null> {
  const res = await db
    .select()
    .from(models)
    .where(
      and(
        eq(models.brand_id, brandId),
        eq(models.slug, slug)
      )
    )
    .limit(1)

  return res[0] ?? null
}

export async function getYearsByModel(modelId: string): Promise<Year[]> {
  return db
    .select()
    .from(years)
    .where(eq(years.model_id, modelId))
    .orderBy(years.year)
}

export async function getYear(
  modelId: string,
  year: number | string
): Promise<Year | null> {

  const yearNumber = Number(year)
  if (isNaN(yearNumber)) return null

  const res = await db
    .select()
    .from(years)
    .where(
      and(
        eq(years.model_id, modelId),
        eq(years.year, yearNumber)
      )
    )
    .limit(1)

  return res[0] ?? null
}

/* =====================================================
   ENGINES
===================================================== */

export async function getEnginesByYear(yearId: string): Promise<Engine[]> {
  return db
    .select()
    .from(engines)
    .where(eq(engines.year_id, yearId))
}

/* =====================================================
   CONTENT SYSTEM (PIPELINE READY)
===================================================== */

async function getContent(
  yearId: string,
  type: string
): Promise<Page[]> {
  return db
    .select()
    .from(pages)
    .where(
      and(
        eq(pages.year_id, yearId),
        eq(pages.type, type)
      )
    )
}

export const getMaintenance = (yearId: string) =>
  getContent(yearId, 'maintenance')

export const getProblems = (yearId: string) =>
  getContent(yearId, 'problems')

export const getOwnership = (yearId: string) =>
  getContent(yearId, 'ownership')

export const getInsurance = (yearId: string) =>
  getContent(yearId, 'insurance')

export const getTires = (yearId: string) =>
  getContent(yearId, 'tires')

export const getBeforeBuy = (yearId: string) =>
  getContent(yearId, 'before-buy')

/* =====================================================
   SEARCH HELPERS
===================================================== */

export async function findBrandByName(name: string): Promise<Brand | null> {
  const res = await db
    .select()
    .from(brands)
    .where(eq(brands.name, name))
    .limit(1)

  return res[0] ?? null
}

export async function findModelByName(
  brandId: string,
  name: string
): Promise<Model | null> {
  const res = await db
    .select()
    .from(models)
    .where(
      and(
        eq(models.brand_id, brandId),
        eq(models.name, name)
      )
    )
    .limit(1)

  return res[0] ?? null
}

/* =====================================================
   🔥 CAR (CLAVE → TODO EL SISTEMA)
===================================================== */

export async function getCarBySlug(
  brandSlug: string,
  modelSlug: string,
  year: string | number
) {
  const yearNumber = Number(year)

  const { data, error } = await supabase
    .from('cars')
    .select(`
      id,
      brand,
      model,
      year,
      brand_slug,
      model_slug,
      engines (
        power,
        fuel_type,
        transmission
      ),
      problems (
        title,
        frequency,
        mentions
      )
    `)
    .eq('brand_slug', brandSlug)
    .eq('model_slug', modelSlug)
    .eq('year', yearNumber)
    .maybeSingle()

  if (error || !data) return null

  const engine = data.engines?.[0]

  return {
    brand: data.brand,
    model: data.model,
    year: data.year,
    brand_slug: data.brand_slug,
    model_slug: data.model_slug,

    power: engine?.power ?? null,
    fuel_type: engine?.fuel_type ?? null,
    transmission: engine?.transmission ?? null,

    problems: data.problems || []
  }
}

/* =====================================================
   🔥 COMPARE (NUEVO → SEO PAGES)
===================================================== */

export async function getCompareCars(slug: string) {
  // ejemplo slug:
  // bmw-3-series-2018-vs-audi-a4-2018

  const parts = slug.split('-vs-')

  if (parts.length !== 2) return []

  function parse(carSlug: string) {
    const chunks = carSlug.split('-')
    const year = chunks.pop()
    const model = chunks.pop()
    const brand = chunks.join('-')

    return {
      brand,
      model,
      year
    }
  }

  const a = parse(parts[0])
  const b = parse(parts[1])

  const cars = await Promise.all([
    getCarBySlug(a.brand, a.model!, a.year!),
    getCarBySlug(b.brand, b.model!, b.year!)
  ])

  return cars.filter(Boolean)
}

/* =====================================================
   TRENDING / LATEST
===================================================== */

export async function getTrendingCars(limit = 6) {
  const { data } = await supabase
    .from('pages')
    .select('*')
    .order('cta_clicks', { ascending: false })
    .limit(limit)

  return data || []
}

export async function getLatestCars(limit = 6) {
  const { data } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}
export async function getCarsForRanking(limit = 100) {
  const { data } = await supabase
    .from('cars')
    .select(`
      brand,
      model,
      year,
      brand_slug,
      model_slug,
      problems (*)
    `)
    .limit(limit)

  return data || []
}
export async function getBestEngineByModel(modelId: string) {
  const res = await db
    .select()
    .from(engines)
    .where(eq(engines.model_id, modelId))

  if (!res.length) return null

  return res.sort((a, b) => (b.power ?? 0) - (a.power ?? 0))[0]
}
export async function getEngineById(id?: string) {
  if (!id) return null

  const res = await db
    .select()
    .from(engines)
    .where(eq(engines.id, id))
    .limit(1)

  return res[0] ?? null
}