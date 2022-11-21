import { useRouter } from 'next/router'
import Link from 'next/link'

import Cast from '../components/Cast'

export default function CastFeed({ casts, query }) {
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

  if (casts.length === 0) {
    return <p>No results found.</p>
  }

  return (
    <>
      <div className="casts h-feed">
        {casts.map((cast, i) => (
          <div key={cast.merkleRoot}>
            <Cast cast={cast} query={query} />
          </div>
        ))}
      </div>

      <div>
        {casts.length === itemsPerPage && (
          <div className="pagination">
            {query.page > 1 && (
              <Link href={urlToPrevPage}>
                <a className="pagination__btn" rel="prev">
                  ← Previous page
                </a>
              </Link>
            )}
            <Link href={urlToNextPage}>
              <a className="pagination__btn" rel="next">
                Next page →
              </a>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .casts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 2rem;
        }

        .pagination {
          display: flex;
          width: 100%;
          margin: 0 auto;
          padding-bottom: 2rem;
          justify-content: ${query.page > 1 ? 'space-between' : 'center'};
        }

        .pagination__btn {
          color: #b0a2cb;
        }
      `}</style>
    </>
  )
}
