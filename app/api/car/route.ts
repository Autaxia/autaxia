import { NextResponse } from 'next/server'
import { getOrCreateCar } from '@/lib/data/get-or-create-car'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const brand = searchParams.get('brand')
  const model = searchParams.get('model')
  const year = Number(searchParams.get('year'))

  if (!brand || !model || !year) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const data = await getOrCreateCar(brand, model, year)

  return NextResponse.json(data)
}