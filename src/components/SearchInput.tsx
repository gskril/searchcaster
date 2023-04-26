import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'
import { useStorage } from '../hooks/useLocalStorage'
import CreatableSelect from 'react-select/creatable'
import Select, { createFilter, MenuListProps, GroupBase } from 'react-select'

import { arrowIcon } from '../assets/icons'
import { FixedSizeList } from 'react-window'

type SearchInputProps = {
  size: 'lg' | undefined
}

export type SearchQuery = {
  text: string[]
  username: string
  advanced: boolean
}

interface Option {
  label: string
  value: string
}

function MenuList(props: MenuListProps<Option, boolean, GroupBase<Option>>) {
  const { options, children, maxHeight, getValue } = props
  if (!children || !Array.isArray(children)) return null
  const [value] = getValue()
  const height = 35
  const initialOffset = options.indexOf(value) * height

  return (
    <FixedSizeList
      height={maxHeight}
      width={''} // 100% width
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      className="menu-list"
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </FixedSizeList>
  )
}

export default function SearchInput({ size, ...props }: SearchInputProps) {
  const router = useRouter()
  const plausible = usePlausible()
  const { getItem, setItem } = useStorage()
  const [mounted, setMounted] = useState<boolean>(false)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
  const [sessionQuery, setSessionQuery] = useState<SearchQuery | undefined>()
  const [keywords, setKeywords] = useState('')
  const [groups, setGroups] = useState<readonly Option[]>([])
  const [user, setUser] = useState<Option>()
  const [allUsers, setAllUsers] = useState<readonly Option[]>([])

  useEffect(() => {
    const searchSession = getItem('search-query', 'session')
    if (searchSession) {
      const _sessionQuery: SearchQuery = JSON.parse(searchSession)
      setIsAdvanced(_sessionQuery.advanced)
      setGroups(_sessionQuery.text.map((t) => { 
        return { label: t, value: t }
      }))
      setUser({ label: `@${_sessionQuery.username}`, value: _sessionQuery.username })
      setSessionQuery(_sessionQuery)
    } else {
      const searchParams = router.query as unknown as SearchQuery
      setSessionQuery(searchParams)
      setIsAdvanced(searchParams.username !== undefined)
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps

    fetch('/api/profiles')
      .then((resp) => resp.json())
      .then((profiles) => {
        return profiles.map((p) => { 
          const { username, displayName } = p.body;
          return {
            label: `@${username} (${displayName})`, 
            value: username,
          }
        })
      })
      .then((options) => setAllUsers(options))
  }, [])

  function handleFormSubmit(e: any) {
    e.preventDefault()
    let query: SearchQuery = {
      text: groups.map((g) => g.value),
      username: user?.value ?? '',
      advanced: isAdvanced,
    }

    const searchParams = new URLSearchParams()
    for (const text of query.text) {
      searchParams.append('text', text)
    }
    if (query.username) searchParams.set('username', query.username)

    // Save query to session storage
    setItem('search-query', JSON.stringify(query), 'session')

    plausible('Search', {
      props: {
        text: query.text.length === 0 ? null : query.text,
        username: query.username === '' ? null : query.username,
      },
    })

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} {...props}>
        {!isAdvanced && (
          <div className="simple-search">
            <input
              type="text"
              name="text"
              placeholder={mounted ? 'Search for any term' : ''}
              defaultValue={groups.length ? groups[0].value : ''}
              onChange={(e) => setGroups([{ label: e.target.value, value: e.target.value }])}
            />
            <input type="hidden" name="username" />
            <button type="submit">{arrowIcon}</button>
          </div>
        )}

        {isAdvanced && (
          <div className="advanced-search">
            <div className="advanced-search__group">
              <div className="advanced-search__label">
                <strong>Keywords</strong>
              </div>
              <CreatableSelect
                isMulti
                isClearable
                menuIsOpen={false}
                components={{ DropdownIndicator: null }}
                inputValue={keywords}
                value={groups}
                onInputChange={(newValue) => setKeywords(newValue)}
                onChange={(newValue) => setGroups(newValue)}
                onKeyDown={(event) => {
                  if (keywords && event.key === "Enter") {
                    setGroups((prev) => [...prev, { label: keywords, value: keywords }]);
                    setKeywords('');
                    event.preventDefault();
                  }
                }}
                placeholder='"new nft collection"'
              />
              <small>
                Press <i>Enter</i> to start a new group of keywords.
                Results will match keywords in at least one group.
              </small>
            </div>
            <div className="advanced-search__group">
              <div className="advanced-search__label">
                <strong>User</strong>
              </div>
              <div className="advanced-search__select">
                <Select
                  isClearable
                  options={allUsers}
                  // override the `components` and `filterOption` fields to reduce lag for large lists
                  // https://github.com/JedWatson/react-select/issues/3128#issuecomment-431397942
                  components={{ MenuList }}
                  filterOption={createFilter({ ignoreAccents: false })}
                  value={user}
                  onChange={(newValue) => setUser(newValue ?? undefined)}
                  placeholder="Any"
                />
              </div>
              <small>Filter casts by their author.</small>
            </div>
            <button className="advanced-search__submit" type="submit">
              Search
            </button>
          </div>
        )}
      </form>

      <div
        className={`advanced-toggle ${
          size !== 'lg' && 'advanced-toggle--inner'
        }`}
        onClick={() => {
          setSessionQuery({
            text: groups.map((g) => g.value),
            username: sessionQuery?.username || '',
            advanced: !isAdvanced,
          })
          setIsAdvanced(!isAdvanced)
        }}
      >
        <input
          type="checkbox"
          className="checkbox"
          checked={isAdvanced}
          onChange={() => setIsAdvanced(!isAdvanced)}
        />
        <span>Advanced {size === 'lg' && 'search'}</span>
      </div>

      <style jsx>{`
        .simple-search {
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

        .advanced-toggle {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding-top: 0.75rem;
          color: #9285ab;

          &--inner {
            padding-top: 0.5rem;
            width: fit-content;
            justify-content: flex-end;
            position: absolute;
            top: 2.75rem;
            right: 1.5rem;

            @media (max-width: 400px) {
              transform: scale(0.8);
              transform-origin: bottom right;
            }
          }

          &:hover {
            cursor: pointer;
          }
        }

        .advanced-search {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background-color: #413656;

          @media (max-width: 768px) {
            gap: 0.5rem;
          }

          &__group {
            width: 100%;
            
            @media (max-width: 768px) {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
              align-items: flex-start;
            }
          }

          &__select {
            color: #0b0b0c;
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

            &:focus-visible {
              background-color: var(--primary-color-hover);
              outline: solid var(--primary-color-light);
            }
          }
        }
      `}</style>
    </>
  )
}
