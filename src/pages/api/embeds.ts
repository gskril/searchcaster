import { z } from 'zod'
import type { NextApiRequest, NextApiResponse } from 'next'

import supabase from '../../lib/db'
import { formatCasts } from '../../utils/cast'

// TODO: add pagination to this endpoint
const schema = z.object({
  url: z.string().url().optional(),
  domain: z.string().optional(),
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
  let unformattedCasts = new Array()
  const { domain, url } = schema.parse(req.query)

  if (domain) {
    const { data, error } = await supabase
      .rpc('find_casts_by_domain', {
        domain,
      })
      .order('published_at', { ascending: false })
      .limit(100)

    if (error) {
      res.status(500).json({ error })
      return
    }

    unformattedCasts = data
  } else if (url) {
    const { data, error } = await supabase
      .rpc('find_casts_by_url', {
        dynamic_url: url,
      })
      .order('published_at', { ascending: false })
      .limit(100)

    if (error) {
      res.status(500).json({ error })
      return
    }

    unformattedCasts = data
  }

  const casts = formatCasts(unformattedCasts)
  return res.status(200).json({ result: casts })
}
