import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { V2ApiResponse } from '../../../../lib/types'
import { db } from '../../../../lib/kysely'
import { SelectQueryBuilder, sql } from 'kysely'
import { Tables } from '../../../../lib/db.types'

const schema = z.object({
  fid: z.coerce.number().optional(),
  username: z.string().optional(),
})

export async function GET(req: NextRequest): Promise<V2ApiResponse<any>> {
  const searchParams = new URL(req.url).searchParams
  const params = Object.fromEntries(searchParams.entries())
  const safeParse = schema.safeParse(params)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 })
  }

  const { fid, username } = schema.parse(safeParse.data)
  let fidToQuery: number | undefined = fid

  if (!fid && !username) {
    return NextResponse.json(
      { error: 'Missing fid or username' },
      { status: 400 }
    )
  }

  if (!fid) {
    fidToQuery = await db
      .selectFrom('userData')
      .select('fid')
      .where('type', '=', 6)
      .where('value', '=', `${username}`)
      .executeTakeFirst()
      .then((res) => res?.fid)
  }

  if (!fidToQuery) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = await db
    .selectFrom('userData')
    .where('fid', '=', fidToQuery)
    .select('fid')
    .select(sql<string>`MAX(CASE WHEN TYPE = 1 THEN value END)`.as('pfp'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 2 THEN value END)`.as('display'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 3 THEN value END)`.as('bio'))
    .select(sql<string>`MAX(CASE WHEN TYPE = 6 THEN value END)`.as('username'))
    .groupBy('fid')
    .executeTakeFirst()

  return NextResponse.json({ data })
}
