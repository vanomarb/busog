<script lang="ts">
  import { Hand, Camera, Search, ArrowUpRight } from '@lucide/svelte';
  import { foodById } from '../../data/catalog';
  import type { Navigation } from '../../lib/navigation';
  /** Three entry routes sit together and lead into the same plate review. */
  let { nav }: { nav: Navigation } = $props();
</script>

<div class="stack">
  <p class="muted">Three ways in. One plate. Pick what fits this meal.</p>
  <div class="sheet-grid">
    <button class="aqua" onclick={() => nav.open({ kind: 'turo' })}
      ><Hand size={27} />
      <h3>Turo-turo</h3>
      <small>Point at your ulam</small></button
    ><button class="coral" onclick={() => nav.open({ kind: 'snap' })}
      ><Camera size={27} />
      <h3>Snap a plate</h3>
      <small>Photo to plate</small></button
    >
  </div>
  <button class="food-row" onclick={() => nav.open({ kind: 'search' })}
    ><Search size={25} />
    <div class="food-text">
      <h3>Search & scan</h3>
      <small>USDA ingredients / packaged foods</small>
    </div>
    <ArrowUpRight size={22} /></button
  >
  <h3>A familiar side</h3>
  <button class="food-row" onclick={() => nav.open({ kind: 'detail', food: foodById('rice'), source: 'usda' })}
    ><div class="food-text">
      <h3>Kanin</h3>
      <small>Cooked white rice · change serving</small>
    </div>
    <ArrowUpRight size={21} /></button
  >
</div>
