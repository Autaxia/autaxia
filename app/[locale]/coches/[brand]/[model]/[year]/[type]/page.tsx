import { typeFromES } from '@/lib/type-map'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { pages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import CarPageUI from '@/components/car-page-ui'

// =====================
// TYPE MAP (ES → EN)
// =====================
const typeMap: any = {
  problemas: 'problems',
  mantenimiento: 'maintenance',
  propiedad: 'ownership',
  seguro: 'insurance',
  neumaticos: 'tires',
  'antes-de-comprar': 'before-buy'
}

// =====================
// SEO METADATA
// =====================
export async function generateMetadata({ params }: any) {
  const { locale = 'en', brand, model, year, type } = params

  const base = `${brand} ${model} ${year}`
  const isES = locale === 'es'

  const metaMap: any = {
    problems: {
      en: {
        title: `${base} Problems (Full Guide + Costs + Fixes)`,
        description: `Real ${base} problems, common faults, repair costs and what to check before buying.`
      },
      es: {
        title: `${base} Problemas (Guía Completa + Costes)`,
        description: `Problemas reales del ${base}, fallos comunes y costes de reparación.`
      }
    },
    maintenance: {
      en: {
        title: `${base} Maintenance Schedule & Costs`,
        description: `Complete maintenance guide for ${base}.`
      },
      es: {
        title: `${base} Mantenimiento y Costes`,
        description: `Guía completa de mantenimiento del ${base}.`
      }
    },
    ownership: {
      en: {
        title: `${base} Ownership Costs & Reliability`,
        description: `Ownership and reliability of ${base}.`
      },
      es: {
        title: `${base} Coste de Uso y Fiabilidad`,
        description: `Costes de uso y fiabilidad del ${base}.`
      }
    }
  }

  const dbType = isES ? typeMap[type] : type

  const meta =
    metaMap[dbType]?.[locale] || {
      title: base,
      description: base
    }

  const basePath = `/cars/${brand}/${model}/${year}/${dbType}`
  const esPath = `/es/coches/${brand}/${model}/${year}/${type}`

  return {
    title: meta.title,
    description: meta.description,

    alternates: {
      canonical: isES
        ? `https://autaxia.com${esPath}`
        : `https://autaxia.com${basePath}`,
      languages: {
        en: basePath,
        es: esPath
      }
    },

    openGraph: {
      title: meta.title,
      description: meta.description,
      url: isES
        ? `https://autaxia.com${esPath}`
        : `https://autaxia.com${basePath}`,
      type: 'article'
    }
  }
}

// =====================
// PAGE
// =====================
export default async function Page({ params }: any) {
  const { locale = 'en', brand, model, year, type } = params

  const dbType = locale === 'es'
  ? typeFromES[type] || type
  : type

  const res = await db
    .select()
    .from(pages)
    .where(
      and(
        eq(pages.brand_slug, brand),
        eq(pages.model_slug, model),
        eq(pages.year, Number(year)),
        eq(pages.type, dbType),
        eq(pages.locale, locale)
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
    links: content.links || [],

    locale // 🔥 clave
  }

  // =====================
  // STRUCTURED DATA
  // =====================
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${brand} ${model} ${year} ${type}`,
    description:
      locale === 'es'
        ? `Guía del ${brand} ${model} ${year}`
        : `Guide about ${brand} ${model} ${year}`,
    inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
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