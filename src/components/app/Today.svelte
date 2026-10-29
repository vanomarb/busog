<script lang="ts">
  import { Search, Bell, ChevronLeft, ChevronRight, Droplets, Flame } from '@lucide/svelte';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  import { dayTotal } from '../../domain/diary';
  import { dateLabel, shiftDate, today } from '../../domain/dates';
  import { macroTargets } from '../../domain/goals';
  import WeeklyCalories from './WeeklyCalories.svelte';
  import MacroBalance from './MacroBalance.svelte';
  import Nudge from './Nudge.svelte';
  import CounterCard from './CounterCard.svelte';
  import MealTiming from './MealTiming.svelte';
  import Coach from './Coach.svelte';
  import Diary from './Diary.svelte';
  import DaySummary from './DaySummary.svelte';
  /** Today connects the overview, diary and all three plate-entry routes. */
  let { store, nav, date = $bindable() }: { store: DemoStore; nav: Navigation; date: string } = $props();
  const total = $derived(dayTotal($store.entries, date));
  const entries = $derived($store.entries.filter((entry) => entry.date === date));
  const targets = $derived(
    macroTargets($store.profile.kcal, $store.profile.proteinPercent, $store.profile.carbsPercent),
  );
  const streak = $derived.by(() => {
    let count = 0;
    while (count < 90 && $store.entries.some((entry) => entry.date === shiftDate(today(), -count))) count++;
    return count;
  });
</script>

<div class="app-page">
  <h1 class="sr-only">Today’s nutrition overview</h1>
  <header class="app-page-intro phone-heading">
    <div>
      <p class="mono muted">Hi, {$store.profile.name}.</p>
      <h1>Your everyday.</h1>
    </div>
    <div class="actions">
      <button class="round" aria-label="Search food" onclick={() => nav.open({ kind: 'search' })}
        ><Search size={21} /></button
      ><button class="round" aria-label="Notifications" onclick={() => nav.open({ kind: 'notice' })}
        ><Bell size={21} /></button
      >
    </div>
  </header>
  <div class="date-controls">
    <button aria-label="Previous day" onclick={() => (date = shiftDate(date, -1))}><ChevronLeft size={20} /></button
    ><span>{dateLabel(date)}</span><button aria-label="Next day" onclick={() => (date = shiftDate(date, 1))}
      ><ChevronRight size={20} /></button
    ><small>Demo diary</small>
  </div>
  <div class="dashboard-grid">
    <div class="dashboard-left">
      <WeeklyCalories
        entries={$store.entries}
        goal={$store.profile.kcal}
        {date}
        onselect={(value) => (date = value)}
        ondetail={() => nav.screen('progress')}
      />
      <div class="dashboard-small">
        <CounterCard onclick={() => nav.open({ kind: 'turo' })} /><MealTiming
          {entries}
          onclick={() => nav.open({ kind: 'log' })}
        />
      </div>
    </div>
    <div class="dashboard-right">
      <Nudge remaining={targets.protein - total.protein} onclick={() => nav.open({ kind: 'turo' })} />
      <MacroBalance
        entries={$store.entries}
        profile={$store.profile}
        {date}
        onselect={(value) => (date = value)}
        ondetail={() => nav.screen('progress')}
      />
      <Coach protein={total.protein} target={targets.protein} />
    </div>
  </div>
  <div class="diary-layout">
    <Diary {entries} {nav} />
    <aside class="sticky-summary">
      <DaySummary {total} profile={$store.profile} />
      <section class="card water-card">
        <div>
          <Droplets size={22} />
          <h2>Water</h2>
          <span class="mono">{($store.water[date] || 0) / 1000} L</span>
        </div>
        <div class="actions">
          <button class="button outline" onclick={() => store.water(date, -250)} aria-label="Remove 250 millilitres"
            >−</button
          ><button class="button accent" onclick={() => store.water(date, 250)}>+ 250 ml</button>
        </div>
      </section>
      <p class="streak">
        <Flame size={19} />
        {streak} days with a logged meal <span class="muted">· mock history</span>
      </p>
    </aside>
  </div>
</div>

<style>
  .date-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 22px;
    font: var(--text-xs) var(--mono);
  }
  .date-controls button {
    display: grid;
    place-items: center;
    width: 44px;
    border-radius: 50%;
    background: var(--raised);
  }
  .date-controls small {
    margin-left: auto;
    color: var(--muted);
    font-size: var(--text-2xs);
  }
  .diary-layout {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 24px;
    margin-top: 42px;
    align-items: start;
  }
  .sticky-summary {
    position: sticky;
    top: 20px;
    display: grid;
    gap: 18px;
  }
  .water-card > div:first-child {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .water-card h2 {
    font-size: var(--text-xl);
    flex: 1;
  }
  .water-card .mono {
    font-size: var(--text-lg);
  }
  .streak {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: var(--text-xs);
  }
  :global([data-device='phone']) .diary-layout {
    display: flex;
    flex-direction: column-reverse;
  }
  :global([data-device='phone']) .sticky-summary {
    position: static;
    width: 100%;
  }
  :global([data-device='phone']) .date-controls small {
    display: none;
  }
  :global([data-device='phone']) .phone-heading .actions {
    gap: 8px;
  }
  :global([data-device='phone']) .phone-heading .round {
    width: 40px;
  }
  @media (max-width: 1000px) {
    .diary-layout {
      grid-template-columns: 1fr;
    }
    .sticky-summary {
      position: static;
    }
  }
</style>
