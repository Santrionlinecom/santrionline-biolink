import { GRUP_APP, SITUS, SOSMED, JUMLAH_KITAB, TOPIK } from '$lib/jaringan';
import type { RequestHandler } from './$types';

// llms.txt (https://llmstxt.org): ringkasan untuk mesin pencari AI. Dibangun dari $lib/jaringan.ts,
// jadi ikut berubah bila menu/sosmed diubah di sana.
const ASAL = 'https://santrionline.my.id';

export const GET: RequestHandler = () => {
	const baris: string[] = [];
	baris.push('# Mas Yogik — SantriOnline Network', '');
	baris.push('> Halaman tautan resmi Yogik Pratama Aprilian (Mas Yogik), pendiri dan pengembang SantriOnline dari Kota Batu, Jawa Timur, Indonesia. SantriOnline adalah sistem pembinaan generasi muslim berhaluan Ahlussunnah wal Jama\'ah (Aswaja): aqidah, adab, amal, ilmu, keterampilan digital, dan komunitas. Belajar di SantriOnline gratis.', '');
	baris.push('Bahasa utama: Indonesia. Mas Yogik juga guru TPQ, sekretaris takmir masjid, dan developer web, aplikasi, otomasi, serta AI.', '');
	baris.push(`Topik: ${TOPIK.join(', ')}.`, '');
	baris.push('## Situs SantriOnline', '');
	for (const s of SITUS) baris.push(`- [${s.label}](${s.href}): ${s.ket}`);
	baris.push('');
	for (const g of GRUP_APP) {
		baris.push(`## app.santrionline.com — ${g.judul}`, '');
		for (const t of g.item) baris.push(`- [${t.label}](${t.href}): ${t.ket}`);
		baris.push('');
	}
	baris.push('## Sosial media dan kontak', '');
	for (const s of SOSMED) baris.push(`- [${s.nama}](${s.url}): ${s.akun}`);
	baris.push('');
	baris.push('## Optional', '');
	baris.push(`- [Halaman ini](${ASAL}/): profil singkat, ${JUMLAH_KITAB} kitab di perpustakaan app, dan semua tautan di atas`);
	baris.push(`- [Sitemap](${ASAL}/sitemap.xml)`);
	return new Response(baris.join('\n') + '\n', {
		headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' }
	});
};
