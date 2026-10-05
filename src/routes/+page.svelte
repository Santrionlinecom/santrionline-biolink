<script lang="ts">
  import '../styles/beranda.css';
  import { onMount } from 'svelte';
  import { APP, GRUP_APP, JUMLAH_HALAMAN_APP, SITUS, SOSMED, TOPIK } from '$lib/jaringan';

  let { data } = $props();

  // Teks berganti di bawah nama (efek mesin ketik)
  const PERAN = ['Owner SantriOnline', 'Developer Web & Aplikasi', 'Guru TPQ', 'Pembina generasi muslim digital'];
  let teks = $state(PERAN[0]);
  let gerakMati = $state(false);

  // Angka yang dihitung naik saat terlihat — semuanya fakta, bukan klaim
  const ANGKA = [
    { n: JUMLAH_HALAMAN_APP, akhiran: '+', ket: 'halaman di app' },
    { n: 188, akhiran: '', ket: 'kitab rujukan Tanya Kitab' },
    { n: 30, akhiran: '', ket: 'juz mushaf digital' },
    { n: 25, akhiran: '', ket: 'rasul dikenalkan' }
  ];
  let hitung = $state(ANGKA.map(() => 0));

  const TITIK = Array.from({ length: 22 }, (_, i) => ({
    x: (i * 37) % 100,
    d: 9 + ((i * 13) % 12),
    t: -((i * 7) % 14),
    s: 2 + (i % 4)
  }));

  const sameAs = SOSMED.filter((s) => s.url.startsWith('http')).map((s) => s.url);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yogik Pratama Aprilian',
    alternateName: 'Mas Yogik',
    jobTitle: 'Owner & Lead Developer SantriOnline',
    url: 'https://santrionline.my.id',
    image: 'https://santrionline.my.id/images/mas-yogik-profile.webp',
    worksFor: { '@type': 'Organization', name: 'SantriOnline', url: 'https://santrionline.com' },
    sameAs: [...sameAs, 'https://santrionline.com', APP, 'https://masyogik.santrionline.com']
  });

  function muncul(node: HTMLElement, jeda = 0) {
    node.style.setProperty('--jeda', `${jeda}ms`);
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('tampil');
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (node.classList.add('tampil'), io.disconnect())),
      { threshold: 0.12 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  function sorot(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  }

  function mulaiHitung(node: HTMLElement) {
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      if (gerakMati) return (hitung = ANGKA.map((a) => a.n));
      const t0 = performance.now();
      const jalan = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        const e = 1 - Math.pow(1 - p, 3);
        hitung = ANGKA.map((a) => Math.round(a.n * e));
        if (p < 1) requestAnimationFrame(jalan);
      };
      requestAnimationFrame(jalan);
    });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(() => {
    gerakMati = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (gerakMati) return;
    let i = 0, pos = PERAN[0].length, hapus = true, henti = 18;
    const id = setInterval(() => {
      if (henti > 0) return henti--;
      const kata = PERAN[i];
      if (hapus) {
        pos--;
        if (pos <= 0) { hapus = false; i = (i + 1) % PERAN.length; }
      } else {
        pos++;
        if (pos >= PERAN[i].length) { hapus = true; henti = 22; }
      }
      teks = (hapus ? kata : PERAN[i]).slice(0, Math.max(0, pos));
    }, 70);
    return () => clearInterval(id);
  });
</script>

