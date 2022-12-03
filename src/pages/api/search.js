import supabase from '../../lib/db'
import { formatCasts } from '../../utils/cast'

export async function searchCasts(query) {
  const startTime = Date.now()

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
  count = Math.min(parseInt(count), 200) || 25
  page = parseInt(page) || 1
  const offset = (page - 1) * count
  const upperRange = offset + count - 1
  const textQuery = text ? text.toString() : ''
  after = Number(after) || 0
  before = Number(before) || new Date().getTime()

  if (merkleRoot) {
    casts = await supabase
      .from('casts')
      .select()
      .or(
        `merkle_root.ilike.${merkleRoot},reply_parent_merkle_root.ilike.${merkleRoot}`
      )
      .eq('deleted', false)
      .gt('published_at', new Date(after).toISOString())
      .lt('published_at', new Date(before).toISOString())
      .order('published_at', { ascending: false })
  } else if (media) {
    if (media === 'image') {
      casts = await supabase
        .from('casts')
        .select()
        .ilike('text', '%https://i.imgur.com/%')
        .eq('deleted', false)
        .gt('published_at', new Date(after).toISOString())
        .lt('published_at', new Date(before).toISOString())
        .range(offset, upperRange)
        .order(
          engagement
            ? engagement === 'reactions'
              ? 'reactions'
              : engagement === 'replies'
              ? 'num_reply_children'
              : engagement
            : 'published_at',
          { ascending: false }
        )
    } else if (media === 'music') {
      casts = await supabase
        .from('casts')
        .select()
        .or(
          'text.ilike.%open.spotify.com%,text.ilike.%soundcloud.com%,text.ilike.%music.apple.com%,text.ilike.%tidal.com%'
        )
        .eq('deleted', false)
        .gt('published_at', new Date(after).toISOString())
        .lt('published_at', new Date(before).toISOString())
        .range(offset, upperRange)
        .order(
          engagement
            ? engagement === 'reactions'
              ? 'reactions'
              : engagement === 'replies'
              ? 'num_reply_children'
              : engagement
            : 'published_at',
          { ascending: false }
        )
    } else if (media === 'youtube') {
      casts = await supabase
        .from('casts')
        .select()
        .or('text.ilike.%youtube.com%,text.ilike.%youtu.be%')
        .eq('deleted', false)
        .gt('published_at', new Date(after).toISOString())
        .lt('published_at', new Date(before).toISOString())
        .range(offset, upperRange)
        .order(
          engagement
            ? engagement === 'reactions'
              ? 'reactions'
              : engagement === 'replies'
              ? 'num_reply_children'
              : engagement
            : 'published_at',
          { ascending: false }
        )
    } else if (media === 'url') {
      casts = await supabase
        .from('casts')
        .select()
        .or('text.ilike.%http://%,text.ilike.%https://%')
        .not('text', 'ilike', '%https://i.imgur.com/%')
        .eq('deleted', false)
        .gt('published_at', new Date(after).toISOString())
        .lt('published_at', new Date(before).toISOString())
        .range(offset, upperRange)
        .order(
          engagement
            ? engagement === 'reactions'
              ? 'reactions'
              : engagement === 'replies'
              ? 'num_reply_children'
              : engagement
            : 'published_at',
          { ascending: false }
        )
    }
  } else if (regex) {
    casts = await supabase
      .rpc('casts_regex', { regex })
      .range(offset, upperRange)
      .order(
        engagement
          ? engagement === 'reactions'
            ? 'reactions'
            : engagement === 'replies'
            ? 'num_reply_children'
            : engagement
          : 'published_at',
        { ascending: false }
      )
  } else {
    casts = await supabase
      .from('casts')
      .select()
      .ilike('username', username ? username : '%')
      .ilike('text', textQuery ? `%${textQuery}%` : '%')
      .eq('deleted', false)
      .gt('published_at', new Date(after).toISOString())
      .lt('published_at', new Date(before).toISOString())
      .range(offset, upperRange)
      .order(
        engagement
          ? engagement === 'reactions'
            ? 'reactions'
            : engagement === 'replies'
            ? 'num_reply_children'
            : engagement
          : 'published_at',
        { ascending: false }
      )
  }

  // Restructure data
  const formattedResponse = formatCasts(casts.data)

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
