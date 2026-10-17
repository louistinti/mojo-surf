// Avis longs simulés (localhost uniquement) : chargement différé et section qui tient dans l'écran.
async page => {
  await page.addInitScript(() => {
    const long = 'Cours génial avec Stéphane, très pédagogue et patient, il prend le temps avec chacun et choisit toujours le bon spot. On a pris plein de vagues et les enfants ont adoré, on reviendra sans hésiter l’été prochain pour progresser encore.';
    const r = n => ({ rating: 5, text: long + ' ' + long, relativePublishTimeDescription: `il y a ${n} mois`, authorAttribution: { displayName: `Client ${n}`, uri: 'https://maps.google.com', photoURI: '' } });
    window.__mockPlace = { rating: 4.8, userRatingCount: 31, googleMapsURI: 'https://maps.google.com/?cid=1', reviews: [1, 2, 3, 4, 5].map(r) };
  });
  await page.goto('http://localhost:5180/');
  await page.waitForTimeout(800);
  const atTop = await page.evaluate(() => document.getElementById('avis').classList.contains('is-empty'));
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById('avis').scrollIntoView(); });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.getElementById('avis').scrollIntoView());
  await page.waitForTimeout(300);
  return await page.evaluate(atTop => {
    const s = document.getElementById('avis'); const r = s.getBoundingClientRect();
    const navH = document.querySelector('.nav').getBoundingClientRect().height;
    const issues = [];
    if (!atTop) issues.push('avis chargés avant d’arriver à la section');
    if (s.classList.contains('is-empty')) issues.push('avis non affichés après défilement');
    if (r.bottom > innerHeight + 1 || r.top < navH - 1) issues.push(`section hors écran : ${Math.round(r.top)}-${Math.round(r.bottom)} pour ${innerHeight}`);
    return JSON.stringify({ vw: innerWidth, vh: innerHeight, issues });
  }, atTop);
}
