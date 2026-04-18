import Link from 'next/link'
import type { Brand } from '@/lib/db/queries'

type Props = {
  brand: Brand
}

export function BrandCard({ brand }: Props) {
  return (
    <Link
      href={`/cars/${brand.slug}`}
      className="group block rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-orange-500 hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors">
            {brand.name}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Explore models
          </p>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 group-hover:text-orange-400 transition">
          →
        </div>

      </div>
    </Link>
  )
}