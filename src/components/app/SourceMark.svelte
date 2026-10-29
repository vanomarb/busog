<script lang="ts">
  import { Hand, Camera, Database, Barcode } from '@lucide/svelte';
  import type { Source } from '../../domain/types';
  /** Every diary item exposes its path with both a repeated symbol and a readable label. */
  let { source }: { source: Source } = $props();
  const labels = { turo: 'Turo-turo', snap: 'Snap', usda: 'USDA', off: 'Open Food Facts' };
</script>

<span class="source-mark" title={labels[source]}>
  {#if source === 'turo'}<Hand size={12} />{:else if source === 'snap'}<Camera
      size={12}
    />{:else if source === 'off'}<Barcode size={12} />{:else}<Database size={12} />{/if}
  {labels[source]}
</span>

<style>
  .source-mark {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font: var(--text-2xs) var(--mono);
    color: var(--muted);
  }
</style>
