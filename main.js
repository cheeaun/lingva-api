import { Hono } from 'https://deno.land/x/hono/mod.ts';

import {
  getTranslationInfo,
  getTranslationText,
  getAudio,
  isValidCode,
  LanguageType,
  languageList,
} from 'npm:lingva-scraper';

const app = new Hono();

app.get('/', (c) => {
  const routes = app.routes.reduce((acc, route) => {
    if (route.path.startsWith('/api')) {
      acc.push(`${route.path}`);
    }
    return acc;
  }, []);
  c.header('Access-Control-Allow-Origin', '*');
  return c.json({ routes });
});

app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.header('X-Response-Time', `${end - start}`);
  c.header('Access-Control-Allow-Origin', '*');
  c.header(
    'cache-control',
    c.res.status === 200 ? 'public, max-age=604800' : 'no-cache',
  ); // 1 week
});

app.get('/api/v1/:source/:target/:query', async (c) => {
  const { source = 'auto', target, query } = c.req.param();

  // console.log({
  //   source,
  //   target,
  //   query,
  // });

  if (!isValidCode(source, LanguageType.SOURCE)) {
    return c.json({ error: 'Invalid source language' }, 400);
  }
  if (!isValidCode(target, LanguageType.TARGET)) {
    return c.json({ error: 'Invalid target language' }, 400);
  }

  const translationPromise = getTranslationText(source, target, query);
  const infoPromise = getTranslationInfo(source, target, query);

  try {
    const translation = await translationPromise;
    if (!translation) {
      return c.json(
        { error: 'An error occurred while retrieving the translation' },
        500,
      );
    }

    const info = await infoPromise;
    return c.json({ translation, info });
  } catch (error) {
    return c.json({ error: error?.message || error }, 500);
  }
});

app.get('/api/v1/audio/:lang/:query', async (c) => {
  const { lang, query } = c.req.param();
  if (!isValidCode(lang, LanguageType.TARGET)) {
    return c.json({ error: 'Invalid target language' }, 400);
  }

  try {
    const audio = await getAudio(lang, query);
    if (!audio) {
      return c.json(
        { error: 'An error occurred while retrieving the audio' },
        500,
      );
    }
    return c.json({ audio });
  } catch (error) {
    return c.json({ error: error?.message || error }, 500);
  }
});

app.get('/api/v1/languages/:type?', (c) => {
  const { type } = c.req.param();
  if (type && type !== LanguageType.SOURCE && type !== LanguageType.TARGET) {
    return c.json({ error: "Type should be 'source', 'target' or empty" }, 400);
  }

  const langEntries = Object.entries(languageList[type ?? 'all']);
  const languages = langEntries.map(([code, name]) => ({ code, name }));

  return c.json({ languages });
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

Deno.serve(app.fetch);
