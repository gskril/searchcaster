import { z } from 'zod'
import type { NextApiRequest, NextApiResponse } from 'next'

import supabase from '../../lib/db'
import { formatCasts } from '../../utils/cast'

const schema = z.object({
  url: z.string().url(),
})

type Response = {
  result?: any[] // TODO: type this to be the output of `formatCasts()`
  error?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const safeParse = schema.safeParse(req.query)

  if (!safeParse.success) {
    res.status(400).json({ error: safeParse.error })
    return
  }

  const { url } = schema.parse(req.query)

  const { data, error } = await supabase.rpc('find_casts_by_url', {
    dynamic_url: url,
  })

  const casts = formatCasts(data)

  if (error) {
    res.status(500).json({ error })
    return
  }

  return res.status(200).json({ result: casts })
}
