<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import FoodCharacter from './FoodCharacter.svelte';
  /** An original illustrated counter turns the Filipino pointing gesture into the product centerpiece. */
  let { onclick }: { onclick: () => void } = $props();
</script>

<section class="card aqua counter-card">
  <header class="card-heading">
    <h2>Turo-turo</h2>
    <button class="round" {onclick} aria-label="Build a turo-turo plate"><ArrowUpRight size={21} /></button>
  </header>
  <p class="mono">Point. Pick. Plate.</p>
  <div class="counter-art">
    <svg viewBox="0 0 300 160" aria-hidden="true">
      <path d="M0 68 150 19l150 49v70L150 160 0 130Z" fill="#83b3ad" stroke="#20231f" stroke-width="2" />
      <path d="m0 68 150 49 150-49M150 117v43" stroke="#20231f" stroke-width="2" />
      <path d="m32 65 60-20 53 18-60 21Z" fill="#f6f8f3" stroke="#20231f" stroke-width="2" />
      <path d="m155 66 60-20 53 18-60 21Z" fill="#ff705e" stroke="#20231f" stroke-width="2" />
      <path d="m91 88 60-20 53 18-60 21Z" fill="#f5d369" stroke="#20231f" stroke-width="2" />
      <path d="m39 65 43-12m83 13 42-13m-104 36 40-12" stroke="#20231f" stroke-width="3" stroke-dasharray="4 6" />
    </svg>
    <button class="dish-chip chip-one" {onclick}>Adobo <ArrowUpRight size={13} /></button>
    <button class="dish-chip chip-two" {onclick}>Munggo <ArrowUpRight size={13} /></button>
    <div class="counter-friend"><FoodCharacter size={75} /></div>
  </div>
</section>

<style>
  p {
    font-size: var(--text-xs);
  }
  .counter-art {
    position: relative;
    margin-top: 15px;
    height: 180px;
  }
  .counter-art > svg {
    width: 100%;
    height: 180px;
  }
  .dish-chip {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border-radius: 14px;
    background: #f6f8f3;
    color: #20231f;
    font: var(--text-xs) var(--mono);
    box-shadow: 0 2px 0 #20231f30;
  }
  .chip-one {
    top: 15px;
    right: -4px;
  }
  .chip-two {
    left: 0;
    bottom: 28px;
  }
  .counter-friend {
    position: absolute;
    right: 0;
    bottom: -15px;
    transform: rotate(8deg);
  }
</style>
