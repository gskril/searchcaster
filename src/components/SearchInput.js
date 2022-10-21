import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'
import { arrowIcon } from '../assets/icons'

export default function SearchInput({ size, ...props }) {
  const router = useRouter()
  const plausible = usePlausible()

  function handleFormSubmit(e) {
    e.preventDefault()
    const query = e.target.text.value

    // if a query is only `from:username` or `from: username` or `from: @username`, redirect to /search?username=username
    // if a query includes a search query *and* `(from:username)` or `(from: username)` or `(from: @username)`, redirect to /search?username=username&text=text
    const justFrom = query.match(/^from:\s?@?(\w+)$/i)
    const fromAndText =
      query.match(/^(.+)\s(from:\s?@?(\w+))$/i) ||
      query.match(/^(.+)\s\((from:\s?@?(\w+))\)$/i)

    if (justFrom) {
      const username = justFrom[1]
      router.push(`/search?username=${username}`)
      plausible('Search', {
        props: {
          username,
        },
      })
    } else if (fromAndText) {
      const text = fromAndText[1]
      const username = fromAndText[3]
      router.push(`/search?username=${username}&text=${text}`)
      plausible('Search', {
        props: {
          query: text,
          username,
        },
      })
    } else {
      router.push(`/search?text=${query}`)
      plausible('Search', {
        props: {
          query,
        },
      })
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} {...props}>
        <div className="input-wrapper">
          <input type="text" name="text" placeholder="It's time to Farcast" />
          <button>{arrowIcon}</button>
        </div>
      </form>

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
        }

        input {
          background: transparent;
          color: #eee4ff;
          outline: none;
          font-size: ${size === 'lg' ? '1.25rem' : '1rem'};
          padding: 0.5rem 1rem;

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
      `}</style>
    </>
  )
}
