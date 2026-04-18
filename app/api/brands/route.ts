import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}