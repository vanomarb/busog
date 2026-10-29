<script lang="ts">
  import { Plus, ArrowLeft } from '@lucide/svelte';
  import { average, dayTotal } from '../../domain/diary';
  import { today, shiftDate, dateLabel } from '../../domain/dates';
  import { number } from '../../domain/nutrition';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  /** Progress reveals actual diary history at three ranges and keeps each weight editable by date. */
  let { store, nav }: { store: DemoStore; nav: Navigation } = $props();
  let range = $state(7);
  const days = $derived(Array.from({ length: range }, (_, i) => shiftDate(today(), i - range + 1)));
  const mean = $derived(average($store.entries, today(), range));
  const ceiling = $derived(
    Math.max($store.profile.kcal * 1.2, ...days.map((day) => dayTotal($store.entries, day).kcal)),
  );
  const weights = $derived($store.weights.filter((weight) => weight.date >= days[0]));
  const minWeight = $derived(Math.min(...weights.map((weight) => weight.kg), $store.profile.weight) - 0.5);
  const maxWeight = $derived(Math.max(...weights.map((weight) => weight.kg), $store.profile.weight) + 0.5);
  const points = $derived(
    weights
      .map((weight, i) => {
        const x = 20 + (i / Math.max(1, weights.length - 1)) * 660;
        const y = 170 - ((weight.kg - minWeight) / (maxWeight - minWeight)) * 140;
        return `${x},${y}`;
      })
      .join(' '),
  );
</script>

<div class="app-page">
  <header class="app-page-intro">
    <div>
      <p class="mono muted">Look at the pattern.</p>
      <h1>Your progress.</h1>
    </div>
    <button class="round" aria-label="Back to today" onclick={() => nav.screen('today')}><ArrowLeft size={21} /></button
    >
  </header>
  <div class="portion-choices">
    {#each [7, 30, 90] as value (value)}<button class:selected={range === value} onclick={() => (range = value)}
        >{value} days</button
      >{/each}
  </div>
  {#if !$store.entries.length}<div class="card">
      <h2>Your story starts with a plate.</h2>
      <p>Log a meal to see your pattern here.</p>
      <button class="button accent" onclick={() => nav.open({ kind: 'log' })}>Log food</button>
    </div>
  {:else}
    <section class="card coral progress-card">
      <header class="card-heading">
        <h2>Calories vs goal</h2>
        <span class="chip">{range} days</span>
      </header>
      <div class="progress-chart" aria-label="Daily calorie history">
        <div class="goal-guide" style:bottom={`${($store.profile.kcal / ceiling) * 100}%`}>
          <span>Goal {number($store.profile.kcal)}</span>
        </div>
        {#each days as day (day)}<div
            class="history-bar"
            style:height={`${(dayTotal($store.entries, day).kcal / ceiling) * 100}%`}
            title={`${dateLabel(day)}: ${number(dayTotal($store.entries, day).kcal)} kcal`}
          ></div>{/each}
      </div>
      <div class="chart-dates mono"><span>{dateLabel(days[0], true)}</span><span>{dateLabel(today(), true)}</span></div>
      <p class="source-line">Average: {number(mean.kcal)} kcal / day. Values come from your logged food weights.</p>
      <details>
        <summary>Read chart as a table</summary>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Calories</th><th>Goal</th></tr></thead><tbody
              >{#each days as day (day)}<tr
                  ><td>{day}</td><td>{number(dayTotal($store.entries, day).kcal)}</td><td>{$store.profile.kcal}</td></tr
                >{/each}</tbody
            >
          </table>
        </div>
      </details>
    </section>
    <section class="card violet progress-card">
      <header class="card-heading"><h2>Macro averages</h2></header>
      <div class="average-grid">
        {#each ['protein', 'carbs', 'fat'] as macro (macro)}<div>
            <p class="mono">{macro}</p>
            <strong>{number(mean[macro as 'protein' | 'carbs' | 'fat'], 1)} g</strong><small>daily average</small>
          </div>{/each}
      </div>
    </section>
  {/if}
  <section class="card sage progress-card">
    <header class="card-heading">
      <h2>Weight trend</h2>
      <button class="round" aria-label="Log or edit weight" onclick={() => nav.open({ kind: 'weight' })}
        ><Plus size={22} /></button
      >
    </header>
    {#if weights.length}<svg
        class="weight-chart"
        viewBox="0 0 700 200"
        role="img"
        aria-label={`Weight from ${number(weights[0].kg, 1)} to ${number(weights[weights.length - 1].kg, 1)} kilograms`}
        ><path d="M20 170h660M20 100h660M20 30h660" stroke="#20231f35" stroke-dasharray="2 7" /><polyline
          {points}
          fill="none"
          stroke="#20231f"
          stroke-width="3"
        /></svg
      >
      <div class="weight-list">
        {#each weights.slice(-5).reverse() as weight (weight.date)}<button onclick={() => nav.open({ kind: 'weight' })}
            ><span>{dateLabel(weight.date, true)}</span><strong
              >{number($store.profile.units === 'imperial' ? weight.kg * 2.2046226218 : weight.kg, 1)}
              {$store.profile.units === 'imperial' ? 'lb' : 'kg'}</strong
            ><span>Edit ↗</span></button
          >{/each}
      </div>{:else}<p>No weigh-ins in this range. Add one when you’re ready.</p>{/if}
  </section>
</div>

<style>
  .progress-card {
    margin-top: 24px;
  }
  .progress-chart {
    height: 240px;
    display: flex;
    align-items: end;
    gap: 4px;
    position: relative;
    padding-top: 20px;
  }
  .history-bar {
    flex: 1;
    background: #20231f;
    border-radius: 6px 6px 0 0;
    min-height: 2px;
  }
  .goal-guide {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 2px dotted #20231f90;
    pointer-events: none;
  }
  .goal-guide span {
    position: absolute;
    right: 0;
    top: -25px;
    font: var(--text-2xs) var(--mono);
  }
  .chart-dates {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-2xs);
    margin: 15px 0;
  }
  .progress-card .source-line {
    color: #20231f;
  }
  summary {
    padding: 12px 0;
    cursor: pointer;
    font-size: var(--text-sm);
  }
  .average-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  .average-grid p {
    font-size: var(--text-xs);
  }
  .average-grid strong {
    display: block;
    font: 500 var(--text-2xl) var(--mono);
    margin: 12px 0;
  }
  .average-grid small {
    font-size: var(--text-2xs);
  }
  .weight-chart {
    width: 100%;
    max-height: 230px;
  }
  .weight-list {
    display: grid;
    gap: 8px;
  }
  .weight-list button {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    background: #f6f8f350;
    padding: 12px 16px;
    border-radius: 14px;
    font: var(--text-xs) var(--mono);
  }
  :global([data-device='phone']) .average-grid {
    grid-template-columns: 1fr;
  }
  :global([data-device='phone']) .average-grid > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :global([data-device='phone']) .average-grid strong {
    font-size: var(--text-lg);
  }
</style>