<svelte:head>
  <title>{data.profile.display_name} — SantriOnline Network</title>
  <meta name="description" content="{data.profile.bio} Jelajahi semua halaman SantriOnline: kitab, mushaf, tokoh, TPQ, buku digital, video, dan sosial media Mas Yogik." />
  <link rel="canonical" href="https://santrionline.my.id/" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="{data.profile.display_name} — SantriOnline Network" />
  <meta property="og:description" content={data.profile.bio} />
  <meta property="og:url" content="https://santrionline.my.id/" />
  <meta property="og:image" content="https://santrionline.my.id/images/mas-yogik-profile.webp" />
  <meta name="twitter:card" content="summary" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="panggung" aria-hidden="true">
  <div class="aurora a1"></div>
  <div class="aurora a2"></div>
  <div class="aurora a3"></div>
  <svg class="bintang b1" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="1.2"><rect x="45" y="45" width="110" height="110" /><rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)" /><circle cx="100" cy="100" r="34" /><circle cx="100" cy="100" r="88" stroke-dasharray="2 6" /></g></svg>
  <svg class="bintang b2" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="50" y="50" width="100" height="100" /><rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" /></g></svg>
  {#each TITIK as t}
    <span class="titik" style="left:{t.x}%;width:{t.s}px;height:{t.s}px;animation-duration:{t.d}s;animation-delay:{t.t}s"></span>
  {/each}
  <div class="kisi"></div>
</div>

<main class="beranda">
  <!-- HERO -->
  <section class="hero">
    <div class="avatar-wrap muncul" use:muncul>
      <span class="cincin"></span>
      <span class="denyut"></span>
      <div class="avatar2">
        {#if data.profile.avatar_url}
          <img src={data.profile.avatar_url} alt={data.profile.display_name} width="132" height="132" />
        {:else}
          <span>SO</span>
        {/if}
      </div>
    </div>
    <p class="eyebrow2 muncul" use:muncul={80}>SantriOnline Network</p>
    <h1 class="judul muncul" use:muncul={140}>{data.profile.display_name}</h1>
    <p class="ketik muncul" use:muncul={200} aria-label={PERAN.join(', ')}><span>{teks}</span><i class="kursor"></i></p>
    <p class="bio2 muncul" use:muncul={260}>{data.profile.bio}</p>
    {#if data.profile.location}<p class="lokasi muncul" use:muncul={300}>📍 {data.profile.location}</p>{/if}

    <div class="sos-baris muncul" use:muncul={340} aria-label="Sosial media">
      {#each SOSMED as s, i}
        <a class="sos-bulat" href={s.url} target="_blank" rel="noopener me" aria-label="{s.nama} {s.akun}" title="{s.nama} · {s.akun}" style="--w:{s.warna};--i:{i}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
        </a>
      {/each}
    </div>

    <div class="cta-baris muncul" use:muncul={400}>
      {#if data.profile.primary_cta_text && data.profile.primary_cta_url}
        <a class="cta utama" href={data.profile.primary_cta_url} target="_blank" rel="noopener">{data.profile.primary_cta_text} <b>→</b></a>
      {/if}
      <a class="cta kedua" href="#jelajah">Jelajahi {JUMLAH_HALAMAN_APP} halaman app ↓</a>
    </div>
  </section>

  <!-- MARQUEE TOPIK -->
  <section class="marquee-wrap" aria-label="Topik pembinaan">
    <div class="marquee"><div class="jalur">{#each [...TOPIK, ...TOPIK] as t}<span>✦ {t}</span>{/each}</div></div>
    <div class="marquee balik"><div class="jalur">{#each [...TOPIK].reverse().concat([...TOPIK].reverse()) as t}<span>{t} ✦</span>{/each}</div></div>
  </section>

  <!-- ANGKA -->
  <section class="angka" use:mulaiHitung>
    {#each ANGKA as a, i}
      <div class="angka-kartu muncul" use:muncul={i * 90}>
        <strong>{hitung[i]}{a.akhiran}</strong><span>{a.ket}</span>
      </div>
    {/each}
  </section>

  <!-- LINK PILIHAN (dikelola dari /admin) -->
  {#if data.links.length}
    <section class="blok">
      <h2 class="blok-judul muncul" use:muncul><span>⭐</span> Link Pilihan</h2>
      <div class="pilihan">
        {#each data.links as link, i}
          <a class="kartu muncul" use:muncul={i * 60} onpointermove={sorot} href={`/r/${link.slug}`}>
            <span class="k-ikon">{link.icon ?? '🔗'}</span>
            <span class="k-isi"><strong>{link.title}</strong>{#if link.description}<small>{link.description}</small>{/if}</span>
            <span class="k-panah">↗</span>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <!-- SEMUA HALAMAN APP (backlink langsung) -->
  <section class="blok" id="jelajah">
    <h2 class="blok-judul muncul" use:muncul><span>🧭</span> Jelajahi app.santrionline.com</h2>
    <p class="blok-sub muncul" use:muncul={60}>Semua menu di header aplikasi, langsung satu ketukan.</p>
    <nav class="lompat muncul" use:muncul={100} aria-label="Lompat ke kelompok">
      {#each GRUP_APP as g}<a href="#{g.id}">{g.ikon} {g.judul}</a>{/each}
    </nav>
    {#each GRUP_APP as g}
      <div class="grup" id={g.id}>
        <h3 class="grup-judul muncul" use:muncul><span>{g.ikon}</span>{g.judul}<em>{g.item.length}</em></h3>
        <div class="grid-app">
          {#each g.item as t, i}
            <a class="kartu kecil muncul" use:muncul={(i % 4) * 70} onpointermove={sorot} href={t.href} title="{t.label} — SantriOnline">
              <span class="k-isi"><strong>{t.label}</strong><small>{t.ket}</small></span>
              <span class="k-panah">→</span>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <!-- JARINGAN SITUS -->
  <section class="blok">
    <h2 class="blok-judul muncul" use:muncul><span>🌐</span> Jaringan SantriOnline</h2>
    <div class="situs">
      {#each SITUS as s, i}
        <a class="kartu besar muncul" use:muncul={i * 90} onpointermove={sorot} href={s.href}>
          <span class="k-ikon">{s.ikon}</span>
          <span class="k-isi"><strong>{s.label}</strong><small>{s.ket}</small></span>
          <span class="k-panah">↗</span>
        </a>
      {/each}
    </div>
  </section>

  <!-- SOSMED LENGKAP -->
  <section class="blok">
    <h2 class="blok-judul muncul" use:muncul><span>💬</span> Ikuti & Hubungi</h2>
    <div class="sos-grid">
      {#each SOSMED as s, i}
        <a class="sos-kartu muncul" use:muncul={i * 60} onpointermove={sorot} href={s.url} target="_blank" rel="noopener me" style="--w:{s.warna}">
          <span class="sos-ikon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg></span>
          <span class="k-isi"><strong>{s.nama}</strong><small>{s.akun}</small></span>
        </a>
      {/each}
    </div>
  </section>

  <footer class="kaki">
    <p>Membina generasi muslim yang berilmu, beradab, dan kompeten.</p>
    <p><a href="https://santrionline.com">santrionline.com</a> · <a href={APP}>app.santrionline.com</a> · <a href="/admin" rel="nofollow">Admin</a></p>
  </footer>
</main>
