/* SZARA digital card / Houston solar sky, no manual switch and no location API. */
(() => {
  const root = document.documentElement;
  const rad = Math.PI / 180;
  const lat = 29.7604 * rad;
  const lonWest = 95.3698 * rad;

  function altitude(date) {
    const d = date.getTime()/86400000 - 0.5 + 2440588 - 2451545;
    const obliquity = 23.4397 * rad;
    const meanAnomaly = (357.5291 + 0.98560028*d) * rad;
    const center = (1.9148*Math.sin(meanAnomaly) + .02*Math.sin(2*meanAnomaly) +
      .0003*Math.sin(3*meanAnomaly)) * rad;
    const longitude = meanAnomaly + center + 102.9372*rad + Math.PI;
    const declination = Math.asin(Math.sin(obliquity)*Math.sin(longitude));
    const rightAscension = Math.atan2(
      Math.sin(longitude)*Math.cos(obliquity), Math.cos(longitude));
    const sidereal = (280.16 + 360.9856235*d)*rad - lonWest;
    return Math.asin(Math.sin(lat)*Math.sin(declination) +
      Math.cos(lat)*Math.cos(declination)*Math.cos(sidereal-rightAscension))/rad;
  }
  const refresh = () => {
    root.dataset.cardSky = altitude(new Date()) > -.833 ? 'day' : 'night';
  };
  refresh();
  addEventListener('pageshow',refresh);
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden)refresh();
  });
  setInterval(refresh,60000);

  document.addEventListener('DOMContentLoaded',()=>{
    const button=document.querySelector('[data-card-share]');
    const status=document.querySelector('[data-card-share-status]');
    const fallback=document.querySelector('[data-card-share-fallback]');
    if(!button||!status||!fallback)return;
    const link='https://withszara.com/card/';
    button.addEventListener('click',async()=>{
      if(navigator.share){
        try{
          await navigator.share({title:'SZARA | Design & Technology',text:'Connect with SZARA',url:link});
          status.textContent='Card shared.';
          return;
        }catch(error){
          if(error?.name==='AbortError')return;
        }
      }
      if(navigator.clipboard?.writeText){
        try{
          await navigator.clipboard.writeText(link);
          status.textContent='Card link copied.';
          return;
        }catch(error){}
      }
      fallback.hidden=false;
      fallback.value=link;
      fallback.focus();
      fallback.select();
      status.textContent='Select and copy the card link.';
    });
  });
})();