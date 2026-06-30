import type { LinkRow } from './db';

type ClickInput = {
  db: D1Database;
  link: LinkRow;
  request: Request;
  platform: App.Platform | undefined;
};

function getDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return 'mobile';
  if (/ipad|tablet/.test(ua)) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return 'Edge';
  if (/chrome\//i.test(userAgent)) return 'Chrome';
  if (/firefox\//i.test(userAgent)) return 'Firefox';
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return 'Safari';
  return 'Other';
}

async function visitorHash(request: Request): Promise<string> {
  const ua = request.headers.get('user-agent') ?? '';
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? '';
  const date = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${date}:${ip}:${ua}`);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export async function recordClick({ db, link, request, platform }: ClickInput) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') ?? '';
  const referrer = request.headers.get('referer') ?? '';
  const cf = platform?.cf;

  await db
    .prepare(`INSERT INTO click_events (
      link_id, referrer, user_agent, country, city, region, colo, device_type, browser,
      utm_source, utm_medium, utm_campaign, visitor_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`) 
    .bind(
      link.id,
      referrer,
      userAgent,
      cf?.country ?? null,
      cf?.city ?? null,
      cf?.region ?? null,
      cf?.colo ?? null,
      getDevice(userAgent),
      getBrowser(userAgent),
      url.searchParams.get('utm_source'),
      url.searchParams.get('utm_medium'),
      url.searchParams.get('utm_campaign'),
      await visitorHash(request)
    )
    .run();
}
