CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  username TEXT NOT NULL DEFAULT 'santrionline',
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  primary_cta_text TEXT,
  primary_cta_url TEXT,
  theme TEXT NOT NULL DEFAULT 'emerald',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '🔗',
  category TEXT DEFAULT 'Utama',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS click_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id INTEGER NOT NULL,
  clicked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  colo TEXT,
  device_type TEXT,
  browser TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  visitor_hash TEXT,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
CREATE INDEX IF NOT EXISTS idx_links_active_order ON links(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_click_events_link_time ON click_events(link_id, clicked_at);
CREATE INDEX IF NOT EXISTS idx_click_events_time ON click_events(clicked_at);

INSERT OR IGNORE INTO profiles (id, username, display_name, bio, avatar_url, location, primary_cta_text, primary_cta_url)
VALUES (
  1,
  'santrionline',
  'Mas Yogik • SantriOnline',
  'Owner SantriOnline, developer, guru TPQ, dan penggerak pembinaan generasi muslim digital.',
  '',
  'Batu, Jawa Timur',
  'Buka SantriOnline.com',
  'https://santrionline.com'
);

INSERT OR IGNORE INTO links (slug, title, description, url, icon, category, sort_order) VALUES
('santrionline', 'SantriOnline.com', 'Platform pembinaan generasi muslim: aqidah, adab, ilmu, skill, dan habit.', 'https://santrionline.com', '🕌', 'Utama', 1),
('app', 'App SantriOnline', 'Dashboard lembaga/TPQ dan sistem pembinaan digital.', 'https://app.santrionline.com', '📚', 'Produk', 2),
('whatsapp', 'WhatsApp Mas Yogik', 'Hubungi untuk kerja sama, website, atau SantriOnline.', 'https://wa.me/6287854545274', '💬', 'Kontak', 3),
('tiktok', 'TikTok SantriOnline', 'Konten pendek edukasi, dakwah, dan pembinaan santri digital.', 'https://www.tiktok.com/@santrionline.com', '🎬', 'Sosmed', 4),
('email', 'Email', 'masyogik@santrionline.com', 'mailto:masyogik@santrionline.com', '✉️', 'Kontak', 5);
