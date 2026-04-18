import Link from 'next/link'
import { articles } from '@/lib/blog/articles'

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-white">

      <h1 className="text-4xl font-bold mb-10">
        Car Guides & Articles
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map(article => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-orange-400 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {article.title}
            </h2>

            <p className="text-gray-400 text-sm">
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>

    </main>
  )
}