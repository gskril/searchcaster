# Searchcaster

Easily search for casts on the [Farcaster](https://www.farcaster.xyz/) protocol via [UI](https://searchcaster.xyz/) or [API](https://searchcaster.xyz/api/search).

API parameters:
- `count` - the number of casts to be returned (max 200)
- `merkleRoot` - the unique identifier of a cast which returns a cast and all of its direct replies (overwrites all other parameters)
- `page` - offsets the response by `count` * `page - 1` casts
-	`text` - return casts by text matching (case insensitive)
-	`username` - return all casts, including replies, from a certain user

## Run locally
1. Clone repo
2. Install dependencies via `npm install`
3. Create a MongoDB database ([Atlas](https://www.mongodb.com/atlas) recommended)
4. Rename `.env.example` to `.env` and add your MongoDB Connection String URI
5. Start a local server via `npm start`
6. Open [localhost:3000](http://localhost:3000/)
