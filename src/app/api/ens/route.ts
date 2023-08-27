import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import supabase from '../../../lib/db'
import { NextResponse } from 'next/server'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const { parent, resolve } = Object.fromEntries(searchParams.entries())

  let casts: any = []

  if (parent) {
    casts = await supabase
      .from('casts')
      .select('*')
      .ilike('thread_hash', parent)
      .like('text', '%.eth%')
  } else {
    return NextResponse.json(
      {
        error: 'Missing parent',
      },
      {
        status: 400,
      }
    )
  }

  const shouldResolve =
    resolve !== undefined && resolve !== 'false' && resolve !== '0'

  const replies = []
  for (let i = 0; i < casts.data.length; i++) {
    const cast = casts.data[i]

    const regex = /[^\s]+\.+eth/i
    const ens = cast.text.match(regex)
      ? cast.text.match(regex)[0].toLowerCase()
      : null
    let ensAddress

    if (!ens) continue

    if (shouldResolve) {
      ensAddress = await client.getEnsAddress({ name: ens })
    }

    replies.push({
      ens_name: ens,
      ens_address: ensAddress,
      text: cast.text,
      username: cast.username,
      displayName: cast.author_display_name || null,
      merkleRoot: cast.hash,
      replyParentMerkleRoot: cast.parent_hash || null,
      threadMerkleRoot: cast.thread_hash || null,
    })
  }

  return NextResponse.json(replies)
}
