// À lancer avec playwright-cli set-color-scheme dark. Renvoie les problèmes trouvés.
async page => {
  return await page.evaluate(() => {
    const parse = c => (c.match(/[\d.]+/g) || []).map(Number);
    const lum = c => { const [r, g, b] = parse(c).slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
    const opaqueBg = el => { for (; el; el = el.parentElement) { const b = getComputedStyle(el).backgroundColor; const a = parse(b)[3]; if (b && (a === undefined || a >= .9)) return b; } return getComputedStyle(document.body).backgroundColor; };
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
    const issues = [];
    if (lum(getComputedStyle(document.body).backgroundColor) > .1) issues.push('fond de page pas sombre');
    document.querySelectorAll('main *, footer *, header *').forEach(el => {
      if (el.closest('.hero') || !el.getClientRects().length) return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const cs = getComputedStyle(el); const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 600;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      const r = ratio(cs.color, opaqueBg(el));
      if (r < need) issues.push(`${el.textContent.trim().slice(0, 30)} ${r.toFixed(2)}<${need}`);
    });
    const brand = document.querySelector('.nav .brand');
    if (lum(getComputedStyle(brand).backgroundColor === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.body).backgroundColor : getComputedStyle(brand).backgroundColor) < .6) issues.push('logo du bandeau sans pastille claire');
    return JSON.stringify({ issues: issues.slice(0, 15), total: issues.length });
  });
}
