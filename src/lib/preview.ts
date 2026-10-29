/** Scale a marketing mockup, including its layout height, to its column without squeezing its cards. */
export function scalePreview(node: HTMLElement) {
  const canvas = node.querySelector<HTMLElement>('.product-preview');
  if (!canvas) return;
  const resize = () => {
    const width = node.clientWidth;
    if (!width) return;
    const designWidth = Math.max(640, width - 14);
    const scale = Math.min(1, width / (designWidth + 14));
    canvas.style.width = `${designWidth}px`;
    canvas.style.transform = `scale(${scale})`;
    node.style.height = `${(canvas.offsetHeight + 18) * scale}px`;
    canvas.style.position = 'absolute';
  };
  const observer = new ResizeObserver(resize);
  observer.observe(node);
  observer.observe(canvas);
  resize();
}

/** Scale every preview on the page; the components themselves render statically. */
export function scaleAllPreviews() {
  document.querySelectorAll<HTMLElement>('[data-scale-preview]').forEach(scalePreview);
}
