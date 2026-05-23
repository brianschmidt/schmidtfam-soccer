// Mobile prototype — dual-lane timeline tournament HQ.
// Renders inside an IOSDevice frame. Self-contained: only depends on window.TOKENS,
// window.TOURNAMENT and helpers from tokens.js.

// React hooks are accessed inline (React.useState/etc.) — declaring
// `const { useState } = React` at top level collides with the same line
// in other inline babel scripts.

// ─────────────────────────────────────────────────────────────
// Icons (inline, monoline)
// ─────────────────────────────────────────────────────────────
const Icon = {
  cal:  (c='currentColor') => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  pin:  (c='currentColor') => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  bag:  (c='currentColor') => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h16l-1 12H5L4 8z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>,
  note: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5M9 8h4"/></svg>,
  arrow:(c='currentColor') => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  warn: (c='currentColor') => <svg width="16" height="16" viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2L1 22h22L12 2zm0 7v6m0 3v.5" stroke="white" strokeWidth="1.8" fill={c}/></svg>,
  car:  (c='currentColor') => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l2-6h14l2 6M3 13h18v5H3z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>,
  chev: (c='currentColor', dir='down') => {
    const r = dir==='down' ? 0 : dir==='up' ? 180 : dir==='right' ? -90 : 90;
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${r}deg)`,transition:'transform .2s'}}><path d="M6 9l6 6 6-6"/></svg>;
  },
  dot:  (c='currentColor') => <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill={c}/></svg>,
  close:(c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  check:(c='currentColor') => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6"/></svg>,
  indoor:(c='currentColor') => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-5h6v5"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Header — date, day pills, summary strip
// ─────────────────────────────────────────────────────────────
function Header({ dayId, setDayId, day, simulatedNow, onTitleTap }) {
  const T = TOKENS;
  const games = day.events.filter(e => e.kind === 'game');
  const attended = games.filter(e => e.attending !== false).length;
  const venues = new Set(games.map(g => g.venue)).size;

  return (
    <div style={{
      paddingTop: 58, paddingLeft: 18, paddingRight: 18, paddingBottom: 12,
      background: T.bg, flexShrink: 0,
      borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 500,
          letterSpacing: 1.6, color: T.muted, textTransform:'uppercase',
        }}>LMFC · Memorial Day Weekend</div>
        <div onClick={onTitleTap} style={{
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 500,
          letterSpacing: 1.4, color: T.mutedSoft,
        }}>2026</div>
      </div>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap: 12 }}>
        <div>
          <div style={{
            fontSize: 13, color: T.muted, fontWeight: 500, marginBottom: 2,
            letterSpacing: 0.2,
          }}>{day.dow}</div>
          <div style={{
            fontFamily: T.font, fontSize: 30, fontWeight: 600, color: T.ink,
            letterSpacing: -0.8, lineHeight: 1, marginBottom: 6,
          }}>{day.date}</div>
        </div>

        {/* Day pills */}
        <div style={{
          display:'flex', background: T.surface2,
          borderRadius: 999, padding: 3, gap: 2,
          border: `1px solid ${T.hairline}`,
        }}>
          {TOURNAMENT.days.map(d => (
            <button key={d.id} onClick={() => setDayId(d.id)} style={{
              padding: '7px 14px', borderRadius: 999, border:0, cursor:'pointer',
              background: d.id === dayId ? T.ink : 'transparent',
              color: d.id === dayId ? T.bg : T.ink2,
              fontFamily: T.font, fontWeight: 600, fontSize: 13,
              letterSpacing: 0.1,
            }}>{d.label} {d.date.split(' ')[1]}</button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div style={{
        display:'flex', gap: 14, marginTop: 14, fontFamily: T.fontMono,
        fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}>
        <span><b style={{ color: T.ink, fontWeight: 700 }}>{games.length}</b> games</span>
        <span style={{ color: T.hairlineStrong }}>·</span>
        <span><b style={{ color: T.ink, fontWeight: 700 }}>{attended}</b> attending</span>
        <span style={{ color: T.hairlineStrong }}>·</span>
        <span><b style={{ color: T.ink, fontWeight: 700 }}>{venues}</b> venues</span>
        {day.conflicts.length > 0 && (
          <>
            <span style={{ color: T.hairlineStrong }}>·</span>
            <span style={{ color: T.warn, fontWeight: 700 }}>{day.conflicts.length} conflict</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Up Next hero card
// ─────────────────────────────────────────────────────────────
function UpNext({ day, simulatedNow, onOpen }) {
  const T = TOKENS;
  if (simulatedNow.day !== day.id) return null;
  // find the next event the parent is actually attending (skip Max G1 unattended)
  const games = day.events
    .filter(e => e.kind === 'game' && e.attending !== false && e.start >= simulatedNow.minute - 5);
  if (games.length === 0) return null;
  const next = games[0];
  const col = kidColor(next.lane);
  const mins = next.start - simulatedNow.minute;

  return (
    <div style={{ padding: '14px 18px 6px' }}>
      <div onClick={() => onOpen(next.id)} style={{
        background: T.surface, borderRadius: T.rXl,
        padding: '18px 18px 16px',
        boxShadow: T.shadow,
        border: `1px solid ${T.hairline}`,
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
      }}>
        {/* tint stripe */}
        <div style={{
          position:'absolute', top:0, left:0, bottom:0, width: 6,
          background: col.fg,
        }} />
        <div style={{
          position:'absolute', top: 0, right: 0, width: 200, height: 200,
          background: `radial-gradient(circle at top right, ${col.bg}, transparent 70%)`,
          pointerEvents: 'none', opacity: 0.65,
        }} />
        <div style={{ position:'relative' }}>
          <div style={{
            display:'flex', alignItems:'center', gap: 8, marginBottom: 14,
            fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 600,
            letterSpacing: 1.4, textTransform:'uppercase',
          }}>
            <span style={{ color: T.muted }}>Up next</span>
            <span style={{
              padding: '3px 8px', background: col.fg, color: '#fff',
              borderRadius: 999, fontSize: 10.5, letterSpacing: 0.8,
            }}>{fmtCountdown(mins)}</span>
          </div>

          <div style={{ display:'flex', alignItems:'flex-start', gap: 14 }}>
            <div>
              <div style={{
                fontFamily: T.fontMono, fontSize: 30, fontWeight: 600,
                color: T.ink, letterSpacing: -1.2, lineHeight: 0.95,
              }}>{fmtTime(next.start).replace(/\s(AM|PM)/,'')}</div>
              <div style={{
                fontFamily: T.fontMono, fontSize: 11, color: T.muted,
                marginTop: 2, letterSpacing: 0.6,
              }}>{fmtTime(next.start).slice(-2)} · {fmtDur(next.end - next.start)}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 18, fontWeight: 600, color: col.deep,
                letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 4,
              }}>{next.who} · {next.game}</div>
              <div style={{
                fontSize: 13.5, color: T.ink2, lineHeight: 1.35,
                marginBottom: 8,
              }}>vs {next.opponent}</div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'4px 9px', background: col.tint,
                borderRadius: 6, fontSize: 12, color: col.deep, fontWeight: 600,
                border: `1px solid ${col.bg}`,
              }}>
                <span style={{ opacity: 0.7 }}>{Icon.pin(col.fg)}</span>
                {next.venue} · <span style={{ fontFamily: T.fontMono, fontWeight:600 }}>{next.field}</span>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
            <a href={mapsHref(next.addr)} target="_blank" rel="noopener" onClick={e=>e.stopPropagation()} style={{
              flex: 1, padding: '11px 14px', textAlign:'center',
              background: T.ink, color: T.bg, borderRadius: 10,
              fontSize: 13.5, fontWeight: 600, textDecoration:'none',
              display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
            }}>
              Directions
              <span style={{ opacity: 0.7 }}>{Icon.arrow(T.bg)}</span>
            </a>
            <button onClick={() => onOpen(next.id)} style={{
              padding:'11px 14px', background:'transparent',
              color: T.ink2, borderRadius: 10, fontSize: 13.5, fontWeight: 600,
              border: `1px solid ${T.hairlineStrong}`, cursor:'pointer',
            }}>Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero action / conflict callout (Saturday morning handoff)
// ─────────────────────────────────────────────────────────────
function HeroAction({ day }) {
  const T = TOKENS;
  const [open, setOpen] = React.useState(true);
  if (!day.heroAction) return null;
  const a = day.heroAction;

  return (
    <div style={{ padding: '4px 18px 0' }}>
      <div style={{
        background: T.warnTint, border: `1px solid ${T.warnBg}`,
        borderRadius: T.rLg, overflow:'hidden',
      }}>
        <button onClick={() => setOpen(!open)} style={{
          width: '100%', textAlign:'left', cursor:'pointer',
          background:'transparent', border:0, padding: '12px 14px',
          display:'flex', alignItems:'center', gap: 10,
        }}>
          <span style={{ flexShrink:0, color: T.warn, display:'flex' }}>{Icon.warn(T.warn)}</span>
          <span style={{
            flex: 1, fontSize: 13.5, fontWeight: 600, color: T.warn,
            letterSpacing: 0.1,
          }}>{a.title}</span>
          <span style={{ color: T.warn }}>{Icon.chev(T.warn, open ? 'up' : 'down')}</span>
        </button>
        {open && (
          <div style={{ padding:'0 14px 14px 40px' }}>
            <div style={{
              fontSize: 12.5, color: T.ink2, lineHeight: 1.5, marginBottom: 10,
            }}>{a.body}</div>
            <ol style={{
              margin: 0, padding: 0, listStyle:'none',
              fontSize: 12.5, color: T.ink2, lineHeight: 1.45,
            }}>
              {a.steps.map((s, i) => (
                <li key={i} style={{
                  display:'flex', gap: 8, marginBottom: 6,
                }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: 999,
                    background: T.warn, color: '#fff',
                    fontSize: 10.5, fontWeight: 700,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily: TOKENS.fontMono, marginTop: 1,
                  }}>{i+1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dual-lane timeline
// ─────────────────────────────────────────────────────────────
const PX_PER_MIN_DEFAULT = 1.5;

function TimelineHeader({ T }) {
  return (
    <div style={{
      display:'flex', position:'sticky', top: 0, zIndex: 5,
      background: T.bg, paddingBottom: 6, paddingTop: 6,
    }}>
      <div style={{ width: 38, flexShrink: 0 }} />
      <div style={{ flex: 1, display:'flex', gap: 8 }}>
        <LaneHeader who="Sofia" lane="sofia" />
        <LaneHeader who="Max"   lane="max" />
      </div>
    </div>
  );
}
function LaneHeader({ who, lane }) {
  const T = TOKENS, col = kidColor(lane);
  return (
    <div style={{
      flex: 1, display:'flex', alignItems:'center', gap: 7,
      padding: '7px 10px', background: col.bg, borderRadius: 8,
      border: `1px solid ${col.bg}`,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: 999, background: col.fg,
      }} />
      <span style={{
        fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
        color: col.deep, letterSpacing: 1.2, textTransform:'uppercase',
      }}>{who}</span>
    </div>
  );
}

function Timeline({ day, expanded, setExpanded, simulatedNow, pxPerMin = PX_PER_MIN_DEFAULT }) {
  const T = TOKENS;
  const startMin = day.startHour * 60;
  const endMin   = day.endHour   * 60;
  const totalMin = endMin - startMin;
  const height   = totalMin * pxPerMin;
  const yFor = (m) => (m - startMin) * pxPerMin;

  const hours = [];
  for (let h = day.startHour; h <= day.endHour; h++) hours.push(h);

  const showNow = simulatedNow.day === day.id &&
    simulatedNow.minute >= startMin && simulatedNow.minute <= endMin;

  return (
    <div style={{ padding: '12px 18px 20px' }}>
      <TimelineHeader T={T} />

      <div style={{ position:'relative', height, marginTop: 4 }}>
        {/* Hour gridlines */}
        {hours.map(h => (
          <div key={h} style={{
            position:'absolute', left: 0, right: 0,
            top: yFor(h * 60),
            display:'flex', alignItems:'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 38, fontFamily: T.fontMono, fontSize: 10.5,
              color: T.mutedSoft, fontWeight: 500, letterSpacing: 0.6,
              transform:'translateY(-7px)',
            }}>{h === 12 ? '12p' : (h > 12 ? `${h-12}p` : `${h}a`)}</div>
            <div style={{
              flex: 1, height: 1,
              borderTop: `1px ${h % 2 === 0 ? 'solid' : 'dashed'} ${T.hairline}`,
            }} />
          </div>
        ))}

        {/* Conflict overlays */}
        {day.conflicts.map((c, i) => (
          <div key={i} style={{
            position:'absolute',
            top: yFor(c.start), height: (c.end - c.start) * pxPerMin,
            left: 38, right: 0,
            background: 'repeating-linear-gradient(135deg, rgba(182,83,27,0.07) 0 6px, rgba(182,83,27,0.03) 6px 12px)',
            border: `1.5px dashed ${T.warn}`,
            borderRadius: 10,
            display:'flex', alignItems:'flex-start', justifyContent:'flex-end',
            padding: '4px 8px',
            pointerEvents:'none', zIndex: 0,
          }}>
            <span style={{
              fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
              color: T.warn, letterSpacing: 0.8, textTransform:'uppercase',
              background: T.warnTint, padding: '2px 5px', borderRadius: 4,
            }}>{c.label}</span>
          </div>
        ))}

        {/* Lane columns (background, so events sit inside them visually) */}
        <div style={{
          position:'absolute', top: 0, bottom: 0, left: 38, right: 0,
          display:'flex', gap: 8, pointerEvents:'none',
        }}>
          <div style={{ flex: 1, background: 'transparent', borderRadius: 8 }} />
          <div style={{ flex: 1, background: 'transparent', borderRadius: 8 }} />
        </div>

        {/* Events */}
        {day.events.map(ev => {
          if (ev.kind === 'game') return (
            <GameCard key={ev.id} ev={ev} y={yFor(ev.start)}
              h={(ev.end - ev.start) * pxPerMin}
              expanded={expanded === ev.id}
              onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)} />
          );
          if (ev.kind === 'travel') return (
            <TravelChip key={ev.id} ev={ev} y={yFor(ev.start)}
              h={(ev.end - ev.start) * pxPerMin}
              expanded={expanded === ev.id}
              onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)} />
          );
          return null;
        })}

        {/* Now line */}
        {showNow && (
          <div style={{
            position:'absolute', left: 0, right: 0,
            top: yFor(simulatedNow.minute),
            zIndex: 6, pointerEvents:'none',
            display:'flex', alignItems:'center',
          }}>
            <div style={{
              width: 38, paddingRight: 4, textAlign:'right',
              fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
              color: T.warn, letterSpacing: 0.6, textTransform:'uppercase',
              transform: 'translateY(-7px)',
            }}>Now</div>
            <div style={{
              flex: 1, height: 0, borderTop: `1.5px solid ${T.warn}`,
              position: 'relative',
            }}>
              <div style={{
                position:'absolute', left: -1, top: -4, width: 7, height: 7,
                borderRadius: 999, background: T.warn,
              }}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Game card (in a lane)
// ─────────────────────────────────────────────────────────────
function GameCard({ ev, y, h, expanded, onToggle }) {
  const T = TOKENS, col = kidColor(ev.lane);
  // game cards live in their lane column. height is clamped to a sane min/max.
  const cardH = Math.max(72, Math.min(h - 6, 130));
  const leftSide = ev.lane === 'sofia';
  return (
    <div style={{
      position:'absolute', top: y,
      left: leftSide ? 38 : 'calc(50% + 4px + 19px)',
      width: 'calc(50% - 23px - 4px)',
      zIndex: expanded ? 4 : 2,
    }}>
      <div onClick={onToggle} style={{
        background: T.surface, border: `1px solid ${col.bg}`,
        borderLeft: `3px solid ${col.fg}`,
        borderRadius: 10, padding: '8px 10px 9px',
        boxShadow: expanded ? T.shadowLg : T.shadow,
        cursor:'pointer', minHeight: cardH,
        position:'relative', overflow:'hidden',
        opacity: ev.attending === false ? 0.62 : 1,
      }}>
        <div style={{
          display:'flex', alignItems:'baseline', justifyContent:'space-between',
          gap: 6, marginBottom: 3,
        }}>
          <span style={{
            fontFamily: T.fontMono, fontSize: 13.5, fontWeight: 700,
            color: T.ink, letterSpacing: -0.2,
          }}>{fmtTimeShort(ev.start)}</span>
          <span style={{
            fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
            color: col.deep, letterSpacing: 0.6, padding:'1px 5px',
            background: col.bg, borderRadius: 3,
            textTransform:'uppercase', whiteSpace:'nowrap',
          }}>{ev.field.replace('Field ','F').replace('Dome ','D')}</span>
        </div>
        <div style={{
          fontSize: 11.5, fontWeight: 600, color: col.deep,
          letterSpacing: 0.2, lineHeight: 1.15,
        }}>{ev.game}</div>
        <div style={{
          fontSize: 11.5, color: T.ink2, lineHeight: 1.25, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical',
          overflow:'hidden',
        }}>vs {ev.opponent.replace(' Football Academy','').replace(' EDP Boys','').replace(' White 2014','').replace(' Youth Phoenix','')}</div>

        {ev.attending === false && (
          <div style={{
            marginTop: 5, fontSize: 9.5, fontWeight: 700,
            color: T.muted, letterSpacing: 0.6, textTransform:'uppercase',
            fontFamily: T.fontMono,
          }}>· not attending ·</div>
        )}
        {ev.indoor && (
          <div style={{
            position:'absolute', top: 8, right: 8, color: col.fg, opacity: 0.5,
          }}>{Icon.indoor(col.fg)}</div>
        )}
      </div>

      {expanded && <GameDetails ev={ev} col={col} />}
    </div>
  );
}

function GameDetails({ ev, col }) {
  const T = TOKENS;
  return (
    <div style={{
      marginTop: 6, background: T.surface,
      border: `1px solid ${col.bg}`, borderRadius: 10,
      padding: '12px 12px 12px',
      boxShadow: T.shadowLg,
      fontFamily: T.font, position:'relative',
    }}>
      <div style={{
        fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
        color: col.deep, letterSpacing: 1.2, textTransform:'uppercase',
        marginBottom: 4,
      }}>{ev.age}</div>
      <div style={{
        fontSize: 13, fontWeight: 600, color: T.ink,
        lineHeight: 1.3, marginBottom: 8,
      }}>vs {ev.opponent}</div>
      <div style={{
        fontSize: 11.5, color: T.muted, lineHeight: 1.4, marginBottom: 10,
      }}>{ev.venue} · {ev.field}<br/>{ev.addr}</div>
      {ev.note && (
        <div style={{
          fontSize: 11.5, fontStyle:'italic', color: T.ink2,
          padding: '7px 9px', background: col.tint, borderRadius: 6,
          lineHeight: 1.4, marginBottom: 10,
        }}>{ev.note}</div>
      )}
      <a href={mapsHref(ev.addr)} target="_blank" rel="noopener" style={{
        display:'block', textAlign:'center',
        padding: '9px 10px', background: col.fg, color: '#fff',
        borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration:'none',
        letterSpacing: 0.2,
      }}>Open in Maps →</a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Travel chip (sits in time gutter / between lanes)
// ─────────────────────────────────────────────────────────────
function TravelChip({ ev, y, h, expanded, onToggle }) {
  const T = TOKENS;
  // Span across both lanes for "both", or live in the appropriate lane for solo
  const both = ev.lane === 'both';
  const cardH = Math.max(28, h - 4);
  const left  = both ? 38 : (ev.lane === 'sofia' ? 38 : 'calc(50% + 4px + 19px)');
  const width = both ? 'calc(100% - 38px)' : 'calc(50% - 23px - 4px)';

  return (
    <div style={{
      position:'absolute', top: y, left, width,
      zIndex: expanded ? 4 : 1,
    }}>
      <div onClick={onToggle} style={{
        background: '#fff',
        border: `1px dashed ${T.hairlineStrong}`,
        borderRadius: 8, padding: '5px 9px',
        cursor:'pointer', minHeight: cardH,
        display:'flex', alignItems:'center', gap: 8,
        color: T.muted,
      }}>
        <span style={{ flexShrink: 0, opacity: 0.7 }}>{Icon.car(T.muted)}</span>
        <span style={{
          fontFamily: TOKENS.fontMono, fontSize: 10.5, fontWeight: 600,
          color: T.ink2, letterSpacing: 0.3,
        }}>{fmtTimeShort(ev.start)}</span>
        <span style={{
          fontSize: 11.5, color: T.ink2, fontWeight: 500,
          whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          flex: 1,
        }}>{ev.title}</span>
        {ev.drive && (
          <span style={{
            fontFamily: TOKENS.fontMono, fontSize: 10, fontWeight: 600,
            color: T.muted, padding: '1px 5px',
            background: T.surface2, borderRadius: 3,
            letterSpacing: 0.4,
          }}>{ev.drive}m</span>
        )}
      </div>
      {expanded && (
        <div style={{
          marginTop: 6, padding: '10px 12px',
          background: T.surface, borderRadius: 8,
          border: `1px solid ${T.hairline}`,
          fontSize: 12, color: T.ink2, lineHeight: 1.45,
          boxShadow: T.shadow,
        }}>{ev.detail}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Venues panel
// ─────────────────────────────────────────────────────────────
function VenuesPanel() {
  const T = TOKENS;
  return (
    <div style={{ padding: '14px 18px 24px' }}>
      <SectionTitle>Venues</SectionTitle>
      <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
        {TOURNAMENT.venues.map(v => {
          const col = kidColor(v.for);
          return (
            <div key={v.id} style={{
              background: T.surface, borderRadius: T.rLg,
              border: `1px solid ${T.hairline}`,
              boxShadow: T.shadow, overflow:'hidden',
            }}>
              <div style={{
                background: col.bg, padding: '12px 14px',
                display:'flex', alignItems:'center', gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius:999, background: col.fg }} />
                <span style={{
                  fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
                  color: col.deep, letterSpacing: 1.2, textTransform:'uppercase',
                  flex: 1,
                }}>{v.for === 'sofia' ? 'Sofia' : 'Max'}</span>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{
                  fontSize: 16, fontWeight: 600, color: T.ink, lineHeight: 1.25,
                  letterSpacing: -0.2, marginBottom: 4,
                }}>{v.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>{v.addr}</div>

                <div style={{ display:'flex', flexDirection:'column', gap: 6, marginBottom: 12 }}>
                  {v.slots.map((s, i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap: 10,
                      padding: '7px 10px', background: col.tint,
                      borderRadius: 7, fontSize: 12.5, color: col.deep,
                    }}>
                      <span style={{
                        fontFamily: T.fontMono, fontWeight: 700, fontSize: 10.5,
                        letterSpacing: 0.6, color: col.fg, width: 28,
                      }}>{s.day}</span>
                      <span style={{ fontFamily: T.fontMono, fontWeight: 600, width: 60 }}>{s.time}</span>
                      <span style={{ fontWeight: 500 }}>{s.field}</span>
                    </div>
                  ))}
                </div>

                <a href={mapsHref(v.addr)} target="_blank" rel="noopener" style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
                  padding: '10px 12px', background: T.ink, color: T.bg,
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  textDecoration:'none',
                }}>Directions <span style={{ opacity: 0.7 }}>{Icon.arrow(T.bg)}</span></a>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 14, padding: '12px 14px',
        background: T.surface2, borderRadius: T.rLg,
        fontSize: 12, color: T.ink2, lineHeight: 1.5,
        border: `1px solid ${T.hairline}`,
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
          color: T.muted, letterSpacing: 1.2, textTransform:'uppercase', marginBottom: 5,
        }}>Drive between venues</div>
        {TOURNAMENT.driveNote}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pack panel
// ─────────────────────────────────────────────────────────────
function PackPanel() {
  const T = TOKENS;
  const [checked, setChecked] = React.useState({});
  const toggle = (k) => setChecked({ ...checked, [k]: !checked[k] });
  return (
    <div style={{ padding: '14px 18px 24px' }}>
      <SectionTitle>Packing &amp; prep</SectionTitle>
      <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
        {TOURNAMENT.packing.map((grp, gi) => (
          <div key={gi} style={{
            background: T.surface, borderRadius: T.rLg,
            border: `1px solid ${T.hairline}`, padding: '14px 16px',
            boxShadow: T.shadow,
          }}>
            <div style={{
              fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
              color: T.muted, letterSpacing: 1.2, textTransform:'uppercase',
              marginBottom: 8,
            }}>{grp.group}</div>
            {grp.items.map((it, i) => {
              const k = `${gi}-${i}`;
              const on = checked[k];
              return (
                <label key={k} onClick={() => toggle(k)} style={{
                  display:'flex', alignItems:'flex-start', gap: 10,
                  padding: '7px 0', cursor:'pointer',
                  borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
                }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: 6,
                    background: on ? T.ink : T.bg,
                    border: `1.5px solid ${on ? T.ink : T.hairlineStrong}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: T.bg, marginTop: 1,
                  }}>{on && Icon.check(T.bg)}</span>
                  <span style={{
                    fontSize: 13, lineHeight: 1.35,
                    color: on ? T.muted : T.ink2,
                    textDecoration: on ? 'line-through' : 'none',
                  }}>{it}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Notes panel (open items + coaches)
