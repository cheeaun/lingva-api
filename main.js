import {
  getTranslationInfo,
  getTranslationText,
  isValidCode,
  LanguageType,
} from 'npm:lingva-scraper';

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=604800' : 'no-cache', // 1 week
    },
  });
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  // 1. Parse /api/v1/:source/:target/:query
  // 2. Parse /?source=:source&target=:target&query=:query

  let [source = 'auto', target, query] =
    url.pathname.match(/^\/api\/v1\/([^/]+)\/([^/]+)\/(.+)$/)?.slice(1) || [];
  if (query) query = decodeURIComponent(query);
  if (!target || !query) {
    const searchParams = url.searchParams;
    source = searchParams.get('source') || source;
    target = searchParams.get('target') || target;
    query = searchParams.get('query') || query;
  }

  // console.log({
  //   source,
  //   target,
  //   query,
  // });

  if (!target || !query) {
    return jsonResponse({ error: 'Missing required parameters' }, 400);
  }

  if (
    !isValidCode(source, LanguageType.SOURCE) ||
    !isValidCode(target, LanguageType.TARGET)
  ) {
    return jsonResponse({ error: 'Invalid language code' }, 400);
  }

  const translationPromise = getTranslationText(source, target, query);
  const infoPromise = getTranslationInfo(source, target, query);

  try {
    const translation = await translationPromise;
    if (!translation) {
      return jsonResponse({ error: 'No translation found' }, 404);
    }

    const info = await infoPromise;
    return jsonResponse({ translation, info });
  } catch (error) {
    return jsonResponse({ error: error?.message || error }, 500);
  }
});
