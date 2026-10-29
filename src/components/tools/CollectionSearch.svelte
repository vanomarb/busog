<script lang="ts">
  /** A small client index searches only public metadata while the reading pages remain static. */
  let {
    items,
    placeholder = 'Search articles',
  }: {
    items: { title: string; description: string; category: string; href: string }[];
    placeholder?: string;
  } = $props();
  let query = $state('');
  const matching = $derived(
    items.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())),
  );
</script>

<div class="stack">
  <label><span class="sr-only">{placeholder}</span><input type="search" {placeholder} bind:value={query} /></label>
  <p class="mono muted">{matching.length} articles</p>
  <div class="help-results">
    {#each matching as item (item.href)}<a href={item.href}
        ><small>{item.category}</small>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <span aria-hidden="true">↗</span></a
      >{:else}<p class="notice">Nothing matches yet. Try “plate”, “serving” or “offline”.</p>{/each}
  </div>
</div>

<style>
  .help-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .help-results a {
    position: relative;
    padding: 28px 55px 28px 28px;
    background: var(--raised);
    border-radius: 24px;
    text-decoration: none;
    display: grid;
    gap: 16px;
  }
  h2 {
    font-size: var(--text-2xl);
  }
  p {
    color: var(--muted);
    font-size: var(--text-sm);
  }
  small {
    font-size: var(--text-2xs);
    color: var(--primary);
  }
  a > span {
    position: absolute;
    right: 25px;
    top: 25px;
  }
  @media (max-width: 600px) {
    .help-results {
      grid-template-columns: 1fr;
    }
  }
</style>
