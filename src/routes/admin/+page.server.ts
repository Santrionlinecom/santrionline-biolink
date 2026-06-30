import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAdmin, logout } from '$lib/server/auth';
import { getAllLinks, getDb, getProfile } from '$lib/server/db';

type StatRow = { link_id: number; clicks: number; unique_clicks: number; last_click: string | null };
type SourceRow = { referrer: string | null; clicks: number };
type DailyRow = { date: string; clicks: number; unique_clicks: number };

export const load: PageServerLoad = async ({ cookies, platform }) => {
  await requireAdmin(cookies, platform);
  const db = getDb(platform);
  const [profile, links] = await Promise.all([getProfile(db), getAllLinks(db)]);

  let stats: StatRow[] = [];
  let sources: SourceRow[] = [];
  let dailyStats: DailyRow[] = [];
  let totalClicks = 0;
  let clicks7d = 0;

  if (db) {
    stats = (await db.prepare(`SELECT link_id, COUNT(*) AS clicks, COUNT(DISTINCT visitor_hash) AS unique_clicks, MAX(clicked_at) AS last_click FROM click_events GROUP BY link_id`).all<StatRow>()).results ?? [];
    sources = (await db.prepare(`SELECT COALESCE(NULLIF(referrer, ''), 'Direct') AS referrer, COUNT(*) AS clicks FROM click_events GROUP BY COALESCE(NULLIF(referrer, ''), 'Direct') ORDER BY clicks DESC LIMIT 8`).all<SourceRow>()).results ?? [];
    dailyStats = (await db.prepare(`
      WITH RECURSIVE days(date) AS (
        SELECT date('now', '-13 days')
        UNION ALL
        SELECT date(date, '+1 day') FROM days WHERE date < date('now')
      )
      SELECT
        days.date AS date,
        COUNT(click_events.id) AS clicks,
        COUNT(DISTINCT click_events.visitor_hash) AS unique_clicks
      FROM days
      LEFT JOIN click_events ON date(click_events.clicked_at) = days.date
      GROUP BY days.date
      ORDER BY days.date ASC
    `).all<DailyRow>()).results ?? [];
    totalClicks = Number((await db.prepare('SELECT COUNT(*) AS count FROM click_events').first<{ count: number }>())?.count ?? 0);
    clicks7d = Number((await db.prepare("SELECT COUNT(*) AS count FROM click_events WHERE clicked_at >= datetime('now', '-7 days')").first<{ count: number }>())?.count ?? 0);
  }

  return { profile, links, stats, sources, dailyStats, totalClicks, clicks7d, hasDb: Boolean(db) };
};

function asString(form: FormData, key: string) {
  return String(form.get(key) ?? '').trim();
}

export const actions: Actions = {
  logout: async ({ cookies }) => {
    logout(cookies);
    throw redirect(303, '/admin/login');
  },
  profile: async ({ request, cookies, platform }) => {
    await requireAdmin(cookies, platform);
    const db = getDb(platform);
    if (!db) return fail(500, { message: 'D1 belum terhubung.' });
    const form = await request.formData();
    await db.prepare(`UPDATE profiles SET display_name=?, bio=?, avatar_url=?, location=?, primary_cta_text=?, primary_cta_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=1`)
      .bind(asString(form, 'display_name'), asString(form, 'bio'), asString(form, 'avatar_url'), asString(form, 'location'), asString(form, 'primary_cta_text'), asString(form, 'primary_cta_url'))
      .run();
    return { message: 'Profil diperbarui.' };
  },
  upsertLink: async ({ request, cookies, platform }) => {
    await requireAdmin(cookies, platform);
    const db = getDb(platform);
    if (!db) return fail(500, { message: 'D1 belum terhubung.' });
    const form = await request.formData();
    const id = asString(form, 'id');
    const slug = asString(form, 'slug').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const title = asString(form, 'title');
    const url = asString(form, 'url');
    if (!slug || !title || !url) return fail(400, { message: 'Slug, judul, dan URL wajib diisi.' });
    const values = [slug, title, asString(form, 'description'), url, asString(form, 'icon') || '🔗', asString(form, 'category') || 'Utama', Number(asString(form, 'sort_order') || 0), form.get('is_active') ? 1 : 0];
    if (id) {
      await db.prepare(`UPDATE links SET slug=?, title=?, description=?, url=?, icon=?, category=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(...values, Number(id)).run();
    } else {
      await db.prepare(`INSERT INTO links (slug, title, description, url, icon, category, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(...values).run();
    }
    return { message: 'Link disimpan.' };
  },
  deleteLink: async ({ request, cookies, platform }) => {
    await requireAdmin(cookies, platform);
    const db = getDb(platform);
    if (!db) return fail(500, { message: 'D1 belum terhubung.' });
    const form = await request.formData();
    await db.prepare('DELETE FROM links WHERE id = ?').bind(Number(asString(form, 'id'))).run();
    return { message: 'Link dihapus.' };
  }
};
