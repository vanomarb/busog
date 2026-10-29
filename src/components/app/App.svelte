<script lang="ts">
  import { onMount } from 'svelte';
  import { createDemoStore } from '../../lib/store';
  import { createNavigation } from '../../lib/navigation';
  import { region } from '../../lib/region';
  import { today } from '../../domain/dates';
  import { recipes, recipeFood, foods } from '../../data/catalog';
  import PhoneShell from './PhoneShell.svelte';
  import WebShell from './WebShell.svelte';
  import Workspace from './Workspace.svelte';
  import SheetHost from './SheetHost.svelte';
  /** Device state selects one shell; the same store and route survive late device detection. */
  const store = createDemoStore();
  const nav = createNavigation();
  let phone = $state(document.documentElement.dataset.device === 'phone');
  let framed = $state(document.documentElement.dataset.framed === 'true');
  let date = $state(today());
  let message = $state('');
  $effect(() => region.set($store.profile.region));
  onMount(() => {
    const update = () => {
      phone = document.documentElement.dataset.device === 'phone';
      framed = document.documentElement.dataset.framed === 'true';
    };
    update();
    store.hydrate();
    const stop = nav.start();
    const params = new URLSearchParams(location.search);
    if (params.has('onboarding')) nav.screen('onboarding');
    const recipe = recipes.find((item) => item.id === params.get('recipe'));
    const food = foods.find((item) => item.id === params.get('food'));
    if (recipe) nav.open({ kind: 'detail', food: recipeFood(recipe), source: 'turo' });
    else if (food) nav.open({ kind: 'detail', food, source: 'usda' });
    window.addEventListener('busog:device', update);
    return () => {
      stop();
      window.removeEventListener('busog:device', update);
    };
  });
</script>

<div class:framed class="app-stage">
  <div class="app-frame">
    {#snippet content()}
      <Workspace {store} {nav} bind:date />
    {/snippet}
    {#if phone}
      <PhoneShell {nav} locked={$nav.layers.length > 0} children={content} />
    {:else}
      <WebShell {nav} {date} locked={$nav.layers.length > 0} children={content} />
    {/if}
    <SheetHost
      {store}
      {nav}
      {date}
      onmessage={(value) => {
        message = value;
        setTimeout(() => (message = ''), 4000);
      }}
    />
    {#if message}<div class="toast" role="status">{message}</div>{/if}
  </div>
  {#if framed}
    <p class="frame-caption">Busog in your pocket · Live demo<br /><a href="/busog/app/">Switch to web view</a></p>
  {/if}
</div>
