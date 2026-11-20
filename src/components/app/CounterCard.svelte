<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import { recipes } from '../../data/catalog';
  import { counterName, homeCuisine, recipeName } from '../../domain/names';
  import { region } from '../../lib/region';
  import DishPhoto from './DishPhoto.svelte';
  /** The counter at a glance: today's dishes as photos, one tap from building a plate. */
  let { onclick }: { onclick: () => void } = $props();
  const COUNTER = ['Mains', 'Vegetables', 'Soup', 'Noodles & pasta', 'Sides', 'Bowls'];
  const dishes = $derived(
    recipes
      .filter((recipe) => COUNTER.includes(recipe.category) && recipe.cuisine === homeCuisine($region))
      .slice(0, 3),
  );
</script>

<section class="card aqua counter-card">
  <header class="card-heading">
    <div>
      <h2>{counterName($region)}</h2>
      <p class="muted">Point, pick, plate.</p>
    </div>
    <button class="round" {onclick} aria-label="Build a plate at the counter"><ArrowUpRight size={21} /></button>
  </header>
  <div class="counter-dishes">
    {#each dishes as dish (dish.id)}
      <button class="counter-dish" {onclick}>
        <DishPhoto recipe={dish} sizes="120px" />
        <span>{recipeName(dish, $region)}</span>
      </button>
    {/each}
  </div>
</section>

<style>
  p {
    margin-top: 4px;
    font-size: var(--text-sm);
  }
  .counter-dishes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 16px;
  }
  .counter-dish {
    position: relative;
    display: block;
    aspect-ratio: 3 / 4;
    padding: 0;
    border-radius: 18px;
    overflow: hidden;
  }
  /* A dark scrim behind the name keeps it legible on any photo. */
  .counter-dish span {
    position: absolute;
    inset: auto 0 0;
    padding: 22px 10px 10px;
    background: linear-gradient(transparent, #000c);
    color: #fff;
    font-size: var(--text-xs);
    font-weight: 600;
    line-height: 1.25;
    text-align: left;
  }
</style>
