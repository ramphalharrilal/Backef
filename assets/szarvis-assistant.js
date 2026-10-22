/* With Szara SZARVIS walking voice assistant — live v1.0
 * Vanilla JS, no dependencies. Crawls only publicly linked same-origin pages.
 * Client-side public-page text matching. No API keys or third-party tracking.
 */
(() => {
  'use strict';
  if (window.__withSzaraWalkerInstalled) return;
  window.__withSzaraWalkerInstalled = true;

  const cfg = Object.assign({
    name: 'SZARVIS',
    autoExplore: true,
    maxPages: 7,
    aiEndpoint: '', // optional server-side endpoint (do not place API keys here)
    contactEmail: 'hello@withszara.com',
    accent: '#c99da3',
    accent2: '#795961',
    voiceLocale: 'en-GB',
    speechRate: 0.92
  }, window.WithSzaraAssistantConfig || {});
  const stop = new Set('a an and are at be can could do does for from how i in is it me my of on or our the there this to we what when where which who why with would you your website websites site please tell about'.split(' '));
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allowedLink = url => {
    try {
      const u = new URL(url, location.href);
      return u.origin === location.origin && /https?:/.test(u.protocol) && !u.search && !u.hash &&
       !/\.(pdf|jpg|jpeg|png|webp|gif|svg|zip|docx?|xlsx?|css|js)$/i.test(u.pathname) &&
       !/(login|admin|checkout|cart|wp-admin|api|account|logout|privacy|terms)/i.test(u.pathname);
    } catch { return false; }
  };

  const style = document.createElement('style');
  style.textContent = `
    .wsz-root{--wsz-pink:${cfg.accent};--wsz-blue:${cfg.accent2};--wsz-ink:#1e1c27;--wsz-line:#d8d1da;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--wsz-ink);z-index:2147482000;position:relative}
    .wsz-root *{box-sizing:border-box}
    .wsz-spotlight{position:fixed;inset:0 auto auto 0;border:2px dashed var(--wsz-blue);background:rgba(76,145,255,.075);box-shadow:0 0 0 5px rgba(76,145,255,.06);pointer-events:none;z-index:2147481800;opacity:0;transition:opacity .22s,top .35s,left .35s,width .35s,height .35s;border-radius:3px}
    .wsz-spotlight.wsz-on{opacity:1;animation:wsz-pulse 1.1s ease infinite alternate}
    .wsz-character{--wsz-scale:1;position:fixed;top:calc(100vh - 165px);left:36px;width:72px;height:100px;z-index:2147481900;pointer-events:none;transform:scale(var(--wsz-scale));transform-origin:bottom center;will-change:left,top;filter:drop-shadow(0 5px 8px rgba(24,22,33,.23))}
    .wsz-character.wsz-flip{transform:scaleX(-1) scale(var(--wsz-scale))}
    .wsz-shadow{position:absolute;left:19px;bottom:0;width:36px;height:7px;background:#17223935;border-radius:100%;filter:blur(2px)}
    .wsz-head{position:absolute;left:22px;top:9px;width:32px;height:33px;background:#eef9ff;border:3px solid #202e42;border-radius:43% 43% 45% 45%;z-index:4}
    .wsz-ear{position:absolute;left:17px;top:21px;width:7px;height:11px;background:var(--wsz-pink);border:2px solid #26212e;border-radius:4px}
    .wsz-head:before,.wsz-head:after{content:"";position:absolute;top:13px;width:4px;height:6px;border-radius:5px;background:#67e6ff;box-shadow:0 0 6px #67e6ff}
    .wsz-head:before{left:8px}.wsz-head:after{right:8px}
    .wsz-hat{position:absolute;z-index:5;top:4px;left:29px;width:20px;height:9px;background:var(--wsz-pink);border:2px solid #26212e;border-radius:12px 12px 1px 1px;transform:rotate(-10deg)}
    .wsz-body{position:absolute;left:29px;top:43px;width:20px;height:27px;border:3px solid #26212e;background:var(--wsz-blue);border-radius:5px 5px 4px 4px;z-index:3}
    .wsz-body:after{content:'S';position:absolute;left:3px;top:1px;font-size:12px;font-weight:900;color:#fff}
    .wsz-arm,.wsz-leg{position:absolute;z-index:2;width:4px;background:#25212a;border-radius:4px;transform-origin:top center}
    .wsz-arm{height:28px;top:46px}.wsz-arm.l{left:30px;transform:rotate(35deg)}.wsz-arm.r{left:47px;transform:rotate(-38deg)}
    .wsz-leg{height:28px;top:67px}.wsz-leg.l{left:33px;transform:rotate(16deg)}.wsz-leg.r{left:46px;transform:rotate(-18deg)}
    .wsz-foot{position:absolute;bottom:-2px;left:-6px;width:13px;height:5px;background:#25212a;border-radius:8px}
    .wsz-character.wsz-walking .wsz-leg.l{animation:wsz-leg-l .30s ease-in-out infinite alternate}.wsz-character.wsz-walking .wsz-leg.r{animation:wsz-leg-r .30s ease-in-out infinite alternate}
    .wsz-character.wsz-walking .wsz-arm.l{animation:wsz-arm-l .30s ease-in-out infinite alternate}.wsz-character.wsz-walking .wsz-arm.r{animation:wsz-arm-r .30s ease-in-out infinite alternate}
    .wsz-character.wsz-scanning .wsz-head{animation:wsz-nod .7s ease-in-out infinite alternate}
    .wsz-lens{position:absolute;top:50px;left:53px;width:15px;height:15px;border:3px solid var(--wsz-pink);border-radius:50%;z-index:6;background:#ffffffb5}
    .wsz-lens:after{content:"";width:12px;height:3px;background:#27212f;position:absolute;top:12px;left:10px;transform:rotate(48deg);border-radius:2px}
    .wsz-char-bubble{position:absolute;bottom:101px;left:6px;min-width:138px;max-width:218px;background:#fff;border:1px solid #e1dce2;padding:9px 12px;font-size:11px;font-weight:700;line-height:1.4;box-shadow:3px 4px 0 #29222a22;border-radius:3px;white-space:normal;pointer-events:none}
    .wsz-char-bubble:after{content:"";position:absolute;bottom:-7px;left:24px;width:10px;height:10px;background:#fff;border-right:1px solid #e1dce2;border-bottom:1px solid #e1dce2;transform:rotate(45deg)}
    .wsz-floating{position:fixed;bottom:25px;right:24px;z-index:2147482000;display:flex;align-items:center;gap:9px;border:1px solid #26212e;background:#211f20;color:#fff;padding:12px 15px;cursor:pointer;box-shadow:3px 3px 0 var(--wsz-pink);border-radius:2px;font:700 13px/1.2 inherit;transition:transform .15s}
    .wsz-floating:hover{transform:translateY(-2px)}.wsz-dot{width:8px;height:8px;border-radius:50%;background:#81e2b1;box-shadow:0 0 0 3px #81e2b122;display:inline-block}
    .wsz-panel{position:fixed;bottom:82px;right:24px;z-index:2147482001;width:min(372px,calc(100vw - 28px));height:min(545px,calc(100dvh - 112px));display:flex;flex-direction:column;background:#fff;border:1px solid #29222f;box-shadow:9px 10px 0 #26212e22;border-radius:3px;overflow:hidden;font-size:13px}
    .wsz-panel[hidden]{display:none}.wsz-panel-head{display:flex;align-items:center;gap:11px;background:#211f20;color:#fff;padding:13px 13px 12px}
    .wsz-panel-icon{height:34px;width:34px;display:grid;place-items:center;border:1px solid #fff6;background:var(--wsz-pink);border-radius:2px;font-size:19px}
    .wsz-panel-title{font-size:14px;font-weight:850;margin-bottom:4px}.wsz-panel-sub{font-size:10px;color:#e4d9e3;letter-spacing:.04em}
    .wsz-close{margin-left:auto;font-size:22px;background:transparent;border:0;color:#fff;cursor:pointer;padding:1px 5px}
    .wsz-activity{font:600 10px/1.4 ui-monospace,SFMono-Regular,monospace;padding:8px 13px;background:#f8f2fa;border-bottom:1px solid #eae1ed;color:#5c4260;display:flex;align-items:center;gap:8px}
    .wsz-transcript{padding:15px 13px;flex:1;overflow:auto;background:#fdfbfc;display:flex;flex-direction:column;gap:11px}
    .wsz-msg{padding:10px 12px;max-width:92%;line-height:1.55;white-space:pre-wrap;border:1px solid #e5dfe6;border-radius:3px;align-self:flex-start;background:#fff}
    .wsz-msg.wsz-user{align-self:flex-end;background:#eaf1ff;border-color:#c8d8f5}
    .wsz-suggestions{padding:6px 13px 11px;display:flex;flex-wrap:wrap;gap:6px;background:#fdfbfc}
    .wsz-chip{background:#fff;border:1px solid #d4cbd7;color:#3e3646;padding:7px 9px;font:600 11px/1.1 inherit;border-radius:2px;cursor:pointer}
    .wsz-chip:hover{border-color:var(--wsz-pink);background:#fff6f9}
    .wsz-compose{display:flex;gap:6px;padding:10px;background:#fff;border-top:1px solid #eee8ee}
    .wsz-input{flex:1;min-width:0;border:1px solid #d7d0d9;padding:11px 10px;font:12px/1.3 inherit;background:#fff;color:#1e1c27;border-radius:2px}
    .wsz-send{padding:0 13px;border:0;background:var(--wsz-pink);font:800 12px/1 inherit;color:#231b28;border-radius:2px;cursor:pointer}
    .wsz-note{font-size:9px;color:#796f7e;padding:0 13px 9px;background:#fff}
    .wsz-link{margin-top:8px;display:inline-block;font-size:11px;color:#2365bc;font-weight:800;text-decoration:underline;text-underline-offset:2px}
    .wsz-controls{margin-left:auto;display:flex;align-items:center;gap:6px}
    .wsz-control{border:1px solid #ffffff70;border-radius:3px;background:transparent;color:#f1faff;padding:6px 8px;cursor:pointer;font-size:11px;font-weight:700;min-width:35px}
    .wsz-control[aria-pressed="true"]{background:#154356;color:#a4faff;border-color:#68e7ed}
    .wsz-control:disabled{opacity:.4;cursor:not-allowed}
    .wsz-close{margin-left:3px}
    .wsz-character.wsz-scanning:after{content:"";position:absolute;width:86px;height:2px;left:51px;top:55px;z-index:1;background:linear-gradient(90deg,#68e8f5,#68e8f500);box-shadow:0 0 10px #6be9ec;transform:rotate(-7deg);animation:wsz-scanray .35s ease infinite alternate;pointer-events:none}
    @keyframes wsz-scanray{from{transform:rotate(-22deg)}to{transform:rotate(23deg)}}
    .wsz-root button:focus-visible,.wsz-root input:focus-visible{outline:3px solid var(--wsz-blue);outline-offset:2px}
    @keyframes wsz-leg-l{from{transform:rotate(35deg)}to{transform:rotate(-38deg)}}@keyframes wsz-leg-r{from{transform:rotate(-33deg)}to{transform:rotate(36deg)}}
    @keyframes wsz-arm-l{from{transform:rotate(-35deg)}to{transform:rotate(38deg)}}@keyframes wsz-arm-r{from{transform:rotate(35deg)}to{transform:rotate(-39deg)}}
    @keyframes wsz-nod{from{transform:rotate(-6deg)}to{transform:rotate(9deg)}}@keyframes wsz-pulse{from{box-shadow:0 0 0 2px #4c91ff12}to{box-shadow:0 0 0 10px #4c91ff12}}
    @media(max-width:640px){.wsz-character{--wsz-scale:.82}.wsz-char-bubble{max-width:152px;font-size:10px}.wsz-floating{bottom:18px;right:15px}.wsz-panel{right:14px;bottom:75px;width:calc(100vw - 28px);height:min(510px,calc(100dvh - 98px))}}
    @media(prefers-reduced-motion:reduce){.wsz-character *,.wsz-spotlight{animation:none!important;transition:none!important}}
  `;
  style.textContent += "\n@media(max-width:640px){.wsz-root .wsz-floating{max-width:calc(100vw - 30px)}.wsz-root .wsz-panel{height:min(495px,calc(100dvh - 105px))}.wsz-root .wsz-msg{max-width:95%}.wsz-root .wsz-char-bubble{max-width:138px}}";
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.className = 'wsz-root';
  root.setAttribute('aria-label','With Szara walking website assistant');
  root.innerHTML = `
    <div class="wsz-spotlight" aria-hidden="true"></div>
    <div class="wsz-character" aria-hidden="true">
      <div class="wsz-char-bubble">SYSTEM ONLINE · SCANNING…</div>
      <div class="wsz-shadow"></div><div class="wsz-ear"></div><div class="wsz-hat"></div><div class="wsz-head"></div><div class="wsz-body"></div>
      <div class="wsz-arm l"></div><div class="wsz-arm r"></div><div class="wsz-leg l"><i class="wsz-foot"></i></div><div class="wsz-leg r"><i class="wsz-foot"></i></div><div class="wsz-lens"></div>
    </div>
    <button class="wsz-floating" type="button" aria-expanded="false" aria-label="Open walking assistant"><span class="wsz-dot"></span> Ask SZARVIS <span aria-hidden="true">↗</span></button>
    <section class="wsz-panel" role="dialog" aria-label="SZARVIS website assistant" hidden>
      <header class="wsz-panel-head"><span class="wsz-panel-icon">✳</span><div><div class="wsz-panel-title">SZARVIS</div><div class="wsz-panel-sub">VISUAL SITE EXPLORER · VOICE READY</div></div><div class="wsz-controls"><button class="wsz-control wsz-voice" type="button" aria-label="Enable spoken replies" title="Turn voice on" aria-pressed="false">🔇</button><button class="wsz-control wsz-mic" type="button" aria-label="Ask by voice" title="Ask by voice">🎙</button><button class="wsz-close" type="button" aria-label="Close assistant">×</button></div></header>
      <div class="wsz-activity"><span class="wsz-dot"></span><span class="wsz-status">Getting oriented…</span></div>
      <div class="wsz-transcript" aria-live="polite"></div>
      <div class="wsz-suggestions"><button type="button" class="wsz-chip" data-ask="What services do you offer?">Services</button><button type="button" class="wsz-chip" data-ask="Do you offer website maintenance?">Maintenance</button><button type="button" class="wsz-chip" data-ask="How do I start a project?">Start a project</button></div>
      <form class="wsz-compose"><input class="wsz-input" aria-label="Ask a question" placeholder="Ask me about With Szara…" maxlength="240" required><button class="wsz-send" type="submit">Ask →</button></form>
      <div class="wsz-note">Answers are based on public website information. For an exact quote, please contact the SZARA team.</div>
    </section>`;
  document.body.appendChild(root);
  const $ = s => root.querySelector(s);
  const walker = $('.wsz-character'), bubble = $('.wsz-char-bubble'), light = $('.wsz-spotlight');
  const panel = $('.wsz-panel'), launcher = $('.wsz-floating'), status = $('.wsz-status');
  const transcript = $('.wsz-transcript'), input = $('.wsz-input');
  const voiceButton = $('.wsz-voice'), micButton = $('.wsz-mic');
  let voiceEnabled = false;
  const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!speechSupported){ voiceButton.disabled = true; voiceButton.title='Speech playback unavailable in this browser'; }
  if(!Recognition){ micButton.disabled = true; micButton.title='Microphone speech recognition unavailable in this browser'; }
  function speakReply(t){
    if(!voiceEnabled || !speechSupported || document.visibilityState==='hidden')return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(t).replace(/https?:\/\/\S+/g,'').replace(/\s+/g,' ').slice(0,550));
    u.lang = cfg.voiceLocale; u.rate = cfg.speechRate; u.pitch = 0.89;
    const voices = window.speechSynthesis.getVoices();
    u.voice = voices.find(v=>v.lang==='en-GB' && /Daniel|George|Oliver|Arthur|British/i.test(v.name)) || voices.find(v=>v.lang==='en-GB') || voices.find(v=>v.lang.startsWith('en')) || null;
    window.speechSynthesis.speak(u);
  }
  voiceButton.addEventListener('click',()=>{
    voiceEnabled = !voiceEnabled;
    voiceButton.setAttribute('aria-pressed',String(voiceEnabled));
    voiceButton.textContent = voiceEnabled ? '🔊' : '🔇';
    voiceButton.title = voiceEnabled ? 'Mute spoken replies' : 'Enable spoken replies';
    voiceButton.setAttribute('aria-label',voiceButton.title);
    if(voiceEnabled) speakReply('Greetings. I am your With Szara website assistant. How may I help?');
    else if(speechSupported) window.speechSynthesis.cancel();
  });
  if(Recognition) micButton.addEventListener('click',()=>{
    const r = new Recognition(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
    micButton.disabled = true; setStatus('Listening for your question…');
    r.onresult = e=>{ const q=e.results?.[0]?.[0]?.transcript || ''; input.value=q; if(q.trim())answer(q); };
    r.onerror = ()=>setStatus('Voice input did not work. You can type your question.');
    r.onend = ()=>{micButton.disabled=false};
    try{r.start()}catch{micButton.disabled=false;setStatus('Voice input unavailable; use the keyboard.');}
  });
  let moving = false, active = null, hits = [], nodes = [], documents = [], inQuestion = false, loop = true;
  let at = { x: Math.min(30, innerWidth*.05), y: innerHeight - 165 };
  function setStatus(s){status.textContent=s;}
  function say(s){bubble.textContent=s;}
  function collectNodes(){
    const select = Array.from(document.querySelectorAll('[data-szara-spot], main h1, main h2, main h3, article h2'));
    const chosen=[];
    for(const el of select){
      if(el.closest('.wsz-root') || chosen.some(n=>n.contains(el)))continue;
      if(el.getClientRects().length===0)continue;
      if(el.textContent.trim().length < 4)continue;
      chosen.push(el);if(chosen.length>=16)break;
    }
    nodes=chosen;
  }
  function posOf(el){
    const r=el.getBoundingClientRect();
    return {x: clamp(r.left+Math.min(r.width/2,120)-33,12,innerWidth-85),y:clamp(r.top+Math.min(r.height,140)/2+5,112,innerHeight-126)};
  }
  function visible(el){const r=el.getBoundingClientRect();return r.height>0&&r.bottom>110&&r.top<innerHeight-140&&r.right>0&&r.left<innerWidth;}
  function glow(el){
    if(!el)return;
    let r=el.getBoundingClientRect();if(r.width===0||r.height===0)return;
    light.style.cssText=`left:${Math.max(r.left-7,0)}px;top:${Math.max(r.top-6,0)}px;width:${Math.min(r.width+14,innerWidth)}px;height:${Math.min(r.height+12,innerHeight)}px;`;
    light.classList.add('wsz-on');
  }
  async function walkTo(el, word, scroll=false){
    if(!el||moving)return;
    if(scroll&&!visible(el))el.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'center'});
    if(scroll)await sleep(reduceMotion?25:650);
    moving=true;active=el;
    const dest=posOf(el);
    walker.classList.toggle('wsz-flip',dest.x<at.x);
    walker.classList.add('wsz-walking');walker.classList.remove('wsz-scanning');light.classList.remove('wsz-on');
    say(word||'On my way…');setStatus('Walking to a page section…');
    const d=Math.hypot(dest.x-at.x,dest.y-at.y); const ms=reduceMotion?0:clamp(d*4.3,450,2700);
    walker.style.transition=`left ${ms}ms linear, top ${ms}ms linear`;
    walker.style.left=dest.x+'px';walker.style.top=dest.y+'px';
    at=dest;await sleep(ms+60);
    walker.classList.remove('wsz-walking','wsz-flip');walker.classList.add('wsz-scanning');
    glow(el);say('Scanning: '+(el.getAttribute('data-szara-spot')||el.innerText||'this section').trim().slice(0,58));
    setStatus('Reading this section…');await sleep(reduceMotion?110:1500);
    walker.classList.remove('wsz-scanning');light.classList.remove('wsz-on');
    say('Ask me what I found!');moving=false;
  }
  function extract(doc,url){
    const main=doc.querySelector('main')||doc.body;
    if(!main)return null;
    const copy=main.cloneNode(true);
    copy.querySelectorAll('script,style,svg,nav,footer,form,iframe,dialog,button,.wsz-root,[aria-hidden="true"]').forEach(n=>n.remove());
    const text=(copy.innerText||copy.textContent||'').replace(/\s+/g,' ').trim().slice(0,17000);
    const title=(doc.querySelector('title')?.textContent||doc.querySelector('h1')?.textContent||url).trim();
    const segments=Array.from(copy.querySelectorAll('h1,h2,h3,p,li'))
      .map(n=>n.textContent.replace(/\s+/g,' ').trim()).filter(s=>s.length>24&&s.length<520).slice(0,90);
    return {url,title,text,segments};
  }
  async function crawl(){
    collectNodes();documents=[];
    const cur=extract(document,location.href);if(cur)documents.push(cur);
    setStatus('Indexed this page · discovering links…');
    const links=Array.from(document.querySelectorAll('a[href]'))
      .map(a=>({url:new URL(a.href,location.href).href,label:a.textContent.trim()}))
      .filter(a=>allowedLink(a.url)&&a.url!==location.href)
      .sort((a,b)=>Number(/services|about|work|portfolio|project|contact|hosting|maintenance|pricing/i.test(b.label+b.url))-Number(/services|about|work|portfolio|project|contact|hosting|maintenance|pricing/i.test(a.label+a.url)));
    const selected=[...new Set(links.map(x=>x.url))].slice(0,Math.max(0,cfg.maxPages-1));
    for(const url of selected){
      try{
        const response=await fetch(url,{credentials:'same-origin',headers:{'Accept':'text/html'},signal:AbortSignal.timeout(4500)});
        if(!response.ok || !(response.headers.get('content-type')||'').includes('text/html'))continue;
        const html=await response.text();
        const doc=new DOMParser().parseFromString(html,'text/html');
        const item=extract(doc,url);
        if(item&&item.text.length>60)documents.push(item);
      }catch(e){ /* A blocked page is skipped, never retried in a loop. */ }
      setStatus(`Indexed ${documents.length} page${documents.length===1?'':'s'} · exploring…`);
      await sleep(220);
    }
    setStatus(`Ready · ${documents.length} page${documents.length===1?'':'s'} indexed`);
  }
  function appendMessage(text,user=false,source=''){
    const item=document.createElement('div');item.className='wsz-msg'+(user?' wsz-user':'');item.textContent=text;
    if(source && allowedLink(source)){
      const a=document.createElement('a');a.href=source;a.className='wsz-link';a.textContent='View this page ↗';item.append(a);
    }
    transcript.append(item);transcript.scrollTop=transcript.scrollHeight;
  }
  function respondLocally(question){
    const tokens=(question.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2&&!stop.has(w));
    if(/(hello|hi|hey)\b/i.test(question)&&tokens.length<2) return {answer:'Hello! I’m SZARVIS. I can explore this website and show you where to find information about our work. What would you like to know?',source:''};
    if(/\b(price|prices|pricing|cost|monthly|package|subscription)\b|how much/i.test(question)){
      return {answer:'Our published five-page Small Business Websites package is US$999 setup plus US$149 per month for SZARA Care, with an initial 12-month agreement. See the Website Pricing page for inclusions and terms. Other projects are quoted according to scope.',source:new URL('/small-business-websites/',location.origin).href};
    }
    if(/contact|email|reach|book|start a project|consultation|quote/i.test(question)){
      const c=documents.find(d=>/contact|get in touch|project|quote/i.test(d.title+' '+d.text));
      return {answer: cfg.contactEmail ? `To get started, use the Start a project enquiry form on the website, or email ${cfg.contactEmail} with details of your project. We'll initially respond within two business days.` : 'The best next step is to use the Contact section on With Szara’s website to describe your project. I can highlight where to get started.',source:c?.url||''};
    }
    const scored=[];
    for(const doc of documents){
      for(const raw of doc.segments){
        const lo=raw.toLowerCase();
        const weight=tokens.reduce((s,t)=>s+(lo.includes(t)?(lo.match(new RegExp(t,'g'))||[]).length:0),0);
        if(weight>0)scored.push({weight:weight+Math.min(tokens.filter(t=>lo.includes(t)).length,3),text:raw,doc});
      }
    }
    scored.sort((a,b)=>b.weight-a.weight);
    if(scored.length){
      const best=scored[0];
      let excerpt=best.text.replace(/\s+/g,' ').slice(0,300);
      return {answer:`Here's what I found on the website:\n\n“${excerpt}${best.text.length>300?'…':''}”\n\nYou can open the source page for more detail.`,source:best.doc.url,text:best.text};
    }
    return {answer: cfg.contactEmail ? `I haven't found a reliable answer to that on the pages I've scanned. You can email ${cfg.contactEmail} for help.` : 'I haven’t found a reliable answer on the pages I scanned, so I won’t guess. Please use the website’s Contact section to ask With Szara directly.',source:''};
  }
  function findWalkTarget(question){
    const words=(question.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>3&&!stop.has(w));
    let best=null,score=0;
    for(const n of nodes){
      const t=n.textContent.toLowerCase().slice(0,1100);
      let s=words.reduce((a,w)=>a+(t.includes(w)?1:0),0);
      if(/contact|quote|start|project/.test(question.toLowerCase())&&/contact|start|project/.test(t))s+=2;
      if(s>score){score=s;best=n;}
    }
    return best;
  }
  async function answer(question){
    if(inQuestion||!question.trim())return;
    inQuestion=true;appendMessage(question.trim(),true);input.value='';setStatus('Looking through website content…');
    const target=findWalkTarget(question);
    if(target && !moving){ await walkTo(target,'Let me find that…',true); }
    let result;
    if(cfg.aiEndpoint){
      try{
        const response=await fetch(cfg.aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,site:location.origin,documents:documents.map(d=>({url:d.url,title:d.title,text:d.text.slice(0,6000)}))})});
        if(!response.ok)throw Error('Assistant unavailable');
        const data=await response.json();
        if(typeof data.answer!=='string')throw Error('Invalid assistant response');
        result={answer:data.answer,source:allowedLink(data.source||'')?data.source:''};
      }catch{result={answer:'The AI connection is unavailable right now. Here is the best match I can find locally:\n\n'+respondLocally(question).answer,source:''};}
    }else{result=respondLocally(question);}
    appendMessage(result.answer,false,result.source);
    speakReply(result.answer);
    setStatus(`Ready · ${documents.length} page${documents.length===1?'':'s'} indexed`);
    say('Found something for you!');inQuestion=false;
  }
  function toggle(open){
    panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));launcher.textContent=open?'Close assistant ✕':'●  Ask '+cfg.name+' ↗';
    if(open){input.focus();if(transcript.children.length===0)appendMessage(`Hi! I'm ${cfg.name}. I can walk through this website, scan its sections and help you find answers. What are you looking for?`);}
  }
  launcher.addEventListener('click',()=>toggle(panel.hidden));
  $('.wsz-close').addEventListener('click',()=>toggle(false));
  $('.wsz-panel-title').textContent=cfg.name;
  launcher.setAttribute('aria-label','Open '+cfg.name+' assistant');
  $('.wsz-compose').addEventListener('submit',e=>{e.preventDefault();answer(input.value)});
  root.querySelectorAll('[data-ask]').forEach(el=>el.addEventListener('click',()=>answer(el.dataset.ask)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){toggle(false);if(speechSupported)window.speechSynthesis.cancel()}});
  window.addEventListener('resize',()=>{at={x:clamp(at.x,12,innerWidth-85),y:clamp(at.y,110,innerHeight-126)};walker.style.left=at.x+'px';walker.style.top=at.y+'px';if(active)glow(active)});
  async function explore(){
    await sleep(1100);
    while(loop){
      if(!inQuestion && !moving && document.visibilityState!=='hidden'){
        const opts=nodes.filter(visible);
        if(opts.length){const target=opts[Math.floor(Math.random()*opts.length)];await walkTo(target,'Exploring your website…');}
      }
      await sleep(reduceMotion?5000:3900);
    }
  }
  crawl().then(()=>{if(cfg.autoExplore)explore()});
  window.WithSzaraWalker={open:()=>toggle(true),ask:answer,refresh:crawl,stop:()=>{loop=false;}};
})();
