<script lang="ts">
  import { untrack } from 'svelte';
  import { Check, Info } from '@lucide/svelte';
  import { recipes, recipeFood, foodById } from '../../data/catalog';
  import { sum, serving, number } from '../../domain/nutrition';
  import { manilaClock } from '../../domain/dates';
  import { MEALS, homeCuisine, mealName, recipeName, recipeSubtitle } from '../../domain/names';
  import type { Meal } from '../../domain/types';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  import { region } from '../../lib/region';
  import DishPhoto from './DishPhoto.svelte';
  /** Point at dishes, choose rice and portion, then commit a whole ingredient-computed plate. */
  let {
    nav,
    store,
    date,
    onmessage,
  }: { nav: Navigation; store: DemoStore; date: string; onmessage: (text: string) => void } = $props();
  const COUNTER = ['Mains', 'Vegetables', 'Soup', 'Noodles & pasta', 'Sides', 'Bowls'];
  // The counter holds the region's own cooked dishes, like a real carinderia; the full kitchen lives in Foods.
  const dishes = $derived(
    recipes.filter((recipe) => COUNTER.includes(recipe.category) && recipe.cuisine === homeCuisine($region)),
  );
  let selected = $state<string[]>(untrack(() => [dishes[0].id]));
  let portion = $state(1);
  let cups = $state(1);
  let meal = $state<Meal>('Lunch');
  const rice = foodById('rice');
  const cupGrams = rice.portions.find((item) => item.label.includes('cup'))!.grams;
  const toggle = (id: string) =>
    (selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  const plate = $derived([
    ...selected.map((id) => {
      const food = recipeFood(recipes.find((dish) => dish.id === id)!);
      return { food, grams: food.portions[0].grams * portion };
    }),
    ...(cups > 0 ? [{ food: rice, grams: cups * cupGrams }] : []),
  ]);
  const total = $derived(sum(plate.map((item) => serving(item.food, item.grams))));
  function confirm() {
    const clock = manilaClock();
    store.add(
      plate.map((item) => ({
        ...item,
        date,
        meal,
        source: 'turo',
        time: `${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`,
      })),
    );
    nav.clear();
    onmessage('Your turo-turo plate is logged.');
  }
</script>

<div class="stack">
  <p class="muted">
    Point at what looks good. Every dish is counted from its ingredients, and the math is yours to see.
  </p>
  <div class="turo-counter">
    {#each dishes as dish (dish.id)}
      {@const chosen = selected.includes(dish.id)}
      <div class="dish" class:chosen>
        <button class="dish-select" aria-pressed={chosen} onclick={() => toggle(dish.id)}>
          <span class="dish-picture"><DishPhoto recipe={dish} /></span>
          <span class="dish-name">{recipeName(dish, $region)}</span>
          {#if recipeSubtitle(dish, $region)}<small>{recipeSubtitle(dish, $region)}</small>{/if}
        </button>
        {#if chosen}<span class="dish-check" aria-hidden="true"><Check size={18} strokeWidth={3} /></span>{/if}
        <button
          class="dish-info"
          aria-label={`How ${recipeName(dish, $region)} is counted`}
          onclick={() => nav.open({ kind: 'detail', food: recipeFood(dish), source: 'turo' })}
          ><Info size={18} /></button
        >
      </div>
    {/each}
  </div>
  <fieldset>
    <legend class="mono">Portion</legend>
    <div class="portion-choices">
      {#each [[0.5, 'Half'], [1, 'Regular'], [1.5, 'Extra']] as [value, label] (value)}<button
          class:selected={portion === value}
          aria-pressed={portion === value}
          onclick={() => (portion = Number(value))}>{label}</button
        >{/each}
    </div>
  </fieldset>
  <div class="turo-options">
    <label
      >Rice · 1 cup = {cupGrams} g<select bind:value={cups}
        ><option value={0}>No rice</option><option value={0.5}>½ cup</option><option value={1}>1 cup</option><option
          value={1.5}>1½ cups</option
        ><option value={2}>2 cups</option></select
      ></label
    >
    <label
      >Meal<select bind:value={meal}
        >{#each MEALS as option (option)}<option value={option}>{mealName(option, $region)}</option>{/each}</select
      ></label
    >
  </div>
  <div class="plate-total">
    <span class="mono">Your plate</span><strong>{number(total.kcal)} kcal</strong><small
      >{number(total.protein)} g protein · {number(total.carbs)} g carbs · {number(total.fat)} g fat</small
    >
  </div>
  <button class="button accent" onclick={confirm} disabled={!plate.length}>Log this plate</button>
</div>

<style>
  .turo-counter {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .dish {
    position: relative;
    border: 2px solid transparent;
    border-radius: 22px;
    overflow: hidden;
    background: var(--raised);
    transition:
      border-color var(--fast),
      transform var(--fast);
  }
  .dish.chosen {
    border-color: var(--primary);
  }
  .dish:active {
    transform: scale(0.98);
  }
  .dish-select {
    display: grid;
    gap: 2px;
    width: 100%;
    padding: 0 0 14px;
    text-align: left;
  }
  .dish-picture {
    display: block;
    height: 112px;
    margin-bottom: 10px;
  }
  .dish-name {
    padding: 0 48px 0 14px;
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.3;
  }
  .dish-select small {
    padding: 0 48px 0 14px;
    color: var(--muted);
    font-size: var(--text-2xs);
    line-height: 1.4;
  }
  .dish-check {
    position: absolute;
    top: 10px;
    right: 10px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--surface);
    color: var(--primary);
    animation: pop var(--fast) var(--ease-out) backwards;
  }
  .dish-info {
    position: absolute;
    right: 4px;
    bottom: 4px;
    display: grid;
    place-items: center;
    color: var(--muted);
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }
  .turo-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .plate-total {
    display: grid;
    gap: 6px;
    padding: 22px;
    border-radius: 22px;
    background: var(--aqua);
    color: var(--card-ink);
  }
  .plate-total strong {
    font: 500 var(--text-2xl) / 1.1 var(--mono);
  }
  .plate-total small {
    font-size: var(--text-xs);
  }
  @keyframes pop {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
  }
</style>
