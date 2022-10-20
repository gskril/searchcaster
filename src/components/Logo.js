import Image from 'next/image'

export default function Logo({ align, size, ...props }) {
  return (
    <>
      <div id="logo-wrapper" {...props}>
        <div className="logo">
          <Image
            src="/img/logo.png"
            width={42}
            height={42}
            alt="Farcaster logo"
          />
        </div>
        <h1>Searchcaster</h1>
      </div>

      <style jsx>{`
        #logo-wrapper {
          display: flex;
          align-items: center;
          align-self: ${align ?? 'flex-start'};
        }

        .logo {
          line-height: 0;
          margin-right: 0.75rem;

          @media screen and (max-width: 30em) {
            width: 2rem;
            height: 2rem;
          }
        }

        h1 {
          font-size: 2.5rem;
          color: #fff;

          @media screen and (max-width: 30em) {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  )
}
