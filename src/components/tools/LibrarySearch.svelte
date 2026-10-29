<script lang="ts" module>
  /** The few fields a library row needs, so the page ships a short list instead of the whole food snapshot. */
  export interface LibraryItem {
    slug: string;
    name: string;
    search: string;
    category: string;
    categorySlug: string;
    fdcId?: number;
    kcal: number;
  }
</script>

<script lang="ts">
  import { number } from '../../domain/nutrition';
  /** A browsable static-source catalogue stays useful without live search or API credentials. */
  let { items, category = '' }: { items: LibraryItem[]; category?: string } = $props();
  let query = $state('');
  const categories = $derived(
    [...new Map(items.map((item) => [item.category, item.categorySlug])).entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  );
  const result = $derived(items.filter((item) => item.search.includes(query.trim().toLowerCase())));
</script>

<div class="library-search">
  <label>Find an ingredient<input type="search" bind:value={query} placeholder="Kangkong, egg, rice…" /></label
  >{#if !category}<nav class="library-categories" aria-label="Food categories">
      {#each categories as [name, slug] (slug)}<a class="chip" href={`/busog/library/category/${slug}/`}>{name} ↗</a
        >{/each}
    </nav>{/if}
  <p class="mono muted" role="status">{result.length} sourced foods · values per 100 g</p>
  <div class="library-list">
    {#each result as item (item.slug)}<a href={`/busog/library/food/${item.slug}/`}
        ><div>
          <h2>{item.name}</h2>
          <small>{item.category} · FDC {item.fdcId}</small>
        </div>
        <span class="mono">{number(item.kcal)}<small>kcal</small></span><span aria-hidden="true">↗</span></a
      >{:else}<p class="notice">No ingredients match. Try a simpler name or browse another category.</p>{/each}
  </div>
</div>

<style>
  .library-search label {
    max-width: 600px;
  }
  .library-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin: 25px 0;
  }
  .library-categories a {
    background: var(--raised);
    text-decoration: none;
    padding: 12px 16px;
    min-height: 44px;
  }
  .library-search > p {
    font-size: var(--text-xs);
    margin: 28px 0;
  }
  .library-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .library-list a {
    padding: 24px;
    border-radius: 22px;
    background: var(--raised);
    display: flex;
    align-items: center;
    gap: 20px;
    text-decoration: none;
  }
  .library-list a > div {
    flex: 1;
    min-width: 0;
  }
  h2 {
    font-size: var(--text-xl);
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  small {
    color: var(--muted);
    font-size: var(--text-2xs);
    display: block;
    margin-top: 8px;
  }
  .library-list a > .mono {
    text-align: right;
    font-size: var(--text-lg);
  }
  @media (max-width: 800px) {
    .library-list {
      grid-template-columns: 1fr;
    }
  }
</style>
