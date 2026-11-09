import type { RequestHandler } from './$types';

// Satu-satunya halaman publik yang bisa diindeks adalah beranda (+ llms.txt). /admin dan /r/* tidak dimasukkan.
const ASAL = 'https://santrionline.my.id';

export const GET: RequestHandler = () => {
	const hari = new Date().toISOString().slice(0, 10);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${ASAL}/</loc><lastmod>${hari}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
`;
	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' }
	});
};
