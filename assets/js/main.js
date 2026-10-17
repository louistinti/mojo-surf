import { CONFIG } from './config.js';
import { collectifPrice } from './pricing.js';
import { startHeroMontage } from './hero.js';

/* ---------- Prix du cours collectif ---------- */
const p = collectifPrice(new Date());
document.querySelectorAll('[data-price]').forEach(el => { el.textContent = p.price; });
document.querySelectorAll('[data-price-label]').forEach(el => { el.textContent = p.label; });
document.querySelectorAll('[data-price-other]').forEach(el => { el.textContent = p.otherLabel; });

/* ---------- Menu mobile ---------- */
const menu = document.getElementById('menu');
const openBtn = document.querySelector('.menu-open');
const closeBtn = menu.querySelector('.menu-close');

function setMenu(open) {
  menu.hidden = !open;
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  (open ? closeBtn : openBtn).focus();
}
openBtn.addEventListener('click', () => setMenu(true));
closeBtn.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
  if (menu.hidden) return;
  if (e.key === 'Escape') setMenu(false);
  if (e.key === 'Tab') {
    const items = menu.querySelectorAll('a, button');
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- Montage vidéo de l'ouverture ---------- */
startHeroMontage(document.getElementById('hero'), CONFIG.heroClips, CONFIG.heroClipSeconds);
