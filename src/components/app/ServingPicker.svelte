<script lang="ts">
  import type { Layer, Navigation } from '../../lib/navigation';
  /** A third nested layer edits grams while leaving the review sheet beneath it stationary. */
  let { layer, index, nav }: { layer: Layer; index: number; nav: Navigation } = $props();
  let grams = $derived(layer.grams || 100);
  let error = $state('');
  function apply() {
    if (!Number.isFinite(grams) || grams <= 0 || grams > 10000) {
      error = 'Choose between 1 and 10,000 grams.';
      return;
    }
    nav.updateLayer(index - 1, { grams });
    nav.close();
  }
</script>

<form
  class="stack"
  onsubmit={(event) => {
    event.preventDefault();
    apply();
  }}
>
  <p class="muted">USDA serving weights are listed when available. Grams always work.</p>
  <div class="portion-choices serving-presets" data-horizontal>
    <button type="button" onclick={() => (grams = 100)}>100 g</button
    >{#each layer.food?.portions || [] as portion (`${portion.label}-${portion.grams}`)}<button
        type="button"
        onclick={() => (grams = portion.grams)}>{portion.label} · {portion.grams} g</button
      >{/each}
  </div>
  <label
    >Weight in grams<input
      data-autofocus
      type="number"
      min="1"
      max="10000"
      step="0.1"
      required
      bind:value={grams}
    /></label
  >
  {#if error}<p role="alert">{error}</p>{/if}
  <button class="button accent" type="submit">Use this portion</button>
</form>
