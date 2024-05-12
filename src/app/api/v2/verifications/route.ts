import { z } from 'zod'
import { toHex } from 'viem/utils'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '../../../../lib/kysely'
import { V2ApiResponse } from '../../../../lib/types'

const schema = z.object({
  fids: z.array(z.number()).max(100),
})

interface Verification {
  fid?: number
  address: string
  timestamp: number
}

type CombinedVerification = {
  fid: number
  verifications: Verification[]
}

export async function POST(req: NextRequest): Promise<
  // Return both `data` and `result` to preserve backwards compatibility
  V2ApiResponse<CombinedVerification[]> & { result?: CombinedVerification[] }
> {
  const body = await req.json()
  const safeParse = schema.safeParse(body)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const { fids } = schema.parse(body)

  const verifications = await db
    .selectFrom('verifications')
    .select(['fid', 'signerAddress', 'timestamp'])
    .where('fid', 'in', fids)
    .where('deletedAt', 'is', null)
    .execute()

  const groupedVerifications: CombinedVerification[] = verifications.reduce(
    (acc, curr) => {
      const { fid, signerAddress, timestamp: date } = curr
      const existing = acc.find((v: any) => v.fid === fid)

      const address = toHex(signerAddress)
      const timestamp = date.getTime()

      if (existing) {
        existing.verifications.push({ address, timestamp })
      } else {
        acc.push({ fid, verifications: [{ address, timestamp }] })
      }
      return acc
    },
    [] as CombinedVerification[]
  )

  return NextResponse.json({
    data: groupedVerifications,
    result: groupedVerifications,
  })
}
