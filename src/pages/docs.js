import Head from 'next/head'
import Link from 'next/link'

import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

export default function Docs() {
  return (
    <>
      <Head>
        <title>Farcaster Search API</title>
        <meta
          property="og:image"
          content="https://searchcaster.xyz/api/og/search?text=API%20Docs"
        />
        <meta
          property="og:description"
          name="description"
          content="Search API for the Farcaster protocol"
        />
        <meta
          name="description"
          content="Search API for the Farcaster protocol."
        />
      </Head>

      <Container>
        <div className="header">
          <Logo className="mb-3" />
          <p className="mb-3">
            Unofficial indexer and search API for the{' '}
            <a
              href="https://www.farcaster.xyz/"
              target="_blank"
              rel="noreferrer"
            >
              Farcaster protocol
            </a>
            .
          </p>
        </div>

        <div className="endpoint">
          <Link href="#casts">
            <h2 id="casts">Search casts</h2>
          </Link>
          <p>
            All casts on the protocol are indexed every minute, and accessible
            via the <Link href="/api/search">/api/search</Link> endpoint.
          </p>
          <p>Cast endpoint parameters:</p>
          <ul>
            <li>
              <code>count</code> - the number of casts to be returned (max 200,
              default 25)
            </li>
            <li>
              <code>engagement</code> - changes the sorting of any search query
              to engagement metrics. Options are &quot;reactions&quot;,
              &quot;recasts&quot;, &quot;replies&quot;, &quot;watches&quot;
            </li>
            <li>
              <code>media</code> - the type of media to be returned. Options are
              &quot;image&quot;, &quot;music&quot;, &quot;youtube&quot;,
              &quot;url&quot;. (overwrites all other parameters)
            </li>
            <li>
              <code>merkleRoot</code> - the unique identifier of a cast which
              returns a cast and all of its direct replies (overwrites all other
              parameters)
            </li>
            <li>
              <code>page</code> - the number of casts to offset the response by
              in relation to <code>count</code>
            </li>
            <li>
              <code>text</code> - return casts by text matching (case
              insensitive)
            </li>
            <li>
              <code>username</code> - return all casts, including replies, from
              a certain user
            </li>
          </ul>
          <p>
            This website follows the same URL structure as the API, so it&apos;s
            easy to switch between HTML and JSON responses.
          </p>
          <p>
            Simply add <code>/api/</code> between the domain and{' '}
            <code>/search</code> from any results page.
          </p>
          <p>For example:</p>
          <ul>
            <li>
              <Link href="/search?text=test">
                searchcaster.xyz/search?text=test
              </Link>{' '}
              returns a web page
            </li>
            <li>
              <Link href="/api/search?text=test">
                searchcaster.xyz/api/search?text=test
              </Link>{' '}
              returns JSON
            </li>
          </ul>
        </div>

        <div className="endpoint">
          <Link href="#profiles">
            <h2 id="profiles">Search profiles</h2>
          </Link>
          <p>
            Fetch Farcaster profiles by fid, username, connected address or bio
            via <Link href="/api/profiles">/api/profiles</Link>.
          </p>
          <p>Profiles endpoint parameters:</p>
          <ul>
            <li>
              <code>connected_address</code> - the Ethereum address or ENS name
              the user has connected to their Farcaster profile
            </li>
            <li>
              <code>username</code> - the username associated with the profile
            </li>
            <li>
              <code>bio</code> - substring of a user&apos;s bio
            </li>
            <li>
              <code>address</code> - a user&apos;s Farcaster address
            </li>
          </ul>
        </div>

        <div className="endpoint">
          <Link href="#ens">
            <h2 id="ens">&quot;Drop your ENS&quot;</h2>
          </Link>
          <p>
            Easily scrape the replies of a cast for .eth names using the{' '}
            <Link href="/api/ens">/api/ens</Link> endpoint.
          </p>
          <p>ENS endpoint parameters:</p>
          <ul>
            <li>
              <code>parent</code> - the merkle root of the cast to scrape the
              replies of (
              <Link href="/api/ens?parent=0xdc3f314ea1a49f2f0a2fe06fa4c4c4538776e7cd54b4ef5b7b36edeb4017c116">
                example
              </Link>
              )
            </li>
          </ul>
        </div>
      </Container>

      <Footer includeTime={false} />

      <style jsx>{`
        .header {
          padding-top: 3rem;
        }

        .endpoint {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  )
}
