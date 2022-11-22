import Head from 'next/head'

import { searchCasts } from './api/search'
import CastFeed from '../components/CastFeed'
import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import SearchFilters from '../components/SearchFilters'
import SearchInput from '../components/SearchInput'

export default function Search({ data, query }) {
  const casts = data.casts

  return (
    <>
      <Head>
        <title>
          {query.text ? `${query.text} - Searchcaster` : 'Searchcaster'}
        </title>
        {query.merkleRoot ? (
          <meta
            property="og:image"
            content={`https://og.farcase.xyz/cast/${query.merkleRoot}`}
          />
        ) : (
          <meta
            property="og:image"
            content={`https://searchcaster.xyz/api/og/search?text=${
              query?.text || ''
            }`}
          />
        )}
      </Head>

      <Container>
        <div className="header">
          <div className="header__row mb-3">
            <Logo />

            {query.page > 1 && (
              <span className="header__page-number">Page {query.page}</span>
            )}
          </div>

          <SearchInput />
        </div>

        {!query.merkleRoot && <SearchFilters query={query} />}
        <CastFeed casts={casts} query={query} />
      </Container>

      {casts.length > 5 && <Footer />}

      <style jsx>{`
        .header {
          display: flex;
          flex-direction: column;
          padding: 3rem 0 2rem;

          &__row {
            display: flex;
            gap: 1rem;
            align-items: flex-end;
            justify-content: space-between;
          }

          &__page-number {
            font-size: 0.875rem;
            opacity: 0.75;
          }
        }
      `}</style>
    </>
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
