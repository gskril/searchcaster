import Link from 'next/link'
import Image from 'next/image'

export default function Docs() {
  return (
    <div className="container">
      <div className="header">
        <div className="header-flex mb-2">
          <div className="logo">
            <Image
              src="/img/logo.png"
              width={48}
              height={48}
              alt="Farcaster logo"
            />
          </div>
          <h1>Farcaster Search API</h1>
        </div>
        <Link href="/">
          <a>Return home</a>
        </Link>
      </div>
      <p className="mb-3">
        Unofficial cast indexer and search API for the{' '}
        <a href="https://www.farcaster.xyz/" target="_blank" rel="noreferrer">
          Farcaster protocol
        </a>
        .
      </p>
      <h2>Search casts</h2>
      <p>
        All casts on the protocol are indexed every 30 minutes, and accessible
        via the the <Link href="/api/search">/api/search</Link> endpoint.
      </p>
      <p>Cast endpoint parameters:</p>
      <ul>
        <li>
          <code>count</code> - the number of casts to be returned (max 200,
          default 50)
        </li>
        <li>
          <code>engagement</code> - changes the sorting of any search query to
          engagement metrics. Options are &quot;reactions&quot;,
          &quot;recasts&quot;, &quot;watches&quot;
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
          <code>page</code> - the number of casts to offset the response by in
          relation to <code>count</code>
        </li>
        <li>
          <code>text</code> - return casts by text matching (case insensitive)
        </li>
        <li>
          <code>username</code> - return all casts, including replies, from a
          certain user
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

      <h2>Search profiles</h2>
      <p>
        Fetch Farcaster profiles by username or connected address via{' '}
        <Link href="/api/profiles">/api/profiles</Link>.
      </p>
      <p>Profiles endpoint parameters:</p>
      <ul>
        <li>
          <code>connect_address</code> - the Ethereum address the user has
          connected to their Farcaster profile
        </li>
        <li>
          <code>username</code> - the username associated with the profile
        </li>
      </ul>

      <h2>&quot;Drop your ENS&quot;</h2>
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
  )
}
