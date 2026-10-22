import { CONFIG } from './config.js';
import { collectifPrice } from './pricing.js';
import { startHeroMontage } from './hero.js';
import { loadReviews, normalizePlace, reviewsMarkup, ratingLabel } from './reviews.js';

document.documentElement.classList.add('js');

/* ---------- Prix du cours collectif ---------- */
const p = collectifPrice(new Date());
document.querySelectorAll('[data-price]').forEach(el => { el.textContent = p.price; });
document.querySelectorAll('[data-price-schedule]').forEach(el => { el.textContent = p.schedule; });

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
  [track, rating].forEach(el => { el.hidden = false; });

  const prev = section.querySelector('.reviews-prev');
  const next = section.querySelector('.reviews-next');
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 0) + 16;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.hidden = next.hidden = max <= 0;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
// Google n'est appelé que si le visiteur approche de la section, pour ménager le quota gratuit.
const avis = document.getElementById('avis');
const avisIO = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) { avisIO.disconnect(); initReviews(); }
}, { rootMargin: '600px 0px' });
avisIO.observe(avis);

/* ---------- Apparitions au défilement ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
