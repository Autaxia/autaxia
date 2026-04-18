import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Calendar, Tag, ArrowRight } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LocaleProvider } from '@/components/locale-context'

import { guides } from '@/lib/data'

// =====================
// SEO
// =====================
export const metadata: Metadata = {
  title: 'Car Guides | Autoaxia',
  description:
    'Expert car guides: buying tips, maintenance advice, reliability insights and ownership cost analysis.',
}

// =====================
// PAGE
// =====================
export default function Page() {
  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'buying-guides', label: 'Buying Guides' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'guides', label: 'General' },
  ]

  const featuredGuide = guides?.[0]
  const otherGuides = guides?.slice(1) || []

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.label || category
  }

  return (
    <LocaleProvider>
      <div className="min-h-screen bg-background">

        <main className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* HERO */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Expert Car Guides
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                In-depth articles to help you make smarter decisions about buying, maintaining and owning your car.
              </p>
            </div>

            {/* FILTERS (ready for future logic) */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.id === 'all' ? 'default' : 'outline'}
                  size="sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* FEATURED */}
            {featuredGuide && (
              <Link href={`/guides/${featuredGuide.slug}`} className="block mt-12">
                <Card className="group relative overflow-hidden hover:border-primary/50 transition-all">

                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

                  <div className="relative p-8 sm:p-12 lg:p-16">

                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                        Featured
                      </span>

                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {getCategoryLabel(featuredGuide.category)}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold group-hover:text-primary transition">
                      {featuredGuide.title}
                    </h2>

                    <p className="mt-3 text-muted-foreground max-w-2xl">
                      {featuredGuide.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">

                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredGuide.publishedAt)}
                        </span>

                        {featuredGuide.featuredCars && (
                          <span>{featuredGuide.featuredCars.length} cars</span>
                        )}

                      </div>

                      <span className="text-primary font-medium flex items-center gap-1">
                        Read Guide
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>

                  </div>
                </Card>
              </Link>
            )}

            {/* GRID */}
            {otherGuides.length > 0 && (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherGuides.map((guide) => (
                  <Link key={guide.id} href={`/guides/${guide.slug}`}>
                    <Card className="group h-full p-6 hover:border-primary/50 hover:shadow-lg transition">

                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {getCategoryLabel(guide.category)}
                      </span>

                      <h3 className="text-lg font-semibold mt-3 group-hover:text-primary">
                        {guide.title}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {guide.description}
                      </p>

                      <div className="mt-4 flex justify-between pt-4 border-t border-border text-xs text-muted-foreground">

                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(guide.publishedAt)}
                        </span>

                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                      </div>

                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {guides.length === 0 && (
              <div className="mt-20 text-center text-muted-foreground">
                No guides available yet.
              </div>
            )}

            {/* CTA */}
            <Card className="mt-16 p-8 sm:p-12 text-center">

              <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />

              <h2 className="text-2xl font-bold">
                Stay Updated
              </h2>

              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Get the latest car guides and insights.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 flex-1 rounded-lg border border-border bg-input px-4 text-sm"
                />

                <Button>
                  Subscribe
                </Button>

              </div>

            </Card>

          </div>
        </main>

      </div>
    </LocaleProvider>
  )
}