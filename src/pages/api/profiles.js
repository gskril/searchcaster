import clientPromise from '../../lib/db'

export default async function search(req, res) {
  const client = await clientPromise
  const db = client.db('farcaster')
  const collection = db.collection('profiles')

  let { connected_address, username } = req.query
  let profiles = []

  if (connected_address) {
    // If param isn't an ETH address, check if it's an ENS name
    if (
      connected_address.length !== 42 ||
      connected_address.substring(0, 2) !== '0x'
    ) {
      console.log('checking ensideas')
      connected_address = await fetch(
        `https://api.ensideas.com/ens/resolve/${connected_address}`
      )
        .then((r) => r.json())
        .then((r) => r.address)
    }

    if (!connected_address) {
      return res.status(400).json({
        error: 'Invalid connected_address',
      })
    }

    profiles = collection.find({
      connectedAddress: { $regex: new RegExp(connected_address, 'i') },
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
