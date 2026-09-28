/* Basic consent: no Google request is made until Analytics is accepted. */
(() => {
  const id = 'G-NVRCRP0TVX';
  const key = 'szara-analytics-choice-v1';
  const pendingKey = 'szara-enquiry-return-v1';
  const age = 180 * 86400000;
  let accepted = false, loaded = false;
  function read() {
    try { const v = JSON.parse(localStorage.getItem(key)); return v && Date.now()-v.time < age && ['accepted','rejected'].includes(v.choice) ? v.choice : null; } catch { return null; }
  }
  function clearCookies() {
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ['', location.hostname, '.'+location.hostname]) {
        document.cookie = name+'=; Max-Age=0; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'');
      }
    }
  }
  function start() {
    if (loaded || !accepted) return;
    loaded = true;
    window['ga-disable-'+id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    // Strip query strings, fragments and external referrer paths; never send form values.
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin+'/' : ''; } catch {}
    gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      page_location:location.origin+location.pathname,page_referrer:referrer,cookie_expires:15552000,cookie_update:false});
    gtag('event','page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:referrer});
    // A return after a valid form submission is a completion signal, not proof of email delivery.
    if (location.pathname==='/thank-you/') {
      try {
        const pending=JSON.parse(sessionStorage.getItem(pendingKey));sessionStorage.removeItem(pendingKey);
        if(pending && Date.now()-pending.time<1800000 && ['/', '/small-business-websites/'].includes(pending.page)) {
          gtag('event','enquiry_returned',{form_page:pending.page});
        }
      } catch {}
    }
    const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.append(tag);
  }
  const panel=document.createElement('section');panel.className='analytics-choice';panel.setAttribute('aria-label','Analytics preference');
  panel.innerHTML='<h2>Help us improve this website?</h2><p>With your permission, Google Analytics measures visits and completed enquiry journeys. Advertising features are off. You can change your choice anytime. <a href="/privacy/">Privacy details</a></p><div><button type="button" data-choice="accepted">Accept analytics</button><button type="button" data-choice="rejected">Reject analytics</button></div>';
  const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';preferences.textContent='Privacy choices';
  document.body.append(panel,preferences);
  function choose(choice) {
    const wasLoaded=loaded; accepted=choice==='accepted';
    try {localStorage.setItem(key,JSON.stringify({choice,time:Date.now()}));} catch {}
    panel.hidden=true;preferences.focus();
    if(accepted) start();
    else {
      window['ga-disable-'+id]=true;clearCookies();
      try {sessionStorage.removeItem(pendingKey);} catch {}
      // Reload removes already loaded analytics code; no denial ping is sent.
      if(wasLoaded) location.reload();
    }
  }
  panel.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.choice)));
  preferences.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();});
  for(const form of document.querySelectorAll('form.brief')) form.addEventListener('submit',()=>{
    if(accepted && form.checkValidity())try{sessionStorage.setItem(pendingKey,JSON.stringify({time:Date.now(),page:location.pathname}));}catch{}
  });
  window.addEventListener('storage',e=>{if(e.key===key)location.reload();});
  const choice=read();panel.hidden=!!choice;accepted=choice==='accepted';
  if(accepted)start();else {window['ga-disable-'+id]=true;clearCookies();}
})();
