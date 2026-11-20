<script lang="ts">
  import { serving, number } from '../../domain/nutrition';
  import type { Food } from '../../domain/types';
  /** Website serving exploration uses the app's pure serving calculation. */
  let { food }: { food: Food } = $props();
  let grams = $state(100);
  const total = $derived(serving(food, Number.isFinite(grams) && grams >= 0 ? grams : 0));
</script>

<section class="nutrition-panel aqua">
  <div>
    <h2>On your plate.</h2>
    <label>Edible portion · grams<input type="number" min="1" max="10000" step="0.1" bind:value={grams} /></label>
  </div>
  <div class="nutrition-values">
    {#each Object.entries(total) as [key, value] (key)}<div>
        <strong>{number(value, key === 'kcal' ? 0 : 1)}</strong><span>{key === 'kcal' ? 'kcal' : `${key} · g`}</span>
      </div>{/each}
  </div>
  <p class="mono">Portion ÷ 100 × published source values. Numbers are rounded for display.</p>
</section>

<style>
  .nutrition-panel {
    padding: 32px;
    border-radius: 28px;
  }
  .nutrition-panel > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 25px;
  }
  h2 {
    font-size: var(--text-2xl);
  }
  label {
    font-size: var(--text-xs);
    max-width: 170px;
  }
  input {
    background: var(--raised-2);
  }
  .nutrition-values {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-top: 30px;
  }
  strong {
    display: block;
    font: 500 var(--text-xl) var(--mono);
  }
  .nutrition-values span {
    font: var(--text-xs) var(--mono);
  }
  p {
    font-size: var(--text-2xs);
    margin-top: 24px;
  }
  @media (max-width: 600px) {
    .nutrition-values {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .nutrition-panel {
      padding: 24px;
    }
  }
</style>
