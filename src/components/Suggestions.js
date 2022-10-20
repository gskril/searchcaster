import Link from 'next/link'

export default function Suggestion({ name, items }) {
  return (
    <>
      <div className="suggestion">
        <h2 className="h3">{name}</h2>
        <div className="suggestion__wrapper">
          {items.map((item, index) => (
            <Link key={index} href={item.href}>
              <a className="suggestion__item">{item.text}</a>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .suggestion {
          margin-bottom: 1.5rem;
        }

        .suggestion__wrapper {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.5rem;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
        }

        .suggestion__item {
          margin: 0;
          padding: 0.125rem 0.75rem;
          color: var(--primary-color-hover);
          background-color: var(--bg-color);
          border: 1px solid var(--primary-color-hover);
          border-radius: 0.25rem;
          transition: all 0.2s ease-in-out;

          &:hover,
          &:focus-visible {
            color: var(--bg-color);
            outline: none;
            background-color: var(--primary-color-hover);
          }

          a:focus {
            outline: none;
          }
        }
      `}</style>
    </>
  )
}
