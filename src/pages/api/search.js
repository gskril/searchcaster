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
    order,
    page,
    text,
    username,
    regex,
  } = query

  const orderAscending = order === 'asc' ? true : false
  let casts = []
  count = Math.min(parseInt(count), 200) || 25
  page = parseInt(page) || 1
  const offset = (page - 1) * count
  const upperRange = offset + count - 1
  const textQuery = Array.isArray(text) ? text : (text ? [text] : []);
  after = Number(after) || 0
  before = Number(before) || new Date().getTime()

  if (merkleRoot) {
    casts = await supabase
      .from('casts')
      .select()
      .or(
        `hash.ilike.${merkleRoot},parent_hash.ilike.${merkleRoot},hash_v1.ilike.${merkleRoot},parent_hash_v1.ilike.${merkleRoot}`
      )
      .eq('deleted', false)
      .gt('published_at', new Date(after).toISOString())
      .lt('published_at', new Date(before).toISOString())
      .order('published_at', { ascending: orderAscending })
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
              ? 'reactions_count'
              : engagement === 'replies'
              ? 'replies_count'
              : engagement === 'recasts'
              ? 'recasts_count'
              : engagement === 'watches'
              ? 'watches_count'
              : engagement
            : 'published_at',
          { ascending: orderAscending }
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
              ? 'reactions_count'
              : engagement === 'replies'
              ? 'replies_count'
              : engagement === 'recasts'
              ? 'recasts_count'
              : engagement === 'watches'
              ? 'watches_count'
              : engagement
            : 'published_at',
          { ascending: orderAscending }
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
              ? 'reactions_count'
              : engagement === 'replies'
              ? 'replies_count'
              : engagement === 'recasts'
              ? 'recasts_count'
              : engagement === 'watches'
              ? 'watches_count'
              : engagement
            : 'published_at',
          { ascending: orderAscending }
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
              ? 'reactions_count'
              : engagement === 'replies'
              ? 'replies_count'
              : engagement === 'recasts'
              ? 'recasts_count'
              : engagement === 'watches'
              ? 'watches_count'
              : engagement
            : 'published_at',
          { ascending: orderAscending }
        )
    }
  } else if (regex) {
    casts = await supabase
      .rpc('casts_regex', { regex })
      .range(offset, upperRange)
      .order(
        engagement
          ? engagement === 'reactions'
            ? 'reactions_count'
            : engagement === 'replies'
            ? 'replies_count'
            : engagement === 'recasts'
            ? 'recasts_count'
            : engagement === 'watches'
            ? 'watches_count'
            : engagement
          : 'published_at',
        { ascending: orderAscending }
      )
  } else {
    // if the text query is ['new nft collection', 'mint now'],
    // transform it to '(new & nft & collection) | (mint & now)'
    // to match casts that contain either new, nft, collection OR mint, now
    const phrases = textQuery.map((phrase) => {
      return phrase
        .trim()
        .replace(/:/g, '\\:') // escape colons with backslash since they're special characters in full text search (':' -> '\:')
        .split(/\s+/)  // split query by any whitespace characters
        .join(' & ')
    });
    const searchTerms = phrases.map((p) => `(${p})`).join(" | ");
      
    casts = await supabase
      .from('casts')
      .select('*')
      .ilike('author_username', username ? username : '%')
      .textSearch('fts', searchTerms)
      .eq('deleted', false)
      .gt('published_at', new Date(after).toISOString())
      .lt('published_at', new Date(before).toISOString())
      .range(offset, upperRange)
      .order(
        engagement
          ? engagement === 'reactions'
            ? 'reactions_count'
            : engagement === 'replies'
            ? 'replies_count'
            : engagement === 'recasts'
            ? 'recasts_count'
            : engagement === 'watches'
            ? 'watches_count'
            : engagement
          : 'published_at',
        { ascending: orderAscending }
      )
  }

  if (casts.error) {
    throw new Error(casts.error.message)
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
