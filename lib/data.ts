import * as db from './db/queries'
import { supabase } from '@/lib/supabase-client'

// ==============================
// 🔹 TYPES
// ==============================

export type Brand = {
  id: string
  name: string
  slug: string
}

export type Model = {
  id: string
  name: string
  slug: string
  brand_id: string
}

export type Engine = {
  id: string
  slug: string
  power: number
  torque: number
  transmission: string
  drivetrain: string
  fuel_type: string
}

export type Year = {
  id: string
  year: number
  model_id: string
}

// ==============================
// 🔹 HELPERS (TIPADO)
// ==============================

function safeArray<T>(data: T[] | null | undefined): T[] {
  return data || []
}

// ==============================
// 🔹 BRANDS
// ==============================

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('name')

  if (error) {
    console.error('❌ getBrands error', error)
    return []
  }

  return safeArray(data)
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const data = await db.getBrandBySlug(slug)

  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
  }
}

// ==============================
// 🔹 MODELS
// ==============================

export async function getModelsByBrand(
  brandId: string
): Promise<Model[]> {

  const data = await db.getModelsByBrand(brandId)

  return safeArray(data).map((m: any) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    brand_id: m.brand_id,
  }))
}

export async function getModelBySlug(
  brandId: string,
  slug: string
): Promise<Model | null> {

  const data = await db.getModelBySlug(brandId, slug)

  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    brand_id: data.brand_id,
  }
}

// ==============================
// 🔹 YEARS
// ==============================

export async function getAvailableYears(
  modelId: string
): Promise<Year[]> {

  const { data, error } = await supabase
    .from('years')
    .select('id, year, model_id')
    .eq('model_id', modelId)
    .order('year', { ascending: false })

  if (error) {
    console.error('❌ getAvailableYears error', error)
    return []
  }

  return safeArray(data)
}

export async function getYear(
  modelId: string,
  year: number
): Promise<Year | null> {

  return db.getYear(modelId, year)
}

// ==============================
// 🔹 ENGINES
// ==============================

export async function getEnginesByYear(
  yearId: string
): Promise<Engine[]> {

  const data = await db.getEnginesByYear(yearId)

  return safeArray(data).map((e: any) => ({
    id: e.id,
    slug: e.slug,
    power: e.power,
    torque: e.torque,
    transmission: e.transmission,
    drivetrain: e.drivetrain,
    fuel_type: e.fuel_type,
  }))
}

// ==============================
// 🔥 TEMP FIX (EVITA ERRORES TS)
// ==============================

// 👉 mientras migramos todo a DB
export const guides: any[] = []
export const brands: Brand[] = []
export const models: Model[] = []