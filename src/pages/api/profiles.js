import { ethers } from 'ethers'
import supabase from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export async function searchProfiles(query) {
  let { address, bio, connected_address, username, q } = query
  let profiles = []

  if (address) {
    profiles = await supabase
      .from('profiles')
      .select()
      .ilike('address', address)
  } else if (q) {
    profiles = await supabase
      .from('profiles')
      .select('*')
      .or(
        `username.ilike.%${q}%, bio.ilike.%${q}%, author_display_name.ilike.%${q}%`
      )
      .order('followers', { ascending: false })
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
      return {
        error: 'Invalid connected_address',
      }
    }

    profiles = await supabase
      .rpc('get_profile_by_address', { connected_address })
      .select('*')
  } else if (username) {
    profiles = await supabase.from('profiles').select('*').match({ username })
  } else {
    return {
      error: 'Missing address, bio, connected_address, or username parameter',
    }
  }

  if (profiles.error) {
    throw profiles.error
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
        registeredAt: new Date(p.registered_at).getTime(),
      },
      connectedAddress: connected_address,
    }
  })

  return formattedProfiles
}

export default async function handler(req, res) {
  try {
    res.json(await searchProfiles(req.query))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
