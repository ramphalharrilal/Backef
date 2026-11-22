/* Original motion implementation for SZARA.
   Parallax images move more slowly than their containing sections.
   Uses passive scroll events and rAF; honors reduced-motion preferences. */
(() => {
  const root = document.body;
  if (!root || !root.classList.contains('szara-relaunch')) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const parallax = Array.from(document.querySelectorAll(
    '.sz-panorama .sz-parallax-image img,' +
    '.sz-panorama-interlude .sz-parallax-image img,' +
    '.sz-blue-quote .sz-blue-quote-photo img'
  ));
  const reveals = Array.from(document.querySelectorAll('.sz-reveal'));
  const header = document.querySelector('.sz-studio-header');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('sz-seen');
        observer.unobserve(entry.target);
      }
    }, { threshold: .07, rootMargin: '0px 0px -8% 0px' });
    for (let i = 0; i < reveals.length; i++) {
      const element = reveals[i];
      element.style.setProperty('--sz-reveal-delay', ((i % 3) * 75) + 'ms');
      observer.observe(element);
    }
    root.classList.add('sz-agency-animated');
  }
  let queued = false;
  function update() {
    queued = false;
    const viewport = innerHeight;
    if (header) header.classList.toggle('has-scrolled', scrollY > 10);
    if (motion.matches) {
      for (const image of parallax) image.style.transform = '';
      root.classList.remove('sz-agency-animated');
      return;
    }
    for (const image of parallax) {
      const section = image.closest('.sz-panorama, .sz-blue-quote, .sz-panorama-interlude');
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewport + 100) continue;
      const centerDistance = viewport / 2 - (rect.top + rect.height / 2);
      // Counteract a fraction of the section's scroll: the background travels
      // more slowly than foreground text, matching the recorded blue panel.
      const isQuote = section.classList.contains('sz-blue-quote');
      const isInterlude = section.classList.contains('sz-panorama-interlude');
      const fraction = isQuote ? .35 : isInterlude ? .29 : .18;
      // Photo wrappers extend beyond each section; keep movement inside those
      // bounds to prevent exposed edges on narrow screens.
      const travel = isQuote
        ? Math.min(95, rect.height * .2)
        : isInterlude ? Math.min(75, rect.height * .145) : rect.height * .05;
      const offset = Math.max(-travel, Math.min(travel, centerDistance * fraction));
      image.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.055)';
    }
  }
  function queueUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  addEventListener('scroll', queueUpdate, { passive: true });
  addEventListener('resize', queueUpdate, { passive: true });
  addEventListener('pageshow', queueUpdate, { passive: true });
  motion.addEventListener && motion.addEventListener('change', queueUpdate);
  update();
})();