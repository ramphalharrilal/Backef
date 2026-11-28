// Check both Houston scenes, bandwidth isolation, menu use and no-JS fallback.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true});
  for(const [scene,instant] of [['day','2026-11-28T18:00:00Z'],['night','2026-11-28T06:00:00Z']]){
    const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
    await page.clock.install({time:new Date(instant)});
    const images=[];
    page.on('request',r=>{if(/houston-(day|night)-\d+\.webp/.test(r.url())) images.push(r.url());});
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
    assert.equal(await page.locator('body').getAttribute('data-houston-time'),scene);
    assert(images.length===1 && images[0].includes('houston-'+scene+'-960.webp'),JSON.stringify(images));
    assert(await page.locator('.sz-panorama .sz-photo-'+scene).evaluate(img=>img.complete&&img.naturalWidth>0));
    await page.locator('.mobile-menu summary').click();
    assert(await page.locator('.mobile-menu-links').isVisible());
    await page.screenshot({path:'search-review/lighting-'+scene+'.png'});
    await page.close();
  }
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  assert(await page.locator('.sz-panorama noscript img').evaluate(img=>img.complete&&img.naturalWidth>0));
  await browser.close();
  console.log('Day/night: one skyline request each; mobile menu and no-JS fallback passed.');
})().catch(e=>{console.error(e);process.exit(1)});
