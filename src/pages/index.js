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
          min-height: 100vh;
        }
      `}</style>
    </>
  )
}
