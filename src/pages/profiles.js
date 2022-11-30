import Head from 'next/head'

import { searchProfiles } from './api/profiles'
import Container from '../components/Container'
import Logo from '../components/Logo'

export default function Search({ data, query }) {
  return (
    <>
      <Head>
        <title>Search profiles on Farcaster</title>
      </Head>

      <Container>
        <div className="header">
          <Logo className="mb-3" />

          <form>
            <input
              type="text"
              name="q"
              id="q"
              placeholder="Search by bio or username"
              defaultValue={query.q}
              style={{
                marginBottom: '0.5rem',
              }}
            />
            <button type="submit" style={{ background: 'initial' }}>
              Search
            </button>
          </form>

          <div className="profiles">
            {data.map((profile) => (
              <div className="profile" key={profile.body.id}>
                <div className="profile__main">
                  <a href={`farcaster://profiles/${profile.body.address}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.body?.avatarUrl}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </a>
                  <div className="name-meta">
                    <a href={`farcaster://profiles/${profile.body.address}`}>
                      {profile.body.displayName}
                    </a>
                    <a
                      href={`farcaster://profiles/${profile.body.address}`}
                      className="username"
                    >
                      {profile.body?.username}
                    </a>
                  </div>
                </div>
                <p>{profile.body?.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style jsx>{`
        .header {
          display: flex;
          flex-direction: column;
          padding: 3rem 0 2rem;
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
            border-radius: 0.25rem;
          }

          p {
            color: rgba(255, 255, 255, 0.8);
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

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

  const data = await searchProfiles(query)

  return {
    props: {
      data,
      query,
    },
  }
}
