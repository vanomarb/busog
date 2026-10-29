<script lang="ts">
  import { onMount } from 'svelte';
  import MealTimeline from './MealTimeline.svelte';
  import { ArrowUpRight } from '@lucide/svelte';
  import { manilaClock } from '../../domain/dates';
  import { EATING_WINDOW, timeAngle } from '../../domain/timing';
  import type { Entry } from '../../domain/types';
  /** The 24-hour clock plots actual log times, with time expressed in Asia/Manila. */
  let { entries, onclick }: { entries: Entry[]; onclick: () => void } = $props();
  let clock = $state(manilaClock());
  const meals = $derived([...new Set(entries.map((entry) => entry.time))].sort());
  onMount(() => {
    const timer = setInterval(() => (clock = manilaClock()), 1000);
    return () => clearInterval(timer);
  });
</script>

<section class="card sage timing-card">
  <header class="card-heading">
    <h2>Meal timing</h2>
    <button class="round" {onclick} aria-label="Log a meal"><ArrowUpRight size={21} /></button>
  </header>
  <svg
    viewBox="0 0 220 220"
    class="meal-dial"
    role="img"
    aria-label={`Eating window 07:00–21:00 on a 24-hour dial; ${meals.length} logged meal times marked by dots`}
  >
    <circle cx="110" cy="110" r="88" style="fill: var(--raised-2)" />
    {#each Array.from({ length: 48 }, (_, i) => i) as tick (tick)}
      <path
        d={tick % 2 === 0 ? 'M110 25v9' : 'M110 25v4'}
        style="stroke: var(--line)"
        transform={`rotate(${tick * 7.5} 110 110)`}
      />
    {/each}
    <circle cx="110" cy="110" r="57" fill="none" style="stroke: var(--line)" stroke-width="14" />
    <circle
      cx="110"
      cy="110"
      r="57"
      fill="none"
      style="stroke: var(--accent)"
      stroke-linecap="round"
      stroke-width="14"
      pathLength="1440"
      stroke-dasharray={`${EATING_WINDOW.end - EATING_WINDOW.start} 1440`}
      transform={`rotate(${EATING_WINDOW.start / 4 - 90} 110 110)`}
    />
    {#each meals as meal (meal)}<circle
        cx="110"
        cy="53"
        r="5"
        style="fill: var(--ink)"
        transform={`rotate(${timeAngle(meal)} 110 110)`}
      />{/each}
    <path
      d="M110 110V48"
      style="stroke: var(--ink)"
      stroke-width="2.5"
      stroke-linecap="round"
      transform={`rotate(${(clock.hours + clock.minutes / 60) * 15} 110 110)`}
    />
    <circle cx="110" cy="110" r="5" style="fill: var(--ink)" />
    <text x="110" y="15" text-anchor="middle">00</text><text x="209" y="114" text-anchor="middle">06</text>
    <text x="110" y="216" text-anchor="middle">12</text><text x="10" y="114" text-anchor="middle">18</text>
  </svg>
  <div class="timing-meta">
    <span class="chip"
      >{clock.hours * 60 + clock.minutes >= EATING_WINDOW.start && clock.hours * 60 + clock.minutes < EATING_WINDOW.end
        ? 'Eating window'
        : 'Fasting'}</span
    ><span class="chip">{String(clock.hours).padStart(2, '0')}:{String(clock.minutes).padStart(2, '0')}</span>
  </div>
  <p class="timing-note">
    Eating window 07:00–21:00. Logged: {meals.length
      ? meals.join(' / ')
      : 'No meals logged yet. Start with your next plate.'}
  </p>
  <MealTimeline
    {entries}
    time={`${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`}
    onlog={onclick}
  />
</section>

<style>
  .meal-dial {
    display: block;
    width: 100%;
    max-width: 230px;
    margin: -10px auto 10px;
  }
  text {
    font: var(--text-2xs) var(--mono);
    fill: var(--muted);
  }
  .timing-meta {
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }
  .timing-meta .chip {
    font-size: var(--text-2xs);
    padding: 5px 8px;
  }
  .timing-note {
    font: var(--text-2xs) / 1.8 var(--mono);
    margin-top: 10px;
  }
</style>
