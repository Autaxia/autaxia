import 'server-only'

import { db } from '@/lib/db'
import { brands, models, years, engines, pages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { supabase } from '@/lib/supabase-client'

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
  const res = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1)

  return res[0] ?? null
}

export async function getModelsByBrand(brandId: string) {
  return db
    .select()
    .from(models)
    .where(eq(models.brand_id, brandId))
}

export async function getModelBySlug(
  brandId: string,
  slug: string
): Promise<Model | null> {
  const res = await db
    .select()
    .from(models)
    .where(and(eq(models.brand_id, brandId), eq(models.slug, slug)))
    .limit(1)

  return res[0] ?? null
}

/* =====================================================
   YEARS / ENGINES
===================================================== */

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
  const y = Number(year)
  if (isNaN(y)) return null

  const res = await db
    .select()
    .from(years)
    .where(and(eq(years.model_id, modelId), eq(years.year, y)))
    .limit(1)

  return res[0] ?? null
}

export async function getEnginesByYear(yearId: string): Promise<Engine[]> {
  return db
    .select()
    .from(engines)
    .where(eq(engines.year_id, yearId))
}

/* =====================================================
   🔥 CONTENT (FIX REAL)
===================================================== */

async function getContent(year: number | string, type: string) {
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('year', Number(year))
    .eq('type', type)

  return data || []
}

export const getMaintenance = (year: number | string) =>
  getContent(year, 'maintenance')

export const getProblems = (year: number | string) =>
  getContent(year, 'problems')

export const getOwnership = (year: number | string) =>
  getContent(year, 'ownership')

export const getInsurance = (year: number | string) =>
  getContent(year, 'insurance')

export const getTires = (year: number | string) =>
  getContent(year, 'tires')

export const getBeforeBuy = (year: number | string) =>
  getContent(year, 'before-buy')

/* =====================================================
   🔥 CAR CORE (SUPABASE)
===================================================== */

export async function getCarBySlug(
  brandSlug: string,
  modelSlug: string,
  year: string | number
) {
  const y = Number(year)

  const { data } = await supabase
    .from('cars')
    .select(`
      *,
      engines (*),
      problems (*),
      maintenance (*),
      tires (*)
    `)
    .eq('brand_slug', brandSlug)
    .eq('model_slug', modelSlug)
    .eq('year', y)
    .maybeSingle()

  if (!data) return null

  return {
    ...data,
    engines: data.engines || [],
    problems: data.problems || [],
    maintenance: data.maintenance || [],
    tires: data.tires || [],

    performance: data.performance || null,
    efficiency: data.efficiency || null,
    reliability: data.reliability || null
  }
}

/* =====================================================
   🔥 COMPARE
===================================================== */

export async function getCompareCars(slug: string) {
  const parts = slug.split('-vs-')
  if (parts.length !== 2) return []

  const parse = (s: string) => {
    const arr = s.split('-')
    const year = arr.pop()
    const model = arr.pop()
    const brand = arr.join('-')
    return { brand, model, year }
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
   🔥 HOMEPAGE DATA
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

/* =====================================================
   🔥 RANKINGS
===================================================== */

export async function getCarsForRanking(limit = 100) {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .limit(limit)

  return data || []
}

/* =====================================================
   🔥 EXTRA
===================================================== */

export async function getBestEngineByModel(modelId: string) {
  const res = await db
    .select()
    .from(engines)
    .where(eq(engines.model_id, modelId))

  if (!res.length) return null

  return res.sort((a, b) => (b.power ?? 0) - (a.power ?? 0))[0]
}