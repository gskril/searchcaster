import type { NextResponse } from 'next/server'

type V2ApiResponseBody<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: any }

export type V2ApiResponse<T> = NextResponse<V2ApiResponseBody<T>>
