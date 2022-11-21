import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { arrowIcon } from '../../../assets/icons'

export const config = {
  runtime: 'experimental-edge',
}

const fontMedium = fetch(
  new URL('../../../assets/Satoshi-Medium.otf', import.meta.url)
).then((res) => res.arrayBuffer())

const fontBold = fetch(
  new URL('../../../assets/Satoshi-Black.otf', import.meta.url)
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const fontMediumData = await fontMedium
  const fontBoldData = await fontBold

  try {
    const { searchParams } = new URL(req.url)

    const hasText = searchParams.get('text')
    const text = hasText
      ? searchParams.get('text')
      : 'Search the Farcaster protocol'

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Satoshi',
            width: '100%',
            height: '100%',
            backgroundColor: '#1c1626',
            transform: 'scale(1.5) translateY(-1%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              fontSize: '40px',
              fontFamily: 'Satoshi-Bold',
              transform: 'scale(0.9)',
              marginBottom: '8px',
            }}
          >
            <span>{svgLogo}</span>
            <h1
              style={{
                lineHeight: '1',
                padding: '0 0 0 10px',
              }}
            >
              Searchcaster
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#4d4063',
              width: 'auto',
              maxWidth: '600px',
              borderRadius: '50px',
              border: '1px solid #6f6581',
              padding: '6px 18px',
              fontSize: '24px',
              color: '#eee4ff',
            }}
          >
            <span
              style={{
                minWidth: '280px',
                opacity: `${hasText ? 1 : 0.5}`,
              }}
            >
              {text}
            </span>
            <span
              style={{
                transform: 'translateY(-1px) scale(1.5)',
                paddingLeft: '24px',
              }}
            >
              {arrowIcon}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Satoshi',
            data: fontMediumData,
            style: 'normal',
          },
          {
            name: 'Satoshi-Bold',
            data: fontBoldData,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

const svgLogo = (
  <svg
    width="43"
    height="44"
    viewBox="0 0 43 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_314_153)">
      <rect
        y="0.857147"
        width="42.8994"
        height="42.8571"
        rx="8.6"
        fill="url(#paint0_linear_314_153)"
      />
      <g filter="url(#filter0_d_314_153)">
        <path
          d="M28.3614 26.6111C30.1499 24.1729 30.951 21.1501 30.6043 18.1472C30.2577 15.1444 28.7889 12.3831 26.4918 10.4157C24.1947 8.44824 21.2387 7.41986 18.2152 7.53625C15.1918 7.65263 12.3238 8.9052 10.185 11.0434C8.0463 13.1815 6.79455 16.0476 6.68021 19.0682C6.56588 22.0887 7.59739 25.0411 9.56838 27.3345C11.5394 29.6279 14.3045 31.0933 17.3105 31.4375C20.3166 31.7816 23.3418 30.9792 25.7811 29.1907H25.7792C25.8347 29.2645 25.8938 29.3346 25.9603 29.4029L33.0714 36.5071C33.4178 36.8533 33.8876 37.0479 34.3776 37.0481C34.8675 37.0483 35.3375 36.854 35.6841 36.508C36.0307 36.162 36.2255 35.6926 36.2257 35.2032C36.2258 34.7137 36.0314 34.2442 35.685 33.8979L28.5738 26.7937C28.5078 26.727 28.4368 26.6653 28.3614 26.6092V26.6111ZM28.838 19.518C28.838 20.8507 28.5752 22.1704 28.0647 23.4018C27.5542 24.6331 26.8059 25.7519 25.8625 26.6943C24.9192 27.6367 23.7993 28.3842 22.5668 28.8943C21.3342 29.4043 20.0132 29.6668 18.6792 29.6668C17.3451 29.6668 16.0241 29.4043 14.7916 28.8943C13.559 28.3842 12.4391 27.6367 11.4958 26.6943C10.5525 25.7519 9.80417 24.6331 9.29364 23.4018C8.78311 22.1704 8.52035 20.8507 8.52035 19.518C8.52035 16.8263 9.59065 14.245 11.4958 12.3417C13.4009 10.4384 15.9849 9.36916 18.6792 9.36916C21.3734 9.36916 23.9574 10.4384 25.8625 12.3417C27.7677 14.245 28.838 16.8263 28.838 19.518Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_314_153"
        x="-1.92837"
        y="3.22382"
        width="46.7544"
        height="46.7243"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4.3" />
        <feGaussianBlur stdDeviation="4.3" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_314_153"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_314_153"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_314_153"
        x1="21.4497"
        y1="0.857147"
        x2="21.4497"
        y2="43.7143"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8A63D2" />
        <stop offset="1" stopColor="#7C59BE" />
      </linearGradient>
      <clipPath id="clip0_314_153">
        <rect
          y="0.857147"
          width="42.8994"
          height="42.8571"
          rx="8.6"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
)
