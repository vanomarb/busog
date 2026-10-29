<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import { dayTotal, weekDays } from '../../domain/diary';
  import { today } from '../../domain/dates';
  import { macroTargets } from '../../domain/goals';
  import { number } from '../../domain/nutrition';
  import type { Entry, Profile } from '../../domain/types';
  /** Labelled multi-series charts preserve meaning when macro hues are hard to distinguish. */
  let {
    entries,
    profile,
    date,
    onselect,
    ondetail,
  }: {
    entries: Entry[];
    profile: Profile;
    date: string;
    onselect: (date: string) => void;
    ondetail: () => void;
  } = $props();
  const days = $derived(weekDays(today()));
  const goals = $derived(macroTargets(profile.kcal, profile.proteinPercent, profile.carbsPercent));
  const series = ['protein', 'carbs', 'fat'] as const;
  const colors = ['var(--protein)', 'var(--carbs)', 'var(--fat)'];
  const points = (macro: (typeof series)[number]) =>
    days
      .filter((day) => day <= today())
      .map((day, i) => `${10 + i * 50},${80 - Math.min(1.2, dayTotal(entries, day)[macro] / goals[macro]) * 55}`)
      .join(' ');
</script>

<section class="card violet">
  <header class="card-heading">
    <h2>Macro balance</h2>
    <button class="round" aria-label="Open macro progress" onclick={ondetail}><ArrowUpRight size={21} /></button>
  </header>
  <div class="macro-circles" data-horizontal>
    {#each days as day (day)}
      <button
        class="macro-day"
        class:selected={date === day}
        class:future={day > today()}
        onclick={() => onselect(day)}
        aria-label={`View ${day}`}
      >
        <span>{new Date(`${day}T12:00:00Z`).toLocaleDateString('en', { weekday: 'short' })}</span>
        <strong>{day > today() ? '—' : `${number((dayTotal(entries, day).kcal / profile.kcal) * 100)}%`}</strong>
      </button>
    {/each}
  </div>
  <svg viewBox="0 0 320 95" class="macro-lines" role="img" aria-label="Macro grams as a proportion of each daily goal">
    <path d="M0 65h320M0 30h320" style="stroke: var(--line)" stroke-dasharray="2 5" />
    {#each series as macro, index (macro)}<polyline
        points={points(macro)}
        fill="none"
        style:stroke={colors[index]}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray={index === 2 ? '2 5' : index === 1 ? '8 5' : undefined}
      />{/each}
  </svg>
  <div class="macro-legend">
    {#each series as macro, index (macro)}<span><i style:background={colors[index]}></i>{macro}</span>{/each}
  </div>
</section>
