// Avis Google : récupérés en direct à chaque visite (rien n'est stocké, conformément aux règles Google).

/** Met une fiche Google (classe Place de la Maps JS API) dans un format simple. Null si pas de note. */
export function normalizePlace(place) {
  if (!place || typeof place.rating !== 'number') return null;
  const reviews = (place.reviews || [])
    .map(r => ({ ...r, body: (typeof r.originalText === 'string' && r.originalText.trim()) ? r.originalText : r.text }))
    .filter(r => typeof r.body === 'string' && r.body.trim())
    .map(r => ({
      author: r.authorAttribution?.displayName || 'Utilisateur Google',
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

const G_LOGO = '<svg class="g-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

const starsLabel = n => `${n} étoile${n > 1 ? 's' : ''} sur 5`;

/** Cartes HTML des avis, façon Google : texte complet et échappé (coupure visuelle en CSS). */
export function reviewsMarkup(data) {
  return data.reviews.map(r => {
    const author = escapeHtml(r.author);
    const stars = '★'.repeat(r.stars) + '☆'.repeat(Math.max(0, 5 - r.stars));
    const avatar = r.photo
      ? `<img class="review-avatar" src="${escapeHtml(r.photo)}" alt="" width="40" height="40" loading="lazy" referrerpolicy="no-referrer">`
      : `<span class="review-avatar" aria-hidden="true">${escapeHtml(r.author.trim().charAt(0).toUpperCase())}</span>`;
    const name = r.authorUrl
      ? `<a class="review-name" href="${escapeHtml(r.authorUrl)}" target="_blank" rel="noopener">${author}</a>`
      : `<span class="review-name">${author}</span>`;
    return `<article class="review" role="listitem" aria-label="Avis de ${author}">
  <div class="review-head">
    <span class="review-face">${avatar}<span class="review-g">${G_LOGO}</span></span>
    <p class="review-meta">${name}${r.when ? `<span class="review-when">${escapeHtml(r.when)}</span>` : ''}</p>
  </div>
  <p class="review-stars" role="img" aria-label="${starsLabel(r.stars)}">${stars}</p>
  <p class="review-text">${escapeHtml(r.text)}</p>
  <a class="review-more" href="${escapeHtml(r.link || data.url)}" target="_blank" rel="noopener" aria-label="Lire l’avis de ${author} sur Google">Lire la suite</a>
</article>`;
  }).join('');
}

/** En-tête de note : « 4,9 ★★★★★ (27 avis) ». */
export function ratingLabel(data) {
  const rating = data.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const full = Math.round(data.rating);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return `<span class="g-score">${rating}</span><span class="g-stars" role="img" aria-label="Note de ${rating} sur 5">${stars}</span><span class="g-count">(${data.count} avis)</span>`;
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
