import Link from 'next/link'
import Container from './Container'

export default function Footer() {
  return (
    <>
      <Container size="full">
        <div className="footer">
          <div className="footer-links footer__left">
            <Link href="/search?username=greg">
              <a className="footer-link">@greg</a>
            </Link>
          </div>
          <div className="footer-links footer__right">
            <Link href="/docs">
              <a className="footer-link">API</a>
            </Link>
            <a
              className="footer-link"
              href="https://github.com/gskril/searchcaster"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .footer {
          display: flex;
          gap: 2rem;
          width: 100%;
          padding: 1.25rem 1rem;
          justify-content: space-between;

          &-links {
            display: flex;
            gap: 1.5rem;
          }

          a {
            color: #9584a7;

            &:hover,
            &:focus-visible {
              color: #af9ec1;
            }
          }
        }
      `}</style>
    </>
  )
}
