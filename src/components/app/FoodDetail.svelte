<script lang="ts">
  import { MEALS, foodName, mealName } from '../../domain/names';
  import { region } from '../../lib/region';
  import { number, serving } from '../../domain/nutrition';
  import { manilaClock } from '../../domain/dates';
  import type { Meal } from '../../domain/types';
  import type { DemoStore } from '../../lib/store';
  import type { Layer, Navigation } from '../../lib/navigation';
  import CountMath from './CountMath.svelte';
  import SourceMark from './SourceMark.svelte';
  /** A shared review step creates the same typed entry for every source, or edits an existing entry. */
  let {
    layer,
    nav,
    store,
    date,
    onmessage,
  }: {
    layer: Layer;
    nav: Navigation;
    store: DemoStore;
    date: string;
    onmessage: (text: string) => void;
  } = $props();
  let meal = $state<Meal>('Lunch');
  const food = $derived(layer.food!);
  const grams = $derived(layer.grams ?? food.portions[0]?.grams ?? 100);
  const total = $derived(serving(food, grams));
  function confirm() {
    if (!Number.isFinite(grams) || grams <= 0 || grams > 10000) return;
    if (layer.entryId) store.edit(layer.entryId, grams);
    else {
      const clock = manilaClock();
      store.add([
        {
          date,
          meal,
          time: `${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`,
          food,
          grams,
          source: layer.source || 'usda',
        },
      ]);
    }
    nav.clear();
    onmessage(layer.entryId ? 'Portion updated.' : 'Added to your plate.');
  }
</script>

<div class="stack">
  <SourceMark source={layer.source || 'usda'} />
  <h3>{foodName(food, $region)}</h3>
  <p class="muted">{food.description}</p>
  <div class="nutrition-grid">
    {#each Object.entries(total) as [key, value] (key)}<div>
        <strong>{number(value, key === 'kcal' ? 0 : 1)}</strong><small>{key === 'kcal' ? 'kcal' : `${key} · g`}</small>
      </div>{/each}
  </div>
  <button class="food-row" onclick={() => nav.open({ kind: 'serving', food, grams })}
    ><div class="food-text">Portion <span class="mono">{number(grams)} g</span></div>
    <span aria-hidden="true">↗</span></button
  >
  <CountMath {food} />
  {#if !layer.entryId}<label
      >Meal<select bind:value={meal}
        >{#each MEALS as option (option)}<option value={option}>{mealName(option, $region)}</option>{/each}</select
      ></label
    >{/if}
  <button class="button accent" onclick={confirm}>{layer.entryId ? 'Save portion' : 'Add to plate'}</button>
  {#if layer.entryId}<button
      class="button outline"
      onclick={() => {
        store.remove(layer.entryId!);
        nav.clear();
        onmessage('Removed from the diary.');
      }}>Remove item</button
    >{/if}
  <p class="source-line">
    {food.source === 'recipe'
      ? 'Computed from USDA ingredients · CC0'
      : food.source === 'off'
        ? 'Open Food Facts · ODbL / DbCL'
        : `USDA FoodData Central · ${food.dataType} · FDC ${food.fdcId} · CC0`}
  </p>
</div>
