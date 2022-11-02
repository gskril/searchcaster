import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'
import { useStorage } from '../hooks/useLocalStorage'

import { arrowIcon } from '../assets/icons'

export default function SearchInput({ size, ...props }) {
  const router = useRouter()
  const plausible = usePlausible()
  const { getItem, setItem } = useStorage()

  const [isAdvanced, setIsAdvanced] = useState(false)

  function handleFormSubmit(e) {
    e.preventDefault()
    const target = e.target
    const query = target.text.value
    setItem('search-query', query, 'session')

    const searchParams = new URLSearchParams()

    if (isAdvanced && target.username.value) {
      searchParams.set('text', query)
      searchParams.set('username', e.target.username.value)

      plausible('Search', {
        props: {
          query,
          username: target.username.value,
        },
      })
    } else {
      // if a query is only `from:username` or `from: username` or `from: @username`, redirect to /search?username=username
      // if a query includes a search query *and* `(from:username)` or `(from: username)` or `(from: @username)`, redirect to /search?username=username&text=text
      const justFrom = query.match(/^from:\s?@?(\w+)$/i)
      const fromAndText =
        query.match(/^(.+)\s(from:\s?@?(\w+))$/i) ||
        query.match(/^(.+)\s\((from:\s?@?(\w+))\)$/i)

      if (justFrom) {
        const username = justFrom[1]
        searchParams.set('username', username)
        plausible('Search', {
          props: {
            username,
          },
        })
      } else if (fromAndText) {
        const text = fromAndText[1]
        const username = fromAndText[3]
        searchParams.set('text', text)
        searchParams.set('username', username)
        plausible('Search', {
          props: {
            query: text,
            username,
          },
        })
      } else {
        searchParams.set('text', query)
        plausible('Search', {
          props: {
            query,
          },
        })
      }
    }

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} {...props}>
        {!isAdvanced && (
          <div className="input-wrapper">
            <input
              type="text"
              name="text"
              placeholder="Search for any term"
              defaultValue={getItem('search-query', 'session')}
            />
            <button type="submit">{arrowIcon}</button>
          </div>
        )}

        {isAdvanced && (
          <div className="advanced-search">
            <div className="advanced-search__group">
              <span className="advanced-search__label">Text to match:</span>
              <input
                type="text"
                name="text"
                className="advanced-search__group"
                placeholder="It's time to Farcast"
              />
            </div>
            <div className="advanced-search__group">
              <span className="advanced-search__label">From this account:</span>
              <input
                type="text"
                name="username"
                className="advanced-search__group"
                placeholder="dwr"
              />
            </div>

            <button className="advanced-search__submit" type="submit">
              Search
            </button>
          </div>
        )}
      </form>

      {size === 'lg' && (
        <div
          className="advanced-toggle"
          onClick={() => setIsAdvanced(!isAdvanced)}
        >
          <span>Advanced search</span>
          <span className="checkbox">{isAdvanced && '✓'}</span>
        </div>
      )}

      <style jsx>{`
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
            font-size: ${size === 'lg' ? '1.25rem' : '1rem'};
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
            right: 0.25rem;
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

        .advanced-toggle {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding-top: 0.75rem;
          color: #9285ab;

          &:hover {
            cursor: pointer;
          }
        }

        .checkbox {
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 0.875rem;
          border-radius: 0.25rem;
          background-color: #5e5278;
        }

        .advanced-search {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: #413656;

          &__group {
            width: 100%;
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;

            @media (max-width: 768px) {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
              align-items: flex-start;
            }

            input {
              background-color: #fff;
              border: 1px solid #6f6581;
              box-shadow: 1px 1px 4px rgba(90, 70, 128, 0.5);
              border-radius: 0.375rem;
              padding: 0.375rem 0.5rem;
              color: #0b0b0c;
              width: 100%;
              max-width: 100%;

              &:focus-visible {
                outline: none;
              }
            }
          }

          &__submit {
            background-color: var(--primary-color);
            border-radius: 0.25rem;
            transition: background-color 0.1s ease-in-out;

            @media (max-width: 768px) {
              margin-top: 0.5rem;
            }

            &:hover {
              background-color: var(--primary-color-hover);
            }
          }
        }
      `}</style>
    </>
  )
}
