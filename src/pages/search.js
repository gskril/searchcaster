import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { likeIcon, recastIcon, watchIcon } from '../assets/icons'
import { getRelativeDate } from '../utils/date'
import { formatCastText } from '../utils/cast'
import { searchCasts } from './api/search'

export default function Search({ data, query }) {
	const casts = data.casts
	const router = useRouter()

	// Redirect home if the user is on desktop and doesn't have an ETH wallet
	useEffect(() => {
		if (window.innerWidth > 500 && !window.ethereum) {
			router.push('/')
		}
	}, [router])

	return (
		<div className="container">
			<div className="header">
				<div className="header-flex mb-2">
					<div className="logo">
						<Image
							src="/img/logo.png"
							width={48}
							height={48}
							alt="Farcaster logo"
						/>
					</div>
					<h1>Search Results</h1>
				</div>
				<Link href="/">
					<a>Return home</a>
				</Link>
			</div>

			{casts.length > 0 ? (
				<div className="casts">
					{casts.map((cast, i) => (
						<div key={cast.merkleRoot}>
							<div className="cast">
								<div className="cast__body">
									<div className="cast__author">
										{cast.meta.avatar && (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={cast.meta.avatar}
												className="cast__avatar"
												alt=""
												width={44}
												height={44}
											/>
										)}
										<div className="cast__names">
											<span className="cast__display-name">
												{cast.meta.displayName}
											</span>
											<Link href={cast.body.username}>
												<a className="cast__username">
													@{cast.body.username}
												</a>
											</Link>
										</div>
									</div>

									<span className="cast__date">
										{getRelativeDate(cast.body.publishedAt)}
									</span>

									<p className="cast__text">
										{formatCastText(cast.body.data.text)}
									</p>

									{cast.body.data.image && (
										<a
											href={cast.body.data.image}
											className="cast__attachment-link"
											target="_blank"
											rel="noreferrer"
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={cast.body.data.image}
												className="cast__attachment"
												loading="lazy"
												alt=""
											/>
										</a>
									)}

									<div className="cast__engagement">
										<div>
											{likeIcon}
											<span>
												{cast.meta.reactions.count}
											</span>
										</div>
										<div>
											{recastIcon}
											<span>
												{cast.meta.recasts.count}
											</span>
										</div>
										<div>
											{watchIcon}
											<span>
												{cast.meta.watches.count}
											</span>
										</div>
									</div>
								</div>

								<div className="cast__meta">
									{cast.body.data.replyParentMerkleRoot ? (
										cast.body.data.replyParentMerkleRoot !==
											query.merkleRoot && (
											<span className="cast__reply">
												In reply to{' '}
												<Link
													href={`/search?merkleRoot=${cast.body.data.replyParentMerkleRoot}`}
												>
													<a>
														@
														{
															cast.meta
																.replyParentUsername
																.username
														}
													</a>
												</Link>
											</span>
										)
									) : (
										<a
											href={cast.uri}
											className="cast__link"
										>
											Open in Farcaster
										</a>
									)}
									{query.merkleRoot && i === 0 ? null : (
										<Link
											href={`/search?merkleRoot=${cast.merkleRoot}`}
										>
											<a className="cast__reply--children">
												See replies
											</a>
										</Link>
									)}
								</div>
							</div>

							{query.merkleRoot && i === 0 && (
								<p className="cast--replies-msg">
									{casts.length > 1
										? 'Direct replies:'
										: 'No direct replies'}
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<p>No results found.</p>
			)}
		</div>
	)
}

export async function getServerSideProps({ query, res }) {
	res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

	const data = await searchCasts(query)

	if (query.merkleRoot) {
		data.casts.reverse()
	}

	return {
		props: {
			data,
			query,
		},
	}
}
