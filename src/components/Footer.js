import Link from 'next/link'
import Container from './Container'

export default function Footer({ includeTime = true }) {
  return (
    <>
      <Container size="full">
        <div className="footer">
          <div className="footer-links footer__left">
            <p>{includeTime ? 'Updates every minute' : 'Searchcaster'}</p>
          </div>
          <div className="footer-links footer__right">
            <Link href="/docs">
              <a className="footer-link">API</a>
            </Link>
            <Link href="/profiles">
              <a className="footer-link">Profiles</a>
            </Link>
            <Link href="https://www.raycast.com/gregskril/searchcaster">
              <a className="footer-link" target="_blank" rel="noreferrer">
                Raycast
              </a>
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
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          padding-top: 1.25rem;
          padding-bottom: 1.25rem;
          align-items: center;
          color: #9584a7;

          &-links {
            display: flex;
            gap: 1.5rem;
          }

          &__left {
            opacity: 0.5;
            display: none;
          }

          @media (min-width: 768px) {
            gap: 2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            flex-direction: row;
            justify-content: space-between;

            &__left {
              opacity: 1;
              display: block;
            }
          }

          a {
            color: inherit;

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
