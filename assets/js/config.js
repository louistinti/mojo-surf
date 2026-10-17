// Seul fichier à modifier à la main : prix, vidéos de l'ouverture, avis Google.
export const CONFIG = {
  // Cours collectif, prix par personne. Saison du 1er du mois de début au dernier jour du mois de fin, inclus.
  pricing: { offSeason: 20, season: 25, seasonStartMonth: 4, seasonEndMonth: 12 },

  // Montage de l'ouverture : 4 extraits d'environ 4 s, ou un seul montage (voir README).
  heroClips: [
    // Extraits provisoires Mixkit (licence Mixkit Stock Video Free), à remplacer par les vidéos de Stéphane.
    { src: 'https://assets.mixkit.co/videos/1076/1076-720.mp4', small: 'https://assets.mixkit.co/videos/1076/1076-360.mp4' },
    { src: 'https://assets.mixkit.co/videos/1128/1128-720.mp4', small: 'https://assets.mixkit.co/videos/1128/1128-360.mp4' },
    { src: 'https://assets.mixkit.co/videos/1074/1074-720.mp4', small: 'https://assets.mixkit.co/videos/1074/1074-360.mp4' },
    { src: 'https://assets.mixkit.co/videos/1127/1127-720.mp4', small: 'https://assets.mixkit.co/videos/1127/1127-360.mp4' },
  ],
  heroClipSeconds: 4,

  // Avis Google : clé navigateur restreinte au site et identifiant de la fiche (voir README).
  google: {
    apiKey: '',
    placeId: '',
    mapsUrl: 'https://maps.app.goo.gl/wCiQ2QshkwwX46Ug9',
  },
};
