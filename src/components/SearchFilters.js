import { useRouter } from 'next/router'

export default function SearchFilters({ query }) {
  const router = useRouter()

  return (
    <>
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
                router.push({
                  pathname: '/search',
                  query: {
                    ...query,
                    ...filter.queryChanges,
                    page: 1,
                  },
                })
              }}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .filters_wrapper {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
        }

        .filter {
          margin: 0;
          width: fit-content;
          padding: 0.125rem 0.75rem;
          color: #fff;
          border: 1px solid var(--primary-color-hover);
          border-radius: 0.25rem;
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
]
