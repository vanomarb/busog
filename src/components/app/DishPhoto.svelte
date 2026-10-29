<script lang="ts">
  import type { Recipe } from '../../domain/types';
  /**
   * A licensed photo of the dish itself (credited on /credits), served as a 480 or 960 pixel WebP. Lazy by default;
   * pass `eager` for the one image a page leads with.
   */
  let {
    recipe,
    alt = '',
    sizes = '(max-width: 600px) 50vw, 320px',
    eager = false,
  }: { recipe: Recipe; alt?: string; sizes?: string; eager?: boolean } = $props();
</script>

<img
  class="dish-photo"
  src={`/busog/images/${recipe.image}-480.webp`}
  srcset={`/busog/images/${recipe.image}-480.webp 480w, /busog/images/${recipe.image}-960.webp 960w`}
  {sizes}
  {alt}
  width="480"
  height="360"
  loading={eager ? 'eager' : 'lazy'}
  fetchpriority={eager ? 'high' : 'auto'}
  decoding="async"
/>

<style>
  .dish-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: var(--raised);
  }
</style>
