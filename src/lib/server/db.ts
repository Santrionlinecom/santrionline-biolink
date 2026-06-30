export type Profile = {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  location: string | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  theme: string;
};

export type LinkRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  url: string;
  icon: string | null;
  category: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export const fallbackProfile: Profile = {
  id: 1,
  username: 'santrionline',
  display_name: 'Mas Yogik • SantriOnline',
  bio: 'Owner SantriOnline, developer, guru TPQ, dan penggerak pembinaan generasi muslim digital.',
  avatar_url: null,
  location: 'Batu, Jawa Timur',
  primary_cta_text: 'Buka SantriOnline.com',
  primary_cta_url: 'https://santrionline.com',
  theme: 'emerald'
};

export const fallbackLinks: LinkRow[] = [
  { id: 1, slug: 'santrionline', title: 'SantriOnline.com', description: 'Platform pembinaan generasi muslim.', url: 'https://santrionline.com', icon: '🕌', category: 'Utama', sort_order: 1, is_active: 1, created_at: '', updated_at: '' },
  { id: 2, slug: 'app', title: 'App SantriOnline', description: 'Dashboard lembaga/TPQ.', url: 'https://app.santrionline.com', icon: '📚', category: 'Produk', sort_order: 2, is_active: 1, created_at: '', updated_at: '' },
  { id: 3, slug: 'whatsapp', title: 'WhatsApp Mas Yogik', description: 'Hubungi untuk kerja sama.', url: 'https://wa.me/6287854545274', icon: '💬', category: 'Kontak', sort_order: 3, is_active: 1, created_at: '', updated_at: '' }
];

export function getDb(platform: App.Platform | undefined): D1Database | undefined {
  return platform?.env?.BIOLINK_DB;
}

export async function getProfile(db: D1Database | undefined): Promise<Profile> {
  if (!db) return fallbackProfile;
  try {
    const profile = await db.prepare('SELECT * FROM profiles WHERE id = 1').first<Profile>();
    return profile ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function getActiveLinks(db: D1Database | undefined): Promise<LinkRow[]> {
  if (!db) return fallbackLinks;
  try {
    const rows = await db.prepare('SELECT * FROM links WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all<LinkRow>();
    return rows.results?.length ? rows.results : fallbackLinks;
  } catch {
    return fallbackLinks;
  }
}

export async function getAllLinks(db: D1Database | undefined): Promise<LinkRow[]> {
  if (!db) return fallbackLinks;
  const rows = await db.prepare('SELECT * FROM links ORDER BY sort_order ASC, id ASC').all<LinkRow>();
  return rows.results ?? [];
}

export async function getLinkBySlug(db: D1Database | undefined, slug: string): Promise<LinkRow | null> {
  if (!db) return fallbackLinks.find((link) => link.slug === slug && link.is_active) ?? null;
  try {
    return await db.prepare('SELECT * FROM links WHERE slug = ? AND is_active = 1').bind(slug).first<LinkRow>();
  } catch {
    return fallbackLinks.find((link) => link.slug === slug && link.is_active) ?? null;
  }
}
