'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function CarTabs({ base }: { base: string }) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Specifications', path: '' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Problems', path: '/common-problems' },
    { name: 'Ownership Cost', path: '/ownership-cost' },
    { name: 'Insurance', path: '/insurance' },
    { name: 'Tires', path: '/tires' },
    { name: 'Before You Buy', path: '/before-you-buy' },
  ]

  return (
    <div className="flex gap-6 border-b border-border pb-3">
      {tabs.map((tab) => {
        const href = `${base}${tab.path}`
        const active = pathname === href

        return (
          <Link
            key={tab.name}
            href={href}
            className={`text-sm transition ${
              active
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}