import supabase from '../lib/db'
import { formatCasts } from '../utils/cast'

export async function searchCasts(query: {
  [key: string]: number | string | undefined | null
}) {
  const startTime = Date.now()

  let {
    after,
    before,
    count,
    engagement: _engagement,
    media,
    merkleRoot,
    order,
    page,
    text,
    username: _username,
    regex,
  } = query

  const engagement = _engagement as string | undefined | null
  const username = _username as string | undefined | null

  const orderAscending = order === 'asc' ? true : false
  let casts: any = []
  count = Math.min(parseInt(count as string), 200) || 25
  page = parseInt(page as string) || 1
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
        `hash.eq.${merkleRoot},parent_hash.eq.${merkleRoot},hash_v1.eq.${merkleRoot},parent_hash_v1.eq.${merkleRoot}`
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
      .rpc('casts_regex_by_user', { regex, username: username || null })
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
    const searchTerms = textQuery
      .trim()
      .replace(/:/g, '\\:') // escape colons with backslash since they're special characters in full text search (':' -> '\:')
      .split(/\s+/) // split query by any whitespace characters
      .join(' & ')

    if (!searchTerms) {
      casts = await supabase
        .from('casts')
        .select('*')
        .ilike('author_username', username ? username : '%')
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
    } else {
      casts = await supabase
        .from('casts')
        .select('*')
        .ilike('author_username', username ? username : '%')
        .textSearch('fts', searchTerms, {
          type: 'phrase',
          config: 'english',
        })
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
