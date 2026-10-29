<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  /**
   * The app's scroll container. Each screen keeps its own scroll position: a screen opened for the first time starts
   * at the top, and returning to one restores where you left it. The position is saved before the DOM swaps screens
   * ($effect.pre) and restored after (`$effect`), so neither the old nor the new screen's height can distort it.
   */
  let { screen, locked, children }: { screen: string; locked: boolean; children: Snippet } = $props();
  let node: HTMLElement;
  // Plain, non-reactive bookkeeping: nothing renders from these values.
  const saved: Record<string, number> = {};
  let shown: string | undefined;
  $effect.pre(() => {
    const next = screen;
    untrack(() => {
      if (node && shown !== undefined && shown !== next) saved[shown] = node.scrollTop;
    });
  });
  $effect(() => {
    const current = screen;
    untrack(() => {
      if (shown !== current) node.scrollTop = saved[current] ?? 0;
      shown = current;
    });
  });
</script>

<main class="app-scroll" class:locked id="app-main" bind:this={node}>{@render children()}</main>
