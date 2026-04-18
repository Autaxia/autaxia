import './globals.css'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { CompareProvider } from '@/components/compare-context'

// ======================
// SEO GLOBAL
// ======================
export const metadata = {
  title: 'Autaxia - Real Car Costs, Problems & Insights',
  description:
    'Discover real car problems, maintenance costs and ownership insights for thousands of vehicles.',
}

// ======================
// LAYOUT
// ======================
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#020203] text-white">

        <CompareProvider>

          {/* ====================== */}
          {/* HEADER */}
          {/* ====================== */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020203]/80 backdrop-blur">
            <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">

              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-300 flex items-center justify-center text-black font-bold text-lg">
                  A
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold">
                    <span className="text-white">Aut</span>
                    <span className="text-orange-400">axia</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Real car costs & insights
                  </span>
                </div>
              </Link>

              {/* NAV */}
              <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/brands" className="hover:text-white transition">Brands</Link>
                <Link href="/compare" className="hover:text-white transition">Compare</Link>
              </nav>

            </div>
          </header>

          {/* ====================== */}
          {/* MAIN */}
          {/* ====================== */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* ====================== */}
          {/* FOOTER */}
<footer className="border-t border-white/10 mt-20 bg-[#020203]">
  <div className="max-w-7xl mx-auto px-5 md:px-6 py-12">

    {/* TOP */}
    <div className="flex flex-col md:flex-row justify-between gap-10">

      {/* BRAND */}
      <div className="max-w-xs">
        <p className="text-white font-semibold text-sm">
          Autaxia
        </p>

        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Real car problems, maintenance costs and ownership insights for thousands of vehicles.
        </p>
      </div>

      {/* LINKS */}
      <div className="flex flex-col md:flex-row gap-10 text-sm">

        {/* NAV */}
        <div className="flex flex-col gap-2 text-gray-400">
          <p className="text-white text-xs mb-2">Explore</p>

          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/brands" className="hover:text-white transition">Brands</Link>
          <Link href="/compare" className="hover:text-white transition">Compare</Link>
          <Link href="/guides" className="hover:text-white transition">Guides</Link>
        </div>

        {/* LEGAL */}
        <div className="flex flex-col gap-2 text-gray-400">
          <p className="text-white text-xs mb-2">Company</p>

          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-2 text-gray-400 max-w-[200px]">
          <p className="text-white text-xs mb-2">Contact</p>

          <p className="text-xs text-gray-500 leading-relaxed">
            Questions, data issues or partnerships.
          </p>

          <a
            href="mailto:contact@autaxia.com"
            className="text-orange-400 text-xs font-semibold hover:underline mt-1"
          >
            contact@autaxia.com
          </a>
        </div>

      </div>

    </div>

    {/* BOTTOM */}
    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">

      <p>
        ©️ {new Date().getFullYear()} Autaxia. All rights reserved.
      </p>

      <div className="flex items-center gap-4">
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <span className="opacity-30">•</span>
        <Link href="/terms" className="hover:text-white">Terms</Link>
        <span className="opacity-30">•</span>
        <Link href="/contact" className="hover:text-white">Contact</Link>
      </div>

    </div>

  </div>
</footer>

        </CompareProvider>

      </body>
    </html>
  )
}