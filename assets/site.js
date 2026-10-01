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


(() => {
  const form = document.querySelector('form.brief');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const fallback = form.querySelector('.form-fallback');
  const copy = document.createElement('button');
  copy.type='button'; copy.className='button light'; copy.textContent='Copy enquiry'; copy.style.marginTop='12px';
  fallback.before(copy);
  copy.addEventListener('click',async()=>{
    const data=new FormData(form);
    const text='Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message');
    try {await navigator.clipboard.writeText(text);status.textContent='Copied. You can paste this into an email to hello@withszara.com. Nothing has been sent by copying.';}
    catch {status.textContent='Please select and copy your message, then email hello@withszara.com.';}
  });
  const failure=()=>{
    status.textContent='We could not confirm your submission. Your message is still here. Please try again or copy it and email hello@withszara.com.';
  };
  window.formspree=window.formspree || function(){(window.formspree.q=window.formspree.q||[]).push(arguments);};
  window.formspree('initForm',{
    formElement:'#szara-enquiry',formId:'xvkgydqn',
    onSubmit:()=>{status.textContent='Sending your enquiry…';},
    onSuccess:()=>{
      form.dispatchEvent(new Event('szara:enquiry-accepted'));
      location.assign('/thank-you/');
    },
    renderSuccess:()=>{},
    onError:failure,onFailure:failure
  });
})();
