/* SZARA mission: a deliberately scroll-driven, three-chapter flight path.
   Decorative only. No analytics, location access, storage, or video.
   Designed to respect reduced-motion and touch screens. */
(() => {
  const root = document.body;
  if (!root || !root.classList.contains('szara-relaunch')) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [...document.querySelectorAll('[data-sz-mission]')]
    .map(stage => {
      const section = stage.closest('.sz-panorama, .sz-blue-quote, .sz-panorama-interlude');
      const path = stage.querySelector('.sz-mission-track');
      const progressPath = stage.querySelector('.sz-mission-progress');
      const ship = stage.querySelector('.sz-mission-ship');
      if (!section || !path || !progressPath || !ship ||
          typeof path.getTotalLength !== 'function') return null;
      const distance = path.getTotalLength();
      progressPath.style.strokeDasharray = distance + ' ' + distance;
      progressPath.style.strokeDashoffset = distance;
      return {stage, section, path, progressPath, ship, distance,
        chapter: stage.getAttribute('data-sz-mission')};
    }).filter(Boolean);
  if (!chapters.length) return;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function positionShip(item, position) {
    const {path, progressPath, ship, distance} = item;
    // Leave the ship visible at the beginning and end of each chapter.
    const fraction = .065 + clamp(position, 0, 1) * .87;
    const length = fraction * distance;
    const here = path.getPointAtLength(length);
    const before = path.getPointAtLength(clamp(length - 2, 0, distance));
    const after = path.getPointAtLength(clamp(length + 2, 0, distance));
    const angle = clamp(
      Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI,
      -29, 29
    );
    ship.style.left = (here.x / 1000 * 100).toFixed(2) + '%';
    ship.style.top = (here.y / 260 * 100).toFixed(2) + '%';
    ship.style.transform = 'translate(-50%,-50%) rotate(' + angle.toFixed(2) + 'deg)';
    progressPath.style.strokeDashoffset = Math.max(0, distance - length).toFixed(1);
    item.stage.setAttribute('data-progress', (position * 100).toFixed(0));
  }

  let queued = false;
  function paint() {
    queued = false;
    if (motion.matches) {
      chapters.forEach(item => {
        item.ship.style.removeProperty('left');
        item.ship.style.removeProperty('top');
        item.ship.style.removeProperty('transform');
        item.progressPath.style.strokeDashoffset = item.distance;
      });
      return;
    }
    const viewport = window.innerHeight || 800;
    const scroll = window.scrollY || window.pageYOffset || 0;
    for (const item of chapters) {
      const rect = item.section.getBoundingClientRect();
      const sectionY = scroll + rect.top;
      const isHero = item.chapter === 'launch';
      const from = isHero
        ? Math.max(0, sectionY - viewport * .07)
        : sectionY - viewport * .84;
      const to = isHero
        ? sectionY + rect.height * .78
        : sectionY + rect.height - viewport * .19;
      const progress = clamp((scroll - from) / Math.max(1, to - from), 0, 1);
      // Offscreen scenes keep their previous state until they approach the viewport.
      if (rect.bottom < -viewport || rect.top > viewport * 2) continue;
      positionShip(item, progress);
    }
  }
  function requestPaint() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener('scroll', requestPaint, {passive:true});
  window.addEventListener('resize', requestPaint, {passive:true});
  if (motion.addEventListener) motion.addEventListener('change', requestPaint);
  // First paint positions the satellite even before the visitor starts scrolling.
  requestPaint();
})();
