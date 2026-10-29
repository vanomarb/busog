<script lang="ts">
  import { foodName } from '../../domain/names';
  import { region } from '../../lib/region';
  import { Search, Barcode, ArrowUpRight } from '@lucide/svelte';
  import { localSearch, searchFoods } from '../../lib/fdc';
  import { lookupBarcode } from '../../lib/off';
  import { number } from '../../domain/nutrition';
  import type { Food } from '../../domain/types';
  import type { Navigation } from '../../lib/navigation';
  import BarcodeScanner from './BarcodeScanner.svelte';
  /** Search is debounced and abortable; barcode lookup is deliberately explicit to respect OFF rate limits. */
  let { nav, apiKey }: { nav: Navigation; apiKey: string } = $props();
  let tab = $state('search');
  let query = $state('');
  let results = $state<Food[]>(localSearch(''));
  let loading = $state(false);
  let barcode = $state('');
  let error = $state('');
  let product = $state<Food | undefined>();
  let controller: AbortController | undefined;
  $effect(() => {
    const value = query;
    const abort = new AbortController();
    results = localSearch(value);
    loading = value.trim().length >= 3;
    const timer = setTimeout(async () => {
      try {
        results = await searchFoods(value, apiKey, abort.signal);
      } catch {
        /* Superseded searches intentionally leave the latest local results intact. */
      } finally {
        if (!abort.signal.aborted) loading = false;
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  });
  $effect(() => () => controller?.abort());
  async function lookup(code = barcode) {
    barcode = code;
    error = '';
    product = undefined;
    loading = true;
    controller?.abort();
    controller = new AbortController();
    try {
      product = await lookupBarcode(code, controller.signal);
    } catch (cause) {
      error = navigator.onLine
        ? cause instanceof Error
          ? cause.message
          : 'Lookup failed. Try again.'
        : 'You’re offline. USDA food search still works with the bundled foods.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="stack">
  <div class="portion-choices">
    <button class:selected={tab === 'search'} onclick={() => (tab = 'search')}><Search size={16} /> USDA search</button
    ><button class:selected={tab === 'scan'} onclick={() => (tab = 'scan')}><Barcode size={16} /> Barcode</button>
  </div>
  {#if tab === 'search'}
    <label
      >Find your food<input
        data-autofocus
        type="search"
        bind:value={query}
        placeholder="Try kangkong, rice or egg"
      /></label
    >
    <p class="source-line">USDA FoodData Central · CC0 · Filipino names search the offline snapshot too.</p>
    {#if loading}<p role="status" class="source-line">Checking USDA; bundled matches are ready below…</p>{/if}
    <div class="stack">
      {#each results as food (food.id)}<button
          class="food-row"
          onclick={() => nav.open({ kind: 'detail', food, source: 'usda' })}
          ><div class="food-text">
            <h3>{foodName(food, $region)}</h3>
            <small>{number(food.nutrition.kcal)} kcal / 100 g · FDC {food.fdcId}</small>
          </div>
          <ArrowUpRight size={19} /></button
        >{:else}<div class="status-note">
          No food matches yet. Try an English ingredient name or a simpler search.
        </div>{/each}
    </div>
  {:else}
    <BarcodeScanner oncode={(code) => lookup(code)} />
    <form
      class="stack"
      onsubmit={(event) => {
        event.preventDefault();
        lookup();
      }}
    >
      <label
        >Barcode digits<input
          inputmode="numeric"
          pattern={'[0-9]{8,14}'}
          bind:value={barcode}
          required
          placeholder="8–14 digits from the pack"
        /></label
      ><button class="button accent" disabled={loading}>{loading ? 'Looking up product…' : 'Look up barcode'}</button>
    </form>
    <p class="source-line">
      Open Food Facts · ODbL / DbCL. Community product data can be incomplete. Always check the pack.
    </p>
    {#if error}<p role="alert" class="status-note">{error}</p>{/if}
    {#if product}<button class="food-row" onclick={() => nav.open({ kind: 'detail', food: product, source: 'off' })}
        ><div class="food-text">
          <h3>{product.name}</h3>
          <small>{number(product.nutrition.kcal)} kcal / 100 g · review before logging</small>
        </div>
        <ArrowUpRight size={20} /></button
      >{:else if !loading && !error}<p class="muted">
        Scan a barcode or enter its digits. Your product will appear here for review.
      </p>{/if}
  {/if}
</div>
