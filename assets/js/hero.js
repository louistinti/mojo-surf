/** Sources à charger : la version légère (`small`) sur petit écran quand elle existe. */
export function clipSources(clips, small) {
  return clips.map(c => (typeof c === 'string' ? c : (small && c.small) || c.src));
}

/** Le montage ne démarre que s'il y a des clips, sans préférence de mouvement réduit ni économie de données. */
export function canPlayMontage({ count, reducedMotion, saveData }) {
  return count > 0 && !reducedMotion && !saveData;
}

/**
 * Montage en boucle de l'ouverture : fondu entre les clips toutes les `seconds` secondes,
 * barre de progression en 4 segments. Si quoi que ce soit échoue, la photo reste affichée.
 */
export function startHeroMontage(root, clips, seconds) {
  if (!root) return;
  const media = root.querySelector('.hero-media');
  const segments = [...root.querySelectorAll('.hero-progress i')];
  const small = window.matchMedia('(max-width: 860px)').matches;
  const sources = clipSources(clips, small);
  const ok = canPlayMontage({
    count: sources.length,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(navigator.connection && navigator.connection.saveData),
  });
  if (!ok || !media) return;

  const single = sources.length === 1;
  const steps = single ? segments.length : sources.length;
  const videos = sources.map((src, i) => {
    const v = document.createElement('video');
    v.className = 'hero-video';
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.preload = i === 0 ? 'auto' : 'metadata';
    v.loop = single;
    v.src = src;
    media.appendChild(v);
    return v;
  });

  let index = 0;
  let timer = null;
  let started = false;

  const paint = () => {
    root.style.setProperty('--clip-duration', `${seconds}s`);
    segments.forEach((s, i) => {
      s.classList.toggle('done', i < index);
      s.classList.remove('run');
    });
    const current = segments[index];
    if (current) { void current.offsetWidth; current.classList.add('run'); }
  };

  const show = i => {
    const v = single ? videos[0] : videos[i];
    if (!single) {
      v.currentTime = 0;
      videos.forEach(other => other.classList.toggle('is-active', other === v));
      videos.forEach(other => { if (other !== v) setTimeout(() => other.pause(), 700); });
    }
    return v.play();
  };

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      index = (index + 1) % steps;
      paint();
      if (!single) show(index).catch(() => {});
      schedule();
    }, seconds * 1000);
  };

  const abort = () => {
    clearTimeout(timer);
    videos.forEach(v => v.remove());
    root.classList.remove('is-playing');
  };

  videos[0].addEventListener('error', abort, { once: true });
  show(0).then(() => {
    started = true;
    videos[0].classList.add('is-active');
    root.classList.add('is-playing');
    paint();
    schedule();
  }).catch(abort);

  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) {
      clearTimeout(timer);
      videos.forEach(v => v.pause());
    } else {
      paint();
      show(index).catch(() => {});
      schedule();
    }
  });
}
