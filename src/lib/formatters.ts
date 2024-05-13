import { Selectable } from 'kysely'
import { Tables } from './db.types'
import { bytesToHex } from 'viem'

export function formatCastV2(cast: Selectable<Tables['castsEnhanced']>) {
  return {
    hash: bytesToHex(cast.hash),
    parentFid: cast.parentFid,
    parentUrl: cast.parentUrl,
    parentHash: cast.parentHash ? bytesToHex(cast.parentHash) : null,
    rootParentUrl: cast.rootParentUrl,
    rootParentHash: cast.rootParentHash
      ? bytesToHex(cast.rootParentHash)
      : null,
    timestamp: cast.timestamp,
    text: cast.text,
    embeds: cast.embeds,
    mentions: cast.mentions,
    mentionsPositions: cast.mentionsPositions,
    author: {
      fid: Number(cast.fid),
      username: cast.authorUsername,
      display: cast.authorDisplay,
      pfp: cast.authorPfp,
    },
  }
}

export function formatCastsV2(casts: Selectable<Tables['castsEnhanced']>[]) {
  return casts.map(formatCastV2)
}
