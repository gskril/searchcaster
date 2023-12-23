import { ethers } from 'ethers'
import supabase from '../../lib/db'

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA_API_KEY
)

export async function searchProfiles(query) {
  let {
    fid,
    address,
    bio,
    connected_address,
    count: _count,
    username,
    q,
  } = query
  let profiles = []
  const count = _count ? parseInt(_count) : 1000

  if (fid) {
    profiles = await supabase
      .from('profile_with_verification')
      .select()
      .eq('id', fid)
  } else if (address) {
    profiles = await supabase
      .from('profile_with_verification')
      .select()
      .ilike('owner', address)
  } else if (q) {
    const isNumber = /^\d+$/.test(q)
    const isPotentialEns = q.endsWith('.eth') && !q.includes(' ')
    const isAddress = ethers.utils.isAddress(q)

    if (isAddress || isPotentialEns) {
      let address = q

      if (isPotentialEns) {
        address = await provider.resolveName(q)
      }

      profiles = await supabase
        .rpc('get_profile_by_address', { connected_address: address })
        .order('followers', { ascending: false })
        .limit(count)
    } else if (q.startsWith('fid:')) {
      profiles = await supabase
        .from('profile_with_verification')
        .select()
        .eq('id', q.split('fid:')[1])
    } else if (isNumber) {
      profiles = await supabase
        .from('profile_with_verification')
        .select('*')
        .or(`id.eq.${q}, username.eq.${q}, bio.ilike.%${q}%`)
        .order('followers', { ascending: false })
        .limit(count)
    } else if (q.startsWith('@')) {
      profiles = await supabase
        .from('profile_with_verification')
        .select('*')
        .or(`username.ilike.%${q.split('@')[1]}%, bio.ilike.%${q}%`)
        .order('followers', { ascending: false })
        .limit(count)
    } else if (q.startsWith('bio:') || q.startsWith('bio: ')) {
      const _bio = q.split('bio:')[1].trim()

      profiles = await supabase
        .from('profile_with_verification')
        .select('*')
        .ilike('bio', `%${_bio}%`)
        .order('followers', { ascending: false })
        .limit(count)
    } else {
      profiles = await supabase
        .from('profile_with_verification')
        .select('*')
        .or(
          `username.ilike.%${q}%, bio.ilike.%${q}%, display_name.ilike.%${q}%`
        )
        .order('followers', { ascending: false })
        .limit(count)
    }
  } else if (bio) {
    profiles = await supabase
      .from('profile_with_verification')
      .select()
      .ilike('bio', `%${bio}%`)
      .order('followers', { ascending: false })
      .limit(count)
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
    profiles = await supabase
      .from('profile_with_verification')
      .select('*')
      .match({ username })
  } else {
    return {
      error:
        'Missing fid, address, bio, connected_address, or username parameter',
    }
  }

  if (profiles.error) {
    throw profiles.error
  }

  const formattedProfiles = profiles.data.map((p) => {
    return {
      body: {
        id: p.id,
        address: p?.owner || null,
        username: p.username,
        displayName: p.display_name,
        bio: p.bio,
        followers: p.followers,
        following: p.following,
        avatarUrl: p.avatar_url,
        isVerifiedAvatar: p.avatar_verified,
        registeredAt: new Date(p.registered_at).getTime(),
      },
      connectedAddress:
        p.verifications && p.verifications[0]
          ? p.verifications[0].address
          : connected_address || null,
      connectedAddresses:
        p.verifications && p.verifications[0]
          ? p.verifications.map((v) => v.address)
          : [],
    }
  })

  return formattedProfiles
}

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=300')
    res.json(await searchProfiles(req.query))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
