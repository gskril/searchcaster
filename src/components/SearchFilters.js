import { useRouter } from 'next/router'

export default function SearchFilters({ query }) {
  const router = useRouter()

  return (
    <>
      <div className="filters">
        <span className="filters_label">Sort:</span>
        <div className="filters_wrapper">
          {filters.map((filter) => {
            const stringifiedQuery = JSON.stringify(query).slice(1, -1)
            const stringifiedQueryChanges = JSON.stringify(
              filter.queryChanges
            ).slice(1, -1)

            const isActive = stringifiedQuery.includes(stringifiedQueryChanges)

            return (
              <button
                key={filter.label}
                className={`filter ${isActive ? 'filter--active' : ''}`}
                onClick={() => {
                  let newQuery = { ...query }

                  // If the filter is already active, remove it from the query
                  if (isActive) {
                    const paramsToRemove = Object.keys(filter.queryChanges)
                    paramsToRemove.forEach((param) => delete newQuery[param])
                  } else {
                    newQuery = { ...newQuery, ...filter.queryChanges }
                  }

                  // Remove page from query (in effect, resetting to page 1)
                  delete newQuery.page

                  router.push({
                    pathname: '/search',
                    query: newQuery,
                  })
                }}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .filters {
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: space-between;
          position: relative;

          @media (max-width: 600px) {
            &::after {
              content: '';
              position: absolute;
              pointer-events: none;
              top: 0;
              right: 0;
              bottom: 0;
              width: 4rem;
              height: calc(100% - 0.75rem);
              background: linear-gradient(
                to right,
                rgba(28, 22, 38, 0),
                rgb(28, 22, 38)
              );
            }
          }
        }

        .filters_label {
          padding-bottom: 0.75rem;
          font-weight: 500;

          @media (min-width: 600px) {
            display: none;
          }
        }

        .filters_wrapper {
          display: flex;
          gap: 0.5rem;
          overflow: scroll;
          padding-bottom: 0.75rem;
        }

        .filter {
          margin: 0;
          width: max-content;
          min-width: max-content;
          padding: 0.125rem 1rem;
          color: #fff;
          border: 1px solid var(--primary-color-hover);
          border-radius: 1rem;
          transition: all 0.2s ease-in-out;

          &--active {
            background-color: #8560ca;
            box-shadow: 1px 1px 4px rgba(90, 70, 128, 0.5);
          }

          &:hover,
          &:focus-visible {
            outline: none;
            background-color: rgba(var(--primary-color-rgb), 0.2);
          }

          a:focus {
            outline: none;
          }
        }
      `}</style>
    </>
  )
}

const filters = [
  {
    label: 'Most liked',
    queryChanges: {
      engagement: 'reactions',
    },
  },
  {
    label: 'Most recasted',
    queryChanges: {
      engagement: 'recasts',
    },
  },
  {
    label: 'Most watched',
    queryChanges: {
      engagement: 'watches',
    },
  },
  {
    label: 'Most replied',
    queryChanges: {
      engagement: 'replies',
    },
  },
]
