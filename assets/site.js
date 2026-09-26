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
