require('dotenv').config()
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

app.post('/search', async (req, res) => {
	const db = client.db('farcaster')
	const collection = db.collection('casts')

	const { query, queryField } = req.body
	const result = await searchCasts(collection, query, queryField)

	// Exclude recasts and deleted casts
	const filteredResult = result.filter((cast) => {
		return (
			!cast.body.data.text.startsWith('recast:farcaster://') &&
			!cast.body.data.text.startsWith('delete:farcaster://')
		)
	})

	// Sort by date
	filteredResult.sort((a, b) => {
		return new Date(b.body.publishedAt) - new Date(a.body.publishedAt)
	})

	// Restructure data
	const formattedResult = filteredResult.map((cast) => {
		const isReply = cast.body.data.replyParentMerkleRoot ? true : false
		const imgurUrl = 'https://i.imgur.com/'
		let text = cast.body.data.text
		let attachment = null

		if (text.includes(imgurUrl)) {
			attachment = imgurUrl + text.split(imgurUrl)[1]
			text = text.split(imgurUrl)[0]
		}

		return {
			text: text,
			reactions: cast.meta?.reactions.count,
			recasts: cast.meta?.recasts.count,
			username: cast.body.username,
			displayName: cast.meta?.displayName,
			avatar: cast.meta?.avatar,
			publishedAt: cast.body.publishedAt,
			uri: `farcaster://${cast.merkleRoot}/${
				isReply ? cast.body.data.replyParentMerkleRoot : cast.merkleRoot
			}`,
			replyParentUsername: isReply
				? cast.meta?.replyParentUsername?.username
				: null,
			replyParent: isReply ? cast.body.data.replyParentMerkleRoot : null,
			attachment: attachment,
		}
	})

	res.render('search', {
		casts: formattedResult,
	})
})

async function searchCasts(collection, query, queryField) {
	let field
	if (queryField === 'replyParent') {
		field = 'merkleRoot'
	} else {
		field = 'body.data.text'
	}

	return await collection
		.find({
			[`${[field][0]}`]: { $regex: query, $options: 'i' },
		})
		.toArray()
}

app.use((req, res, next) => {
	res.redirect('/')
})
