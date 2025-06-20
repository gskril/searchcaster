import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({
    error: 'The Searchcaster API has been deprecated. Try neynar.com instead.',
  })
}
