import type { PageServerLoad } from './$types';
import { getActiveLinks, getDb, getProfile } from '$lib/server/db';

export const load: PageServerLoad = async ({ platform }) => {
  const db = getDb(platform);
  const [profile, links] = await Promise.all([getProfile(db), getActiveLinks(db)]);

  return {
    profile,
    links,
    siteUrl: platform?.env?.PUBLIC_SITE_URL ?? 'https://santrionline.my.id'
  };
};
