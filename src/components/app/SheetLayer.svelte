<script lang="ts">
  import { X } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import { sheet } from '../../lib/sheet';
  /** A layer owns its own drag transform; only the active layer receives input. */
  let {
    title,
    active,
    index,
    close,
    children,
  }: {
    title: string;
    active: boolean;
    index: number;
    close: () => void;
    children: Snippet;
  } = $props();
</script>

<div class="layer" style:z-index={50 + index} inert={!active}>
  <button class="sheet-backdrop" onclick={close} aria-label="Close dialog" tabindex={active ? 0 : -1}></button>
  <div
    class="sheet-panel"
    role="dialog"
    aria-modal={active}
    aria-label={title}
    tabindex="-1"
    use:sheet={{ active, close }}
  >
    <div class="sheet-grip" aria-hidden="true"><span></span></div>
    <header class="sheet-heading">
      <h2>{title}</h2>
      <button class="round" onclick={close} aria-label="Close dialog"><X size={20} /></button>
    </header>
    <div class="sheet-scroll">{@render children()}</div>
  </div>
</div>
