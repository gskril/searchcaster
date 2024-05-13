import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { V2ApiResponse } from '../../../../lib/types'
import { db } from '../../../../lib/kysely'
import { SelectQueryBuilder, sql } from 'kysely'
import { Tables } from '../../../../lib/db.types'

const schema = z.object({
  q: z.string().optional(),
  display: z.string().optional(),
  username: z.string().optional(),
  description: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
})

export async function GET(req: NextRequest): Promise<V2ApiResponse<any>> {
  const searchParams = new URL(req.url).searchParams
  const params = Object.fromEntries(searchParams.entries())
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const { q, display, username, description, page } = schema.parse(
    safeParse.data
  )

  let query: SelectQueryBuilder<Tables, 'userData', {}>

  if (q) {
    query = db.selectFrom('userData').where('value', 'ilike', `%${q}%`)
  } else if (display) {
    query = db
      .selectFrom('userData')
      .where('type', '=', 2)
      .where('value', 'ilike', `%${display}%`)
  } else if (username) {
    query = db
      .selectFrom('userData')
      .where('type', '=', 6)
      .where('value', 'ilike', `%${username}%`)
  } else if (description) {
    query = db
      .selectFrom('userData')
      .where('type', '=', 3)
      .where('value', 'ilike', `%${description}%`)
  } else {
    query = db.selectFrom('userData')
  }

  const fids = await query
    .select('fid')
    .limit(100)
    .offset((page - 1) * 100)
    .orderBy('fid', 'asc')
    .execute()

  if (!fids.length) {
    return NextResponse.json({ data: [] })
  }

  const data = await db
    .selectFrom('userData')
    .where(
      'fid',
      'in',
      fids.map((f) => f.fid)
    )
    .select('fid')
    .select(sql<string>`MAX(CASE WHEN TYPE = 1 THEN value END)`.as('pfp'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 2 THEN value END)`.as('display'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 3 THEN value END)`.as('bio'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 6 THEN value END)`.as('username'))
    .groupBy('fid')
    .orderBy('fid', 'asc')
    .execute()

  return NextResponse.json({ data })
}
