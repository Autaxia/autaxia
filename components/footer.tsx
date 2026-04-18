'use client'

import Link from 'next/link'
import { Car } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020203]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* LOGO */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-md">
                <Car className="w-5 h-5 text-black" />
              </div>

              <span className="text-xl font-semibold tracking-tight text-white">
                Auto<span className="text-orange-400">axia</span>
              </span>

            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Discover real car problems, reliability insights and ownership costs for thousands of vehicles.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Navigation
            </h3>

            <ul className="space-y-2 text-sm text-gray-400">

              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/brands" className="hover:text-white transition">
                  Brands
                </Link>
              </li>

              <li>
                <Link href="/compare" className="hover:text-white transition">
                  Compare
                </Link>
              </li>

              <li>
                <Link href="/guides" className="hover:text-white transition">
                  Guides
                </Link>
              </li>

            </ul>
          </div>

          {/* SEO LINKS */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Popular Guides
            </h3>

            <ul className="space-y-2 text-sm text-gray-400">

              <li>
                <Link href="/guides/most-reliable-cars" className="hover:text-white transition">
                  Most Reliable Cars
                </Link>
              </li>

              <li>
                <Link href="/guides/cheapest-cars-to-maintain" className="hover:text-white transition">
                  Cheapest Cars to Maintain
                </Link>
              </li>

              <li>
                <Link href="/guides/diesel-vs-petrol" className="hover:text-white transition">
                  Diesel vs Petrol
                </Link>
              </li>

              <li>
                <Link href="/guides/best-first-cars" className="hover:text-white transition">
                  Best First Cars
                </Link>
              </li>

            </ul>
          </div>

          {/* CONTACT */}
<div>
  <h3 className="mb-4 text-sm font-semibold text-white">
    Contact with us
  </h3>

  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
    Have questions, found incorrect data or interested in working together?
  </p>

  <a
    href="mailto:contact@autaxia.com"
    className="inline-block text-orange-400 text-sm font-semibold hover:underline"
  >
    contact@autaxia.com
  </a>

  <div className="mt-4 text-xs text-gray-500 space-y-1">
    <p>• Business & partnerships</p>
    <p>• Report car data issues</p>
    <p>• General inquiries</p>
  </div>
</div>

        </div>

        {/* BOTTOM */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Autaxia. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-gray-500">

            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>

            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>

          </div>

        </div>

      </div>

    </footer>
  )
}