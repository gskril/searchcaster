import '../styles/fonts.scss'
import '../styles/globals.scss'

import Head from 'next/head'
import PlausibleProvider from 'next-plausible'

function App({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="searchcaster.xyz" trackOutboundLinks>
      <Head>
        <link rel="apple-touch-icon" href="/img/logo.png" />
        <link rel="icon" href="/img/favicon-16.png" sizes="16x16" />
        <link rel="icon" href="/img/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/img/favicon-64.png" sizes="64x64" />
        <link rel="icon" href="/img/favicon-96.png" sizes="96x96" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}

export default App
