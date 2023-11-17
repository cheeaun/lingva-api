import { Hono } from 'https://deno.land/x/hono/mod.ts';

import {
  getTranslationInfo,
  getTranslationText,
  isValidCode,
  LanguageType,
} from 'npm:lingva-scraper';

const app = new Hono();

app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.header('X-Response-Time', `${end - start}`);
  c.header('Access-Control-Allow-Origin', '*');
  c.header('content-type', 'application/json; charset=utf-8');
  c.header(
    'cache-control',
    c.res.status === 200 ? 'public, max-age=604800' : 'no-cache',
  ); // 1 week
});

app.get('/', (c) =>
  c.json({ message: 'Please use /api/v1/:source/:target/:query' }),
);

app.get('/api/v1/:source/:target/:query', async (c) => {
  const { source = 'auto', target, query } = c.req.param();

  // console.log({
  //   source,
  //   target,
  //   query,
  // });

  if (
    !isValidCode(source, LanguageType.SOURCE) ||
    !isValidCode(target, LanguageType.TARGET)
  ) {
    return c.json({ error: 'Invalid language code' }, 400);
  }

  const translationPromise = getTranslationText(source, target, query);
  const infoPromise = getTranslationInfo(source, target, query);

  try {
    const translation = await translationPromise;
    if (!translation) {
      return c.json({ error: 'No translation found' }, 404);
    }

    const info = await infoPromise;
    return c.json({ translation, info });
  } catch (error) {
    return c.json({ error: error?.message || error }, 500);
  }
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

Deno.serve(app.fetch);
