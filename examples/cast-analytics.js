const axios = require('axios')

async function getDailyCasts() {
	const casts = await axios
		.get('http://localhost:3000/api/search?count=20000')
		.then((res) => res.data.casts)

	const castsByDate = {}
	casts.forEach((cast) => {
		const date = new Date(cast.body.publishedAt)
		const dateString = `${date.getFullYear()}-${
			date.getMonth() + 1
		}-${date.getDate()}`
		if (!castsByDate[dateString]) {
			castsByDate[dateString] = []
		}
		castsByDate[dateString].push(cast)
	})

	for (let date in castsByDate) {
		const dayOfTheWeek = new Date(date).getDay()
		const dayString = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		][dayOfTheWeek]

		console.log(`${date} (${dayString}): ${castsByDate[date].length}`)
	}
}

getDailyCasts()
