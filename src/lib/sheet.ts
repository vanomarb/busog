interface SheetOptions {
  active: boolean;
  close: () => void;
}
/** Own drag and focus at the top layer so nested sheets never move their parents. */
export function sheet(node: HTMLElement, initial: SheetOptions) {
  let options = initial;
  let startY = 0;
  let lastTime = 0;
  let lastY = 0;
  let speed = 0;
  let distance = 0;
  let dragging = false;
  let armed = false;
  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const focus = () => {
    if (options.active)
      (node.querySelector<HTMLElement>('[data-autofocus], button, input, select') || node).focus({
        preventScroll: true,
      });
  };
  const frame = requestAnimationFrame(focus);
  const eligible = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    if (target.closest('input, select, textarea, [data-horizontal], [role="slider"]')) return false;
    let ancestor: Element | null = target;
    while (ancestor && ancestor !== node) {
      if (ancestor.scrollWidth > ancestor.clientWidth + 2) return false;
      if (ancestor.scrollHeight > ancestor.clientHeight + 2 && ancestor.scrollTop > 0) return false;
      ancestor = ancestor.parentElement;
    }
    return options.active;
  };
  const begin = (y: number, target: EventTarget | null) => {
    armed = eligible(target);
    if (!armed) return;
    startY = y;
    lastTime = performance.now();
    lastY = y;
    speed = 0;
    distance = 0;
  };
  const move = (y: number, event: Event) => {
    if (!armed || !options.active) return;
    if (y < startY - 5 && !dragging) {
      armed = false;
      return;
    }
    distance = Math.max(0, y - startY);
    const now = performance.now();
    speed = (y - lastY) / Math.max(1, now - lastTime);
    lastY = y;
    lastTime = now;
    if (distance < 5 && !dragging) return;
    dragging = true;
    if (event.cancelable) event.preventDefault();
    node.style.transition = 'none';
    node.style.transform = `translateY(${distance}px)`;
  };
  const finish = () => {
    if (!armed) return;
    const velocity = performance.now() - lastTime < 120 ? speed : 0;
    armed = false;
    if (dragging && (distance > node.offsetHeight * 0.25 || (distance > 40 && velocity > 0.6))) options.close();
    node.style.transition = 'transform 180ms ease-out';
    node.style.transform = '';
    dragging = false;
  };
  const touchStart = (event: TouchEvent) => begin(event.touches[0].clientY, event.target);
  const touchMove = (event: TouchEvent) => move(event.touches[0].clientY, event);
  const pointerStart = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !(event.target instanceof Element) || !event.target.closest('.sheet-grip'))
      return;
    begin(event.clientY, event.target);
    if (armed) node.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') move(event.clientY, event);
  };
  const keydown = (event: KeyboardEvent) => {
    if (!options.active) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      options.close();
    }
    if (event.key === 'Tab') {
      const items = [
        ...node.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex="0"]'),
      ].filter((item) => !item.hasAttribute('disabled') && item.offsetParent !== null);
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };
  node.addEventListener('touchstart', touchStart, { passive: true });
  node.addEventListener('touchmove', touchMove, { passive: false });
  node.addEventListener('touchend', finish);
  node.addEventListener('touchcancel', finish);
  node.addEventListener('pointerdown', pointerStart);
  node.addEventListener('pointermove', pointerMove);
  node.addEventListener('pointerup', finish);
  node.addEventListener('keydown', keydown);
  return {
    update(next: SheetOptions) {
      options = next;
    },
    destroy() {
      cancelAnimationFrame(frame);
      node.removeEventListener('touchstart', touchStart);
      node.removeEventListener('touchmove', touchMove);
      node.removeEventListener('touchend', finish);
      node.removeEventListener('touchcancel', finish);
      node.removeEventListener('pointerdown', pointerStart);
      node.removeEventListener('pointermove', pointerMove);
      node.removeEventListener('pointerup', finish);
      node.removeEventListener('keydown', keydown);
      requestAnimationFrame(() => previous?.focus({ preventScroll: true }));
    },
  };
}
