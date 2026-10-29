<script lang="ts">
  import { untrack } from 'svelte';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  import Today from './Today.svelte';
  import Progress from './Progress.svelte';
  import Foods from './Foods.svelte';
  import Profile from './Profile.svelte';
  import Onboarding from './Onboarding.svelte';
  /** Shared screen content is mounted once inside the chosen responsive shell. */
  let { store, nav, date = $bindable() }: { store: DemoStore; nav: Navigation; date: string } = $props();
  const status = untrack(() => store.status);
</script>

{#if !$status.loaded}
  <section class="app-page">
    <h1>Setting the table.</h1>
    <p role="status">Loading your demo diary…</p>
  </section>
{:else}
  {#if !$status.persistent}<p class="storage-notice" role="status">
      Storage is unavailable. Your demo works for this visit.
    </p>{/if}
  {#if $status.recovered}<p class="storage-notice" role="status">
      Saved data couldn’t be read. A fresh demo is ready.
    </p>{/if}
  {#if $nav.screen === 'today'}<Today {store} {nav} bind:date />
  {:else if $nav.screen === 'progress'}<Progress {store} {nav} />
  {:else if $nav.screen === 'foods'}<Foods {nav} />
  {:else if $nav.screen === 'profile'}<Profile {store} {nav} />
  {:else}<Onboarding {store} {nav} />{/if}
{/if}
