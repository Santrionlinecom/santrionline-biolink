<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.profile.display_name} | SantriOnline Links</title>
  <meta name="description" content={data.profile.bio} />
</svelte:head>

<main class="public-shell">
  <section class="bio-card">
    <div class="halo"></div>
    <div class="avatar" aria-hidden="true">
      {#if data.profile.avatar_url}
        <img src={data.profile.avatar_url} alt={data.profile.display_name} />
      {:else}
        <span>SO</span>
      {/if}
    </div>

    <p class="eyebrow">SantriOnline Network</p>
    <h1>{data.profile.display_name}</h1>
    <p class="bio">{data.profile.bio}</p>

    {#if data.profile.location}
      <p class="location">📍 {data.profile.location}</p>
    {/if}

    {#if data.profile.primary_cta_text && data.profile.primary_cta_url}
      <a class="primary-cta" href={data.profile.primary_cta_url} target="_blank" rel="noreferrer">
        {data.profile.primary_cta_text}
      </a>
    {/if}

    <div class="links" aria-label="Daftar link">
      {#each data.links as link}
        <a class="link-card" href={`/r/${link.slug}`} data-category={link.category}>
          <span class="link-icon">{link.icon ?? '🔗'}</span>
          <span class="link-copy">
            <strong>{link.title}</strong>
            {#if link.description}<small>{link.description}</small>{/if}
          </span>
          <span class="arrow">↗</span>
        </a>
      {/each}
    </div>

    <footer>
      <span>Bio link, shortlink & analytics pribadi.</span>
      <a href="/admin">Admin</a>
    </footer>
  </section>
</main>
