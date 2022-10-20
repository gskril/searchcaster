import { useRouter } from 'next/router'
import { usePlausible } from 'next-plausible'

import Logo from '../components/Logo'
import Container from '../components/Container'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <div className="home">
        <div />
        <Container>
          <Logo align="center" />
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
