/* Accessible mobile navigation: reverse stagger when closing. */
(() => {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closeTimer;
  function closeMenu() {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    if (reduced.matches || window.matchMedia('(min-width: 721px)').matches) {
      menu.open = false;
      return;
    }
    menu.classList.add('is-closing');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      menu.open = false;
      menu.classList.remove('is-closing');
    }, 500);
  }
  summary.addEventListener('click', (event) => {
    if (menu.open) {
      event.preventDefault();
      closeMenu();
    }
  });
  menu.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      // Navigate normally; for same-page anchors, collapse the overlay.
      if (link.hash && link.origin === location.origin && link.pathname === location.pathname) {
        menu.open = false;
        menu.classList.remove('is-closing');
      }
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      closeMenu();
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) closeMenu();
  });
})();
