import { z } from 'zod'
import type { NextApiRequest, NextApiResponse } from 'next'

import supabase from '../../../lib/db'
import type { CombinedVerification, Verification } from '../../../types'

const schema = z.object({
  fids: z.array(z.number()).max(1000),
})

type Response = {
  result?: CombinedVerification[]
  error?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const safeParse = schema.safeParse(req.body)

  if (!safeParse.success) {
    res.status(400).json({ error: safeParse.error })
    return
  }

  const { fids } = schema.parse(req.body)

  const { data, error } = await supabase
    .from('verification')
    .select('*')
    .in('fid', fids)

  if (error) {
    res.status(500).json({ error })
    return
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

  return res.status(200).json({ result: groupedVerifications })
}
