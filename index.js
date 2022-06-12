require('dotenv').config()
const axios = require('axios')
const express = require('express')
const app = express()

// Create a MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb')
const client = new MongoClient(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

// Connect to the database
client.connect(async (err) => {
	if (err) {
		client.close()
		return console.error(err)
	}
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

// accept a query and return the results like an API
app.get('/api/search', async (req, res) => {
	const { merkleRoot, text, username } = req.query
	const startTime = Date.now()

	const db = client.db('farcaster')
	const collection = db.collection('casts')
	const response = await searchCasts(collection, merkleRoot, text, username)

	// Exclude recasts and deleted casts
	const filteredResponse = response.filter((cast) => {
		return (
			!cast.body.data.text.startsWith('recast:farcaster://') &&
			!cast.body.data.text.startsWith('delete:farcaster://')
		)
	})

	// Sort by date
	filteredResponse.sort((a, b) => {
		return new Date(b.body.publishedAt) - new Date(a.body.publishedAt)
	})

	// Restructure data
	const formattedResponse = filteredResponse.map((cast) => {
		const isReply = cast.body.data.replyParentMerkleRoot ? true : false
		const imgurUrl = 'https://i.imgur.com/'
		let text = cast.body.data.text
		let attachment

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
					replyParentMerkleRoot: cast.body.data.replyParentMerkleRoot,
				},
			},
			meta: {
				displayName: cast.meta?.displayName,
				avatar: cast.meta?.avatar,
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
					username: cast.meta?.replyParentUsername?.username,
				},
			},
			merkleRoot: cast.merkleRoot,
			uri: `farcaster://${cast.merkleRoot}/${
				isReply ? cast.body.data.replyParentMerkleRoot : cast.merkleRoot
			}`,
		}
	})

	// When fetching a specific cast, reverse the order to show the replies after the cast
	if (merkleRoot) {
		formattedResponse.reverse()
	}

	const endTime = Date.now()
	const elapsedTime = endTime - startTime

	res.send({
		casts: formattedResponse,
		meta: {
			count: formattedResponse.length,
			responseTime: elapsedTime,
		},
	})
})

app.get('/search', async (req, res) => {
	const { merkleRoot, text, username } = req.query

	const queryParams =
		`merkleRoot=${merkleRoot || ''}` +
		`&text=${text || ''}` +
		`&username=${username || ''}`

	const casts = await axios
		.get(`http://${req.headers.host}/api/search?${queryParams}`)
		.then((response) => response.data.casts)
		.catch((error) => console.error(error))

	res.render('search', {
		casts: casts,
		searchTerm: text,
		searchUsername: username,
		searchMerkle: merkleRoot,
	})
})

async function searchCasts(collection, merkleRoot, text, username) {
	if (merkleRoot) {
		return await collection
			.find({
				$or: [
					{ merkleRoot: merkleRoot },
					{ 'body.data.replyParentMerkleRoot': merkleRoot },
				],
			})
			.toArray()
	} else if (username) {
		if (text) {
			return await collection
				.find({
					'body.username': { $regex: username, $options: 'i' },
					'body.data.text': { $regex: text, $options: 'i' },
				})
				.toArray()
		}

		return await collection
			.find({
				'body.username': { $regex: username, $options: 'i' },
			})
			.toArray()
	} else {
		return await collection
			.find({
				'body.data.text': { $regex: text, $options: 'i' },
			})
			.toArray()
	}
}
