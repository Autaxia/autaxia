import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const brandId = searchParams.get('brandId')

  if (!brandId) return NextResponse.json([])

  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('brand_id', brandId)

  if (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }

  return NextResponse.json(data)
}