import clientPromise from '../../lib/db'

export default async function search(req, res) {
  const client = await clientPromise
  const db = client.db('farcaster')
  const collection = db.collection('profiles')

  const { connected_address, username } = req.query
  let profiles = []

  if (connected_address) {
    profiles = collection.find({
      connectedAddress: connected_address,
    })
  } else if (username) {
    profiles = collection.find({
      username: username,
    })
  } else {
    return res.status(400).json({
      error: 'Missing connected_address or username',
    })
  }

  profiles = await profiles.toArray()
  profiles = profiles.map((profile) => {
    delete profile._id
    return profile
  })

  return res.json(profiles)
}
