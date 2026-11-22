/* Houston constellation diagram: north-up, zenith-centred sky projection.
   Uses device UTC time and fixed downtown Houston coordinates, with no
   network requests, geolocation, cookies, camera, or astronomy API.
   Star-line coordinates are J2000 equatorial positions. Source:
   Olaf Frohn, d3-celestial/data/constellations.lines.json (BSD 3-Clause)
   https://github.com/ofrohn/d3-celestial
   Copyright (c) 2015, Olaf Frohn. All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that this copyright notice,
   these conditions and the following disclaimer are retained.
   Neither the copyright holder nor contributors may be used to endorse
   derivative products without prior written permission.
   THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   INCLUDING FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
   IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY ARISING FROM ITS USE.
   Sidereal and horizon-coordinate calculations follow US Naval Observatory:
   https://aa.usno.navy.mil/faq/GAST
   https://aa.usno.navy.mil/faq/alt_az
   The graphic is a star chart, NOT a photograph or a compass-aligned overlay. */
(() => {
  'use strict';
  const sky = document.querySelector('[data-houston-live-sky]');
  if (!sky) return;
  const chart = sky.querySelector('svg');
  const caption = sky.querySelector('[data-houston-sky-clock]');
  const live = sky.querySelector('[data-houston-sky-names]');
  const svgNS = 'http://www.w3.org/2000/svg';
  const lat = 29.7604 * Math.PI / 180;
  const lon = -95.3698;
  const radius = 89;
  const data = [{"name":"Andromeda","lines":[[[30.9748,42.3297],[17.433,35.6206],[9.832,30.861],[2.0969,29.0904]],[[14.3017,23.4176],[11.8347,24.2672],[9.6389,29.3118],[9.832,30.861],[9.2202,33.7193],[354.5342,43.2681],[345.4803,42.326]],[[354.5342,43.2681],[355.1021,44.3339],[354.391,46.4582]],[[17.433,35.6206],[14.1884,38.4993],[12.4535,41.0789],[17.3755,47.2418],[24.4982,48.6282]],[[355.1021,44.3339],[356.5085,46.4203]]]},{"name":"Aquila","lines":[[[296.5649,10.6133],[297.6958,8.8683],[298.8283,6.4068],[302.8262,-0.8215],[298.1182,1.0057],[291.3746,3.1148],[286.3525,13.8635],[297.6958,8.8683],[291.3746,3.1148],[286.5622,-4.8826]]]},{"name":"Aries","lines":[[[42.496,27.2605],[31.7934,23.4624],[28.66,20.808],[28.3826,19.2939]]]},{"name":"Auriga","lines":[[[89.8822,44.9474],[79.1723,45.998],[76.6287,41.2345],[74.2484,33.1661],[81.573,28.6075],[89.9303,37.2126],[89.8822,44.9474],[89.8818,54.2847],[79.1723,45.998],[75.4922,43.8233],[75.6195,41.0758]]]},{"name":"Boötes","lines":[[[206.8156,17.4569],[208.6712,18.3977],[213.9153,19.1824],[217.9575,30.3714],[218.0195,38.3083],[225.4865,40.3906],[228.8757,33.3148],[221.2467,27.0742],[213.9153,19.1824],[220.2873,13.7283]],[[218.0195,38.3083],[214.0959,46.0883],[213.3659,51.7879],[216.2992,51.8507],[214.0959,46.0883]]]},{"name":"Cassiopeia","lines":[[[28.5989,63.6701],[21.454,60.2353],[14.1772,60.7167],[10.1268,56.5373],[2.2945,59.1498]]]},{"name":"Cygnus","lines":[[[318.2341,30.2269],[311.5528,33.9703],[305.5571,40.2567],[296.2437,45.1308],[292.4265,51.7298],[289.2757,53.3685]],[[310.358,45.2803],[305.5571,40.2567],[299.0765,35.0834],[292.6803,27.9597]]]},{"name":"Gemini","lines":[[[93.7194,22.5068],[95.7401,22.5136],[100.983,25.1311],[107.7849,30.2452],[113.6494,31.8883],[116.329,28.0262],[113.9806,26.8957],[110.0307,21.9823],[106.0272,20.5703],[99.4279,16.3993],[101.3224,12.8956]],[[110.0307,21.9823],[109.5232,16.5404]]]},{"name":"Hercules","lines":[[[245.4801,19.1531],[247.555,21.4896],[250.3215,31.6027],[250.724,38.9223],[248.5258,42.437],[244.9352,46.3134],[242.1924,44.9349],[238.1689,42.4515]],[[250.3215,31.6027],[255.0724,30.9264]],[[250.724,38.9223],[258.7618,36.8092]],[[269.0633,37.2505],[260.9206,37.1459],[258.7618,36.8092],[255.0724,30.9264],[258.758,24.8392],[266.6147,27.7207],[269.4412,29.2479],[271.8856,28.7625]],[[258.6619,14.3903],[247.555,21.4896]]]},{"name":"Leo","lines":[[[152.093,11.9672],[151.8331,16.7627],[154.9931,19.8415],[168.5271,20.5237],[177.2649,14.5721],[168.56,15.4296],[152.093,11.9672]],[[154.9931,19.8415],[154.1726,23.4173],[148.1909,26.007],[146.4628,23.7743]]]},{"name":"Lyra","lines":[[[281.1932,37.6051],[281.0949,39.6127],[279.2347,38.7837],[281.1932,37.6051],[283.6262,36.8986],[284.7359,32.6896],[282.52,33.3627],[281.1932,37.6051]]]},{"name":"Orion","lines":[[[91.893,14.7685],[88.5958,20.2762],[90.9799,20.1385],[92.985,14.2088],[90.5958,9.6473],[88.7929,7.4071],[81.2828,6.3497],[73.7239,10.1508]],[[74.6371,1.714],[73.5629,2.4407],[72.8015,5.6051],[72.46,6.9613],[72.653,8.9002],[73.7239,10.1508],[74.0928,13.5145],[76.1423,15.4041],[77.4248,15.5972]],[[78.6345,-8.2016],[81.1192,-2.3971],[83.0017,-0.2991],[81.2828,6.3497],[83.7845,9.9342],[88.7929,7.4071],[85.1897,-1.9426],[86.9391,-9.6696]],[[85.1897,-1.9426],[84.0534,-1.2019],[83.0017,-0.2991]]]},{"name":"Pegasus","lines":[[[332.4969,33.1782],[340.7506,30.2212],[345.9436,28.0828],[2.0969,29.0904],[3.309,15.1836],[346.1902,15.2053],[341.6733,12.1729],[340.3655,10.8314],[332.5499,6.1979],[326.0465,9.875]],[[346.1902,15.2053],[345.9436,28.0828],[342.5008,24.6016],[341.6328,23.5657],[331.7528,25.3451],[326.1614,25.645]]]},{"name":"Perseus","lines":[[[56.0797,32.2882],[58.533,31.8836],[59.7413,35.791],[59.4635,40.0102],[56.2985,42.5785],[55.7313,47.7876],[54.1224,48.1926],[51.0807,49.8612],[46.1991,53.5064],[42.6742,55.8955],[43.5644,52.7625],[47.2667,49.6133],[47.374,44.8575],[47.0422,40.9556],[47.8224,39.6116],[46.2941,38.8403],[44.6903,39.6627],[44.9162,41.0329],[47.0422,40.9556]],[[61.646,50.3513],[63.7244,48.4093],[62.1654,47.7125],[55.7313,47.7876]],[[47.2667,49.6133],[41.0499,49.2284],[25.9152,50.6887]]]},{"name":"Sagittarius","lines":[[[274.4068,-36.7617],[276.043,-34.3846],[275.2485,-29.8281],[276.9927,-25.4217],[273.4409,-21.0588]],[[290.6596,-44.459],[290.9716,-40.6159],[285.653,-29.8801],[281.4141,-26.9908],[276.9927,-25.4217]],[[298.8154,-41.8683],[299.9341,-35.2763],[298.9598,-26.2995],[294.1768,-24.8836],[291.3187,-24.5086],[288.8851,-25.2567],[283.8164,-26.2967],[281.4141,-26.9908],[275.2485,-29.8281],[271.452,-30.4241],[276.043,-34.3846],[285.653,-29.8801],[286.735,-27.6704],[283.8164,-26.2967],[286.1708,-21.7415],[287.441,-21.0236],[289.4087,-18.9529],[290.4182,-17.8472],[290.4318,-15.955]],[[286.1708,-21.7415],[284.4325,-21.1067],[283.5424,-22.7448],[283.8164,-26.2967]]]},{"name":"Scorpius","lines":[[[239.713,-26.1141],[240.0834,-22.6217],[241.3593,-19.8055]],[[240.0834,-22.6217],[245.2972,-25.5928],[247.3519,-26.432],[248.9706,-28.216],[252.5409,-34.2932],[252.9676,-38.0474],[253.6459,-42.3613],[258.0383,-43.2392],[264.3297,-42.9978],[266.8962,-40.127],[265.622,-39.03],[263.4022,-37.1038]]]},{"name":"Taurus","lines":[[[84.4112,21.1425],[68.9802,16.5093],[67.1656,15.8709],[64.9483,15.6276],[65.7337,17.5425],[67.1542,19.1804],[81.573,28.6075]],[[64.9483,15.6276],[60.1701,12.4903],[51.7923,9.7327],[60.7891,5.9893]],[[51.7923,9.7327],[51.2033,9.0289],[54.2183,0.4017]]]},{"name":"Ursa Major","lines":[[[183.8565,57.0326],[165.932,61.751],[165.4603,56.3824],[178.4577,53.6948],[183.8565,57.0326],[193.5073,55.9598],[200.9814,54.9254],[206.8852,49.3133]],[[178.4577,53.6948],[176.5126,47.7794],[169.6197,33.0943],[169.5468,31.5308]],[[176.5126,47.7794],[167.4159,44.4985],[155.5823,41.4995]],[[167.4159,44.4985],[154.2741,42.9144]],[[165.932,61.751],[142.8821,63.0619],[127.5661,60.7182],[147.7473,59.0387],[165.4603,56.3824]],[[165.4603,56.3824],[148.0265,54.0643],[143.2143,51.6773],[134.8019,48.0418]],[[135.9064,47.1565],[143.2143,51.6773]]]},{"name":"Ursa Minor","lines":[[[236.0147,77.7945],[244.3762,75.7553],[230.1821,71.834],[222.6764,74.1555],[236.0147,77.7945],[251.4927,82.0373],[263.0542,86.5865],[37.9545,89.2641]]]},{"name":"Virgo","lines":[[[176.4648,6.5294],[177.6738,1.7647],[184.9765,-0.6668],[190.4152,-1.4494],[197.4875,-5.539],[201.2982,-11.1613],[214.0036,-6.0005],[220.7651,-5.6582]],[[195.5442,10.9592],[193.9009,3.3975],[190.4152,-1.4494]],[[197.4875,-5.539],[203.6733,-0.5958],[210.4116,1.5445],[221.5622,1.8929]]]}];
  const rad = Math.PI / 180;
  function el(tag, attrs, parent) {
    const node = document.createElementNS(svgNS, tag);
    for (const key in attrs) node.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function horizontal(ra, dec, sidereal) {
    const d = dec * rad;
    const hour = (((sidereal - ra + 540) % 360) - 180) * rad;
    const alt = Math.asin(
      Math.sin(lat) * Math.sin(d) +
      Math.cos(lat) * Math.cos(d) * Math.cos(hour)
    );
    const az = Math.atan2(
      -Math.sin(hour),
      Math.tan(d) * Math.cos(lat) - Math.sin(lat) * Math.cos(hour)
    );
    const distance = radius * (Math.PI/2 - alt) / (Math.PI/2);
    return {
      alt:alt / rad,
      x:110 - distance * Math.sin(az),
      y:110 - distance * Math.cos(az)
    };
  }
  function siderealDegrees(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const t = (jd - 2451545) / 36525;
    // Approximate Greenwich mean sidereal time in degrees, USNO standard.
    const gmst = 280.46061837 +
      360.98564736629 * (jd - 2451545) +
      0.000387933 * t * t - t * t * t / 38710000;
    return ((gmst + lon) % 360 + 360) % 360;
  }
  function render() {
    const now = new Date();
    const sidereal = siderealDegrees(now);
    const fragment = document.createDocumentFragment();
    el('circle',{cx:110,cy:110,r:radius+1,fill:'rgba(8,33,55,.20)',
      stroke:'rgba(200,232,244,.34)','stroke-width':.7},fragment);
    el('circle',{cx:110,cy:110,r:radius*.5,fill:'none',
      stroke:'rgba(200,232,244,.12)','stroke-width':.5,
      'stroke-dasharray':'2 6'},fragment);
    el('path',{d:'M110 21V199 M21 110H199',fill:'none',
      stroke:'rgba(200,232,244,.11)','stroke-width':.5},fragment);
    const scores = [];
    for (const constellation of data) {
      const points=[];
      let above=0, height=0, x=0, y=0;
      for (const line of constellation.lines) {
        let before=null;
        for (const pair of line) {
          const current=horizontal(pair[0],pair[1],sidereal);
          if (current.alt >= 3) {
            // Sky above the horizon only; do not imply below-horizon stars visible.
            el('circle',{cx:current.x.toFixed(2),cy:current.y.toFixed(2),
              r:1.35,fill:'#e8f8ff',opacity:.87},fragment);
            above++;height+=current.alt;x+=current.x;y+=current.y;
            points.push(current);
          }
          if (before && before.alt>=3 && current.alt>=3) {
            el('line',{x1:before.x.toFixed(2),y1:before.y.toFixed(2),
              x2:current.x.toFixed(2),y2:current.y.toFixed(2),
              stroke:'#b9e8f8','stroke-width':.8,opacity:.74},fragment);
          }
          before=current;
        }
      }
      if(above>=3 && height/above>=12) {
        scores.push({name:constellation.name,count:above,
          alt:height/above,x:x/above,y:y/above});
      }
    }
    scores.sort((a,b)=>b.alt-a.alt);
    const occupied=[];
    const displayed=[];
    for (const item of scores) {
      if (displayed.length>=3) break;
      const pX=Math.max(32,Math.min(188,item.x));
      const pY=Math.max(32,Math.min(186,item.y+10));
      if(occupied.some(p=>Math.hypot(p.x-pX,p.y-pY)<36))continue;
      const label=el('text',{x:pX.toFixed(1),y:pY.toFixed(1),
        'text-anchor':'middle','font-size':'8.4',
        'font-family':'Arial, sans-serif','font-weight':'700',
        'letter-spacing':'.25',fill:'#ecfbff',
        'paint-order':'stroke',stroke:'rgba(9,32,49,.9)',
        'stroke-width':'2.2'},fragment);
      label.textContent=item.name.toUpperCase();
      occupied.push({x:pX,y:pY});displayed.push(item.name);
    }
    for (const [name,x,y] of [
      ['N',110,13],['S',110,216],['E',12,112],['W',208,112]]) {
      const node=el('text',{x,y,'text-anchor':'middle','font-size':9,
        'font-weight':700,'font-family':'Arial, sans-serif',
        fill:'rgba(225,245,251,.76)'},fragment);
      node.textContent=name;
    }
    chart.replaceChildren(fragment);
    const houstonTime = new Intl.DateTimeFormat('en-US',{
      hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'
    }).format(now);
    caption.textContent=houstonTime+' Houston';
    live.textContent=displayed.length ? displayed.join(' · ') : 'Stars above the horizon';
    chart.setAttribute('aria-label',
      'Calculated Houston sky at '+houstonTime+
      ', north at top, east at left. Highlighted: '+live.textContent+
      '. Approximate celestial positions, not aligned with skyline photo.');
    sky.dataset.ready='true';
  }
  try { render(); } catch (err) { sky.dataset.ready='false'; return; }
  setInterval(render, 120000);
  addEventListener('pageshow',render);
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)render();
  });
})();
