'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const path = usePathname()

  const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/content', label: 'Content' },
    { href: '/admin/media', label: 'Media' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#020203] text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-6 space-y-6">
        <div className="text-2xl font-bold">
          Auto<span className="text-orange-400">Admin</span>
        </div>

        <nav className="space-y-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`block px-3 py-2 rounded-lg transition ${
                path === n.href
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin Panel</h1>

          <div className="flex gap-4 items-center">
            <button className="px-4 py-2 rounded-lg bg-orange-500 text-black font-semibold">
              + New
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}