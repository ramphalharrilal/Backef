/* SZARA / Houston sky.
   Uses actual solar position over downtown Houston (29.7604 N, 95.3698 W).
   Day/night follows sunrise/sunset in Houston, regardless of visitor timezone.
   The user's device clock provides the current UTC instant.
   No API calls, location permission, cookies, analytics or storage. */
(() => {
  const root = document.body;
  const hero = document.querySelector('[data-houston-scene="hero"]');

  if (!root || !hero) return;

  const rad = Math.PI / 180;
  const HOUSTON_LAT = 29.7604;
  const HOUSTON_LON = -95.3698;

  // Standard approximate solar coordinates (J2000 solar ecliptic formula).
  function sunAltitudeDegrees(date) {
    const d = date.getTime() / 86400000 - 0.5 + 2440588 - 2451545;
    const obliquity = rad * 23.4397;
    const meanAnomaly = rad * (357.5291 + 0.98560028 * d);
    const center = rad * (
      1.9148 * Math.sin(meanAnomaly) +
      .02 * Math.sin(2 * meanAnomaly) +
      .0003 * Math.sin(3 * meanAnomaly)
    );
    const eclipticLongitude = meanAnomaly + center + rad * 102.9372 + Math.PI;
    const declination = Math.asin(
      Math.sin(obliquity) * Math.sin(eclipticLongitude)
    );
    const rightAscension = Math.atan2(
      Math.sin(eclipticLongitude) * Math.cos(obliquity),
      Math.cos(eclipticLongitude)
    );
    const latitude = HOUSTON_LAT * rad;
    const westLongitude = -HOUSTON_LON * rad;
    const siderealTime = rad * (280.16 + 360.9856235 * d) - westLongitude;
    const hourAngle = siderealTime - rightAscension;
    return Math.asin(
      Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle)
    ) / rad;
  }

  function currentHoustonScene(date = new Date()) {
    // At -0.833° the apparent sun reaches the horizon with refraction.
    return sunAltitudeDegrees(date) > -0.833 ? 'day' : 'night';
  }

  function applyLighting() {
    // Always follow the sun's position over Houston; no manual override.
    root.dataset.houstonTime = currentHoustonScene();
  }

  addEventListener('pageshow', applyLighting);
  setInterval(applyLighting, 60000);
  applyLighting();
})();
