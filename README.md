# Searchcaster

Easily search for casts on the [Farcaster](https://www.farcaster.xyz/) protocol via [UI](https://searchcaster.xyz/) or [API](https://searchcaster.xyz/docs).

Powered by [this Farcaster Indexer](https://github.com/gskril/farcaster-indexer).

## Run locally

1. Clone the [indexer repo](https://github.com/gskril/farcaster-indexer) and follow instructions to setup a database on [Supabase](https://supabase.com/)
2. Clone this repo and install dependencies via `yarn install`
3. Rename `.env.example` to `.env` and enter your database credentials
4. Start a local server via `yarn dev`
5. Open [localhost:3000](http://localhost:3000/)

## Extra tip

To make the `regex` search param work, you'll need to [create an SQL function in Supabase](https://github.com/supabase/supabase/discussions/1822?sort=new#discussioncomment-827513):

```sql
create or replace function casts_regex(regex text) returns setof casts as $$
  select * from casts where text ~ regex;
$$ language sql;
```
