import { useRouter } from 'next/router'
import Link from 'next/link'

import { formatCastText } from '../utils/cast'
import { getRelativeDate } from '../utils/date'
import { likeIcon, recastIcon, commentIcon } from '../assets/icons'

export default function Cast({ cast, query }) {
  const router = useRouter()

  return (
    <>
      <div
        className="cast unstyled-link h-entry"
        role="button"
        onClick={(e) => {
          // if the user selected text, or clicked on a link, don't navigate
          if (!window.getSelection().toString() && e.target.tagName !== 'A') {
            router.push(`/search?merkleRoot=${cast.merkleRoot}`)
          }
        }}
      >
        <div className="cast__author h-card">
          {cast.meta.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cast.meta.avatar}
              className="cast__avatar u-photo"
              alt=""
              width={44}
              height={44}
            />
          )}
          <div className="cast__names">
            <span className="cast__display-name p-name p-nickname">
              {cast.meta.displayName}
            </span>
            <Link href={`/search?username=${cast.body.username}`}>
              <a className="cast__username u-url u-uid">
                @{cast.body.username}
              </a>
            </Link>
          </div>
        </div>

        <span className="cast__date dt-published">
          {cast.body.publishedAt && getRelativeDate(cast.body.publishedAt)}
        </span>

        <p className="cast__text e-content">
          {formatCastText(cast.body.data.text, query.text)}
        </p>

        {cast.body.data.image && (
          <a
            href={cast.body.data.image}
            className="cast__attachment-link u-photo u-featured"
            target="_blank"
            rel="noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cast.body.data.image}
              className="cast__attachment u-photo u-featured"
              loading="lazy"
              alt=""
            />
          </a>
        )}

        <div className="cast__engagement">
          <div>
            {commentIcon}
            <span>{cast.meta.numReplyChildren}</span>
          </div>
          <div>
            {recastIcon}
            <span>{cast.meta.recasts.count}</span>
          </div>
          <div>
            {likeIcon}
            <span>{cast.meta.reactions.count}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cast {
          position: relative;
          display: block;
          overflow: hidden;
          padding: 1.25rem 1rem;
          border-bottom: 2px solid #35294d;

          &:hover {
            background-color: #291f3c;
            cursor: pointer;
          }
        }

        .unstyled-link {
          text-decoration: none;
          color: unset;
        }

        .cast--replies-msg {
          margin-bottom: 1rem;
          font-weight: 600;
          text-align: center;
        }

        .cast__author {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .cast__avatar {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 1.5rem;
          background: var(--bg-color);
          margin-right: 0.75rem;
          box-shadow: 0px 0.125rem 0.375rem -0.0625rem rgba(var(--shadow-rgb), 0.08);
        }

        .cast__names {
          display: flex;
          flex-direction: column;
        }

        .cast__display-name {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: -0.125rem;
        }

        .cast__username {
          color: #8c7bab;
          opacity: 0.95;
          font-size: 0.875rem;

          &:hover,
          &:focus-visible {
            cursor: pointer;
            text-decoration: underline;
          }
        }

        .cast__date {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: #8c7bab;
          font-size: 0.875rem;
        }

        .cast__text {
          white-space: pre-wrap;
        }

        .cast__attachment-link {
          display: block;
          border-radius: 0.5rem;
          margin-top: 1rem;
          max-width: 25rem;
          overflow: hidden;
        }

        .cast__attachment {
          width: 100%;
        }

        .cast__engagement {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: fit-content;
          font-size: 0.875rem;
          color: #8c7bab;
          align-items: center;
          margin-top: 1rem;
          gap: 2rem;

          & > div {
            display: flex;
            align-items: center;
            gap: 0.375rem;
          }
        }
      `}</style>
    </>
  )
}
