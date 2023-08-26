import Head from 'next/head'
import { useEffect } from 'react'
import { useStorage } from '../hooks/useLocalStorage'

import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import SearchInput from '../components/SearchInput'

export default function Home() {
  const { getItem, setItem } = useStorage()

  // Reset search session when user navigates back to home page
  useEffect(() => {
    let isAdvanced = false
    let searchSession = getItem('search-query', 'session')

    if (searchSession) {
      isAdvanced = JSON.parse(searchSession).advanced
    }

    const defaultSearchQuery = {
      text: '',
      username: '',
      advanced: isAdvanced,
    }

    setItem('search-query', JSON.stringify(defaultSearchQuery), 'session')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Searchcaster</title>
        <meta
          property="og:image"
          content="https://searchcaster.xyz/api/og/search"
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

      <div className="home">
        <div />
        <Container size="sm">
          <Logo size="lg" align="center" className="mb-5" />
          <SearchInput size="lg" />
        </Container>
        <Footer />
      </div>

      <style jsx>{`
        .home {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
          min-height: 100svh;
        }
      `}</style>
    </>
  )
}
