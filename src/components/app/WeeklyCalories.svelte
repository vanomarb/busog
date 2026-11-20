<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import { average, dayTotal, weekDays, percentageChange } from '../../domain/diary';
  import { today, shiftDate } from '../../domain/dates';
  import { number } from '../../domain/nutrition';
  import type { Entry } from '../../domain/types';
  /** Weekly history uses hatching for unlogged/future values and a single selected date. */
  let {
    entries,
    goal,
    date,
    onselect,
    ondetail,
  }: {
    entries: Entry[];
    goal: number;
    date: string;
    onselect: (date: string) => void;
    ondetail: () => void;
  } = $props();
  let period = $state('0');
  const days = $derived(weekDays(shiftDate(today(), Number(period) * 7)));
  const end = $derived(shiftDate(today(), Number(period) * 7 - 1));
  const currentAverage = $derived(average(entries, end, 7));
  const previousAverage = $derived(average(entries, shiftDate(end, -7), 7));
  const calorieDelta = $derived(percentageChange(currentAverage.kcal, previousAverage.kcal));
  const proteinDelta = $derived(percentageChange(currentAverage.protein, previousAverage.protein));
</script>

<section class="card coral calories-card">
  <header class="card-heading weekly-heading">
    <h2>Calories</h2>
    <div class="actions">
      <label class="range-pill"
        ><span class="sr-only">Calorie chart period</span>
        <select bind:value={period}><option value="0">this week</option><option value="-1">last week</option></select>
      </label>
      <button class="round" onclick={ondetail} aria-label="Open calorie progress"><ArrowUpRight size={21} /></button>
    </div>
  </header>
  <div class="calorie-body">
    <div class="weekly-bars" aria-label="Daily calories compared to goal">
      {#each days as day (day)}
        {@const total = dayTotal(entries, day)}
        <button
          class="bar-button"
          onclick={() => onselect(day)}
          aria-label={`${day}: ${number(total.kcal)} of ${goal} calories`}
        >
          <div class="bar-track" class:future={day > today()}>
            {#if day <= today()}<span class="bar-fill" style:height={`${Math.min(100, (total.kcal / goal) * 100)}%`}
              ></span>{/if}
            {#if day === date}<span class="bar-value">{number(total.kcal)}</span>{/if}
          </div>
          <span class="bar-day" class:selected={day === date}
            >{new Date(`${day}T12:00:00Z`).toLocaleDateString('en', { weekday: 'short' })}</span
          >
        </button>
      {/each}
    </div>
    <div class="weekly-stats">
      <div>
        <p>
          Average intake {#if calorieDelta}<span class="delta">{calorieDelta}</span>{/if}
        </p>
        <strong>{number(currentAverage.kcal)}</strong><small>kcal / last 7 full days</small>
      </div>
      <div>
        <p>
          Protein average {#if proteinDelta}<span class="delta">{proteinDelta}</span>{/if}
        </p>
        <strong>{number(currentAverage.protein)}<span> g</span></strong><small>vs previous 7 days</small>
      </div>
    </div>
  </div>
</section>

<style>
  .weekly-heading {
    flex-wrap: wrap;
  }
  .range-pill {
    position: relative;
    width: 104px;
    height: 44px;
  }
  .range-pill select {
    position: absolute;
    width: calc(100% / 0.75);
    min-height: calc(44px / 0.75);
    font: var(--text-base) var(--mono);
    transform: scale(0.75);
    transform-origin: top left;
  }
</style>
