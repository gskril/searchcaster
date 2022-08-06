import { ethers } from 'ethers'
import clientPromise from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('farcaster')
  const collection = db.collection('casts')

  const { parent, resolve } = req.query
  let casts = []

  if (parent) {
    casts = collection.find({
      $and: [
        { 'body.data.text': { $regex: /[^\s]\.+eth/gi } },
        { 'body.data.replyParentMerkleRoot': parent },
      ],
    })
  } else {
    return res.status(400).json({
      error: 'Missing parent',
    })
  }

  const shouldResolve =
    resolve !== undefined && resolve !== 'false' && resolve !== '0'

  const json = await casts.sort({ 'body.publishedAt': -1 }).toArray()

  const replies = json.map(async (cast) => {
    const regex = /[^\s]+\.+eth/i
    const ens = cast.body.data.text.match(regex)[0].toLowerCase()
    let ensAddress

    if (shouldResolve) {
      ensAddress = await provider.resolveName(ens)
    }

    return {
      ens_name: ens,
      ens_address: ensAddress,
      text: cast.body.data.text,
      username: cast.body.username,
      displayName: cast.meta.displayName || null,
      merkleRoot: cast.merkleRoot,
      replyParentMerkleRoot: cast.body.data.replyParentMerkleRoot || null,
    }
  })

  return res.json(await Promise.all(replies))
}
