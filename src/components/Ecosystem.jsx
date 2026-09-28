import { useMemo, useRef, useState } from 'react'
import { services } from '../data/services'
import { site } from '../data/site'
import { MARK_SRC } from './Logo'
import { gsap, revealIn, useGSAP, useIsMobile } from '../lib/motion'

export default function Ecosystem({ onOpen }) {
  const root = useRef(null)
  const isMobile = useIsMobile()
  const [hover, setHover] = useState(-1)

  // Desktop: services orbit the hub. Mobile: a tree — hub on top, branches alternating left/right.
  const view = isMobile ? { w: 400, h: 760, rx: 0, ry: 0, font: 17 } : { w: 1100, h: 660, rx: 430, ry: 240, font: 15 }
  const cx = view.w / 2
  const cy = isMobile ? 90 : view.h / 2

  const nodes = useMemo(
    () =>
      services.map((s, i) => {
        if (isMobile) return { ...s, x: i % 2 ? 252 : 148, y: 230 + i * 54, i }
        const a = (i / services.length) * Math.PI * 2 - Math.PI / 2
        return { ...s, x: cx + Math.cos(a) * view.rx, y: cy + Math.sin(a) * view.ry, i }
      }),
    [cx, cy, view.rx, view.ry, isMobile],
  )

  // Decorative background nodes — the wider network everything lives in.
  const dust = useMemo(() => {
    const out = []
    for (let i = 0; i < (isMobile ? 0 : 34); i++) {
      const a = i * 2.399963
      const r = 0.35 + (((i * 37) % 100) / 100) * 0.85
      if (isMobile) out.push({ x: 20 + ((i * 97) % 360), y: 170 + ((i * 131) % 520) })
      else out.push({ x: cx + Math.cos(a) * view.rx * r * 1.15, y: cy + Math.sin(a) * view.ry * r * 1.15 })
    }
    return out
  }, [cx, cy, view.rx, view.ry, isMobile])

  useGSAP(
    () => {
      revealIn(root.current)
      gsap.from('[data-link]', {
        strokeDashoffset: 1,
        duration: 1.6,
        ease: 'power3.inOut',
        stagger: 0.06,
        scrollTrigger: { trigger: '[data-map]', start: 'top 70%', once: true },
      })
      gsap.from('[data-node]', {
        scale: 0,
        transformOrigin: 'center',
        duration: 0.9,
        ease: 'back.out(2)',
        stagger: 0.07,
        delay: 0.6,
        scrollTrigger: { trigger: '[data-map]', start: 'top 70%', once: true },
      })
    },
    { scope: root, dependencies: [isMobile], revertOnUpdate: true },
  )

  // Label placement: beside the node on mobile, above/below on desktop.
  const labelPos = (n) => {
    if (isMobile) {
      const right = n.x > cx
      return { x: n.x + (right ? 32 : -32), y: n.y + 1, sub: n.y + 20, anchor: right ? 'start' : 'end' }
    }
    const below = n.y >= cy
    return { x: n.x, y: below ? n.y + 50 : n.y - 56, sub: below ? n.y + 69 : n.y - 37, anchor: 'middle' }
  }

  return (
    <section ref={root} className="relative overflow-hidden py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p data-reveal className="eyebrow">Ecosystem</p>
            <h2 data-reveal className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Ten services,
              <br />
              <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">one</em> network.
            </h2>
          </div>
          <p data-reveal className="max-w-md leading-relaxed text-white/55 md:justify-self-end">
            Most products combine several of these — a token needs a DEX, an exchange needs wallets. Select any node to see what it includes.
          </p>
        </div>

        <svg data-map viewBox={`0 0 ${view.w} ${view.h}`} className="mt-10 h-auto w-full overflow-visible" role="group" aria-label="Service ecosystem">
          <defs>
            <radialGradient id="hubGlow">
              <stop offset="0%" stopColor="#ff5b24" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff5b24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {dust.map((d, i) => (
            <g key={i}>
              <line x1={d.x} y1={d.y} x2={nodes[i % nodes.length].x} y2={nodes[i % nodes.length].y} stroke="#fff" strokeOpacity={i % 3 ? 0 : 0.05} />
              <circle cx={d.x} cy={d.y} r="2" fill="#fff" fillOpacity="0.25" />
            </g>
          ))}

          {!isMobile && <ellipse cx={cx} cy={cy} rx={view.rx} ry={view.ry} fill="none" stroke="#fff" strokeOpacity="0.08" strokeDasharray="2 8" />}

          {/* mobile: the trunk of the tree */}
          {isMobile && (
            <line data-link x1={cx} y1={cy + 48} x2={cx} y2={nodes[nodes.length - 1].y} pathLength="1" strokeDasharray="1" stroke="#ff5b24" strokeOpacity="0.45" strokeWidth="1.5" />
          )}

          {nodes.map((n, i) => {
            const hot = hover === i
            // Desktop: straight spoke from the hub. Mobile: down the trunk, then along a branch.
            const route = isMobile ? `M${cx},${cy + 48} V${n.y} H${n.x}` : `M${cx},${cy} L${n.x},${n.y}`
            const nx = nodes[(i + 1) % nodes.length]
            return (
              <g key={n.id}>
                <path
                  data-link
                  d={isMobile ? `M${cx},${n.y} H${n.x}` : route}
                  pathLength="1"
                  strokeDasharray="1"
                  fill="none"
                  stroke={hot ? '#ff5b24' : '#fff'}
                  strokeOpacity={hot ? 0.9 : isMobile ? 0.3 : 0.16}
                  strokeWidth={hot ? 1.5 : 1}
                  style={{ transition: 'stroke .3s, stroke-opacity .3s' }}
                />
                {!isMobile && <line data-link x1={n.x} y1={n.y} x2={nx.x} y2={nx.y} pathLength="1" strokeDasharray="1" stroke="#fff" strokeOpacity="0.1" />}
                {isMobile && <circle cx={cx} cy={n.y} r="3" fill="#ff5b24" />}
                <circle r="3" fill="#ff5b24">
                  <animateMotion dur={`${2.4 + (i % 5) * 0.4}s`} repeatCount="indefinite" path={route} />
                </circle>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r="120" fill="url(#hubGlow)" />
          <circle cx={cx} cy={cy} r="66" fill="none" stroke="#ff5b24" strokeOpacity="0.5" strokeDasharray="3 6">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="30s" repeatCount="indefinite" />
          </circle>
          {/* the hub is the logo itself — no text; a dark disc keeps spokes from showing through it */}
          <circle cx={cx} cy={cy} r="40" fill="#0b0b0e" />
          <image href={MARK_SRC} x={cx - 46} y={cy - 46} width="92" height="92">
            <title>{site.brand}</title>
          </image>

          {nodes.map((n) => {
            const l = labelPos(n)
            const hot = hover === n.i
            return (
              <g
                key={n.id}
                data-node
                role="button"
                tabIndex={0}
                aria-label={`${n.title} — open details`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHover(n.i)}
                onMouseLeave={() => setHover(-1)}
                onFocus={() => setHover(n.i)}
                onBlur={() => setHover(-1)}
                onClick={() => onOpen(n.i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(n.i)}
              >
                <circle cx={n.x} cy={n.y} r="22" fill="#0f0f13" stroke={hot ? '#ff5b24' : 'rgba(255,255,255,.25)'} style={{ transition: 'stroke .3s' }} />
                <circle cx={n.x} cy={n.y} r={hot ? 8 : 5} fill={hot ? '#ff5b24' : '#fff'} style={{ transition: 'all .3s' }} />
                <text x={l.x} y={l.y} textAnchor={l.anchor} fill={hot ? '#ff8a5c' : '#fff'} fontSize={view.font + 1} fontWeight="600" style={{ transition: 'fill .3s' }}>
                  {n.short}
                </text>
                <text x={l.x} y={l.sub} textAnchor={l.anchor} fill="#8b8b96" fontSize={view.font - 4} fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                  {String(n.i + 1).padStart(2, '0')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
