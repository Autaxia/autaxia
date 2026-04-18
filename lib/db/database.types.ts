export interface BrandRecord {
  id: string
  name: string
  slug: string
  country: string
}

export interface ModelRecord {
  id: string
  brand_id: string
  name: string
  slug: string
}

export interface YearRecord {
  id: string
  model_id: string
  year: number
}

export interface EngineRecord {
  id: string
  model_id: string
  name: string
  horsepower: number
  fuelType: string
  transmission: string
}