<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowUpRight, Sparkles } from '@lucide/svelte';
  import { manilaClock } from '../../domain/dates';
  import { number } from '../../domain/nutrition';
  /** A source-derived protein reminder and live local countdown replace unsupported coaching claims. */
  let { remaining, onclick }: { remaining: number; onclick: () => void } = $props();
  let clock = $state(manilaClock());
  onMount(() => {
    const timer = setInterval(() => (clock = manilaClock()), 1000);
    return () => clearInterval(timer);
  });
  const seconds = $derived(Math.max(0, 21 * 3600 - clock.hours * 3600 - clock.minutes * 60 - clock.seconds));
  const countdown = $derived(
    [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map((part) => String(part).padStart(2, '0'))
      .join(':'),
  );
</script>

<section class="card yellow nudge">
  <div class="nudge-icon"><Sparkles size={24} /></div>
  <div>
    <h2>A little nudge</h2>
    <p>Protein: {number(Math.max(0, remaining))} g to your target.</p>
    <small>{seconds ? `Until 9pm in Manila: ${countdown}` : 'Dinner window complete. Tomorrow is a fresh plate.'}</small
    >
  </div>
  <button class="round" {onclick} aria-label="Find food for dinner"><ArrowUpRight size={20} /></button>
</section>

<style>
  .nudge {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  .nudge h2 {
    font-size: var(--text-xl);
    margin-bottom: 8px;
  }
  .nudge p {
    font-size: var(--text-sm);
  }
  .nudge small {
    display: block;
    font-size: var(--text-2xs);
    margin-top: 5px;
  }
  .nudge > div:nth-child(2) {
    flex: 1;
  }
  .nudge-icon {
    display: grid;
    place-items: center;
    width: 50px;
    height: 58px;
    border-radius: 18px;
    background: color-mix(in srgb, var(--tone) 18%, transparent);
    color: var(--tone);
  }
  :global([data-device='phone']) .nudge-icon {
    display: none;
  }
</style>
