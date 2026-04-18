import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { page_metrics } from '@/lib/db/schema'

export async function POST(req: Request) {
  const body = await req.json()

  await db.insert(page_metrics).values({
    slug: body.slug,
    locale: body.locale,
    cta_clicks: 1
  })

  return NextResponse.json({ ok: true })
}