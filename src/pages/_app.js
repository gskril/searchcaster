import '../styles/fonts.scss'
import '../styles/globals.scss'
import '../styles/nprogress.scss'

import Head from 'next/head'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PlausibleProvider from 'next-plausible'

NProgress.configure({
  showSpinner: false,
})

function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start())
    router.events.on('routeChangeComplete', () => NProgress.done())
    router.events.on('routeChangeError', () => NProgress.done())
  }, [router.events])

  return (
    <PlausibleProvider domain="searchcaster.xyz" trackOutboundLinks>
      <Head>
        <title>Farcaster Search | Searchcaster</title>
        <link rel="apple-touch-icon" href="/img/search-logo.png" />
        <link rel="icon" href="/img/favicon-16.png" sizes="16x16" />
        <link rel="icon" href="/img/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/img/favicon-64.png" sizes="64x64" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />

        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="Farcaster Search"
          href="https://searchcaster.xyz/search.xml"
        />

        {router.asPath ? (
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Farcaster Search"
            href={`https://granary.io/url?input=html&output=rss&url=https%3A%2F%2Fsearchcaster.xyz${router.asPath}`}
          />
        ) : (
          ''
        )}

        <meta
          property="og:image"
          content="https://dev.searchcaster.xyz/api/og/search"
        />
        <meta
          property="og:description"
          name="description"
          content="Search for any cast"
        />
        <meta
          name="description"
          content="Search for any cast on the Farcaster protocol."
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}

export default App
