import Image from 'next/image'

export default function Logo({ align, size, ...props }) {
  const imageSize = size === 'lg' ? 42 : 32

  return (
    <>
      <div id="logo-wrapper" {...props}>
        <div className="logo">
          <Image
            src="/img/logo.png"
            width={imageSize}
            height={imageSize}
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
          margin-right: ${size === 'lg' ? '0.75rem' : '0.5rem'};
          width: ${imageSize};
          height: ${imageSize};

          @media screen and (max-width: 30em) {
            width: 32px;
            height: 32px;
          }
        }

        h1 {
          font-size: ${size === 'lg' ? '2.5rem' : '2rem'};
          color: #fff;

          @media screen and (max-width: 30em) {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  )
}
