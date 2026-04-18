import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { brand, model } = await req.json()

  return NextResponse.json({
    title: `${brand} ${model} specs, performance and best engines`,
    description: `Discover the best engines for the ${brand} ${model}. Compare performance, fuel efficiency and reliability.`,
    content: `
      The ${brand} ${model} is one of the most popular cars in its segment.
      In this guide we explore its engine options, performance and efficiency.
    `
  })
}