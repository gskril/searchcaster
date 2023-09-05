import { ethers } from 'ethers'
import { getClientIp } from 'request-ip'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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
    // if q is a valid ETH address, search by address
    if (q.startsWith('0x') && q.length === 42) {
      profiles = await supabase
        .rpc('get_profile_by_address', { connected_address: q })
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

// Create a new ratelimiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '5 s'),
  analytics: true,
  prefix: 'api/profile',
})

const RATE_LIMITED_IP_ADDRESSES = process.env.RATE_LIMITED_IP_ADDRESSES || '[]'
const rateLimitedIpAddresses = JSON.parse(RATE_LIMITED_IP_ADDRESSES)

export default async function handler(req, res) {
  try {
    const identifier = getClientIp(req)

    // Rate limit requests from IP addresses that have been flagged for abuse
    if (rateLimitedIpAddresses.includes(identifier)) {
      const limit = await ratelimit.limit(identifier)

      if (!limit.success) {
        return res.status(429).json({
          error: 'Too many requests',
          ...limit,
        })
      }
    }

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=300')
    res.json(await searchProfiles(req.query))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
