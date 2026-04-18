import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  real
} from 'drizzle-orm/pg-core'

/* =========================
   BRANDS
========================= */
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique()
})

/* =========================
   MODELS
========================= */
export const models = pgTable('models', {
  id: uuid('id').primaryKey().defaultRandom(),
  brand_id: uuid('brand_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull()
})

/* =========================
   YEARS
========================= */
export const years = pgTable('years', {
  id: uuid('id').primaryKey().defaultRandom(),
  model_id: uuid('model_id').notNull(),
  year: integer('year').notNull()
})

/* =========================
   ENGINES (🔥 PRO FIX)
========================= */
export const engines = pgTable('engines', {
  id: uuid('id').primaryKey().defaultRandom(),

  // 🔥 CLAVE: usar uuid igual que models
  model_id: uuid('model_id').notNull(),
  year_id: uuid('year_id'), // puedes poner .notNull() si quieres

name:text('name'),

  power: integer('power'),
  torque: integer('torque'),
  acceleration: real('acceleration'),

  fuel_type: text('fuel_type'),
  transmission: text('transmission')
})

/* =========================
   PAGES (🔥 SEO CORE)
========================= */
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),

  year_id: uuid('year_id').notNull(),

  brand_slug: text('brand_slug').notNull(),
  model_slug: text('model_slug').notNull(),
  year: integer('year').notNull(),

  type: text('type').notNull(),

  title: text('title'),
  description: text('description'),

  content: jsonb('content'),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  locale: text('locale').default('en')
})

/* =========================
   PAGE METRICS
========================= */
export const page_metrics = pgTable('page_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),

  slug: text('slug').notNull(),
  locale: text('locale').default('en'),

  views: integer('views').default(0),
  impressions: integer('impressions').default(0),
  ctr: integer('ctr').default(0),
  cta_clicks: integer('cta_clicks').default(0),

  created_at: timestamp('created_at').defaultNow()
})