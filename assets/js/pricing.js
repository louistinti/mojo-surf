import { CONFIG } from './config.js';

const NBSP = '\u00a0';

/** Prix du cours collectif à une date donnée, selon le calendrier local du visiteur. */
export function collectifPrice(date, pricing = CONFIG.pricing) {
  const month = date.getMonth() + 1;
  const inSeason = month >= pricing.seasonStartMonth && month <= pricing.seasonEndMonth;
  const seasonSpan = `${monthFrom(pricing.seasonStartMonth)} à ${monthName(pricing.seasonEndMonth)}`;
  const offSpan = offSeasonSpan(pricing);
  return {
    price: inSeason ? pricing.season : pricing.offSeason,
    other: inSeason ? pricing.offSeason : pricing.season,
    season: inSeason ? 'saison' : 'hors-saison',
    label: `Tarif ${inSeason ? seasonSpan : offSpan}`,
    otherLabel: inSeason ? `${pricing.offSeason}${NBSP}€ ${offSpan}` : `${pricing.season}${NBSP}€ ${seasonSpan}`,
    schedule: `${pricing.season}${NBSP}€ ${seasonSpan}, ${pricing.offSeason}${NBSP}€ ${offSpan}`,
  };
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const monthName = m => MONTHS[(m + 11) % 12];
// « d'avril », « de janvier » : élision devant voyelle
const monthFrom = m => (/^[aeiouéo]/i.test(monthName(m)) ? `d’${monthName(m)}` : `de ${monthName(m)}`);
const offSeasonSpan = p => `${monthFrom(p.seasonEndMonth + 1)} à ${monthName(p.seasonStartMonth - 1)}`;
