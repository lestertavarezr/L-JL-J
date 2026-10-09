(() => {
  'use strict';
  const config = window.WEDDING_CONFIG || {};
  const $ = id => document.getElementById(id);
  const opening = $('opening');
  const main = $('main');
  const music = $('music');
  const controls = $('musicControls');
  const musicToggle = $('musicToggle');
  const muteToggle = $('muteToggle');
  const announce = message => { $('announcer').textContent = message; };
  let opened = false;
  let sourceIndex = 0;
  let sourceReady = false;
  main.inert = true;

  function finishOpening() {
    opening.classList.add('finished');
    opening.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-closed');
    main.inert = false;
    main.focus({ preventScroll: true });
    window.setTimeout(() => { opening.hidden = true; }, 1000);
  }

  function setMusicButtons() {
    musicToggle.textContent = music.paused ? '▶' : '❚❚';
    musicToggle.setAttribute('aria-label', music.paused ? 'Reproducir música' : 'Pausar música');
    musicToggle.title = musicToggle.getAttribute('aria-label');
    muteToggle.textContent = music.muted ? '♪̸' : '♫';
    muteToggle.setAttribute('aria-label', music.muted ? 'Activar sonido' : 'Silenciar música');
    muteToggle.title = muteToggle.getAttribute('aria-label');
  }

  async function startMusic() {
    const sources = Array.isArray(config.musicSources) ? config.musicSources : [];
    if (!sources.length) return;
    music.volume = 0.55;
    for (sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
      music.src = sources[sourceIndex];
      try {
        await music.play();
        sourceReady = true;
        controls.hidden = false;
        setMusicButtons();
        return;
      } catch (_) { /* Archivo ausente o reproducción rechazada. */ }
    }
    controls.hidden = true;
  }

  music.addEventListener('error', () => {
    // Durante el arranque, startMusic() prueba los formatos en orden.
    if (!sourceReady) return;
    const sources = Array.isArray(config.musicSources) ? config.musicSources : [];
    if (sourceIndex + 1 < sources.length) {
      sourceIndex++;
      music.src = sources[sourceIndex];
      music.play().catch(() => { controls.hidden = true; sourceReady = false; });
    } else { controls.hidden = true; sourceReady = false; }
  });
  music.addEventListener('play', setMusicButtons);
  music.addEventListener('pause', setMusicButtons);
  musicToggle.addEventListener('click', () => {
    if (music.paused) music.play().catch(() => announce('No se pudo reproducir la música.'));
    else music.pause();
  });
  muteToggle.addEventListener('click', () => { music.muted = !music.muted; setMusicButtons(); });

  function openInvitation() {
    if (opened) return;
    opened = true;
    $('openButton').disabled = true;
    startMusic(); // Llamado en el gesto del usuario para respetar la política de reproducción.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { finishOpening(); return; }
    opening.classList.add('playing');
    window.setTimeout(finishOpening, 5900);
  }
  $('openButton').addEventListener('click', openInvitation);
  document.querySelector('.skip-link').addEventListener('click', () => {
    if (!opened) { opened = true; finishOpening(); }
  });

  const target = new Date(config.dateISO || '2026-12-26T16:00:00-04:00').getTime();
  function updateCountdown() {
    if (!Number.isFinite(target)) return;
    const ms = Math.max(0, target - Date.now());
    const units = [Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24, Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60];
    ['days','hours','minutes','seconds'].forEach((id, i) => { $(id).textContent = String(units[i]).padStart(2, '0'); });
    if (ms === 0) { $('countdownEnded').hidden = false; clearInterval(timer); }
  }
  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();

  function mapLink(place) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place); }
  $('ceremonyMap').href = mapLink(config.ceremony || 'Iglesia Santos Ángeles Custodios, Santiago de los Caballeros');
  $('receptionMap').href = mapLink(config.reception || 'Camino de Santiago Eventos, Santiago de los Caballeros');

  const params = new URLSearchParams(window.location.search);
  const code = (params.get('code') || '').trim().slice(0, 40);
  const quotaRaw = params.get('guests') || '';
  const quota = /^\d{1,2}$/.test(quotaRaw) ? Number(quotaRaw) : 0;
  const guestInfo = $('guestInfo');
  if (code || (quota >= 1 && quota <= 20)) {
    const pieces = [];
    if (code) pieces.push('Código de invitación: ' + code);
    if (quota >= 1 && quota <= 20) pieces.push('Invitación para ' + quota + (quota === 1 ? ' persona' : ' personas'));
    guestInfo.textContent = pieces.join(' · ');
    guestInfo.hidden = false;
  }

  try {
    if (config.formUrl) {
      const form = new URL(config.formUrl);
      if (form.protocol === 'https:' && /(^|\.)docs\.google\.com$/.test(form.hostname)) {
        if (code && /^entry\.\d+$/.test(config.formFields?.code || '')) form.searchParams.set(config.formFields.code, code);
        if (quota >= 1 && quota <= 20 && /^entry\.\d+$/.test(config.formFields?.quota || '')) form.searchParams.set(config.formFields.quota, String(quota));
        $('rsvpButton').href = form.toString();
        $('rsvpButton').hidden = false;
        $('rsvpPending').hidden = true;
      }
    }
  } catch (_) { /* URL sin configurar: mostrar el aviso. */ }
})();
