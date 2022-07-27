import Head from 'next/head'
import '../styles/globals.css'

function App({ Component, pageProps }) {
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
