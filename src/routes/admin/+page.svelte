<script lang="ts">
  import { LineChart } from 'layerchart';

  let { data, form } = $props();

  const statByLink = $derived(new Map(data.stats.map((row) => [row.link_id, row])));
  const previewLinks = $derived(data.links.filter((link) => link.is_active));
  const chartMax = $derived(Math.max(1, ...data.dailyStats.map((day) => day.clicks)));
  const chartData = $derived(
    data.dailyStats.map((day, index) => ({
      ...day,
      index,
      label: day.date.slice(5),
      total: day.clicks
    }))
  );
  const bestDay = $derived(data.dailyStats.reduce((best, day) => (day.clicks > best.clicks ? day : best), data.dailyStats[0] ?? { date: '-', clicks: 0, unique_clicks: 0 }));
  const lastDay = $derived(data.dailyStats.at(-1) ?? { clicks: 0, unique_clicks: 0 });
  const previousDay = $derived(data.dailyStats.at(-2) ?? { clicks: 0, unique_clicks: 0 });
  const trendDelta = $derived(lastDay.clicks - previousDay.clicks);
</script>

<svelte:head><title>Dashboard | SantriOnline Links</title></svelte:head>

<main class="admin-shell">
  <aside class="admin-sidebar">
    <div>
      <p class="eyebrow">SantriOnline Links</p>
      <h1>Dashboard</h1>
      <p>Kelola halaman bio, shortlink, analytics klik, dan lihat preview HP seperti Linktree/Librelinks.</p>
    </div>
    <nav>
      <a href="/" target="_blank">Lihat Halaman Publik ↗</a>
      <a href="#preview">Preview HP</a>
      <a href="#links">Kelola Link</a>
      <a href="#analytics">Analytics</a>
    </nav>
    <form method="POST" action="?/logout"><button class="ghost" type="submit">Logout</button></form>
  </aside>

  <section class="admin-content">
    {#if form?.message}<div class="toast">{form.message}</div>{/if}
    {#if !data.hasDb}<div class="alert">D1 belum terhubung. Data yang tampil adalah fallback sampai binding BIOLINK_DB dipasang.</div>{/if}

    <section class="metric-grid" id="analytics">
      <article><span>Total Klik</span><strong>{data.totalClicks}</strong></article>
      <article><span>Klik 7 Hari</span><strong>{data.clicks7d}</strong></article>
      <article><span>Jumlah Link</span><strong>{data.links.length}</strong></article>
    </section>

    <section class="panel analytics-hero">
      <div class="panel-heading">
        <div>
          <h2>Grafik Klik 14 Hari</h2>
          <p>Naik-turun trafik harian dari semua link, model insight seperti Bitly/Librelinks.</p>
        </div>
        <div class:up={trendDelta >= 0} class:down={trendDelta < 0} class="trend-pill">
          {trendDelta >= 0 ? '↗' : '↘'} {Math.abs(trendDelta)} vs kemarin
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-summary">
          <div><span>Hari ini</span><strong>{lastDay.clicks}</strong><small>{lastDay.unique_clicks} unik</small></div>
          <div><span>Tertinggi</span><strong>{bestDay.clicks}</strong><small>{bestDay.date}</small></div>
          <div><span>Periode</span><strong>14</strong><small>hari terakhir</small></div>
        </div>

        <div class="layerchart-wrap" aria-label="Grafik klik harian 14 hari dengan LayerChart">
          <LineChart
            data={chartData}
            x="index"
            y="total"
            yDomain={[0, chartMax]}
            axis={false}
            grid={{ y: true, x: false }}
            points={{ r: 4, class: 'lc-point' }}
            rule={false}
            series={[{ key: 'clicks', label: 'Klik', value: 'total', color: '#38bdf8', props: { class: 'lc-line' } }]}
            props={{
              spline: { strokeWidth: 4, class: 'lc-line' },
              highlight: { points: { r: 6, class: 'lc-highlight' } }
            }}
          />
        </div>

        <div class="chart-days">
          {#each data.dailyStats as day}
            <div class:active-day={day.clicks === bestDay.clicks && day.clicks > 0}>
              <span>{day.date.slice(5)}</span>
              <strong>{day.clicks}</strong>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <div class="admin-main-grid">
      <div class="admin-workspace">
        <section class="panel">
          <div class="panel-heading"><h2>Profil Bio</h2><p>Mirip Librelinks: halaman profil yang bisa dikustom dan langsung terlihat di preview HP.</p></div>
          <form method="POST" action="?/profile" class="form-grid">
            <label>Nama tampil<input name="display_name" value={data.profile.display_name} /></label>
            <label>Lokasi<input name="location" value={data.profile.location ?? ''} /></label>
            <label class="wide">Bio<textarea name="bio" rows="3">{data.profile.bio}</textarea></label>
            <label class="wide">Avatar URL<input name="avatar_url" value={data.profile.avatar_url ?? ''} /></label>
            <label>CTA Text<input name="primary_cta_text" value={data.profile.primary_cta_text ?? ''} /></label>
            <label>CTA URL<input name="primary_cta_url" value={data.profile.primary_cta_url ?? ''} /></label>
            <button type="submit">Simpan Profil</button>
          </form>
        </section>

        <section class="panel" id="links">
          <div class="panel-heading"><h2>Tambah Link</h2><p>Setiap link diarahkan lewat /r/slug agar klik tercatat.</p></div>
          <form method="POST" action="?/upsertLink" class="form-grid">
            <label>Slug<input name="slug" placeholder="contoh: tiktok" required /></label>
            <label>Judul<input name="title" placeholder="TikTok SantriOnline" required /></label>
            <label>URL<input name="url" placeholder="https://..." required /></label>
            <label>Icon<input name="icon" placeholder="🎬" /></label>
            <label>Kategori<input name="category" placeholder="Sosmed" /></label>
            <label>Urutan<input name="sort_order" type="number" value="10" /></label>
            <label class="wide">Deskripsi<input name="description" placeholder="Deskripsi pendek" /></label>
            <label class="checkbox"><input name="is_active" type="checkbox" checked /> Aktif</label>
            <button type="submit">Tambah Link</button>
          </form>
        </section>

        <section class="panel">
          <div class="panel-heading"><h2>Link Aktif</h2><p>Edit cepat dan statistik per link.</p></div>
          <div class="link-table">
            {#each data.links as link}
              {@const stat = statByLink.get(link.id)}
              <form method="POST" action="?/upsertLink" class="link-row">
                <input type="hidden" name="id" value={link.id} />
                <input name="sort_order" type="number" value={link.sort_order} aria-label="Urutan" />
                <input name="icon" value={link.icon ?? ''} aria-label="Icon" />
                <input name="title" value={link.title} aria-label="Judul" />
                <input name="slug" value={link.slug} aria-label="Slug" />
                <input name="url" value={link.url} aria-label="URL" />
                <input name="category" value={link.category ?? ''} aria-label="Kategori" />
                <input name="description" value={link.description ?? ''} aria-label="Deskripsi" />
                <label class="mini-check"><input name="is_active" type="checkbox" checked={Boolean(link.is_active)} /> Aktif</label>
                <span class="clicks">{stat?.clicks ?? 0} klik</span>
                <button type="submit">Simpan</button>
              </form>
              <form method="POST" action="?/deleteLink" class="delete-row">
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" class="danger">Hapus {link.slug}</button>
              </form>
            {/each}
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading"><h2>Sumber Trafik</h2><p>Referrer teratas seperti TikTok, Instagram, Google, atau Direct.</p></div>
          <div class="source-list">
            {#each data.sources as source}
              <div><span>{source.referrer}</span><strong>{source.clicks}</strong></div>
            {:else}
              <p>Belum ada data klik.</p>
            {/each}
          </div>
        </section>
      </div>

      <aside class="phone-preview-panel" id="preview" aria-label="Preview halaman bio versi HP">
        <div class="preview-heading">
          <div>
            <p class="eyebrow">Live Preview</p>
            <h2>Tampilan HP</h2>
          </div>
          <a href="/" target="_blank">Open ↗</a>
        </div>

        <div class="phone-frame">
          <div class="phone-speaker"></div>
          <div class="phone-screen">
            <div class="phone-bg"></div>
            <div class="phone-avatar">
              {#if data.profile.avatar_url}
                <img src={data.profile.avatar_url} alt={data.profile.display_name} />
              {:else}
                <span>SO</span>
              {/if}
            </div>
            <p class="phone-kicker">SantriOnline Network</p>
            <h3>{data.profile.display_name}</h3>
            <p class="phone-bio">{data.profile.bio}</p>
            {#if data.profile.location}<p class="phone-location">📍 {data.profile.location}</p>{/if}
            {#if data.profile.primary_cta_text && data.profile.primary_cta_url}
              <a class="phone-cta" href={data.profile.primary_cta_url} target="_blank" rel="noreferrer">{data.profile.primary_cta_text}</a>
            {/if}
            <div class="phone-links">
              {#each previewLinks as link}
                <a href={`/r/${link.slug}`} target="_blank" class="phone-link">
                  <span>{link.icon ?? '🔗'}</span>
                  <strong>{link.title}</strong>
                </a>
              {/each}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</main>
