import { NextResponse } from 'next/server'
import { searchProfiles } from '../../../handlers/search-profiles'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const profiles = await searchProfiles({ username: 'greg' })

    return NextResponse.json(profiles)
  } catch (err: any) {
    return new Response(err, { status: 500 })
  }
}
