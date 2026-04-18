import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LocaleProvider } from '@/components/locale-context'

import { guides, brands, models } from '@/lib/data'
import type { Metadata } from 'next'

// =====================
// TYPES
// =====================
type Guide = typeof guides[number]
type Brand = typeof brands[number]
type Model = typeof models[number]

interface GuidePageProps {
  params: { slug: string }
}

// =====================
// SEO META
// =====================
export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {

  const guide = guides.find((g: Guide) => g.slug === params.slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | Autoaxia'
    }
  }

  const url = `https://autaxia.com/guides/${guide.slug}`

  return {
    title: `${guide.title} | Autoaxia`,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: 'Autoaxia',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description
    }
  }
}

// =====================
// STATIC PARAMS
// =====================
export async function generateStaticParams() {
  return guides.map((g: Guide) => ({
    slug: g.slug
  }))
}

// =====================
// CONTENT BASE
// =====================
const defaultContent = {
  sections: [
    {
      title: 'Overview',
      content:
        'This guide provides real-world insights into reliability, ownership costs, maintenance and common issues.'
    },
    {
      title: 'What matters most',
      content:
        'Focus on reliability, maintenance cost, insurance impact and long-term value.'
    },
    {
      title: 'Recommendations',
      content:
        'We highlight the best options based on real ownership data and performance.'
    }
  ]
}

// =====================
// COMPONENT
// =====================
function GuideDetailPage({
  guide,
  relatedGuides
}: {
  guide: Guide
  relatedGuides: Guide[]
}) {

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

  // =====================
  // FEATURED CARS
  // =====================
  const featuredCars = (guide.featuredCars || [])
    .map((id: number) => {

      const model = models.find((m: Model) => m.id === String(id))
      if (!model) return null

      const brand = brands.find((b: Brand) => b.id === model.brand_id)
      if (!brand) return null

      return { model, brand }

    })
    .filter(Boolean) as {
      model: Model
      brand: Brand
    }[]

  return (
    <div className="min-h-screen bg-background">

      <main className="py-10">
        <article className="mx-auto max-w-4xl px-4">

          {/* BREADCRUMB */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/guides">Guides</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{guide.title}</span>
          </nav>

          {/* HERO HEADER (🔥 IMPORTANTE) */}
          <header className="mb-10">

            <h1 className="text-3xl md:text-5xl font-bold">
              {guide.title}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {guide.description}
            </p>

            <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(guide.publishedAt)}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                5 min read
              </span>
            </div>

          </header>

          {/* CONTENT */}
          <div className="space-y-8">
            {defaultContent.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  {section.title}
                </h2>
                <p className="text-muted-foreground">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          {/* SEO LINKS */}
          <div className="mt-10 text-sm text-gray-400">
            Discover the{' '}
            <Link href="/best-cars/reliable" className="text-orange-400">
              most reliable cars
            </Link>{' '}
            or compare vehicles using our{' '}
            <Link href="/compare" className="text-orange-400">
              compare tool
            </Link>.
          </div>

          {/* FEATURED */}
          {featuredCars.length > 0 && (
            <section className="mt-12 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">
                Featured Cars
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {featuredCars.map((car) => (
                  <Link
                    key={car.model.id}
                    href={`/cars/${car.brand.slug}/${car.model.slug}`}
                  >
                    <Card className="p-4 hover:border-orange-400 transition">
                      <h3>
                        {car.brand.name} {car.model.name}
                      </h3>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* RELATED */}
          {relatedGuides.length > 0 && (
            <section className="mt-12 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">
                Related Guides
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {relatedGuides.map((g) => (
                  <Link key={g.id} href={`/guides/${g.slug}`}>
                    <Card className="p-4 hover:border-orange-400 transition">
                      <h3>{g.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {g.description}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* NAV */}
          <div className="mt-12 flex justify-between">
            <Link href="/guides">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Guides
              </Button>
            </Link>

            <Link href="/compare">
              <Button>
                Compare Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </article>
      </main>

    </div>
  )
}

// =====================
// PAGE
// =====================
export default function Page({ params }: GuidePageProps) {

  const guide = guides.find((g: Guide) => g.slug === params.slug)
  if (!guide) return notFound()

  const relatedGuides =
    guides
      .filter((g: Guide) =>
        g.id !== guide.id &&
        g.category === guide.category
      )
      .slice(0, 2)

  return (
    <LocaleProvider>
      <GuideDetailPage
        guide={guide}
        relatedGuides={relatedGuides}
      />
    </LocaleProvider>
  )
}