import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { pages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import CarPageUI from '@/components/car-page-ui'

// =====================
// SEO METADATA
// =====================
export async function generateMetadata({ params }: any) {
  const { brand, model, year, type } = params

  const base = `${brand} ${model} ${year}`

  const map: any = {
    problems: {
      title: `${base} Problems (Full Guide + Costs + Fixes)`,
      description: `Real ${base} problems, common faults, repair costs and what to check before buying.`
    },
    maintenance: {
      title: `${base} Maintenance Schedule & Costs`,
      description: `Complete maintenance guide for ${base}: intervals and service costs.`
    },
    ownership: {
      title: `${base} Ownership Costs & Reliability`,
      description: `Fuel, maintenance and ownership insights for ${base}.`
    },
    insurance: {
      title: `${base} Insurance Cost Guide`,
      description: `Insurance costs and tips for ${base}.`
    },
    tires: {
      title: `${base} Tire Sizes & Recommendations`,
      description: `Correct tire sizes for ${base}.`
    },
    'before-buy': {
      title: `${base} Buying Guide (What to Check)`,
      description: `Checklist before buying ${base}.`
    }
  }

  const meta = map[type] || {
    title: `${base} Specs & Guide`,
    description: `Full guide about ${base}`
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://tudominio.com/cars/${brand}/${model}/${year}/${type}`
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://tudominio.com/cars/${brand}/${model}/${year}/${type}`,
      type: 'article'
    }
  }
}

// =====================
// PAGE
// =====================
export default async function Page({ params }: any) {
  const { brand, model, year, type } = params

  const res = await db
    .select()
    .from(pages)
    .where(
      and(
        eq(pages.brand_slug, brand),
        eq(pages.model_slug, model),
        eq(pages.year, Number(year)),
        eq(pages.type, type)
      )
    )
    .limit(1)

  const page = res[0]

  if (!page) return notFound()

  const content = (page.content || {}) as any

  // =====================
  // SAFE DATA
  // =====================
  const safe = {
    brand: {
      name: brand,
      slug: brand
    },
    model: {
      name: model,
      slug: model
    },
    year: Number(year),

    engines: content.engines || [],
    maintenance: content.maintenance || [],
    problems: content.problems || [],
    ownership: content.ownership || [],
    insurance: content.insurance || [],
    tires: content.tires || [],
    beforeBuy: content.beforeBuy || [],
    links: content.links || []
  }

  // =====================
  // STRUCTURED DATA
  // =====================
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${brand} ${model} ${year} ${type}`,
    description: `Guide about ${brand} ${model} ${year}`,
    author: {
      "@type": "Organization",
      name: "CarBase"
    }
  }

  return (
    <>
      {/* 🔥 STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      {/* 🔥 UI */}
      <CarPageUI {...safe} />
    </>
  )
}