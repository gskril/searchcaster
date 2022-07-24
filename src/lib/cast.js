export default function formatCasts(casts) {
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
