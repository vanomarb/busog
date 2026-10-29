<script lang="ts">
  import { generateDemo } from '../../lib/mock';
  import { today } from '../../domain/dates';
  import WeeklyCalories from '../app/WeeklyCalories.svelte';
  import MacroBalance from '../app/MacroBalance.svelte';
  import CounterCard from '../app/CounterCard.svelte';
  import BrandMark from './BrandMark.svelte';
  /**
   * Marketing previews render the actual dashboard components at build time, with no hydration: the page ships no
   * framework code for a picture. The controls are inert, and the whole preview is one link into the live demo.
   * Scaling to the column width is done by lib/preview.ts.
   */
  const data = generateDemo();
  const date = today();
  const ignore = () => {};
</script>

<div class="preview-viewport" data-scale-preview>
  <a class="preview-link" href="/busog/app/" aria-label="Open the live demo"></a>
  <div class="product-preview" inert>
    <div class="preview-top">
      <span class="preview-monogram"><BrandMark size={20} /></span><span class="mono">Today / Overview</span><span
        class="preview-day mono">Mara’s plate</span
      >
    </div>
    <WeeklyCalories entries={data.entries} goal={data.profile.kcal} {date} onselect={ignore} ondetail={ignore} />
    <div class="preview-bottom">
      <MacroBalance
        entries={data.entries}
        profile={data.profile}
        {date}
        onselect={ignore}
        ondetail={ignore}
      /><CounterCard onclick={ignore} />
    </div>
  </div>
</div>

<style>
  .preview-viewport {
    position: relative;
    width: 100%;
    min-width: 0;
    overflow: clip;
  }
  .preview-link {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 30px;
  }
  .product-preview {
    transform-origin: top left;
    border: 1px solid #c5d4ca60;
    border-radius: 30px;
    padding: 18px;
    background: #232522;
    color: #f6f8f3;
    box-shadow: 14px 18px 0 #141612;
  }
  .preview-top {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 9px;
    margin-bottom: 18px;
  }
  .preview-monogram {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--sage);
    color: #20231f;
    --mark-cut: var(--sage);
  }
  .preview-day {
    margin-left: auto;
    background: #f6f8f3;
    color: #20231f;
    padding: 8px 15px;
    border-radius: 99px;
  }
  .preview-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 12px;
    margin-top: 12px;
  }
  .product-preview :global(.card) {
    border-radius: 22px;
    padding: 20px;
  }
  .product-preview :global(.card-heading) {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 8px;
    margin-bottom: 16px;
  }
  .product-preview :global(.card-heading h2) {
    font-size: 29px;
  }
  .product-preview :global(.card-heading .round) {
    width: 32px;
    height: 32px;
    min-height: 44px;
  }
  .product-preview :global(.card-heading select) {
    background: #20231f15;
    color: #20231f;
    border: 0;
    border-radius: 99px;
    font: 16px var(--mono);
    width: auto;
    padding: 9px;
  }
  .product-preview :global(.calorie-body) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 12px;
  }
  .product-preview :global(.weekly-stats) {
    grid-template-columns: 1fr;
  }
  .product-preview :global(.weekly-stats > div) {
    padding: 12px;
  }
  .product-preview :global(.weekly-stats strong) {
    font-size: 26px;
    margin: 6px 0;
  }
  .product-preview :global(.weekly-stats p) {
    font-size: 9px;
  }
  .product-preview :global(.weekly-bars) {
    height: 200px;
  }
  .product-preview :global(.macro-day strong) {
    width: 29px;
    height: 29px;
    font-size: 8px;
    border-width: 2px;
  }
  .product-preview :global(.macro-day) {
    /* The preview is inert, so its day buttons don't need the 44px touch minimum. */
    min-width: 0;
    flex: 1;
    font-size: 8px;
    gap: 7px;
  }
  .product-preview :global(.macro-circles) {
    gap: 4px;
  }
  .product-preview :global(.macro-legend span) {
    font-size: 8px;
    padding: 4px 7px;
  }
</style>
