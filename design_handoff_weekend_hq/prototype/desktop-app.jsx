// Desktop prototype — weekend-at-a-glance: both days side by side,
// left rail with up-next + venues. Reuses Timeline & primitives from mobile-app.jsx.

const { useState: useStateD, useEffect: useEffectD } = React;

function DesktopApp({ simulatedNow }) {
  const T = TOKENS;
  const sNow = simulatedNow || TOURNAMENT.simulatedNow;
  const [expanded, setExpanded] = useStateD(null);
  const [active,   setActive]   = useStateD('venues'); // sidebar tab: venues / pack / notes
  const sat = TOURNAMENT.days[0];
  const sun = TOURNAMENT.days[1];

  return (
    <div style={{
      minHeight: '100%', background: T.bg, color: T.ink,
      fontFamily: T.font,
    }}>
      <DesktopHeader sNow={sNow} />

      <div style={{
        display:'grid',
        gridTemplateColumns: '340px 1fr 1fr',
        gap: 24, padding: '24px 32px 40px',
        maxWidth: 1400, margin: '0 auto',
        alignItems:'start',
      }}>
        {/* Left rail */}
        <div style={{ display:'flex', flexDirection:'column', gap: 16, position:'sticky', top: 24 }}>
          <DesktopUpNext sNow={sNow} setExpanded={setExpanded} />
          <DesktopHeroes day={sat} />
          <DesktopSidePicker active={active} setActive={setActive} />
          {active === 'venues' && <DesktopVenues />}
          {active === 'pack'   && <DesktopPack />}
          {active === 'notes'  && <DesktopNotes />}
        </div>

        {/* Saturday column */}
        <DayColumn day={sat} expanded={expanded} setExpanded={setExpanded} simulatedNow={sNow} />

        {/* Sunday column */}
        <DayColumn day={sun} expanded={expanded} setExpanded={setExpanded} simulatedNow={sNow} />
      </div>
    </div>
  );
}

