<script lang="ts">
  let { form } = $props();
</script>

<svelte:head><title>Login Admin | SantriOnline Links</title></svelte:head>

<main class="admin-login">
  <form method="POST" class="login-card">
    <p class="eyebrow">Admin Area</p>
    <h1>Masuk Dashboard</h1>
    <p>Kelola link, profil, dan statistik klik santrionline.my.id.</p>
    {#if form?.message}<div class="alert">{form.message}</div>{/if}
    <label>
      Password Admin
      <input name="password" type="password" autocomplete="current-password" required />
    </label>
    <button type="submit">Masuk</button>
    <a href="/">← Kembali ke halaman bio</a>
  </form>
</main>
