// https://github.com/gskril/farcaster-indexer/blob/hubs/src/db/db.types.ts
// With modifications for unused tables and views

import { ColumnType, Generated, GeneratedAlways } from 'kysely'
import { isDataView } from 'util/types'

type ReactionType = number
type UserDataType = number
type Fid = number
type Hex = `0x${string}`

type CastIdJson = {
  fid: Fid
  hash: Hex
}

// CASTS -------------------------------------------------------------------------------------------
declare const $castDbId: unique symbol
type CastDbId = string & { [$castDbId]: true }

type CastEmbedJson = { url: string } | { castId: CastIdJson }

type CastRow = {
  id: GeneratedAlways<CastDbId>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  timestamp: Date
  deletedAt: Date | null
  prunedAt: Date | null
  fid: Fid
  parentFid: Fid | null
  hash: Uint8Array
  rootParentHash: Uint8Array | null
  parentHash: Uint8Array | null
  rootParentUrl: string | null
  parentUrl: string | null
  text: string
  fts: GeneratedAlways<string>
  embeds: ColumnType<CastEmbedJson[], string, string>
  mentions: ColumnType<Fid[], string, string>
  mentionsPositions: ColumnType<number[], string, string>
}

type CastEnhancedRow = {
  fid: ColumnType<Fid, never, never>
  hash: ColumnType<Uint8Array, never, never>
  parentFid: ColumnType<Fid | null, never, never>
  parentUrl: ColumnType<string | null, never, never>
  parentHash: ColumnType<Uint8Array | null, never, never>
  rootParentUrl: ColumnType<string | null, never, never>
  rootParentHash: ColumnType<Uint8Array | null, never, never>
  timestamp: ColumnType<Date, never, never>
  text: ColumnType<string, never, never>
  embeds: ColumnType<CastEmbedJson[], never, never>
  mentions: ColumnType<Fid[], never, never>
  mentionsPositions: ColumnType<number[], never, never>
  authorPfp: ColumnType<string | null, never, never>
  authorDisplay: ColumnType<string | null, never, never>
  authorUsername: ColumnType<string | null, never, never>
}

// REACTIONS ---------------------------------------------------------------------------------------
declare const $reactionDbId: unique symbol
type ReactionDbId = string & { [$reactionDbId]: true }

type ReactionRow = {
  id: GeneratedAlways<ReactionDbId>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  timestamp: Date
  deletedAt: Date | null
  prunedAt: Date | null
  fid: Fid
  targetCastFid: Fid | null
  type: ReactionType
  hash: Uint8Array
  targetCastHash: Uint8Array | null
  targetUrl: string | null
}

// LINKS -------------------------------------------------------------------------------------------
declare const $linkDbId: unique symbol
type LinkDbId = string & { [$linkDbId]: true }

type LinkRow = {
  id: GeneratedAlways<LinkDbId>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  timestamp: Date
  deletedAt: Date | null
  prunedAt: Date | null
  fid: Fid
  targetFid: Fid | null
  displayTimestamp: Date | null
  type: string
  hash: Uint8Array
}

// VERIFICATIONS -----------------------------------------------------------------------------------
declare const $verificationDbId: unique symbol
type VerificationDbId = string & { [$verificationDbId]: true }

type VerificationRow = {
  id: GeneratedAlways<VerificationDbId>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  timestamp: Date
  deletedAt: Date | null
  fid: Fid
  hash: Uint8Array
  signerAddress: Uint8Array
  blockHash: Uint8Array
  signature: Uint8Array
}

// USER DATA ---------------------------------------------------------------------------------------
declare const $userDataDbId: unique symbol
type UserDataDbId = string & { [$userDataDbId]: true }

type UserDataRow = {
  id: GeneratedAlways<UserDataDbId>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  timestamp: Date
  deletedAt: Date | null
  fid: Fid
  type: UserDataType
  hash: Uint8Array
  value: string
}

// FIDS -------------------------------------------------------------------------------------------
type FidRow = {
  fid: Fid
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
  registeredAt: Date
  custodyAddress: Uint8Array
  recoveryAddress: Uint8Array
}

// ALL TABLES --------------------------------------------------------------------------------------
export interface Tables {
  casts: CastRow
  castsEnhanced: CastEnhancedRow
  reactions: ReactionRow
  links: LinkRow
  verifications: VerificationRow
  userData: UserDataRow
  fids: FidRow
}
