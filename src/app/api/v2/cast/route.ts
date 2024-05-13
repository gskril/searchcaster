import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { V2ApiResponse } from '../../../../lib/types'
import { db } from '../../../../lib/kysely'
import { Hex, hexToBytes } from 'viem'
import { formatCastV2 } from '../../../../lib/formatters'

const schema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
})

export async function GET(req: NextRequest): Promise<V2ApiResponse<any>> {
  const searchParams = new URL(req.url).searchParams
  const params = Object.fromEntries(searchParams.entries())
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const { hash: _hash } = schema.parse(safeParse.data)
  const hash = _hash as Hex

  const cast = await db
    .selectFrom('castsEnhanced')
    .where('hash', '=', hexToBytes(hash))
    .selectAll()
    .executeTakeFirst()

  if (!cast) {
    return NextResponse.json({ error: 'Cast not found' }, { status: 404 })
  }

  return NextResponse.json({ data: formatCastV2(cast) })
}
