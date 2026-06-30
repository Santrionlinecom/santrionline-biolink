import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { recordClick } from '$lib/server/analytics';
import { getDb, getLinkBySlug } from '$lib/server/db';

export const GET: RequestHandler = async ({ params, request, platform }) => {
  const db = getDb(platform);
  const link = await getLinkBySlug(db, params.slug ?? '');
  if (!link) throw error(404, 'Link tidak ditemukan atau nonaktif.');

  if (db) {
    const job = recordClick({ db, link, request, platform }).catch(() => undefined);
    platform?.context?.waitUntil ? platform.context.waitUntil(job) : await job;
  }

  throw redirect(302, link.url);
};
