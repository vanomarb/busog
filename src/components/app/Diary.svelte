<script lang="ts">
  import { MEALS, foodName, mealName } from '../../domain/names';
  import { region } from '../../lib/region';
  import { Plus, ArrowUpRight } from '@lucide/svelte';
  import { sum, serving, number } from '../../domain/nutrition';
  import type { Entry } from '../../domain/types';
  import type { Navigation } from '../../lib/navigation';
  import SourceMark from './SourceMark.svelte';
  /** Meal subtotals and editable entries stay adjacent to the sticky nutrition summary on web. */
  let { entries, nav }: { entries: Entry[]; nav: Navigation } = $props();
</script>

<section class="diary-section">
  <header class="card-heading">
    <h2>The day’s diary</h2>
    <button class="round" aria-label="Log a meal" onclick={() => nav.open({ kind: 'log' })}><Plus size={22} /></button>
  </header>
  {#each MEALS as meal (meal)}
    {@const items = entries.filter((entry) => entry.meal === meal)}
    {@const total = sum(items.map((entry) => serving(entry.food, entry.grams)))}
    <section class="meal-group">
      <header>
        <h3>{mealName(meal, $region)}</h3>
        <span class="mono">{number(total.kcal)} kcal</span>
      </header>
      {#each items as entry (entry.id)}
        <button
          class="diary-row"
          onclick={() =>
            nav.open({ kind: 'detail', food: entry.food, source: entry.source, grams: entry.grams, entryId: entry.id })}
        >
          <div class="diary-symbol" aria-hidden="true">{entry.food.source === 'recipe' ? '◒' : '◌'}</div>
          <div>
            <p>{foodName(entry.food, $region)}</p>
            <small>{number(entry.grams)} g · {entry.time}</small><SourceMark source={entry.source} />
          </div>
          <span class="entry-calories mono"
            >{number(serving(entry.food, entry.grams).kcal)}<ArrowUpRight size={15} /></span
          >
        </button>
      {:else}
        <button class="empty-meal" onclick={() => nav.open({ kind: 'log' })}
          ><Plus size={17} /> Add your {mealName(meal, $region).toLowerCase()} plate</button
        >
      {/each}
    </section>
  {/each}
</section>

<style>
  .diary-section {
    min-width: 0;
  }
  .diary-section h2 {
    font-size: var(--text-2xl);
  }
  .meal-group {
    padding: 25px;
    border-radius: 25px;
    background: var(--raised);
    margin-bottom: 16px;
  }
  .meal-group > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .meal-group h3 {
    font-size: var(--text-xl);
  }
  .meal-group > header span {
    font-size: var(--text-xs);
  }
  .diary-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 14px;
    padding: 18px 0;
    text-align: left;
    border-bottom: 1px solid var(--line);
  }
  .diary-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
  .diary-symbol {
    background: var(--raised-2);
    color: var(--muted);
    border-radius: 16px;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    font-size: var(--text-xl);
    flex-shrink: 0;
  }
  .diary-row > div:nth-child(2) {
    flex: 1;
    min-width: 0;
  }
  .diary-row p {
    font-size: var(--text-sm);
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .diary-row small {
    display: block;
    font-size: var(--text-2xs);
    color: var(--muted);
    margin: 4px 0;
  }
  .entry-calories {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: var(--text-xs);
  }
  .empty-meal {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 0 0;
    color: var(--muted);
    font-size: var(--text-sm);
  }
</style>
