import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getBrandBySlug,
  getModelsByBrand
} from '@/lib/db/queries'

import ModelCard from '@/components/model-card'

type Props = {
  params: Promise<{
    brand: string
  }>
}

export default async function BrandPage({ params }: Props) {

  // 🔥 NEXT 15 FIX
  const { brand } = await params

  // 🔒 VALIDACIÓN
  if (!brand || typeof brand !== 'string') {
    console.log('❌ INVALID PARAM:', brand)
    return notFound()
  }

  // 🔥 NORMALIZACIÓN PRO
  const brandSlugSafe = brand
    .split(',')[0]
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()

  console.log('🔥 BRAND SLUG FINAL:', brandSlugSafe)

  // 🔥 DB
  const brandData = await getBrandBySlug(brandSlugSafe)

  if (!brandData) {
    console.log('❌ BRAND NOT FOUND:', brandSlugSafe)
    return notFound()
  }

  // 🔥 MODELS
  const models = await getModelsByBrand(brandData.id)

  // 🔥 ORDEN
  const sortedModels = (models || []).sort((a: any, b: any) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className="min-h-screen bg-[#020203] text-white relative overflow-hidden">

      {/* 🔥 GLOW */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,115,0,0.10),transparent),radial-gradient(700px_400px_at_90%_0%,rgba(255,115,0,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* 🔥 BACK TO BRANDS */}
        <Link
          href="/cars"
          className="
            inline-flex items-center gap-2
            text-sm
            text-gray-400
            hover:text-orange-400
            transition
          "
        >
          ← Back to brands
        </Link>

        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {brandData.name}
          </h1>

          <p className="text-gray-400 mt-2">
            Select a model
          </p>
        </div>

        {/* 🔥 MODELS GRID */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">

          {sortedModels.length > 0 ? (
            sortedModels.map((model: any) => (
              <ModelCard
                key={model.id}
                model={model}
                brand={brandData}
              />
            ))
          ) : (
            <div className="col-span-full text-center space-y-4">
              <p className="text-gray-400">
                No models available for this brand.
              </p>

              <Link
                href="/cars"
                className="
                  inline-block
                  px-6 py-3
                  rounded-xl
                  bg-orange-500/10
                  border border-orange-400/30
                  text-orange-400
                  hover:bg-orange-500/20
                  transition
                "
              >
                Browse other brands
              </Link>
            </div>
          )}

        </div>

        {/* ===================================== */}
        {/* 🔥 INTERNAL LINKS SEO (CLAVE SEO REAL) */}
        {/* ===================================== */}
        <div className="pt-8">
          <h3 className="text-lg font-semibold mb-3">
            Explore more
          </h3>

          <div className="flex gap-4 flex-wrap text-sm">

            <Link
              href="/compare"
              className="text-orange-400 hover:underline"
            >
              Compare cars
            </Link>

            <Link
              href="/best-cars/reliable"
              className="text-orange-400 hover:underline"
            >
              Most reliable cars
            </Link>

            <Link
              href="/best-cars/low-maintenance"
              className="text-orange-400 hover:underline"
            >
              Low maintenance cars
            </Link>

            <Link
              href="/best-cars/few-problems"
              className="text-orange-400 hover:underline"
            >
              Cars with fewer problems
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}