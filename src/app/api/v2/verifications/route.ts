import { z } from 'zod'
import { NextResponse } from 'next/server'

import supabase from '../../../../lib/db'
import type { CombinedVerification, Verification } from '../../../../types'

const schema = z.object({
  fids: z.array(z.number()).max(1000),
})

export async function POST(req: Request) {
  const safeParse = schema.safeParse(req.body)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const { fids } = schema.parse(req.body)

  const { data, error } = await supabase
    .from('verification')
    .select('*')
    .in('fid', fids)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  const verifications = data.map((v) => {
    return {
      fid: v.fid,
      address: v.address,
      timestamp: new Date(v.created_at).getTime(),
    }
  }) as Verification[]

  const groupedVerifications: CombinedVerification[] = verifications.reduce(
    (acc: any, curr: Verification) => {
      const { fid, address, timestamp } = curr
      const existing = acc.find((v: Verification) => v.fid === fid)

      if (existing) {
        existing.verifications.push({ address, timestamp })
      } else {
        acc.push({ fid, verifications: [{ address, timestamp }] })
      }
      return acc
    },
    [] as CombinedVerification[]
  )

  return NextResponse.json({ result: groupedVerifications })
}
