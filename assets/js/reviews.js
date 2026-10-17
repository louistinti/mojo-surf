// Avis Google : récupérés en direct à chaque visite (rien n'est stocké, conformément aux règles Google).

/** Met une fiche Google (classe Place de la Maps JS API) dans un format simple. Null si pas de note. */
export function normalizePlace(place) {
  if (!place || typeof place.rating !== 'number') return null;
  const reviews = (place.reviews || [])
    .map(r => ({ ...r, body: (typeof r.originalText === 'string' && r.originalText.trim()) ? r.originalText : r.text }))
    .filter(r => typeof r.body === 'string' && r.body.trim())
    .map(r => ({
      author: r.authorAttribution?.displayName || 'Avis Google',
      authorUrl: r.authorAttribution?.uri || '',
      photo: r.authorAttribution?.photoURI || '',
      stars: Math.round(r.rating || 0),
      text: r.body.trim(),
      link: r.googleMapsURI || '',
      when: r.relativePublishTimeDescription || '',
    }));
  return { rating: place.rating, count: place.userRatingCount || 0, url: place.googleMapsURI || '', reviews };
}

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Cartes HTML des avis : texte complet et échappé (la coupure est visuelle, en CSS), lien vers Google. */
export function reviewsMarkup(data) {
  return data.reviews.map(r => {
    const stars = '★'.repeat(r.stars) + '☆'.repeat(Math.max(0, 5 - r.stars));
    const name = r.authorUrl
      ? `<a href="${escapeHtml(r.authorUrl)}" target="_blank" rel="noopener">${escapeHtml(r.author)}</a>`
      : escapeHtml(r.author);
    const photo = r.photo ? `<img src="${escapeHtml(r.photo)}" alt="" width="32" height="32" loading="lazy" referrerpolicy="no-referrer">` : '';
    return `<article class="review">
  <p class="review-stars" role="img" aria-label="${r.stars} étoiles sur 5">${stars}</p>
  <p class="review-text">${escapeHtml(r.text)}</p>
  <a class="review-more" href="${escapeHtml(r.link || data.url)}" target="_blank" rel="noopener">Lire sur Google</a>
  <p class="review-who">${photo}<span>${name}${r.when ? `, ${escapeHtml(r.when)}` : ''}</span></p>
</article>`;
  }).join('\n');
}

/** « 4,9 / 5 · 27 avis Google » */
export function ratingLabel(data) {
  const rating = data.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `<b>${rating}</b> / 5 · ${data.count} avis Google`;
}

let mapsLoading = null;
function loadMapsApi(apiKey) {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (!mapsLoading) {
    mapsLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&language=fr&callback=__mojoMapsReady`;
      s.async = true;
      window.__mojoMapsReady = () => resolve();
      s.onerror = () => reject(new Error('Maps API non chargée'));
      document.head.appendChild(s);
    });
  }
  return mapsLoading;
}

/** Charge la fiche depuis Google. Toute absence de clé ou erreur donne null, sans exception. */
export async function loadReviews({ apiKey, placeId }) {
  if (!apiKey || !placeId) return null;
  try {
    await loadMapsApi(apiKey);
    const { Place } = await window.google.maps.importLibrary('places');
    const place = new Place({ id: placeId, requestedLanguage: 'fr' });
    await place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews', 'googleMapsURI'] });
    return normalizePlace(place);
  } catch {
    return null;
  }
}
