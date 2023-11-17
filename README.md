# Lingva API

Simple API endpoint based on [Lingva Translate](https://github.com/thedaviddelta/lingva-translate).

- Written in [Deno](https://deno.com/).
- Serverless, on [Deno Deploy](https://deno.com/deploy).
- There's no front-end.
- Not all API endpoints from Lingva Translate are implemented.
- Uses [lingva-scraper](https://github.com/thedaviddelta/lingva-scraper).

## Development

Requires [Deno](https://deno.com/).

- `deno task dev` - Run the server with watch mode, for development.
- `deno task start` - Run the server.

## REST API Endpoints

- `GET /api/v1/:SOURCE/:TARGET/:QUERY`
- `GET /api/v1/audio/:TARGET/:QUERY`
- `GET /api/v1/languages/?:(SOURCE|TARGET)`

Parameters:
- `SOURCE` - Source language, default: `auto`.
- `TARGET` - Target language, required.
- `QUERY` - Text to translate, required.