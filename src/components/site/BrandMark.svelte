<script lang="ts">
  /**
   * The Busog mark (a smiling bowl with two curls of steam), used everywhere the brand appears: site header, app rail,
   * coach avatar and previews. It draws in currentColor; the smile is cut out with --mark-cut, so set that to the
   * colour behind the mark.
   */
  let { size = 40 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <path d="M7 22h34c-1 12-7 18-17 18S8 34 7 22Z" fill="currentColor"></path>
  <path d="M15 14c-4-7 4-10 6-2M27 12c0-8 9-7 8-1" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
  <path d="M17 29c4 4 10 4 14 0" stroke="var(--mark-cut, var(--surface))" stroke-width="2.5" stroke-linecap="round"
  ></path>
</svg>
