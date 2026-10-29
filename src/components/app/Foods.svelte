<script lang="ts">
  import { ArrowUpRight, Search } from '@lucide/svelte';
  import { foods, recipes, recipeFood } from '../../data/catalog';
  import { number, serving } from '../../domain/nutrition';
  import { byRegion, foodName, recipeName, recipeSubtitle, searchText } from '../../domain/names';
  import type { Navigation } from '../../lib/navigation';
  import { region } from '../../lib/region';
  import FoodCharacter from './FoodCharacter.svelte';
  import DishPhoto from './DishPhoto.svelte';
  /** Colored catalogue header and dark rows adapt the reference's people list to real foods and recipes. */
  let { nav }: { nav: Navigation } = $props();
  let tab = $state('recipes');
  let query = $state('');
  let visible = $state(24);
  const needle = $derived(query.trim().toLowerCase());
  const matchingFoods = $derived(foods.filter((food) => searchText(food).includes(needle)));
  const matchingRecipes = $derived(
    byRegion(recipes, $region).filter((recipe) =>
      `${recipe.name} ${recipe.english ?? ''} ${recipe.description}`.toLowerCase().includes(needle),
    ),
  );
</script>

<div class="app-page foods-page">
  <header class="foods-header coral">
    <div>
      <p class="mono">Something good is cooking.</p>
      <h1>The kitchen.</h1>
      <div class="food-stats">
        <span><strong>{foods.length}</strong> sourced foods</span><span><strong>{recipes.length}</strong> recipes</span>
      </div>
    </div>
    <FoodCharacter kind="egg" size={140} />
  </header>
  <div class="foods-controls">
    <div class="portion-choices">
      <button class:selected={tab === 'recipes'} onclick={() => (tab = 'recipes')}>Recipes</button><button
        class:selected={tab === 'foods'}
        onclick={() => (tab = 'foods')}>Ingredients</button
      >
    </div>
    <label
      ><span class="sr-only">Search kitchen</span><input
        type="search"
        bind:value={query}
        placeholder="Find your next plate"
      /></label
    ><button class="round" aria-label="Search live USDA and barcodes" onclick={() => nav.open({ kind: 'search' })}
      ><Search size={21} /></button
    >
  </div>
  <div class="foods-list">
    {#if tab === 'recipes'}
      {#each matchingRecipes as recipe (recipe.id)}
        {@const food = recipeFood(recipe)}
        <button class="food-row" onclick={() => nav.open({ kind: 'detail', food, source: 'turo' })}
          ><span class="food-thumb"><DishPhoto {recipe} sizes="64px" /></span>
          <div class="food-text">
            <h3>{recipeName(recipe, $region)}</h3>
            {#if recipeSubtitle(recipe, $region)}<p class="food-subtitle">{recipeSubtitle(recipe, $region)}</p>{/if}
            <small
              ><span class="nowrap">{number(serving(food, food.portions[0].grams).kcal)} kcal</span> ·
              <span class="nowrap">{recipe.minutes} min</span></small
            ><span class="chip">{recipe.category}</span>
          </div>
          <span class="round"><ArrowUpRight size={20} /></span></button
        >
      {:else}<p class="status-note">No recipes match. Try “adobo”, “salmon” or “noodles”.</p>{/each}
    {:else}
      {#each matchingFoods.slice(0, visible) as food (food.id)}<button
          class="food-row"
          onclick={() => nav.open({ kind: 'detail', food, source: 'usda' })}
          ><div class="food-text">
            <h3>{foodName(food, $region)}</h3>
            <small>{number(food.nutrition.kcal)} kcal / 100 g · USDA FDC {food.fdcId}</small><span class="chip"
              >{food.category}</span
            >
          </div>
          <span class="round"><ArrowUpRight size={20} /></span></button
        >{:else}<p class="status-note">No ingredient matches. Live USDA search may have more.</p>{/each}
      {#if visible < matchingFoods.length}<button class="button outline" onclick={() => (visible += 24)}
          >Show more foods</button
        >{/if}
    {/if}
  </div>
  <p class="source-line">
    Food numbers: USDA FoodData Central, CC0. Recipe totals are computed from their ingredients. Dish photos are openly
    licensed and credited on <a href="/busog/credits/">the credits page</a>.
  </p>
</div>

<style>
  .foods-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 35px;
    border-radius: 32px;
  }
  .foods-header p {
    font-size: var(--text-xs);
    margin-bottom: 16px;
  }
  .food-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 25px;
  }
  .food-stats > span {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font: var(--text-xs) var(--mono);
    background: #f6f8f340;
    padding: 12px 18px;
    border-radius: 15px;
  }
  .food-stats strong {
    font-size: var(--text-xl);
  }
  .foods-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 26px 0;
  }
  .foods-controls label {
    margin-left: auto;
    flex: 1;
    max-width: 340px;
  }
  .foods-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .foods-list .chip {
    font-size: var(--text-2xs);
    margin-top: 8px;
    background: var(--surface);
  }
  .food-thumb {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    overflow: hidden;
  }
  .food-subtitle {
    color: var(--muted);
    font-size: var(--text-xs);
    line-height: 1.4;
  }
  :global([data-device='phone']) .foods-header {
    padding: 24px 20px;
    margin: -28px -18px 0;
    border-radius: 0 0 32px 32px;
  }
  :global([data-device='phone']) .foods-header > :global(svg) {
    max-width: 90px;
  }
  :global([data-device='phone']) .food-stats {
    gap: 7px;
  }
  :global([data-device='phone']) .food-stats > span {
    padding: 8px;
    font-size: var(--text-2xs);
  }
  :global([data-device='phone']) .food-stats strong {
    font-size: var(--text-lg);
  }
  :global([data-device='phone']) .foods-controls {
    flex-wrap: wrap;
  }
  :global([data-device='phone']) .foods-controls label {
    order: 2;
    flex-basis: 100%;
    max-width: none;
  }
  :global([data-device='phone']) .foods-list {
    grid-template-columns: 1fr;
  }
  @media (max-width: 1100px) {
    .foods-list {
      grid-template-columns: 1fr;
    }
  }
</style>
