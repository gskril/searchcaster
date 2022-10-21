import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import SearchInput from '../components/SearchInput'

export default function Home() {
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
