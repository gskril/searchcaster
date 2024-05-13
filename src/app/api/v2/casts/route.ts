import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { V2ApiResponse } from '../../../../lib/types'
import { db } from '../../../../lib/kysely'
import { formatCastsV2 } from '../../../../lib/formatters'
import { Hex, hexToBytes } from 'viem'
import { SelectQueryBuilder, sql } from 'kysely'
import { Tables } from '../../../../lib/db.types'

// All filters should have indices in the database
const schema = z.object({
  text: z.string().optional(),
  parentUrl: z.string().optional(),
  // prettier-ignore
  parentHash: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  page: z.coerce.number().min(1).default(1),
})

export async function GET(req: NextRequest): Promise<V2ApiResponse<any>> {
  const searchParams = new URL(req.url).searchParams
  const params = Object.fromEntries(searchParams.entries())
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const {
    text,
    parentUrl,
    parentHash: _parentHash,
    page,
  } = schema.parse(safeParse.data)

  const parentHash = _parentHash as Hex | undefined
  let query: SelectQueryBuilder<Tables, 'casts', {}>

  if (text) {
    query = db
      .selectFrom('casts')
      .where('fts', '@@', sql<string>`to_tsquery(${text})`)
  } else if (parentUrl) {
    query = db.selectFrom('casts').where('parentUrl', '=', parentUrl)
  } else if (parentHash) {
    query = db
      .selectFrom('casts')
      .where('parentHash', '=', hexToBytes(parentHash))
  } else {
    query = db.selectFrom('casts').selectAll()
  }

  const hashes = await query
    .select('hash')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .offset((page - 1) * 100)
    .execute()

  const casts = await db
    .selectFrom('castsEnhanced')
    .selectAll()
    .where(
      'hash',
      'in',
      hashes.map((h) => h.hash)
    )
    .execute()

  // Faster than sorting in SQL
  const sortedCasts = casts.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  return NextResponse.json({ data: formatCastsV2(sortedCasts) })
}
