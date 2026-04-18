'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* 🔥 LOGO */}
        <Link href="/" className="flex items-center gap-3 group">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-md group-hover:scale-105 transition">
            🚗
          </div>

          <span className="text-xl font-semibold tracking-tight">
            Auto<span className="text-orange-400">axia</span>
          </span>

        </Link>

        {/* 🔥 NAV PRO */}
        <nav className="flex items-center gap-6 md:gap-8 text-sm text-gray-400">

          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/brands" className="hover:text-white transition">
            Brands
          </Link>

          <Link href="/models" className="hover:text-white transition">
            Models
          </Link>

          <Link href="/problems" className="hover:text-white transition">
            Problems
          </Link>

          <Link href="/compare" className="hover:text-white transition">
            Compare
          </Link>

          <Link href="/guides" className="hover:text-white transition">
            Guides
          </Link>

          {/* 🔥 NUEVO → PÁGINAS DE TRÁFICO */}
          <Link
            href="/best-cars/reliable"
            className="text-orange-400 hover:text-orange-300 transition font-medium"
          >
            Best Cars
          </Link>

        </nav>

      </div>

    </header>
  )
}