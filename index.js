require('dotenv').config()
const axios = require('axios')
const express = require('express')
const app = express()

// Create a MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb')
const client = new MongoClient(process.env.DATABASE_URI, {
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

// Configure Express
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/api', (req, res) => {
	res.render('api')
})

// API endpoint for searching casts
app.get('/api/search', async (req, res) => {
	const { count, engagement, media, merkleRoot, page, text, username } =
		req.query
	const startTime = Date.now()

	const db = client.db('farcaster')
	const collection = db.collection('casts')
	const response = await searchCasts(
		collection,
		count,
		engagement,
		media,
		merkleRoot,
		page,
		text,
		username
	)

	// Restructure data
	const formattedResponse = response.map((cast) => {
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
			uri: `farcaster://casts/${cast.merkleRoot}/${
				isReply ? replyParentMerkleRoot : cast.merkleRoot
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

// API endpoint for 'drop your ENS'
app.get('/api/ens', async (req, res) => {
	let { page, parent } = req.query

	count = 50
	page = parseInt(page) || 1
	const offset = (page - 1) * count

	const db = client.db('farcaster')
	const collection = db.collection('casts')
	let casts
	if (parent) {
		casts = collection.find({
			$and: [
				{ 'body.data.text': { $regex: /[^\s]\.+eth/ } },
				{ 'body.data.replyParentMerkleRoot': parent },
			],
		})
	} else {
		return res.send({
			error: 'No parent specified',
		})
	}

	const json = await casts
		.sort({ 'body.publishedAt': -1 })
		.limit(count)
		.skip(offset)
		.toArray()

	res.send(
		json.map((cast) => {
			return {
				text: cast.body.data.text,
				username: cast.body.username,
				displayName: cast.meta.displayName || null,
				merkleRoot: cast.merkleRoot,
				replyParentMerkleRoot:
					cast.body.data.replyParentMerkleRoot || null,
			}
		})
	)
})

app.get('/api/profiles', async (req, res) => {
	const { connected_address } = req.query
	const db = client.db('farcaster')
	const collection = db.collection('profiles')

	if (!connected_address) {
		return res.send({
			error: 'No address specified',
		})
	}

	// Find profiles where the connectedAddress = connect_address
	const profiles = await collection
		.find({
			connectedAddress: connected_address,
		})
		.toArray()

	res.send(profiles)
})

// Search results page
app.get('/search', async (req, res) => {
	let { count, engagement, media, merkleRoot, page, text, username } =
		req.query

	const textQuery = text ? text.replace(/#/g, '%23') : ''

	count = count ? parseInt(count) : 25
	page = page ? parseInt(page) : 1

	const queryParams =
		`engagement=${engagement || ''}` +
		`&merkleRoot=${merkleRoot || ''}` +
		`&media=${media || ''}` +
		`&text=${textQuery}` +
		`&username=${username || ''}` +
		`&count=${count}` +
		`&page=${page}`

	const casts = await axios
		.get(`http://${req.headers.host}/api/search?${queryParams}`)
		.then((response) => response.data.casts)
		.catch((error) => console.error(error))

	res.render('search', {
		casts: casts,
		count: count,
		page: page,
		searchTerm: text,
		searchUsername: username,
		searchMerkle: merkleRoot,
	})
})

// Fartcaster results page
app.get('/fartcaster', async (req, res) => {
	let { count, engagement, media, merkleRoot, page, username } = req.query
	const text = '%23fartcaster' // Hardcoded search text for this route

	count = count ? parseInt(count) : 25
	page = page ? parseInt(page) : 1

	const queryParams =
		`engagement=${engagement || ''}` +
		`media=${media || ''}` +
		`merkleRoot=${merkleRoot || ''}` +
		`&text=${text}` +
		`&username=${username || ''}` +
		`&count=${count}` +
		`&page=${page}`

	const casts = await axios
		.get(`http://${req.headers.host}/api/search?${queryParams}`)
		.then((response) => response.data.casts)
		.catch((error) => console.error(error))

	res.render('fartcaster', {
		casts: casts,
		count: count,
		page: page,
		searchTerm: text,
		searchUsername: username,
		searchMerkle: merkleRoot,
	})
})

// Search casts in the database
async function searchCasts(
	collection,
	count,
	engagement,
	media,
	merkleRoot,
	page,
	text,
	username
) {
	let casts
	count = parseInt(count) || 50
	page = parseInt(page) || 1
	const offset = (page - 1) * count
	const textQuery = text ? text.toString() : ''

	// regex that identifies all cats with '
	const mediaImg =
		// Limit to 200 results per page for performance
		count > 200 ? (count = 200) : (count = count)

	if (merkleRoot) {
		casts = await collection.find({
			$or: [
				{ merkleRoot: merkleRoot },
				{ 'body.data.replyParentMerkleRoot': merkleRoot },
			],
		})
	} else if (media) {
		if (media === 'image') {
			casts = await collection.find({
				'body.data.text': { $regex: /i.imgur.com/ },
			})
		} else if (media === 'music') {
			casts = await collection.find({
				'body.data.text': {
					$regex: /(open.spotify.com|soundcloud.com|music.apple.com|tidal.com)/,
				},
			})
		} else if (media === 'youtube') {
			casts = await collection.find({
				'body.data.text': {
					$regex: /(youtube.com|youtu.be)/,
				},
			})
		} else if (media === 'url') {
			casts = await collection.find({
				$and: [
					{ 'body.data.text': { $regex: /(http:\/\/|https:\/\/)/ } },
					{ 'body.data.text': { $regex: /(.com|.xyz)/ } },
					{ 'body.data.text': { $not: /i.imgur.com/ } },
				],
			})
		}
	} else if (username) {
		if (text) {
			casts = await collection.find({
				$and: [
					{ 'body.username': username.toLowerCase() },
					{
						'body.data.text': {
							$regex: textQuery,
							$options: 'i',
						},
					},
					{
						'body.data.text': {
							$not: {
								$regex: '^(delete:farcaster://|recast:farcaster://)',
							},
						},
					},
				],
			})
		} else {
			casts = await collection.find({
				$and: [
					{ 'body.username': username.toLowerCase() },
					{
						'body.data.text': {
							$not: {
								$regex: '^(delete:farcaster://|recast:farcaster://)',
							},
						},
					},
				],
			})
		}
	} else {
		casts = await collection.find({
			$and: [
				{
					'body.data.text': {
						$regex: textQuery,
						$options: 'i',
					},
				},
				{
					'body.data.text': {
						$not: {
							$regex: '^(delete:farcaster://|recast:farcaster://)',
						},
					},
				},
			],
		})
	}

	const filterMethod = engagement
		? `meta.${engagement}.count`
		: 'body.publishedAt'

	return casts
		.sort({ [filterMethod]: -1 })
		.limit(count)
		.skip(offset)
		.toArray()
}
