<script lang="ts">
  import { House, ChartNoAxesCombined, Plus, CookingPot, Settings, Search, Bell, ChevronDown } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import BrandMark from '../site/BrandMark.svelte';
  import type { Navigation } from '../../lib/navigation';
  import ScreenScroll from './ScreenScroll.svelte';
  import { dateLabel } from '../../domain/dates';
  /** Desktop rail and breadcrumb chrome follow the owner-directed operational-dashboard vocabulary. */
  let {
    nav,
    date,
    locked,
    children,
  }: {
    nav: Navigation;
    date: string;
    locked: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="web-shell" inert={locked}>
  <aside class="icon-rail" aria-label="App navigation">
    <a href="/busog/" class="monogram" aria-label="Busog home"><BrandMark size={30} /></a>
    <nav>
      <button aria-label="Today" class:active={$nav.screen === 'today'} onclick={() => nav.screen('today')}
        ><House /></button
      >
      <button aria-label="Progress" class:active={$nav.screen === 'progress'} onclick={() => nav.screen('progress')}
        ><ChartNoAxesCombined /></button
      >
      <button aria-label="Foods and recipes" class:active={$nav.screen === 'foods'} onclick={() => nav.screen('foods')}
        ><CookingPot /></button
      >
      <button aria-label="Settings" class:active={$nav.screen === 'profile'} onclick={() => nav.screen('profile')}
        ><Settings /></button
      >
    </nav>
    <div class="rail-bottom">
      <button aria-label="Log food" onclick={() => nav.open({ kind: 'log' })}><Plus /></button><button
        class="avatar"
        aria-label="Mara's profile"
        onclick={() => nav.screen('profile')}>M</button
      >
    </div>
  </aside>
  <div class="web-main">
    <header class="app-topbar">
      <p class="mono"><span class="muted">{$nav.screen === 'foods' ? 'Kitchen' : $nav.screen} /</span> Overview</p>
      <div class="topbar-controls">
        <button class="round" onclick={() => nav.open({ kind: 'search' })} aria-label="Search foods"
          ><Search size={22} /></button
        >
        <button class="day-selector" onclick={() => nav.open({ kind: 'log' })}
          ><CookingPot size={22} /><span>{dateLabel(date)}</span><ChevronDown size={18} /></button
        >
        <button class="round notification" onclick={() => nav.open({ kind: 'notice' })} aria-label="Notifications"
          ><Bell size={22} /><i></i></button
        >
      </div>
    </header>
    <ScreenScroll screen={$nav.screen} {locked}>{@render children()}</ScreenScroll>
  </div>
</div>
