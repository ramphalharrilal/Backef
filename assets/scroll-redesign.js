/* Progressive enhancements only: no tracking, cookies, or dependencies. */
(() => {
  const body = document.body;
  if (!body.classList.contains('szara-relaunch')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const hero = document.querySelector('.szara-cinematic-hero');
  const image = hero && hero.querySelector('.szara-hero-media img');
  const targets = [...document.querySelectorAll(
    '.szara-thesis-grid>*,' +
    '.szara-pathways-intro>*,' +
    '.szara-pathway,.szara-service-extras,' +
    '.szara-city-band .wrap>*,' +
    '#work .section-top>*,#work .case-study,' +
    '#client-feedback .wrap>*,#about .founder-grid>*,' +
    '#contact .contact-grid>*'
  )];
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -7% 0px', threshold: .07 });
    targets.forEach((el, i) => {
      el.style.setProperty('--sz-delay', ((i % 3) * 90) + 'ms');
      el.classList.add('szara-reveal');
      observer.observe(el);
    });
    body.classList.add('szara-js');
  }
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const y = Math.max(0, window.scrollY || 0);
    if (header) header.classList.toggle('has-scrolled', y > 8);
    if (!reduced && image && hero && y < hero.offsetHeight + 100) {
      image.style.transform = 'translate3d(0,' + (Math.min(y,hero.offsetHeight)*.15) + 'px,0) scale(1.08)';
    }
  };
  addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, {passive:true});
  update();
})();
