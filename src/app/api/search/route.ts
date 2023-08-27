import { NextResponse } from 'next/server'
import { searchCasts } from '../../../handlers/search-casts'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const params = Object.fromEntries(searchParams.entries())

  try {
    const casts = await searchCasts(params)
    return NextResponse.json(casts)
  } catch (err: any) {
    return new Response(err, { status: 500 })
  }
}
