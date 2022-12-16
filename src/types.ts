export interface Verification {
  fid?: number
  address: string
  timestamp: number
}

export type CombinedVerification = {
  fid: number
  verifications: Verification[]
}
