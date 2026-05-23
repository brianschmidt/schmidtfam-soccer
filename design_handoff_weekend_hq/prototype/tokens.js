// Design tokens + tiny helpers used across mobile + desktop views.
// Avoid the cliché pink/blue: Sofia is warm rose, Max is deep teal.

window.TOKENS = {
  // Surfaces
  bg:        '#F7F4EE',   // warm off-white page
  surface:   '#FFFFFF',
  surface2:  '#F1ECE3',   // subtle warm tint for inset rows
  hairline:  'rgba(26,23,20,0.08)',
  hairlineStrong: 'rgba(26,23,20,0.16)',

  // Ink
  ink:       '#1A1714',
  ink2:      '#3A332B',
  muted:     '#857C72',
  mutedSoft: '#A8A097',

  // Kid colors
  sofia:     '#B23457', // warm rose
  sofiaBg:   '#FBE9EE',
  sofiaTint: '#FDF4F6',
  sofiaInk:  '#7A1F38',

  max:       '#1F6F6C', // deep teal
  maxBg:     '#DDECEB',
  maxTint:   '#F0F7F6',
  maxInk:    '#0E4644',

  // Status
  warn:      '#B6531B', // warm orange (conflict)
  warnBg:    '#FBEAD8',
  warnTint:  '#FDF5EC',

  ok:        '#3D7A3A',
  okBg:      '#E4EFDF',

  // Type
  font:        '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono:    '"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',

  // Radii / shadows
  r:    8,
  rLg:  14,
  rXl:  22,
  shadow:   '0 1px 2px rgba(26,23,20,0.04), 0 4px 14px rgba(26,23,20,0.06)',
  shadowLg: '0 8px 28px rgba(26,23,20,0.08), 0 2px 6px rgba(26,23,20,0.05)',
};

// Helpers
window.fmtTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hr12 = ((h + 11) % 12) + 1;
  const ap = h < 12 ? 'AM' : 'PM';
  return `${hr12}:${m.toString().padStart(2,'0')} ${ap}`;
};

window.fmtTimeShort = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hr12 = ((h + 11) % 12) + 1;
  if (m === 0) return `${hr12}${h < 12 ? 'a' : 'p'}`;
  return `${hr12}:${m.toString().padStart(2,'0')}${h < 12 ? 'a' : 'p'}`;
};

window.fmtDur = (mins) => {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins/60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

window.fmtCountdown = (mins) => {
  if (mins < 0) return 'now';
  if (mins < 60) return `in ${mins}m`;
  const h = Math.floor(mins/60);
  const m = mins % 60;
  return m ? `in ${h}h ${m}m` : `in ${h}h`;
};

// Kid color helper
window.kidColor = (lane, T = window.TOKENS) => {
  if (lane === 'sofia') return { fg: T.sofia, bg: T.sofiaBg, tint: T.sofiaTint, deep: T.sofiaInk };
  if (lane === 'max')   return { fg: T.max,   bg: T.maxBg,   tint: T.maxTint,   deep: T.maxInk };
  return { fg: T.ink,  bg: T.surface2, tint: T.surface2, deep: T.ink };
};

// Google Maps deep link for an address
window.mapsHref = (addr) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
