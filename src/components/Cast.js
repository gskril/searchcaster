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
        className="cast h-entry"
        role="button"
        onClick={(e) => {
          // if the user selected text, or clicked on a link, don't navigate
          if (!window.getSelection().toString() && e.target.tagName !== 'A') {
            router.push(`/search?merkleRoot=${cast.merkleRoot}`)
          }
        }}
      >
        {cast.body.data.replyParentMerkleRoot && (
          <Link
            href={`/search?merkleRoot=${cast.body.data.replyParentMerkleRoot}`}
          >
            <a className="reply-indicator">
              In reply to <span>@{cast.meta.replyParentUsername.username}</span>
            </a>
          </Link>
        )}

        <div className="cast__header">
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
          <span
            className="cast__date dt-published"
            title={new Date(cast.body.publishedAt).toLocaleString()}
          >
            {cast.body.publishedAt && getRelativeDate(cast.body.publishedAt)}
          </span>
        </div>

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

        <div className="cast__bottom">
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

          <a href={cast.uri} className="cast__link u-url u-uid">
            Open in Farcaster
          </a>
        </div>
      </div>

      <style jsx>{`
        .cast {
          position: relative;
          display: block;
          overflow: hidden;
          padding: 1rem;
          border-radius: 0.5rem;
          background: rgba(53, 41, 77, 0.2);
          border: 1px solid rgba(90, 70, 128, 0.5);

          &:hover {
            background-color: #291f3c;
            cursor: pointer;
          }
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

        .cast__header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          justify-content: space-between;
        }

        .cast__date {
          color: #8c7bab;
          font-size: 0.875rem;
        }

        .reply-indicator {
          display: block;
          margin-bottom: 1rem;
          margin-top: -0.25rem;
          color: #a08fbf;
          font-size: 0.875rem;

          & > span {
            color: #997bd0;
          }
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

        .cast__bottom {
          display: flex;
          gap: 0.5rem 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          align-items: center;
          justify-content: space-between;
        }

        .cast__engagement {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: fit-content;
          color: #8c7bab;
          align-items: center;
          font-size: 0.875rem;
          gap: 2rem;

          @media screen and (max-width: 768px) {
            gap: 1rem;
          }

          & > div {
            display: flex;
            align-items: center;
            gap: 0.375rem;
          }
        }

        .cast__link {
          color: #997bd0;
          font-size: 0.9375rem;
          transition: color 0.1s ease-in-out;

          &:hover {
            color: #8257d1;
          }
        }
      `}</style>
    </>
  )
}
