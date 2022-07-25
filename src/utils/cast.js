import { createElement } from 'react'

export function formatCasts(casts) {
	return casts.map((cast) => {
		const replyParentMerkleRoot =
			cast.body.data.replyParentMerkleRoot || null
		const isReply = replyParentMerkleRoot ? true : false
		const imgurUrl = 'https://i.imgur.com/'
		let text = cast.body.data.text
		let attachment = null

		if (text.includes(imgurUrl)) {
			attachment = imgurUrl + text.split(imgurUrl)[1]
			text = text.split(imgurUrl)[0]
		}

		return {
			body: {
				publishedAt: cast.body.publishedAt,
				username: cast.body.username,
				data: {
					text: text,
					image: attachment,
					replyParentMerkleRoot: replyParentMerkleRoot,
				},
			},
			meta: {
				displayName: cast.meta?.displayName,
				avatar: cast.meta?.avatar.replace(
					'https://storage.opensea.io/',
					'https://openseauserdata.com/'
				),
				isVerifiedAvatar: cast.meta?.isVerifiedAvatar,
				reactions: {
					count: cast.meta?.reactions.count,
					type: cast.meta?.reactions.type,
				},
				recasts: {
					count: cast.meta?.recasts.count,
				},
				watches: {
					count: cast.meta?.watches.count,
				},
				replyParentUsername: {
					username: cast.meta?.replyParentUsername?.username || null,
				},
			},
			merkleRoot: cast.merkleRoot,
			uri:
				!isReply &&
				`farcaster://casts/${cast.merkleRoot}/${
					isReply ? replyParentMerkleRoot : cast.merkleRoot
				}`,
		}
	})
}

export function formatCastText(text) {
	const links = text.match(
		// Regex to identify URLS with .com, .xyz, .net, or .org extension (it doesn't have to start with http:// or https://)
		/\b(?:https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
	)

	if (links) {
		links.forEach((link) => {
			text = text.replace(
				link,
				`<a href="${link}" target="_blank" rel="noopener">${link}</a>`
			)
		})
	}

	const farcasterUri = text.match(
		// Regex to identify a Farcater URI
		/farcaster:\/\/casts\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+)/g
	)

	if (farcasterUri) {
		farcasterUri.forEach((uri) => {
			const shortenedUri = uri.slice(0, 20) + '...' + uri.slice(-10)
			text = text.replace(
				uri,
				`<a href="${uri}" rel="noopener">${shortenedUri}</a>`
			)
		})
	}

	const mention = text.match(
		// Regex to identify a @username mention
		/@([a-zA-Z0-9_]+)/g
	)

	if (mention) {
		mention.forEach((mention) => {
			// If the mention is at the beginning of the text, or it has a space before it, it's a valid mention
			if (
				text.startsWith(mention) ||
				text.split(mention)[0].endsWith(' ')
			) {
				text = text.replace(
					mention,
					`<a href="https://farcaster.com/@${mention.slice(
						1
					)}" rel="noopener">${mention}</a>`
				)
			}
		})
	}

	return (
		<span
			dangerouslySetInnerHTML={{
				__html: text,
			}}
		/>
	)
}
