import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'

import { likeIcon, recastIcon, watchIcon } from '../assets/icons'
import ConnectMessage from '../components/connect-message'
import { getRelativeDate } from '../utils/date'
import { formatCastText } from '../utils/cast'
import { searchCasts } from './api/search'

export default function Search({ data, query }) {
  const { isConnected } = useAccount()
  const [banned, setBanned] = useState(false)

  useEffect(() => {
    setBanned(window.ethereum ? false : !isConnected)
  }, [isConnected])

  const casts = data.casts

  return (
    <div className="container">
      <div className="header">
        <div
          className={[
            'header-flex',
            'mb-2',
            query.page > 1 ? 'header--pagination' : null,
          ].join(' ')}
        >
          <div className="logo">
            <Image
              src="/img/logo.png"
              width={48}
              height={48}
              alt="Farcaster logo"
            />
          </div>
          <h1>
            Search Results
            {query.page > 1 && (
              <span className="title__page-number">Page {query.page}</span>
            )}
          </h1>
        </div>
        <Link href="/">
          <a>Return home</a>
        </Link>
      </div>

      {banned ? (
        <ConnectMessage />
      ) : (
        <>
          <Filters query={query} />{' '}
          <Casts casts={casts} query={query} />
        </>
      )}
    </div>
  )
}

function Filters({ query }) {
  const plausible = usePlausible()
  const router = useRouter()

  return (
    <div className="filters">
      <details>
        <summary className="filters__title">Filters</summary>
        <form
          className="filters__content"
          onSubmit={(e) => {
            e.preventDefault()
            const text = e.target.text.value || null
            const username = e.target.username.value || null
            let url = new URLSearchParams()

            if (text) {
              url.set('text', text)
            }
            if (username) {
              url.set('username', username)
            }

            // Plausible Analytics
            plausible('Search', {
              props: {
                query: text,
              },
            })

            router.push(`/search?${url.toString()}`)
          }}
        >
          <div>
            <label htmlFor="text">Text:</label>
            <div className="input-group">
              <input
                type="text"
                name="text"
                defaultValue={query.text}
                placeholder="It's time to Farcast"
              />
              <input type="submit" value="Search" />
            </div>
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <div className="input-group">
              <input
                type="text"
                name="username"
                defaultValue={query.username}
                placeholder="gregskril"
              />
              <input type="submit" value="Search" />
            </div>
          </div>
        </form>
      </details>
    </div>
  )
}

function Casts({ casts, query }) {
  const router = useRouter()
  const url = router.asPath
  const itemsPerPage = query.count || 25
  const page = parseInt(query.page) || 1

  const urlToNextPage = query.page
    ? url.replace(/page=\d+/, `page=${page + 1}`)
    : url.includes('?')
      ? `${url}&page=2`
      : `${url}?page=2`

  const urlToPrevPage =
    query.page && url.replace(/page=\d+/, `page=${page - 1}`)

  return casts.length > 0 ? (
    <div className="casts">
      {casts.map((cast, i) => (
        <div key={cast.merkleRoot}>
          <div className="cast">
            <div className="cast__body">
              <div className="cast__author">
                {cast.meta.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cast.meta.avatar}
                    className="cast__avatar"
                    alt=""
                    width={44}
                    height={44}
                  />
                )}
                <div className="cast__names">
                  <span className="cast__display-name">
                    {cast.meta.displayName}
                  </span>
                  <Link href={`/search?username=${cast.body.username}`}>
                    <a className="cast__username">@{cast.body.username}</a>
                  </Link>
                </div>
              </div>

              <span className="cast__date">
                {getRelativeDate(cast.body.publishedAt)}
              </span>

              <p className="cast__text">
                {formatCastText(cast.body.data.text, query.text)}
              </p>

              {cast.body.data.image && (
                <a
                  href={cast.body.data.image}
                  className="cast__attachment-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cast.body.data.image}
                    className="cast__attachment"
                    loading="lazy"
                    alt=""
                  />
                </a>
              )}

              <div className="cast__engagement">
                <div>
                  {likeIcon}
                  <span>{cast.meta.reactions.count}</span>
                </div>
                <div>
                  {recastIcon}
                  <span>{cast.meta.recasts.count}</span>
                </div>
                <div>
                  {watchIcon}
                  <span>{cast.meta.watches.count}</span>
                </div>
              </div>
            </div>

            <div className="cast__meta">
              {cast.body.data.replyParentMerkleRoot ? (
                cast.body.data.replyParentMerkleRoot !== query.merkleRoot && (
                  <span className="cast__reply">
                    In reply to{' '}
                    <Link
                      href={`/search?merkleRoot=${cast.body.data.replyParentMerkleRoot}`}
                    >
                      <a>@{cast.meta.replyParentUsername.username}</a>
                    </Link>
                  </span>
                )
              ) : (
                <a href={cast.uri} className="cast__link">
                  Open in Farcaster
                </a>
              )}
              {query.merkleRoot && i === 0 ? null : (
                <Link href={`/search?merkleRoot=${cast.merkleRoot}`}>
                  <a className="cast__reply--children">See replies</a>
                </Link>
              )}
            </div>
          </div>

          {query.merkleRoot && i === 0 && (
            <p className="cast--replies-msg">
              {casts.length > 1 ? 'Direct replies:' : 'No direct replies'}
            </p>
          )}
        </div>
      ))}

      {casts.length === itemsPerPage && (
        <div className="pagination">
          {query.page > 1 && (
            <Link href={urlToPrevPage}>
              <a className="pagination__btn">← Previous page</a>
            </Link>
          )}
          <Link href={urlToNextPage}>
            <a className="pagination__btn">Next page →</a>
          </Link>
        </div>
      )}
    </div>
  ) : (
    <p>No results found.</p>
  )
}

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

  const data = await searchCasts(query)

  if (query.merkleRoot) {
    data.casts.reverse()
  }

  return {
    props: {
      data,
      query,
    },
  }
}
