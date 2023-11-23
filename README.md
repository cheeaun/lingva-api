# Lingva API

Simple API endpoint based on [Lingva Translate](https://github.com/thedaviddelta/lingva-translate).

- Written in [Deno](https://deno.com/).
- Serverless, on [Deno Deploy](https://deno.com/deploy).
- There's no front-end.
- Uses [fork](https://github.com/cheeaun/lingva-scraper) of [Lingva Scraper](https://github.com/thedaviddelta/lingva-scraper).

## Development

Requires [Deno](https://deno.com/).

- `deno task dev` - Run the server with watch mode, for development.
- `deno task debug` - Run the server with watch mode and debugging, for development.
- `deno task start` - Run the server.

## REST API Endpoints

- `GET /api/v1/:SOURCE/:TARGET/:QUERY`
- `GET /api/v1/audio/:TARGET/:QUERY`
- `GET /api/v1/languages/(source|target)?`

Parameters:
- `SOURCE` - Source language, default: `auto`.
- `TARGET` - Target language, required.
- `QUERY` - Text to translate, required.

## License

Lingva Translate ©️ [thedaviddelta](https://github.com/thedaviddelta) & contributors.