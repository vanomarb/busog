<script lang="ts">
  import { untrack } from 'svelte';
  import { recipes, foodById } from '../../data/catalog';
  import { MEALS, byRegion, foodName, mealName, recipeName } from '../../domain/names';
  import { region } from '../../lib/region';
  import { serving, sum, number } from '../../domain/nutrition';
  import { manilaClock } from '../../domain/dates';
  import type { Meal } from '../../domain/types';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  /** Staged sample mappings demonstrate photo review without pretending to run food recognition. */
  let {
    store,
    nav,
    date,
    onmessage,
  }: { store: DemoStore; nav: Navigation; date: string; onmessage: (text: string) => void } = $props();
  let stage = $state<'choose' | 'reading' | 'review'>('choose');
  /** Six sample plates, the region's own dishes first; every recipe has a photo of that exact dish. */
  const samples = $derived(byRegion(recipes, $region).slice(0, 6));
  let selected = $state(untrack(() => samples[0]));
  let items = $state<{ id: string; grams: number }[]>([]);
  let meal = $state<Meal>('Lunch');
  let reading = $state('Finding the food on your plate…');
  let active = true;
  $effect(() => () => {
    active = false;
  });
  async function pick(index: number) {
    selected = samples[index];
    stage = 'reading';
    reading = 'Reading your sample plate…';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) await new Promise((resolve) => setTimeout(resolve, 700));
    if (!active) return;
    reading = 'Matching the staged ingredients to USDA…';
    if (!reduced) await new Promise((resolve) => setTimeout(resolve, 650));
    if (!active) return;
    items = selected.ingredients.map((item) => ({ id: item.foodId, grams: item.grams / selected.servings }));
    stage = 'review';
  }
  const total = $derived(sum(items.map((item) => serving(foodById(item.id), item.grams || 0))));
  function confirm() {
    const clock = manilaClock();
    store.add(
      items
        .filter((item) => item.grams > 0)
        .map((item) => ({
          food: foodById(item.id),
          grams: item.grams,
          date,
          meal,
          source: 'snap',
          time: `${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`,
        })),
    );
    nav.clear();
    onmessage('Reviewed sample plate added.');
  }
</script>

<div class="stack">
  <p class="status-note">
    Demo: recognition is simulated. Photos are illustrative; mappings use Busog’s recipe ingredients. Nothing is
    uploaded.
  </p>
  {#if stage === 'choose'}
    <h3>Pick a sample plate</h3>
    <div class="snap-samples">
      {#each samples as sample, index (sample.id)}<button onclick={() => pick(index)}
          ><img
            src={`/busog/images/${sample.image}-480.webp`}
            alt={recipeName(sample, $region)}
            width="250"
            height="170"
            loading="lazy"
            decoding="async"
          /><span>{recipeName(sample, $region)}</span></button
        >{/each}
    </div>
  {:else if stage === 'reading'}
    <img
      class="snap-photo"
      src={`/busog/images/${selected.image}-480.webp`}
      alt={recipeName(selected, $region)}
      width="480"
      height="250"
    />
    <p role="status" class="mono">{reading}</p>
    <progress aria-label="Simulated plate reading"></progress>
  {:else}
    <h3>Review your ingredients</h3>
    <p class="muted">Check the gram weights before adding this plate.</p>
    {#each items as item, index (item.id)}<label class="snap-item"
        ><span>{foodName(foodById(item.id), $region)}<small>USDA FDC {foodById(item.id).fdcId}</small></span><input
          type="number"
          aria-label={`${foodName(foodById(item.id), $region)} grams`}
          min="0"
          max="2000"
          value={item.grams}
          oninput={(event) =>
            (items = items.map((row, i) =>
              i === index ? { ...row, grams: Math.max(0, Math.min(2000, Number(event.currentTarget.value))) } : row,
            ))}
        /><span>g</span></label
      >{/each}
    <label
      >Meal<select bind:value={meal}
        >{#each MEALS as option (option)}<option value={option}>{mealName(option, $region)}</option>{/each}</select
      ></label
    >
    <p class="mono">Plate total: {number(total.kcal)} kcal</p>
    <button class="button accent" disabled={!items.some((item) => item.grams > 0)} onclick={confirm}
      >Confirm this plate</button
    ><button class="button outline" onclick={() => (stage = 'choose')}>Choose another sample</button>
  {/if}
</div>

<style>
  .snap-samples {
    display: grid;
    gap: 14px;
  }
  .snap-samples button {
    padding: 0;
    background: var(--raised);
    border-radius: 20px;
    overflow: hidden;
    text-align: left;
  }
  .snap-samples img,
  .snap-photo {
    width: 100%;
    height: 170px;
    border-radius: 20px;
  }
  .snap-samples span {
    display: block;
    padding: 15px;
  }
  .snap-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: var(--text-sm);
  }
  .snap-item > span:first-child {
    flex: 1;
  }
  .snap-item small {
    display: block;
    font-size: var(--text-2xs);
    color: var(--muted);
  }
  .snap-item input {
    width: 95px;
  }
  progress {
    width: 100%;
    accent-color: var(--coral);
  }
</style>
