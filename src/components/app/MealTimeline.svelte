<script lang="ts">
  import { foodName } from '../../domain/names';
  import { region } from '../../lib/region';
  import { Plus } from '@lucide/svelte';
  import type { Entry } from '../../domain/types';
  /** The phone timeline mirrors the dial's actual meal timestamps and offers a local next action. */
  let { entries, time, onlog }: { entries: Entry[]; time: string; onlog: () => void } = $props();
  const moments = $derived([...new Set(entries.map((entry) => `${entry.time}|${entry.meal}`))].sort());
</script>

<div class="meal-timeline">
  {#each moments as moment (moment)}
    {@const [logged, meal] = moment.split('|')}
    <div class="timeline-moment">
      <time>{logged}</time>
      <div>
        <h3>{meal}</h3>
        <p>
          {entries
            .filter((entry) => entry.time === logged && entry.meal === meal)
            .map((entry) => foodName(entry.food, $region))
            .join(', ')}
        </p>
      </div>
    </div>
  {:else}<p>Your next meal will start the timeline.</p>{/each}
  <footer>
    <span class="now-pill">{time} / now</span><button
      class="round"
      onclick={onlog}
      aria-label="Add a meal to the timeline"><Plus size={23} /></button
    >
  </footer>
</div>

<style>
  .meal-timeline {
    display: none;
    border-top: 1px solid var(--line);
    margin-top: 20px;
    padding-top: 20px;
  }
  .timeline-moment {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 15px;
    margin-bottom: 18px;
  }
  time {
    font: var(--text-2xs) var(--mono);
    padding-top: 9px;
  }
  .timeline-moment > div {
    padding: 15px;
    border-radius: 18px;
    background: var(--raised-2);
    min-width: 0;
  }
  h3 {
    font-size: var(--text-lg);
  }
  p {
    font: var(--text-2xs) / 1.7 var(--mono);
    margin-top: 10px;
    overflow-wrap: anywhere;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 25px;
  }
  .now-pill {
    background: var(--accent);
    color: var(--on-accent);
    border-radius: 20px;
    padding: 7px 12px;
    font: var(--text-2xs) var(--mono);
  }
  footer .round {
    background: var(--accent);
    color: var(--on-accent);
  }
  :global([data-device='phone']) .meal-timeline {
    display: block;
  }
</style>
