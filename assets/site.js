// Include limited source context in the enquiry email, without cookies or storage.
// Native browser validation and FormSubmit delivery remain unchanged.
(() => {
  const params = new URLSearchParams(location.search);
  const campaign = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const value = params.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) campaign[key] = value;
  }
  for (const form of document.querySelectorAll('form.brief')) {
    const context = { enquiry_page: location.pathname, ...campaign };
    for (const [name, value] of Object.entries(context)) {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      form.append(input);
    }
  }
  // Carry campaign labels between these two pages without storing a visitor ID.
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) continue;
    if (!/(?:\/|\/small-business-websites\/)$/.test(url.pathname)) continue;
    for (const [key, value] of Object.entries(campaign)) url.searchParams.set(key, value);
    link.href = url.href;
  }
})();

// Temporary delivery fallback while FormSubmit returns server errors.
(() => {
  for (const form of document.querySelectorAll('form.brief')) {
    const notice = form.querySelector('.submit-note');
    notice.textContent = 'Our form delivery service is temporarily unavailable. Open an email draft below, then send it from your email app. Nothing is sent automatically.';
    notice.setAttribute('role', 'note');
    const submit = form.querySelector('button[type="submit"]');
    submit.textContent = 'Open email draft';
    const privacy = form.querySelector('.micro');
    const privacyLink = privacy && privacy.querySelector('a');
    if (privacy && privacyLink) {
      privacy.replaceChildren('Read ', privacyLink, '. This temporary email option uses your email app. Please leave out sensitive information. This enquiry is not a purchase or an agreement.');
    }
    const status = form.querySelector('.form-status');
    const fallback = form.querySelector('.form-fallback');
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'button light';
    copy.textContent = 'Copy enquiry';
    copy.style.marginTop = '12px';
    fallback.before(copy);
    function body() {
      const values = new FormData(form);
      return 'Name: ' + (values.get('name') || '') + '\nEmail: ' + (values.get('email') || '') +
        '\n\n' + (values.get('message') || '') + '\n\nWebsite: ' + location.origin + location.pathname;
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try { sessionStorage.removeItem('szara-enquiry-return-v1'); } catch {}
      if (!form.reportValidity()) return;
      status.textContent = 'Your enquiry has not been sent yet. Send the draft in your email app. If no app opens, copy your enquiry and email hello@withszara.com.';
      location.href = 'mailto:hello@withszara.com?subject=' +
        encodeURIComponent('New SZARA website enquiry') + '&body=' + encodeURIComponent(body());
    }, true);
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(body());
        status.textContent = 'Copied. Paste into an email to hello@withszara.com and send it. Nothing has been sent yet.';
      } catch {
        status.textContent = 'Copy is unavailable in this browser. Select your message above and email it to hello@withszara.com.';
      }
    });
  }
})();