function DesktopHeader({ sNow }) {
  const T = TOKENS;
  const day = TOURNAMENT.days.find(d => d.id === sNow.day);
  return (
    <div style={{
      position:'sticky', top: 0, zIndex: 50,
      background: 'rgba(247,244,238,0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: `1px solid ${T.hairline}`,
      padding: '14px 32px',
      display:'flex', alignItems:'center', gap: 24,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: T.ink, color: T.bg,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
        letterSpacing: 0.4,
      }}>LM</div>
      <div>
        <div style={{
          fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.2,
          lineHeight: 1.1,
        }}>LMFC Memorial Day Weekend</div>
        <div style={{
          fontFamily: T.fontMono, fontSize: 11, color: T.muted,
          letterSpacing: 0.4, marginTop: 1,
        }}>May 23 – 24, 2026 · Sofia &amp; Max · Solo</div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        display:'flex', alignItems:'center', gap: 10,
        padding: '6px 12px', borderRadius: 999,
        background: T.warnTint, border: `1px solid ${T.warnBg}`,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: 999, background: T.warn,
          boxShadow: `0 0 0 4px ${T.warnBg}`,
        }} />
        <span style={{
          fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
          color: T.warn, letterSpacing: 0.6, textTransform:'uppercase',
        }}>Now · {day.dow} {fmtTime(sNow.minute)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Up Next (desktop variant — taller, full info)
// ─────────────────────────────────────────────────────────────
function DesktopUpNext({ sNow, setExpanded }) {
  const T = TOKENS;
  const day = TOURNAMENT.days.find(d => d.id === sNow.day);
  const upcoming = day.events.filter(e => (e.kind === 'game' || e.kind === 'dinner') && e.attending !== false && e.start >= sNow.minute - 5);
  if (!upcoming.length) return null;
  const next = upcoming[0];
  const col = kidColor(next.lane);
  const mins = next.start - sNow.minute;

  return (
    <div style={{
      background: T.surface, borderRadius: TOKENS.rXl,
      boxShadow: T.shadow, border: `1px solid ${T.hairline}`,
      padding: 0, overflow:'hidden', position:'relative',
    }}>
      {/* color band */}
      <div style={{
        height: 6, background: col.fg,
      }} />
      <div style={{ padding: '18px 20px 18px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap: 8, marginBottom: 14,
        }}>
          <span style={{
            fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
            color: T.muted, letterSpacing: 1.6, textTransform:'uppercase',
          }}>Up next</span>
          <span style={{
            padding: '3px 9px', background: col.fg, color: '#fff',
            borderRadius: 999, fontSize: 10, letterSpacing: 1,
            fontWeight: 700, textTransform:'uppercase', fontFamily: T.fontMono,
          }}>{fmtCountdown(mins)}</span>
        </div>

        <div style={{
          fontFamily: T.fontMono, fontSize: 38, fontWeight: 600,
          color: T.ink, letterSpacing: -1.4, lineHeight: 0.95,
        }}>{fmtTime(next.start).replace(/\s(AM|PM)/,'')}<span style={{ fontSize: 14, color: T.muted, marginLeft: 6, fontWeight:500 }}>{fmtTime(next.start).slice(-2)}</span></div>

        <div style={{
          fontSize: 18, fontWeight: 600, color: col.deep,
          letterSpacing: -0.3, lineHeight: 1.2, marginTop: 12,
        }}>{next.who} · {next.game}</div>
        <div style={{
          fontSize: 13, color: T.ink2, lineHeight: 1.4, marginTop: 4,
        }}>vs {next.opponent}</div>

        <div style={{
          marginTop: 14, padding: 12, background: col.tint,
          border: `1px solid ${col.bg}`,
          borderRadius: 10,
        }}>
          <div style={{
            fontSize: 11.5, color: T.muted, fontWeight: 600,
            letterSpacing: 0.2, marginBottom: 3,
          }}>{next.venue} · <span style={{ fontFamily: T.fontMono, fontWeight:700, color: col.deep }}>{next.field}</span></div>
          <div style={{ fontSize: 12, color: T.ink2 }}>{next.addr}</div>
        </div>

        <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
          <a href={mapsHref(next.addr)} target="_blank" rel="noopener" style={{
            flex: 1, padding: '10px 12px', textAlign:'center',
            background: T.ink, color: T.bg, borderRadius: 9,
            fontSize: 13, fontWeight: 600, textDecoration:'none',
          }}>Open in Maps →</a>
          <button onClick={() => setExpanded(next.id)} style={{
            padding:'10px 14px', background:'transparent',
            color: T.ink2, borderRadius: 9, fontSize: 13, fontWeight: 600,
            border: `1px solid ${T.hairlineStrong}`, cursor:'pointer',
          }}>Details</button>
        </div>
      </div>
    </div>
  );
}

function DesktopHeroes({ day }) {
  const actions = day.heroActions || (day.heroAction ? [day.heroAction] : []);
  if (!actions.length) return null;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
      {actions.map((a, i) => <DesktopHeroCard key={a.id || i} a={a} />)}
    </div>
  );
}

