const NAV_HEIGHT = 56;

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function smoothScrollTo(targetY: number, duration = 800): void {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function scrollToSection(id: string, duration = 800): void {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  smoothScrollTo(top, duration);
}