// ─────────────────────────────────────────────────────────────
function NotesPanel() {
  const T = TOKENS;
  return (
    <div style={{ padding: '14px 18px 24px' }}>
      <SectionTitle>Open items</SectionTitle>
      <div style={{
        background: T.surface, borderRadius: T.rLg,
        border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
        overflow:'hidden',
      }}>
        {TOURNAMENT.openItems.map((o, i) => (
          <div key={i} style={{
            padding: '14px 16px',
            borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
          }}>
            <div style={{
              fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
              color: T.muted, letterSpacing: 1.0, textTransform:'uppercase',
              marginBottom: 4,
            }}>{o.who}</div>
            <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.45 }}>{o.what}</div>
          </div>
        ))}
      </div>

      <SectionTitle style={{ marginTop: 22 }}>The plan</SectionTitle>
      <div style={{
        background: T.surface, borderRadius: T.rLg,
        border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
        padding: '14px 16px', fontSize: 12.5, color: T.muted, lineHeight: 1.55,
      }}>
        Plan generated May 18, 2026. Adjust departure times once both coaches send formal arrival / meeting instructions. Tap any event on the schedule to pull up directions and notes.
      </div>
    </div>
  );
}

function SectionTitle({ children, style }) {
  const T = TOKENS;
  return (
    <div style={{
      fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
      color: T.muted, letterSpacing: 1.4, textTransform:'uppercase',
      marginBottom: 10, ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tabs
// ─────────────────────────────────────────────────────────────
function BottomTabs({ tab, setTab }) {
  const T = TOKENS;
  const tabs = [
    { id:'schedule', label:'Schedule', icon: Icon.cal },
    { id:'venues',   label:'Venues',   icon: Icon.pin },
    { id:'pack',     label:'Pack',     icon: Icon.bag },
    { id:'notes',    label:'Notes',    icon: Icon.note },
  ];
  return (
    <div style={{
      flexShrink: 0, paddingBottom: 30,
      background: 'rgba(247,244,238,0.9)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${T.hairline}`,
      display:'flex', justifyContent:'space-around',
      paddingTop: 8,
    }}>
      {tabs.map(t => {
        const on = tab === t.id;
        const c = on ? T.ink : T.mutedSoft;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border:0, background:'transparent', cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            padding: '4px 10px', color: c,
          }}>
            {t.icon(c)}
            <span style={{
              fontSize: 10.5, fontWeight: on ? 700 : 500,
              letterSpacing: 0.2, color: c,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile app shell
// ─────────────────────────────────────────────────────────────
function MobileApp({ initialTab = 'schedule', initialDay, simulatedNow }) {
  const T = TOKENS;
  const sNow = simulatedNow || TOURNAMENT.simulatedNow;
  const [dayId, setDayId] = React.useState(initialDay || sNow.day);
  const [tab, setTab]     = React.useState(initialTab);
  const [expanded, setExpanded] = React.useState(null);
  const day = TOURNAMENT.days.find(d => d.id === dayId);

  return (
    <div style={{
      height: '100%', display:'flex', flexDirection:'column',
      background: T.bg, fontFamily: T.font, color: T.ink,
    }}>
      {tab === 'schedule' && (
        <Header dayId={dayId} setDayId={setDayId} day={day} simulatedNow={sNow} />
      )}
      {tab !== 'schedule' && <TopBar title={({venues:'Venues', pack:'Packing', notes:'Notes'})[tab]} />}

      <div style={{ flex: 1, overflowY: 'auto', overflowX:'hidden' }}>
        {tab === 'schedule' && (
          <>
            <UpNext day={day} simulatedNow={sNow}
              onOpen={(id) => setExpanded(id)} />
            <HeroAction day={day} />
            <Timeline day={day} expanded={expanded} setExpanded={setExpanded} simulatedNow={sNow} />
          </>
        )}
        {tab === 'venues' && <VenuesPanel />}
        {tab === 'pack'   && <PackPanel />}
        {tab === 'notes'  && <NotesPanel />}
      </div>

      <BottomTabs tab={tab} setTab={setTab} />
    </div>
  );
}

function TopBar({ title }) {
  const T = TOKENS;
  return (
    <div style={{
      paddingTop: 58, paddingBottom: 14,
      paddingLeft: 18, paddingRight: 18,
      background: T.bg, flexShrink: 0,
      borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div style={{
        fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 500,
        letterSpacing: 1.6, color: T.muted, textTransform:'uppercase',
        marginBottom: 6,
      }}>LMFC · Memorial Day Weekend</div>
      <div style={{
        fontFamily: T.font, fontSize: 30, fontWeight: 600, color: T.ink,
        letterSpacing: -0.8, lineHeight: 1,
      }}>{title}</div>
    </div>
  );
}

Object.assign(window, {
  MobileApp, Timeline, UpNext, HeroAction, Header, BottomTabs,
  VenuesPanel, PackPanel, NotesPanel, SectionTitle,
  GameCard, TravelChip, LaneHeader, Icon,
});
