import { ethers } from 'ethers'
import supabase from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export default async function handler(req, res) {
  const { parent, resolve } = req.query
  let casts = []

  if (parent) {
    casts = await supabase
      .from('casts')
      .select('*')
      .ilike('thread_hash', parent)
      .like('text', '%.eth%')
  } else {
    return res.status(400).json({
      error: 'Missing parent',
    })
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
      ensAddress = await provider.resolveName(ens)
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

  return res.json(replies)
}
