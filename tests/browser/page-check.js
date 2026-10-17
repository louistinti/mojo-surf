// Vérification de la page dans le navigateur (playwright-cli run-code --filename=...).
// Renvoie la liste des problèmes trouvés ; une liste vide veut dire OK.
async page => {
  return await page.evaluate(() => {
    const issues = [];
    const need = sel => { if (!document.querySelector(sel)) issues.push(`manque ${sel}`); };
    ['header.nav', 'main', '#hero .hero-media', '#hero .hero-progress', '#mojo', '#cours', '#contact', '#avis .reviews-track',
     '#avis a.reviews-link', '#faq details', 'footer', '[data-price]', '[data-price-label]', '[data-price-other]'].forEach(need);
    const progress = document.querySelectorAll('#hero .hero-progress i').length;
    if (progress !== 4) issues.push(`hero-progress a ${progress} segments au lieu de 4`);
    const ctas = [...document.querySelectorAll('a.btn-cta')].map(a => a.textContent.trim());
    if (!ctas.length || ctas.some(t => t !== 'Contacter')) issues.push(`boutons d'action : ${JSON.stringify(ctas)}`);
    const text = document.body.innerText;
    if (/\b(nous|notre|nos)\b/i.test(text)) issues.push('« nous / notre / nos » présent');
    if (/[—–]/.test(text)) issues.push('tiret cadratin ou demi-cadratin présent');
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) issues.push(`débordement horizontal ${document.documentElement.scrollWidth}px`);
    const small = [...document.querySelectorAll('a, button, summary')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44 && getComputedStyle(e).visibility !== 'hidden'; })
      .map(e => `${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24)} ${Math.round(e.getBoundingClientRect().height)}px`);
    if (small.length) issues.push(`zones < 44px : ${small.join(' | ')}`);
    if (innerWidth < 600) {
      const off = [...document.querySelectorAll('.nav .brand, .nav .btn-cta, #hero, .key, #mojo h2, .about-photo, .price-block, .facts, .contact-row, .reviews-head, .faq-list, footer .wrap > *')]
        .filter(e => e.getBoundingClientRect().width > 0)
        .map(e => { const r = e.getBoundingClientRect(); return { e, l: Math.round(r.left), rr: Math.round(innerWidth - r.right) }; })
        .filter(o => (o.e.matches('.nav .brand') ? o.l !== 16 : o.e.matches('.nav .btn-cta') ? o.rr !== 16 : (o.l !== 16 || o.rr !== 16)))
        .map(o => `${o.e.className || o.e.tagName} ${o.l}/${o.rr}`);
      if (off.length) issues.push(`marges mobiles ≠ 16px : ${off.join(' | ')}`);
    }
    return JSON.stringify({ vw: innerWidth, issues });
  });
}
