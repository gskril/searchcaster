import Container from './Container'

export default function Footer({ includeTime = true }) {
  return (
    <>
      <Container size="full">
        <div className="footer">
          <p>
            Built by <a href="https://farcaster.xyz/greg">@greg</a>
          </p>
        </div>
      </Container>

      <style jsx>{`
        .footer {
          padding-top: 1.25rem;
          padding-bottom: 1.25rem;
          text-align: center;
          color: #9584a7;

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
