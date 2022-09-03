import '../styles/globals.css'
import '../styles/nprogress.css'
import '@rainbow-me/rainbowkit/styles.css'

import Head from 'next/head'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PlausibleProvider from 'next-plausible'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Searchcaster',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <PlausibleProvider domain="searchcaster.xyz" trackOutboundLinks>
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
            <meta name="twitter:card" content="summary_large_image" />
          </Head>
          <Component {...pageProps} />
        </PlausibleProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
