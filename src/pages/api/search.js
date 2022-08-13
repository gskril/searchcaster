import clientPromise from '../../lib/db'
import { formatCasts } from '../../utils/cast'

export async function searchCasts(query) {
  const startTime = Date.now()
  const client = await clientPromise
  const db = client.db('farcaster')
  const collection = db.collection('casts')

  let {
    after,
    before,
    count,
    engagement,
    media,
    merkleRoot,
    page,
    text,
    username,
    regex,
  } = query

  let casts = []
  count = Math.min(parseInt(count), 50) || 25
  page = parseInt(page) || 1
  const offset = (page - 1) * count
  const textQuery = text ? text.toString() : ''
  after = Number(after) || 0
  before = Number(before) || new Date().getTime()

  if (merkleRoot) {
    casts = collection.find({
      $or: [
        { merkleRoot: merkleRoot },
        { 'body.data.replyParentMerkleRoot': merkleRoot },
      ],
    })
  } else if (media) {
    if (media === 'image') {
      casts = collection.find({
        'body.data.text': { $regex: /i.imgur.com/ },
      })
    } else if (media === 'music') {
      casts = collection.find({
        'body.data.text': {
          $regex: /(open.spotify.com|soundcloud.com|music.apple.com|tidal.com)/,
        },
      })
    } else if (media === 'youtube') {
      casts = collection.find({
        'body.data.text': {
          $regex: /(youtube.com|youtu.be)/,
        },
      })
    } else if (media === 'url') {
      casts = collection.find({
        $and: [
          { 'body.data.text': { $regex: /(http:\/\/|https:\/\/)/ } },
          { 'body.data.text': { $regex: /(.com|.xyz)/ } },
          { 'body.data.text': { $not: /i.imgur.com/ } },
        ],
      })
    }
  } else if (username) {
    if (text) {
      casts = collection.find({
        $and: [
          { 'body.username': username.toLowerCase() },
          {
            'body.data.text': {
              $regex: textQuery,
              $options: 'i',
            },
          },
          {
            'body.data.text': {
              $not: {
                $regex: '^(delete:farcaster://|recast:farcaster://)',
              },
            },
          },
          // make sure that cast.body.publishedAt is after 'after' and before 'before'
          {
            'body.publishedAt': {
              $gte: after,
              $lte: before,
            },
          },
        ],
      })
    } else {
      casts = collection.find({
        $and: [
          { 'body.username': username.toLowerCase() },
          {
            'body.data.text': {
              $not: {
                $regex: '^(delete:farcaster://|recast:farcaster://)',
              },
            },
          },
          // make sure that cast.body.publishedAt is after 'after' and before 'before'
          {
            'body.publishedAt': {
              $gte: after,
              $lte: before,
            },
          },
        ],
      })
    }
  } else if (regex) {
    casts = collection.find({
      // regex for a string that starts with gm or gn
      $and: [
        {
          'body.data.text': {
            $regex: regex,
          },
        },
        {
          'body.data.text': {
            $not: {
              $regex: '^(delete:farcaster://|recast:farcaster://)',
            },
          },
        },
      ]
    })
  } else {
    casts = collection.find({
      $and: [
        {
          'body.data.text': {
            $regex: textQuery,
            $options: 'i',
          },
        },
        {
          'body.data.text': {
            $not: {
              $regex: '^(delete:farcaster://|recast:farcaster://)',
            },
          },
        },
        // make sure that cast.body.publishedAt is after 'after' and before 'before'
        {
          'body.publishedAt': {
            $gt: after,
            $lt: before,
          },
        },
      ],
    })
  }

  const filterMethod = engagement
    ? `meta.${engagement}.count`
    : 'body.publishedAt'

  const response = await casts
    .sort({ [filterMethod]: -1 })
    .limit(count)
    .skip(offset)
    .toArray()

  // Restructure data
  const formattedResponse = formatCasts(response)

  const endTime = Date.now()
  const elapsedTime = endTime - startTime

  return {
    casts: formattedResponse,
    meta: {
      count: formattedResponse.length,
      responseTime: elapsedTime,
    },
  }
}

export default async function handler(req, res) {
  try {
    res.json(await searchCasts(req.query))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
