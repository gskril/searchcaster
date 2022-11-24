import { ethers } from 'ethers'
import supabase from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export default async function search(req, res) {
  let { address, bio, connected_address, username } = req.query
  let profiles = []

  if (address) {
    profiles = await supabase
      .from('profiles')
      .select()
      .ilike('address', address)
  } else if (bio) {
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

    profiles = await supabase
      .from('profiles')
      .select('*')
      .ilike('connected_address', connected_address)
  } else if (username) {
    profiles = await supabase.from('profiles').select('*').match({ username })
  } else {
    return res.status(400).json({
      error: 'Missing address, bio, connected_address, or username parameter',
    })
  }

  const formattedProfiles = profiles.data.map((p) => {
    return {
      body: {
        id: p.id,
        address: p.address,
        username: p.username,
        displayName: p.display_name,
        bio: p.bio,
        followers: p.followers,
        following: p.following,
        avatarUrl: p.avatar_url,
        isVerifiedAvatar: p.avatar_verified,
        proofUrl: `https://api.farcaster.xyz/v1/verified_addresses/${p.address}`,
        registeredAt: new Date(p.registered_at).getTime(),
        version: p.version,
      },
      connectedAddress: p.connected_address,
    }
  })

  return res.json(formattedProfiles)
}
