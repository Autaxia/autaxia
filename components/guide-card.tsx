'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Guide } from '@/lib/types'

interface GuideCardProps {
  guide: Guide
  variant?: 'default' | 'featured'
}

const categoryColors: Record<string, string> = {
  'buying-guides': 'bg-blue-500/10 text-blue-400',
  'maintenance': 'bg-green-500/10 text-green-400',
  'guides': 'bg-primary/10 text-primary',
}

export function GuideCard({ guide, variant = 'default' }: GuideCardProps) {
  const formattedDate = new Date(guide.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (variant === 'featured') {
    return (
      <Link href={`/guides/${guide.slug}`}>
        <Card className="group relative h-full overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          <div className="relative p-6 md:p-8">
            <div className="mb-4 flex items-start justify-between">
              <Badge 
                variant="secondary" 
                className={categoryColors[guide.category] || 'bg-secondary text-secondary-foreground'}
              >
                {guide.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors md:text-2xl">
              {guide.title}
            </h3>
            
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed md:text-base">
              {guide.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                5 min read
              </span>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/guides/${guide.slug}`}>
      <Card className="group h-full overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={categoryColors[guide.category] || 'bg-secondary text-secondary-foreground'}
            >
              {guide.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          
          <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {guide.title}
          </h3>
          
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {guide.description}
          </p>
          
          <div className="flex items-center gap-1 text-sm text-primary font-medium">
            Read more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
