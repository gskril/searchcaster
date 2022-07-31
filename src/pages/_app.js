import '../styles/globals.css'
import '../styles/nprogress.css'

import Head from 'next/head'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

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
    <>
      <Head>
        <title>Farcaster Search | Searchcaster</title>
        <link rel="apple-touch-icon" href="/img/search-logo.png" />
        <link rel="icon" href="/img/favicon-16.png" sizes="16x16" />
        <link rel="icon" href="/img/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/img/favicon-64.png" sizes="64x64" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />

        <meta
          property="og:image"
          content="https://searchcaster.xyz/img/opengraph.png"
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
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
