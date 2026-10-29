<script lang="ts">
  import { foods, recipes, foodById } from '../../data/catalog';
  import { recipeTotal, number, serving } from '../../domain/nutrition';
  import { foodName } from '../../domain/names';
  import type { Food } from '../../domain/types';
  import { region } from '../../lib/region';
  /** Visible ingredient arithmetic makes dish compositions inspectable instead of claiming exact restaurant values. */
  let { food }: { food: Food } = $props();
  const recipe = $derived(recipes.find((item) => item.id === food.id));
</script>

<details class="count-math">
  <summary>How we counted this</summary>
  {#if recipe}
    <p>
      Weighed ingredients, in their USDA state. Makes {recipe.servings} servings. A cook’s own recipe may differ.
    </p>
    {#each recipe.ingredients as ingredient (ingredient.foodId)}
      {@const item = foodById(ingredient.foodId)}
      <div class="math-row">
        <a href={item.sourceUrl} target="_blank" rel="noreferrer"
          >{foodName(item, $region)}<small>FDC {item.fdcId}</small></a
        ><span
          >{ingredient.grams} g × {number(item.nutrition.kcal)} / 100<br />= {number(
            serving(item, ingredient.grams).kcal,
            1,
          )} kcal</span
        >
      </div>
    {/each}
    <p class="mono">
      {number(recipeTotal(recipe.ingredients, foods).kcal, 1)} kcal ÷ {recipe.servings} = {number(
        recipeTotal(recipe.ingredients, foods).kcal / recipe.servings,
        1,
      )} kcal / serving
    </p>
  {:else}
    <p>
      Published values are per 100 g of edible food. Your portion in grams ÷ 100 × the source values gives your plate’s
      numbers.
    </p>
    <a href={food.sourceUrl} target="_blank" rel="noreferrer"
      >View {food.source === 'off' ? 'Open Food Facts · ODbL' : `USDA FDC ${food.fdcId}`}</a
    >
  {/if}
</details>

<style>
  summary {
    cursor: pointer;
    padding: 12px 0;
    min-height: 44px;
    font-weight: 600;
  }
  details {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  p {
    font-size: var(--text-sm);
    margin: 14px 0;
  }
  .math-row {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    border-top: 1px solid var(--line);
    padding: 13px 0;
    font-size: var(--text-xs);
  }
  .math-row small {
    display: block;
    font-size: var(--text-2xs);
    color: var(--muted);
    margin-top: 5px;
  }
  .math-row > span {
    font: var(--text-2xs) / 1.8 var(--mono);
    flex-shrink: 0;
    text-align: right;
  }
</style>
