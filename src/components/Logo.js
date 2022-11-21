import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ align, size, ...props }) {
  const imageSize = size === 'lg' ? 42 : 26

  function MainLogo() {
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
            width: ${imageSize + 'px'};
            height: ${imageSize + 'px'};

            @media screen and (max-width: 30em) {
              margin-right: ${size === 'lg' ? '0.5rem' : '0.5rem'};
              width: ${size === 'lg' ? '32px' : '26px'};
              height: ${size === 'lg' ? '32px' : '26px'};
            }
          }

          h1 {
            font-size: ${size === 'lg' ? '2.5rem' : '1.5rem'};
            color: #fff;

            @media screen and (max-width: 30em) {
              font-size: ${size === 'lg' ? '1.8rem' : '1.5rem'};
            }
          }
        `}</style>
      </>
    )
  }

  if (size === 'lg') {
    return <MainLogo />
  } else {
    return (
      <Link href="/">
        <a>
          <MainLogo />
        </a>
      </Link>
    )
  }
}
