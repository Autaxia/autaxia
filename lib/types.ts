// Core data types for the automotive platform
// Database-ready architecture for future Supabase/PostgreSQL integration

// lib/types.ts

// Tipos principales
export interface Brand {
  id: string
  name: string
  slug: string
  country: string
  description: string
}

export interface Model {
  id: string
  brandId: string
  name: string
  slug: string
  category: string
  productionStart: number
}

export interface Engine {
  id: string
  name: string
  code?: string
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'plugin-hybrid'
  displacement?: number
  cylinders?: number
  horsepower?: number
  torque?: number
  transmission?: string
  gears?: number
  drivetrain?: string
}

export interface Specifications {
  carYearId: string
  engineId: string
  fuelConsumption: { city: number; highway: number; combined: number }
  acceleration: number
  topSpeed: number
  weight: number
  length: number
  width: number
  height: number
  wheelbase: number
  trunkCapacity: number
  fuelTankCapacity: number
}

export interface MaintenanceScheduleItem {
  name: string
  interval: number
  estimatedCost: number
  description?: string
}

export interface Maintenance {
  carYearId: string
  engineId: string
  oilType?: string
  oilCapacity?: number
  oilChangeInterval?: number
  timingType?: string
  brakeFluidInterval?: number
  coolantInterval?: number
  transmissionFluidInterval?: number
  airFilterInterval?: number
  fuelFilterInterval?: number
  schedule: MaintenanceScheduleItem[]
}

export interface Problem {
  id: string
  carYearId: string
  engineId?: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  affectedYears: number[]
  estimatedRepairCost?: { min: number; max: number }
  preventiveMeasures?: string
  symptoms?: string[]
}

export interface TireInfo {
  carYearId: string
  frontSize: string
  rearSize: string
  wheelSizeFront: string
  wheelSizeRear: string
  recommendedBrands: string[]
  estimatedReplacementCost: { min: number; max: number }
}

export interface Car {
  brand: Brand
  model: Model
  year: number
  engine: Engine
  specifications: Specifications
  maintenance: Maintenance
  problems: Problem[]
  tires: TireInfo
}

export interface Guide {
  id: string
  slug: string
  title: string
  description: string
  category: string
  content: string
  featuredCars?: string[]
  publishedAt: string
  updatedAt: string
}

export interface CarData {
  brand: { name: string }
  model: { name: string }
  year: { year: number }

  engines?: {
    power: number
    fuel_type: string
    transmission: string
    drivetrain?: string
    acceleration?: number
    top_speed?: number
  }[]

  maintenance?: string[]
  problems?: string[]
  ownership?: string[]
  insurance?: string[]
  tires?: string[]

  summary?: string

  faq?: {
    q: string
    a: string
  }[]

  seo?: {
    title?: string
    description?: string
  }

  links?: any
  breadcrumbs?: any
  internal_links?: any
  schema?: any
}