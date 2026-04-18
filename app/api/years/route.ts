import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const modelId = searchParams.get('modelId')

  if (!modelId) return NextResponse.json([])

  const { data, error } = await supabase
    .from('years')
    .select('*')
    .eq('model_id', modelId)

  if (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }

  return NextResponse.json(data)
}