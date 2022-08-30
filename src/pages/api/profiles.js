import { ethers } from 'ethers'
import supabase from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export default async function search(req, res) {
  let { bio, connected_address, username } = req.query
  let profiles = []

  if (bio) {
    profiles = await supabase.from('profiles').select().ilike('bio', `%${bio}%`)
  } else if (connected_address) {
    // If param isn't an ETH address, check if it's an ENS name
    if (
      connected_address.length !== 42 ||
      connected_address.substring(0, 2) !== '0x'
    ) {
      connected_address = await provider.resolveName(connected_address)
    }

    if (!connected_address) {
      return res.status(400).json({
        error: 'Invalid connected_address',
      })
    }

    profiles = await supabase.from('profiles').select('*').match({
      connected_address,
    })
  } else if (username) {
    profiles = await supabase.from('profiles').select('*').match({ username })
  } else {
    return res.status(400).json({
      error: 'Missing bio, connected_address, or username',
    })
  }

  const formattedProfiles = profiles.data.map((p) => {
    return {
      body: {
        addressActivityUrl: p.address_activity,
        avatarUrl: p.avatar,
        address: p.address,
        username: p.username,
        displayName: p.display_name,
        bio: p.bio,
        proofUrl: p.proof,
        timestamp: p.timestamp,
        registeredAt: p.registered_at,
        version: p.version,
      },
      merkleRoot: p.merkle_root,
      signature: p.signature,
      index: p.index,
      connectedAddress: p.connected_address,
    }
  })

  return res.json(formattedProfiles)
}
