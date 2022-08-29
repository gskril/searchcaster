import Image from 'next/image'
import { useRouter } from 'next/router'
import { usePlausible } from 'next-plausible'
import toast, { Toaster } from 'react-hot-toast'

import Suggestion from '../components/suggestion'

export default function Home() {
  const plausible = usePlausible()

  const router = useRouter()
  const timeLastWeek = new Date().setDate(new Date().getDate() - 7)

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header-flex">
            <div className="logo">
              <Image
                src="/img/logo.png"
                width={48}
                height={48}
                alt="Farcaster logo"
              />
            </div>
            <h1>Farcaster Search</h1>
          </div>
        </div>

        <p className="mb-3">Search for any cast. Updates every 30 minutes.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!hasEthereum) {
              // Plausible Analytics
              plausible('Denied')

              return toast.error('You need an Ethereum wallet :)')
            }
            const query = e.target.text.value

            // Plausible Analytics
            plausible('Search', {
              props: {
                query,
              },
            })

            router.push(`/search?text=${query}`)
          }}
        >
          <div className="input-group">
            <input type="text" name="text" placeholder="It's time to Farcast" />
            <input type="submit" value="Search" />
          </div>
        </form>

        <div className="suggestions">
          <Suggestion
            name="Popular Topics"
            items={[
              {
                text: 'All casts',
                href: '/search',
              },
              {
                text: 'Startup',
                href: '/search?text=startup',
              },
              {
                text: 'NFT',
                href: '/search?text=nft',
              },
              {
                text: 'Farcaster',
                href: '/search?text=farcaster',
              },
            ]}
          />

          <Suggestion
            name="Media Types"
            items={[
              {
                text: 'All links',
                href: '/search?media=url',
              },
              {
                text: 'Images',
                href: '/search?media=image',
              },
              {
                text: 'Music',
                href: '/search?media=music',
              },
              {
                text: 'YouTube',
                href: '/search?media=youtube',
              },
            ]}
          />

          <Suggestion
            name="Popular (All Time)"
            items={[
              {
                text: 'Most reactions',
                href: '/search?engagement=reactions',
              },
              {
                text: 'Most recasts',
                href: '/search?engagement=recasts',
              },
              {
                text: 'Most watches',
                href: '/search?engagement=watches',
              },
            ]}
          />

          <Suggestion
            name="Trending (Last 7 Days)"
            items={[
              {
                text: 'Most reactions',
                href: `/search?engagement=reactions&after=${timeLastWeek}`,
              },
              {
                text: 'Most recasts',
                href: `/search?engagement=recasts&after=${timeLastWeek}`,
              },
              {
                text: 'Most watches',
                href: `/search?engagement=watches&after=${timeLastWeek}`,
              },
            ]}
          />
        </div>
      </div>

      <Toaster position="bottom-center" />
    </>
  )
}
