import Head from 'next/head'

import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { Banner } from '../components/Banner'

export default function Home() {
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
        <Banner />
        <Container size="sm">
          <Logo size="lg" align="center" className="mb-5" />
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
