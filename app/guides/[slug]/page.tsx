import { articles } from '@/lib/blog/articles'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return articles.map(a => ({
    slug: a.slug
  }))
}

export function generateMetadata({ params }: any) {
  const article = articles.find(a => a.slug === params.slug)

  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt
  }
}

export default function ArticlePage({ params }: any) {
  const article = articles.find(a => a.slug === params.slug)

  if (!article) return notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-white">
      
      <h1 className="text-4xl font-bold mb-6">
        {article.title}
      </h1>

      <p className="text-gray-400 mb-8">
        {article.excerpt}
      </p>

      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

    </main>
  )
}