import { CONFIG } from './config.js';
import { collectifPrice } from './pricing.js';
import { startHeroMontage } from './hero.js';
import { loadReviews, normalizePlace, reviewsMarkup, ratingLabel } from './reviews.js';

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

/* ---------- Avis Google ---------- */
async function initReviews() {
  const section = document.getElementById('avis');
  const link = section.querySelector('.reviews-link');
  link.href = CONFIG.google.mapsUrl;
  // Données simulées pour les tests en local uniquement.
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const data = isLocal && window.__mockPlace ? normalizePlace(window.__mockPlace) : await loadReviews(CONFIG.google);
  if (!data || !data.reviews.length) return; // la section garde le titre et le bouton vers Google

  const track = section.querySelector('.reviews-track');
  const rating = section.querySelector('.reviews-rating');
  track.innerHTML = reviewsMarkup(data);
  rating.innerHTML = ratingLabel(data);
  if (data.url) link.href = data.url;
  section.classList.remove('is-empty');
  [track, rating, section.querySelector('.reviews-source')].forEach(el => { el.hidden = false; });

  const arrows = section.querySelector('.reviews-arrows');
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 0) + 18;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    arrows.hidden = max <= 0;
    section.querySelector('.reviews-prev').disabled = track.scrollLeft <= 2;
    section.querySelector('.reviews-next').disabled = track.scrollLeft >= max;
  };
  section.querySelector('.reviews-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  section.querySelector('.reviews-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
initReviews();
