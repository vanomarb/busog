<script lang="ts">
  import type { Navigation } from '../../lib/navigation';
  import type { DemoStore } from '../../lib/store';
  import SheetLayer from './SheetLayer.svelte';
  import LogMenu from './LogMenu.svelte';
  import FoodDetail from './FoodDetail.svelte';
  import ServingPicker from './ServingPicker.svelte';
  import TuroTuro from './TuroTuro.svelte';
  import Snap from './Snap.svelte';
  import FoodSearch from './FoodSearch.svelte';
  import WeightEditor from './WeightEditor.svelte';
  /** Each route layer stays mounted below its successor, preserving scroll and local review state. */
  let {
    nav,
    store,
    date,
    onmessage,
  }: {
    nav: Navigation;
    store: DemoStore;
    date: string;
    onmessage: (text: string) => void;
  } = $props();
  const titles = {
    log: 'Add to your plate',
    detail: 'Food detail',
    serving: 'Change serving',
    turo: 'At the counter',
    snap: 'Snap a plate',
    search: 'Find your food',
    weight: 'Your weigh-in',
    notice: 'From Busog',
  };
</script>

{#each $nav.layers as layer, index (`${index}-${layer.kind}`)}
  <SheetLayer title={titles[layer.kind]} {index} active={index === $nav.layers.length - 1} close={() => nav.close()}>
    {#if layer.kind === 'log'}<LogMenu {nav} />
    {:else if layer.kind === 'detail'}<FoodDetail {layer} {nav} {store} {date} {onmessage} />
    {:else if layer.kind === 'serving'}<ServingPicker {layer} {index} {nav} />
    {:else if layer.kind === 'turo'}<TuroTuro {nav} {store} {date} {onmessage} />
    {:else if layer.kind === 'snap'}<Snap {nav} {store} {date} {onmessage} />
    {:else if layer.kind === 'search'}<FoodSearch {nav} apiKey={$store.profile.apiKey} />
    {:else if layer.kind === 'weight'}<WeightEditor {nav} {store} />
    {:else}<div class="stack">
        <h3>Your table is ready.</h3>
        <p>
          Try the three ways to log, adjust a portion, or look back at the sample week. Everything stays on your device.
        </p>
        <a href="/busog/download/">How to install Busog</a>
      </div>{/if}
  </SheetLayer>
{/each}
