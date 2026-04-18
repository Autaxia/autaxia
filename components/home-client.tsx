'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Gauge,
  Wrench,
  Shield,
  Calculator,
  GitCompare,
  BookOpen,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { LocaleProvider } from '@/components/locale-context'
import { CarSearch } from '@/components/car-search'
import { BrandCard } from '@/components/brand-card'
import { supabase } from '@/lib/supabase-client'
import { getBrands } from '@/lib/db/queries'
import type { Brand } from '@/lib/db/queries'

// ===============================
// 🚀 HOMEPAGE CLIENT
// ===============================
export default function HomeClient() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrands()
        setBrands(data || [])
      } catch (err) {
        console.error(err)
        setBrands([])
      }
    }

    loadBrands()
  }, [])

  const featuredBrands = brands.slice(0, 8)

  const features = [
    {
      icon: Gauge,
      title: 'Detailed Specifications',
      description: 'Complete technical data and performance.',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      description: 'Service schedules and real costs.',
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Common problems and fixes.',
    },
    {
      icon: Calculator,
      title: 'Ownership Cost',
      description: 'Fuel, insurance and depreciation.',
    },
    {
      icon: GitCompare,
      title: 'Compare Cars',
      description: 'Side-by-side comparison.',
    },
    {
      icon: BookOpen,
      title: 'Guides',
      description: 'Expert buying advice.',
    },
  ]

  return (
    <LocaleProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#0e1424] text-white">

        <main>

          {/* HERO */}
          <section className="border-b border-white/10 py-20 text-center">
            <div className="max-w-4xl mx-auto px-6">

              <h1 className="text-4xl sm:text-5xl font-bold">
                Your Complete{' '}
                <span className="text-orange-500">Car Ownership</span> Guide
              </h1>

              <p className="mt-6 text-gray-400 text-lg">
                Explore specs, maintenance and costs.
              </p>

              <div className="mt-10">
                <CarSearch />
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <Stat value={`${brands.length}+`} label="Brands" />
                <Stat value="500+" label="Models" />
                <Stat value="10K+" label="Configs" />
              </div>

            </div>
          </section>

          {/* FEATURES */}
          <section className="py-20 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6">

              <h2 className="text-3xl font-bold text-center">
                Everything You Need
              </h2>

              <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">

                {features.map((f) => (
                  <Card
                    key={f.title}
                    className="bg-white/5 border-white/10 p-6 hover:border-orange-500 transition"
                  >
                    <f.icon className="h-6 w-6 text-orange-400 mb-4" />
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {f.description}
                    </p>
                  </Card>
                ))}

              </div>

            </div>
          </section>

          {/* BRANDS */}
          <section className="py-20 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6">

              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-bold">
                  Browse by Brand
                </h2>

                <Link
                  href="/brands"
                  className="text-orange-400 flex items-center gap-2"
                >
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredBrands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>

            </div>
          </section>

        </main>

      </div>
    </LocaleProvider>
  )
}

// ===============================
function Stat({ value, label }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <p className="text-2xl font-bold text-orange-400">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  )
}