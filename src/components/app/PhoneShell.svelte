<script lang="ts">
  import { House, ChartNoAxesCombined, Plus, CookingPot, UserRound } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import type { Navigation, Screen } from '../../lib/navigation';
  import ScreenScroll from './ScreenScroll.svelte';
  /** The opaque floating navigation: icon-only like the desktop rail, around a raised log action. */
  let { nav, locked, children }: { nav: Navigation; locked: boolean; children: Snippet } = $props();
  const tab = (screen: Screen) => ({
    'aria-label': { today: 'Today', progress: 'Progress', foods: 'Foods', profile: 'You', onboarding: '' }[screen],
    'aria-current': $nav.screen === screen ? ('page' as const) : undefined,
    class: $nav.screen === screen ? 'active' : '',
    onclick: () => nav.screen(screen),
  });
</script>

<div class="phone-shell" inert={locked}>
  <ScreenScroll screen={$nav.screen} {locked}>{@render children()}</ScreenScroll>
  <nav class="phone-tabs" aria-label="App navigation">
    <button {...tab('today')}><House size={24} /></button>
    <button {...tab('progress')}><ChartNoAxesCombined size={24} /></button>
    <button class="raised-log" aria-label="Log food" onclick={() => nav.open({ kind: 'log' })}
      ><Plus size={28} /></button
    >
    <button {...tab('foods')}><CookingPot size={24} /></button>
    <button {...tab('profile')}><UserRound size={24} /></button>
  </nav>
</div>
