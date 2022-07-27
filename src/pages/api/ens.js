import clientPromise from '../../lib/db'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('farcaster')
  const collection = db.collection('casts')

  const { parent } = req.query
  let casts = []

  if (parent) {
    casts = collection.find({
      $and: [
        { 'body.data.text': { $regex: /[^\s]\.+eth/ } },
        { 'body.data.replyParentMerkleRoot': parent },
      ],
    })
  } else {
    return res.status(400).json({
      error: 'Missing parent',
    })
  }

  const json = await casts.sort({ 'body.publishedAt': -1 }).toArray()

  return res.json(
    json.map((cast) => {
      return {
        text: cast.body.data.text,
        username: cast.body.username,
        displayName: cast.meta.displayName || null,
        merkleRoot: cast.merkleRoot,
        replyParentMerkleRoot: cast.body.data.replyParentMerkleRoot || null,
      }
    })
  )
}
