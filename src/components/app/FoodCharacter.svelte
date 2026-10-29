<script lang="ts">
  /** Original flat food friends provide personality without reference artwork. */
  let { kind = 'rice', size = 120 }: { kind?: 'rice' | 'egg' | 'banana' | 'fish'; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 140 140" fill="none" aria-hidden="true">
  {#if kind === 'rice'}
    <path
      d="M24 66C18 45 34 33 47 39c0-25 34-27 42-4 20-4 37 14 27 32Z"
      fill="#f6f8f3"
      stroke="#20231f"
      stroke-width="3"
    />
    <path d="M17 65h106c-3 43-20 57-53 57S20 108 17 65Z" fill="#bce9e7" stroke="#20231f" stroke-width="3" />
    <path d="M49 99q21 18 42 0M40 121l-8 9m66-9 10 8" stroke="#20231f" stroke-width="3" stroke-linecap="round" />
    <circle cx="49" cy="86" r="3" fill="#20231f" /><circle cx="91" cy="86" r="3" fill="#20231f" />
  {:else if kind === 'egg'}
    <path
      d="M70 16c25 0 54 53 52 78-2 38-100 39-104 2C15 70 44 16 70 16Z"
      fill="#f6f8f3"
      stroke="#20231f"
      stroke-width="3"
    />
    <circle cx="70" cy="83" r="30" fill="#f5d369" stroke="#20231f" stroke-width="3" />
    <circle cx="59" cy="78" r="3" fill="#20231f" /><circle cx="80" cy="78" r="3" fill="#20231f" />
    <path d="M60 93q10 8 20 0" stroke="#20231f" stroke-width="3" stroke-linecap="round" />
  {:else if kind === 'banana'}
    <path
      d="M35 20c14 59 39 79 84 67-17 51-87 48-99 3-8-28-2-49 15-70Z"
      fill="#f5d369"
      stroke="#20231f"
      stroke-width="3"
    />
    <path d="M32 40c3 41 27 73 59 67M30 17l5 3 5-10" stroke="#20231f" stroke-width="3" stroke-linecap="round" />
    <circle cx="49" cy="94" r="3" fill="#20231f" /><circle cx="67" cy="105" r="3" fill="#20231f" />
    <path d="m46 108 10 7" stroke="#20231f" stroke-width="3" stroke-linecap="round" />
  {:else}
    <path
      d="M17 72 4 45l36 8c32-31 70-19 91 17-20 38-57 50-91 20L4 101Z"
      fill="#ff705e"
      stroke="#20231f"
      stroke-width="3"
    />
    <path d="M86 44c-13 16-13 38 0 53M57 59l-15 12 15 13" stroke="#20231f" stroke-width="3" />
    <circle cx="108" cy="65" r="4" fill="#20231f" /><path d="m104 83 9-2" stroke="#20231f" stroke-width="3" />
  {/if}
</svg>