function DesktopHeroCard({ a }) {
  const T = TOKENS;
  return (
    <div style={{
      background: T.warnTint, border: `1px solid ${T.warnBg}`,
      borderRadius: T.rLg, padding: '14px 16px',
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap: 8, marginBottom: 10,
      }}>
        <span style={{ color: T.warn, display:'flex' }}>{Icon.warn(T.warn)}</span>
        <span style={{
          fontSize: 13, fontWeight: 700, color: T.warn, letterSpacing: 0.1,
        }}>{a.title}</span>
      </div>
      <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.5, marginBottom: 10 }}>{a.body}</div>
      <ol style={{ margin: 0, padding: 0, listStyle:'none' }}>
        {a.steps.map((s,i) => (
          <li key={i} style={{
            display:'flex', gap: 8, marginBottom: 6,
            fontSize: 12, color: T.ink2, lineHeight: 1.45,
          }}>
            <span style={{
              flexShrink:0, width: 16, height: 16, borderRadius: 999,
              background: T.warn, color: '#fff', fontFamily: T.fontMono,
              fontSize: 9.5, fontWeight: 700,
              display:'flex', alignItems:'center', justifyContent:'center', marginTop: 1,
            }}>{i+1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DesktopSidePicker({ active, setActive }) {
  const T = TOKENS;
  const opts = [
    { id:'venues', label:'Venues' },
    { id:'pack',   label:'Pack' },
    { id:'notes',  label:'Notes' },
  ];
  return (
    <div style={{
      display:'flex', padding: 3, background: T.surface2,
      borderRadius: 999, border: `1px solid ${T.hairline}`,
      gap: 2,
    }}>
      {opts.map(o => {
        const on = o.id === active;
        return (
          <button key={o.id} onClick={() => setActive(o.id)} style={{
            flex: 1, padding: '7px 10px', borderRadius: 999, border: 0,
            cursor:'pointer', background: on ? T.ink : 'transparent',
            color: on ? T.bg : T.ink2,
            fontFamily: T.font, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function DesktopVenues() {
  const T = TOKENS;
  return (
    <div style={{
      background: T.surface, borderRadius: T.rLg,
      border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
      overflow:'hidden',
    }}>
      {TOURNAMENT.venues.map((v, i) => {
        const col = kidColor(v.for);
        const tag = v.for === 'sofia' ? 'Sofia' : v.for === 'max' ? 'Max' : (v.tag || 'Home base');
        return (
          <div key={v.id} style={{
            padding: '14px 16px',
            borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
          }}>
            <div style={{
              display:'flex', alignItems:'center', gap: 7, marginBottom: 6,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: col.fg }} />
              <span style={{
                fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
                color: col.deep, letterSpacing: 1.2, textTransform:'uppercase',
              }}>{tag}</span>
            </div>
            <div style={{
              fontSize: 14.5, fontWeight: 600, color: T.ink, letterSpacing: -0.2,
              marginBottom: 4,
            }}>{v.name}</div>
            <a href={mapsHref(v.addr)} target="_blank" rel="noopener" style={{
              fontSize: 12, color: T.muted, lineHeight: 1.4, textDecoration:'none',
              display:'block', marginBottom: 10,
            }}>{v.addr} →</a>
            <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
              {v.slots.map((s, si) => (
                <div key={si} style={{
                  display:'flex', alignItems:'center', gap: 8,
                  fontSize: 12, color: T.ink2,
                }}>
                  <span style={{
                    fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
                    color: col.fg, letterSpacing: 0.4, width: 22,
                  }}>{s.day}</span>
                  <span style={{ fontFamily: T.fontMono, fontWeight: 600, width: 60 }}>{s.time}</span>
                  <span>{s.field}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div style={{
        padding: '12px 16px', background: T.surface2,
        borderTop: `1px solid ${T.hairline}`,
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
          color: T.muted, letterSpacing: 1.2, textTransform:'uppercase', marginBottom: 6,
        }}>Drive times</div>
        {(TOURNAMENT.driveRoutes || []).map((r, i) => (
          <div key={i} style={{
            display:'flex', gap: 8, alignItems:'baseline',
            fontSize: 11.5, color: T.ink2, padding:'3px 0',
          }}>
            <span style={{
              fontFamily: T.fontMono, fontWeight: 700, color: T.ink,
              minWidth: 46,
            }}>{r.mins} min</span>
            <span style={{ flex: 1 }}>{r.from} → {r.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopPack() {
  const T = TOKENS;
  return (
    <div style={{
      background: T.surface, borderRadius: T.rLg,
      border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
      overflow:'hidden',
    }}>
      {TOURNAMENT.packing.map((grp, gi) => (
        <div key={gi} style={{
          padding: '12px 16px',
          borderTop: gi === 0 ? 'none' : `1px solid ${T.hairline}`,
        }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
            color: T.muted, letterSpacing: 1.4, textTransform:'uppercase',
            marginBottom: 6,
          }}>{grp.group}</div>
          {grp.items.map((it, i) => (
            <div key={i} style={{
              fontSize: 12.5, color: T.ink2, lineHeight: 1.5,
              padding: '3px 0', display:'flex', gap: 8,
            }}>
              <span style={{ color: T.mutedSoft, flexShrink: 0 }}>·</span>
              <span>{it}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DesktopNotes() {
  const T = TOKENS;
  const items = TOURNAMENT.openItems || [];
  const asks = items.filter(o => o.kind === 'ask' || !o.kind);
  const fyis = items.filter(o => o.kind === 'fyi');
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
      <div style={{
        background: T.surface, borderRadius: T.rLg,
        border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
        overflow:'hidden',
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
          color: T.warn, letterSpacing: 1.4, textTransform:'uppercase',
          padding: '10px 16px 4px',
        }}>● Asks</div>
        {asks.map((o, i) => (
          <div key={i} style={{
            padding: '10px 16px', position:'relative',
            borderTop: `1px solid ${T.hairline}`,
          }}>
            <div style={{
              position:'absolute', left: 0, top: 12, bottom: 12, width: 2.5,
              background: T.warn,
            }} />
            <div style={{
              fontSize: 12.5, fontWeight: 700, color: T.ink,
              marginBottom: 3, letterSpacing: -0.1,
            }}>{o.who}</div>
            <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.4 }}>{o.what}</div>
          </div>
        ))}
      </div>
      {fyis.length > 0 && (
        <div style={{
          background: T.surface, borderRadius: T.rLg,
          border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
          overflow:'hidden',
        }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
            color: T.muted, letterSpacing: 1.4, textTransform:'uppercase',
            padding: '10px 16px 4px',
          }}>○ For your information</div>
          {fyis.map((o, i) => (
            <div key={i} style={{
              padding: '10px 16px',
              borderTop: `1px solid ${T.hairline}`,
            }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: 10, fontWeight: 700,
                color: T.muted, letterSpacing: 1.0, textTransform:'uppercase',
                marginBottom: 3,
              }}>{o.who}</div>
              <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.4 }}>{o.what}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Day column with full dual-lane timeline
// ─────────────────────────────────────────────────────────────
function DayColumn({ day, expanded, setExpanded, simulatedNow }) {
  const T = TOKENS;
  const games = day.events.filter(e => e.kind === 'game');
  const dinners = day.events.filter(e => e.kind === 'dinner');
  const all = [...games, ...dinners];
  const attended = all.filter(e => e.attending !== false).length;
  const isCurrentDay = simulatedNow.day === day.id;

  return (
    <div style={{
      background: T.surface, borderRadius: T.rLg,
      border: `1px solid ${T.hairline}`, boxShadow: T.shadow,
      padding: '20px 18px 18px', position:'relative',
    }}>
      <div style={{
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        marginBottom: 16, gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 600,
            color: T.muted, letterSpacing: 1.6, textTransform:'uppercase',
            marginBottom: 4,
          }}>{day.dow}</div>
          <div style={{
            fontFamily: T.font, fontSize: 26, fontWeight: 600, color: T.ink,
            letterSpacing: -0.6, lineHeight: 1,
          }}>{day.date}</div>
        </div>
        <div style={{
          display:'flex', gap: 10, alignItems:'center',
          fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 500,
          color: T.muted, letterSpacing: 0.6, textTransform:'uppercase',
        }}>
          <span><b style={{ color: T.ink, fontWeight: 700 }}>{games.length}</b> games</span>
          {dinners.length > 0 && <>
            <span style={{ color: T.hairlineStrong }}>·</span>
            <span><b style={{ color: T.ink, fontWeight: 700 }}>{dinners.length}</b> dinner{dinners.length>1?'s':''}</span>
          </>}
          <span style={{ color: T.hairlineStrong }}>·</span>
          <span><b style={{ color: T.ink, fontWeight: 700 }}>{attended}</b> attending</span>
          {day.conflicts.length > 0 && (
            <>
              <span style={{ color: T.hairlineStrong }}>·</span>
              <span style={{ color: T.warn, fontWeight: 700 }}>1 conflict</span>
            </>
          )}
          {isCurrentDay && (
            <span style={{
              padding:'3px 7px', background: T.warnTint, color: T.warn,
              borderRadius: 4, fontWeight: 700, letterSpacing: 0.8,
            }}>Today</span>
          )}
        </div>
      </div>

      <Timeline day={day} expanded={expanded} setExpanded={setExpanded}
                simulatedNow={simulatedNow} pxPerMin={1.2} />
    </div>
  );
}

Object.assign(window, { DesktopApp });
