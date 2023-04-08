import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { arrowIcon } from '../assets/icons'
import { searchProfiles } from './api/profiles'
import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import useDebounce from '../hooks/useDebounce'

export default function Search({ data, query }) {
  const router = useRouter()
  const hasData = data && data.length > 0
  const [isDevMode, setIsDevMode] = useState(false)
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    if (!debouncedValue || !query?.q) return

    router.push({
      pathname: '/profiles',
      query: { q: debouncedValue },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <>
      <Head>
        <title>Search profiles on Farcaster</title>
        <meta
          property="og:image"
          content={`https://searchcaster.xyz/api/og/search?text=${
            query?.q || 'Search for profiles on Farcaster'
          }`}
        />
      </Head>

      <Container>
        <div className="header">
          <Logo className="mb-3" />

          <form
            onSubmit={(e) => {
              e.preventDefault()
              router.push({
                pathname: '/profiles',
                query: { q: e.target.q.value },
              })
            }}
          >
            <div className="input-wrapper">
              <input
                type="text"
                name="q"
                id="q"
                placeholder="Search by bio or name"
                value={value}
                onChange={handleChange}
              />
              <button type="submit">{arrowIcon}</button>
            </div>
          </form>

          {hasData && (
            <div className="dev-mode">
              <input
                type="checkbox"
                id="dev-mode"
                className="checkbox"
                checked={isDevMode}
                onChange={() => setIsDevMode(!isDevMode)}
              />
              <label htmlFor="dev-mode">Developer mode</label>
            </div>
          )}
        </div>

        {hasData && (
          <div className="profiles">
            {data.map((profile) => (
              <div className="profile" key={profile.body.id}>
                <div className="profile__main">
                  <a href={`https://warpcast.com/${profile.body.username}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.body?.avatarUrl}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </a>
                  <div className="name-meta">
                    <a href={`https://warpcast.com/${profile.body.username}`}>
                      {profile.body.displayName}
                    </a>
                    <a
                      href={`https://warpcast.com/${profile.body.username}`}
                      className="username"
                    >
                      @{profile.body?.username}
                    </a>
                  </div>
                </div>

                {profile.body?.bio && <p>{profile.body.bio}</p>}

                {isDevMode && (
                  <div className="profile__advanced">
                    <div className="profile__advanced-group">
                      <label>Farcaster ID:</label>
                      <span>{profile.body.id}</span>
                    </div>

                    {profile.body.registeredAt ? (
                      <div className="profile__advanced-group">
                        <label>Registration date:</label>
                        <span>
                          {new Date(
                            profile.body.registeredAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    ) : null}

                    {profile.body.address && (
                      <div className="profile__advanced-group">
                        <label>Custody address:</label>
                        <span>{profile.body.address}</span>
                      </div>
                    )}

                    {profile.connectedAddress && (
                      <div className="profile__advanced-group">
                        <label>Connected address:</label>
                        <span>{profile.connectedAddress}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!hasData && query?.q && (
          <p
            style={{
              textAlign: 'center',
            }}
          >
            No profiles found
          </p>
        )}
      </Container>

      {data.length > 10 && <Footer />}

      <style jsx>{`
        .header {
          display: flex;
          flex-direction: column;
          padding: 3rem 0 2rem;
        }

        .input-wrapper {
          display: flex;
          background-color: #4d4063;
          border-radius: 2.5rem;
          justify-content: space-between;
          border: 1px solid #6f6581;
          position: relative;
          padding-right: 2.25rem;
          overflow: hidden;

          input {
            background: transparent;
            color: #eee4ff;
            outline: none;
            font-size: 1rem;
            padding: 0.25rem 1rem;

            &::placeholder {
              color: #eee4ff;
              opacity: 0.4;
            }
          }

          button {
            --size: 2.5rem;

            position: absolute;
            width: fit-content;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: var(--size);
            height: var(--size);
            padding: 0.5rem;
            line-height: 0;
            border-radius: 5rem;
            opacity: 1;
            transition: opacity 0.1s ease-in-out;

            &:hover,
            &:focus-visible {
              opacity: 0.85;
            }
          }
        }

        .dev-mode {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          align-self: center;

          &:hover {
            cursor: pointer;
          }

          @media (max-width: 768px) {
            display: none;
          }
        }

        .profiles {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid #6f588b;

          img {
            object-fit: cover;
            border-radius: 0.25rem;
          }

          p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.25rem;
          }

          a {
            color: inherit;
          }
        }

        .profile__main {
          display: flex;
          gap: 0.6rem;
          width: 100%;
        }

        .profile__advanced {
          background-color: rgba(53, 41, 77, 0.5);
          border: 1px solid rgba(53, 41, 77, 0.8);
          padding: 0.75rem;
          border-radius: 0.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;

          &-group {
            gap: 0.5rem;
            line-height: 1.25;

            & > * {
              max-width: 100%;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            label {
              margin: 0 0.5rem 0 0;
              opacity: 0.65;
            }
          }
        }

        .name-meta {
          display: flex;
          flex-direction: column;

          .username {
            font-size: 0.875rem;
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps({ query: _query, res }) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  const q = new URLSearchParams(_query).get('q') || ''
  const query = {
    q,
    count: 100,
  }

  const data = await searchProfiles(query)

  return {
    props: {
      data,
      query,
    },
  }
}
