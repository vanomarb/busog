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
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 16px;
  }
  .help-results a {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px 64px 20px 22px;
    background: var(--raised);
    border-radius: 22px;
    text-decoration: none;
    transition: transform var(--base) var(--ease-out);
  }
  .help-results a:hover {
    transform: translateY(-3px);
  }
  h2 {
    font-size: var(--text-xl);
    line-height: 1.02;
  }
  p {
    color: var(--muted);
    font-size: var(--text-sm);
    line-height: 1.45;
  }
  small {
    font-size: var(--text-2xs);
    color: var(--primary);
  }
  a > span {
    position: absolute;
    right: 20px;
    top: 20px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--raised-2);
    color: var(--ink);
    font-size: var(--text-sm);
  }
</style>
