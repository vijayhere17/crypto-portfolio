import { useId, useMemo } from 'react'
import { mulberry32 } from '../lib/motion'

/*
 * Original, code-drawn illustrations for each service. Every visual is an
 * 800×500 SVG scene over a tinted backdrop, so it stays crisp at any size.
 * Set `image` on a service to show a real screenshot instead.
 */

const C = {
  panel: '#15151b',
  deep: '#0d0d11',
  chip: '#22222a',
  line: 'rgba(255,255,255,.1)',
  mute: '#8b8b96',
  text: '#f4f4f6',
  accent: '#ff5b24',
  accentSoft: '#ff8a5c',
  green: '#34d399',
  red: '#f87171',
  btc: '#f7931a',
  eth: '#627eea',
  usdt: '#26a17b',
  bnb: '#f3ba2f',
}
const MONO = 'JetBrains Mono, ui-monospace, monospace'

const Panel = ({ r = 14, ...p }) => <rect rx={r} fill={C.panel} stroke={C.line} {...p} />

function T({ size = 13, fill = C.text, weight = 500, mono, anchor = 'start', children, ...p }) {
  return (
    <text fontSize={size} fill={fill} fontWeight={weight} fontFamily={mono ? MONO : 'inherit'} textAnchor={anchor} {...p}>
      {children}
    </text>
  )
}

function Coin({ cx, cy, r = 12, color, sym }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <T x={cx} y={cy + r * 0.36} size={r * 0.95} weight={700} anchor="middle" fill="#fff">
        {sym}
      </T>
    </g>
  )
}

/* ── 01 Blockchain ─────────────────────────────────────────── */
function Cube({ cx, cy, s, lit }) {
  const h = s * 0.866
  const f = lit ? ['#ff8a5c', '#ff5b24', '#c2410c'] : ['#2c2c35', '#1c1c23', '#141419']
  return (
    <g stroke="rgba(255,255,255,.16)" strokeLinejoin="round">
      <polygon points={`${cx},${cy - s} ${cx + h},${cy - s / 2} ${cx},${cy} ${cx - h},${cy - s / 2}`} fill={f[0]} />
      <polygon points={`${cx - h},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx - h},${cy + s / 2}`} fill={f[1]} />
      <polygon points={`${cx},${cy} ${cx + h},${cy - s / 2} ${cx + h},${cy + s / 2} ${cx},${cy + s}`} fill={f[2]} />
    </g>
  )
}

function Blockchain() {
  const pts = [
    [130, 250],
    [265, 212],
    [400, 250],
    [535, 212],
    [670, 250],
  ]
  const path = 'M' + pts.map((p) => p.join(',')).join(' L')
  const hashes = ['3fa1', '9c07', 'e44b', '71d2', 'b80e']
  return (
    <>
      <T x={60} y={70} size={11} mono fill={C.mute} letterSpacing="2">NETWORK · MAINNET</T>
      <T x={740} y={70} size={11} mono fill={C.green} anchor="end">● SYNCED</T>
      <path d={path} fill="none" stroke={C.accent} strokeOpacity=".55" strokeWidth="2" strokeDasharray="6 6" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <Cube cx={x} cy={y} s={54} lit={i === 2} />
          <T x={x} y={y + 88} size={11} mono anchor="middle" fill={i === 2 ? C.accentSoft : C.text}>
            #{1204329 + i}
          </T>
          <T x={x} y={y + 106} size={10} mono anchor="middle" fill={C.mute}>
            0x{hashes[i]}…
          </T>
        </g>
      ))}
      <circle r="5" fill="#fff">
        <animateMotion dur="5s" repeatCount="indefinite" path={path} />
      </circle>
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={330 + i * 24} cy={440} r="5" fill={i < 5 ? C.accent : '#2c2c35'} />
        ))}
        <T x={400} y={470} size={10} mono anchor="middle" fill={C.mute}>VALIDATORS</T>
      </g>
    </>
  )
}

/* ── 02 dApp ───────────────────────────────────────────────── */
function DApp() {
  const calls = [
    ['approve(spender)', '✓', C.green],
    ['stake(1000)', '✓', C.green],
    ['claimRewards()', 'pending', C.accentSoft],
    ['vote(proposal #7)', 'queued', C.mute],
  ]
  return (
    <>
      <Panel x={60} y={40} width={680} height={420} r={18} />
      <line x1={60} x2={740} y1={82} y2={82} stroke={C.line} />
      {[84, 102, 120].map((x) => (
        <circle key={x} cx={x} cy={61} r={5} fill="#34343d" />
      ))}
      <rect x={260} y={50} width={280} height={22} rx={11} fill={C.deep} />
      <T x={400} y={65} size={11} mono anchor="middle" fill={C.mute}>🔒 app.yourdapp.io</T>
      <rect x={585} y={50} width={138} height={22} rx={11} fill="rgba(255,91,36,.12)" stroke={C.accent} strokeOpacity=".6" />
      <circle cx={600} cy={61} r={4} fill={C.green} />
      <T x={612} y={65} size={11} mono>0x7a3…9f2c</T>

      <Panel x={90} y={105} width={300} height={330} fill="#111116" />
      <T x={114} y={140} size={18} weight={700}>Stake</T>
      <T x={114} y={175} size={11} fill={C.mute}>Amount</T>
      <rect x={114} y={185} width={252} height={48} rx={10} fill={C.deep} stroke={C.line} />
      <T x={130} y={216} size={20} weight={600}>1,000</T>
      <rect x={296} y={198} width={58} height={22} rx={11} fill={C.chip} />
      <T x={325} y={213} size={10} weight={700} anchor="middle">TOKEN</T>
      <T x={114} y={268} size={11} fill={C.mute}>Est. APY</T>
      <T x={114} y={300} size={26} weight={700} fill={C.accentSoft}>12.5%</T>
      <T x={250} y={268} size={11} fill={C.mute}>Lock period</T>
      <T x={250} y={300} size={18} weight={600}>30 days</T>
      <rect x={114} y={350} width={252} height={48} rx={24} fill={C.accent} />
      <T x={240} y={379} size={14} weight={700} anchor="middle" fill="#111">Stake now</T>

      <Panel x={410} y={105} width={300} height={330} fill="#111116" />
      <T x={434} y={140} size={16} weight={700}>Contract calls</T>
      {calls.map(([fn, st, col], i) => (
        <g key={fn}>
          <rect x={434} y={162 + i * 52} width={252} height={40} rx={8} fill={C.deep} />
          <T x={448} y={187 + i * 52} size={11} mono>{fn}</T>
          <T x={674} y={187 + i * 52} size={11} mono anchor="end" fill={col}>{st}</T>
        </g>
      ))}
      <T x={434} y={400} size={10} mono fill={C.mute}>gas · 0.0021 BNB</T>
    </>
  )
}

/* ── 03 Wallet ─────────────────────────────────────────────── */
function Wallet() {
  const tokens = [
    ['Bitcoin', 'BTC', '0.0842', '$5,680', C.btc, '₿'],
    ['Ethereum', 'ETH', '1.204', '$4,055', C.eth, 'Ξ'],
    ['Tether', 'USDT', '2,410.00', '$2,410', C.usdt, '₮'],
    ['BNB', 'BNB', '0.58', '$335', C.bnb, 'B'],
  ]
  return (
    <>
      <rect x={290} y={18} width={220} height={464} rx={34} fill={C.deep} stroke="rgba(255,255,255,.2)" strokeWidth="2" />
      <rect x={365} y={30} width={70} height={14} rx={7} fill="#1c1c22" />
      <T x={400} y={86} size={11} anchor="middle" fill={C.mute}>Total balance</T>
      <T x={400} y={118} size={26} weight={700} anchor="middle">$12,480.52</T>
      <T x={400} y={138} size={11} anchor="middle" fill={C.green}>▲ 2.4% today</T>
      {[
        ['↑', 'Send'],
        ['↓', 'Receive'],
        ['⇄', 'Swap'],
      ].map(([icon, label], i) => (
        <g key={label}>
          <circle cx={340 + i * 60} cy={180} r={18} fill={i === 0 ? C.accent : '#1f1f27'} />
          <T x={340 + i * 60} y={186} size={16} weight={700} anchor="middle" fill={i === 0 ? '#111' : C.text}>{icon}</T>
          <T x={340 + i * 60} y={216} size={10} anchor="middle" fill={C.mute}>{label}</T>
        </g>
      ))}
      {tokens.map(([name, sym, amt, usd, col, glyph], i) => {
        const y = 262 + i * 50
        return (
          <g key={sym}>
            <line x1={306} x2={494} y1={y - 26} y2={y - 26} stroke={C.line} />
            <Coin cx={320} cy={y} r={13} color={col} sym={glyph} />
            <T x={342} y={y - 2} size={12} weight={700}>{name}</T>
            <T x={342} y={y + 13} size={10} fill={C.mute}>{sym}</T>
            <T x={494} y={y - 2} size={12} weight={600} anchor="end">{amt}</T>
            <T x={494} y={y + 13} size={10} anchor="end" fill={C.mute}>{usd}</T>
          </g>
        )
      })}

      <Panel x={60} y={120} width={200} height={84} />
      <rect x={82} y={158} width={22} height={17} rx={3} fill={C.accent} />
      <path d="M87,158 v-6 a6,6 0 0 1 12,0 v6" fill="none" stroke={C.accent} strokeWidth="2.5" />
      <T x={118} y={157} size={13} weight={700}>Seed phrase</T>
      <T x={118} y={177} size={11} fill={C.mute}>Secured · non-custodial</T>

      <Panel x={545} y={290} width={200} height={104} />
      <T x={565} y={318} size={11} fill={C.mute}>Networks</T>
      {['ETH', 'BSC', 'POLYGON', 'TRON'].map((n, i) => {
        const w = n.length * 8 + 20
        const x = 565 + (i % 2 ? (i === 1 ? 58 : 90) : 0)
        const y = i < 2 ? 332 : 362
        return (
          <g key={n}>
            <rect x={x} y={y} width={w} height={22} rx={11} fill={C.chip} />
            <T x={x + w / 2} y={y + 15} size={10} weight={600} anchor="middle">{n}</T>
          </g>
        )
      })}
    </>
  )
}

/* ── 04 DEX ────────────────────────────────────────────────── */
function Dex() {
  const box = (y, label, amount, col, sym, glyph) => (
    <g>
      <rect x={252} y={y} width={296} height={100} rx={14} fill={C.deep} />
      <T x={270} y={y + 26} size={11} fill={C.mute}>{label}</T>
      <T x={270} y={y + 72} size={30} weight={700}>{amount}</T>
      <rect x={434} y={y + 45} width={98} height={34} rx={17} fill={C.chip} />
      <Coin cx={455} cy={y + 62} r={11} color={col} sym={glyph} />
      <T x={473} y={y + 67} size={13} weight={700}>{sym}</T>
    </g>
  )
  return (
    <>
      <Panel x={230} y={36} width={340} height={428} r={22} />
      <T x={256} y={74} size={18} weight={700}>Swap</T>
      <T x={544} y={74} size={16} anchor="end" fill={C.mute}>⚙</T>
      {box(96, 'You pay', '1.25', C.eth, 'ETH', 'Ξ')}
      {box(226, 'You receive', '4,210.80', C.usdt, 'USDT', '₮')}
      <circle cx={400} cy={211} r={20} fill={C.accent} stroke={C.panel} strokeWidth="6" />
      <T x={400} y={218} size={18} weight={700} anchor="middle" fill="#111">↓</T>
      <T x={270} y={356} size={10} mono fill={C.mute}>1 ETH = 3,368.64 USDT</T>
      <T x={530} y={356} size={10} mono anchor="end" fill={C.mute}>fee 0.3%</T>
      <rect x={252} y={378} width={296} height={52} rx={26} fill={C.accent} />
      <T x={400} y={410} size={16} weight={700} anchor="middle" fill="#111">Swap</T>

      <Panel x={48} y={150} width={164} height={118} />
      <T x={66} y={176} size={11} fill={C.mute}>Liquidity pool</T>
      <T x={66} y={200} size={14} weight={700}>ETH / USDT</T>
      <rect x={66} y={216} width={128} height={8} rx={4} fill={C.usdt} />
      <rect x={66} y={216} width={64} height={8} rx={4} fill={C.eth} />
      <T x={66} y={250} size={10} mono fill={C.mute}>50 / 50 · AMM</T>

      <Panel x={590} y={276} width={164} height={104} />
      <T x={608} y={302} size={11} fill={C.mute}>Your LP tokens</T>
      <T x={608} y={330} size={18} weight={700}>1,240.5</T>
      <T x={608} y={356} size={11} fill={C.green}>+18.2 earned</T>
    </>
  )
}

/* ── 05 CEX ────────────────────────────────────────────────── */
function Cex() {
  const { candles, asks, bids } = useMemo(() => {
    const rng = mulberry32(7)
    let p = 50
    const raw = Array.from({ length: 30 }, () => {
      const o = p
      const c = o + (rng() - 0.42) * 9
      const h = Math.max(o, c) + rng() * 4
      const l = Math.min(o, c) - rng() * 4
      p = c
      return { o, c, h, l, v: 0.25 + rng() * 0.75 }
    })
    const min = Math.min(...raw.map((k) => k.l))
    const max = Math.max(...raw.map((k) => k.h))
    const y = (v) => 350 - ((v - min) / (max - min)) * 240
    const candles = raw.map((k) => ({ ...k, yo: y(k.o), yc: y(k.c), yh: y(k.h), yl: y(k.l) }))
    const book = (n, seed) => {
      const r = mulberry32(seed)
      return Array.from({ length: n }, () => ({ amt: (r() * 1.8 + 0.05).toFixed(4), depth: 20 + r() * 150 }))
    }
    return { candles, asks: book(7, 3), bids: book(7, 9) }
  }, [])

  return (
    <>
      <T x={40} y={46} size={16} weight={700}>BTC / USDT</T>
      <T x={160} y={46} size={16} weight={700} fill={C.green}>67,420.15</T>
      <T x={262} y={46} size={12} fill={C.green}>+1.82%</T>
      <T x={340} y={46} size={11} mono fill={C.mute}>24h high 68,105 · low 65,870</T>

      <Panel x={30} y={64} width={500} height={410} />
      {[120, 180, 240, 300].map((y) => (
        <line key={y} x1={30} x2={530} y1={y} y2={y} stroke="rgba(255,255,255,.04)" />
      ))}
      {candles.map((k, i) => {
        const x = 52 + i * 15.6
        const up = k.c >= k.o
        const col = up ? C.green : C.red
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={k.yh} y2={k.yl} stroke={col} strokeWidth="1.2" />
            <rect x={x - 4.5} y={Math.min(k.yo, k.yc)} width={9} height={Math.max(2, Math.abs(k.yo - k.yc))} fill={col} rx="1" />
            <rect x={x - 4.5} y={460 - k.v * 60} width={9} height={k.v * 60} fill={col} opacity=".25" />
          </g>
        )
      })}

      <Panel x={545} y={64} width={225} height={410} />
      <T x={563} y={92} size={13} weight={700}>Order book</T>
      <T x={563} y={114} size={10} fill={C.mute}>Price (USDT)</T>
      <T x={752} y={114} size={10} anchor="end" fill={C.mute}>Amount</T>
      {asks.map((a, i) => (
        <g key={'a' + i}>
          <rect x={762 - a.depth} y={124 + i * 20} width={a.depth} height={16} fill={C.red} opacity=".1" />
          <T x={563} y={136 + i * 20} size={11} mono fill={C.red}>{(67560 - i * 20).toLocaleString('en-US')}.{i}0</T>
          <T x={752} y={136 + i * 20} size={11} mono anchor="end" fill={C.mute}>{a.amt}</T>
        </g>
      ))}
      <T x={563} y={286} size={15} weight={700} fill={C.green}>67,420.15 ↑</T>
      {bids.map((b, i) => (
        <g key={'b' + i}>
          <rect x={762 - b.depth} y={300 + i * 20} width={b.depth} height={16} fill={C.green} opacity=".1" />
          <T x={563} y={312 + i * 20} size={11} mono fill={C.green}>{(67400 - i * 20).toLocaleString('en-US')}.{i}5</T>
          <T x={752} y={312 + i * 20} size={11} mono anchor="end" fill={C.mute}>{b.amt}</T>
        </g>
      ))}
    </>
  )
}

/* ── 06 NFT ────────────────────────────────────────────────── */
function Nft({ uid }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b0764" />
          <stop offset="1" stopColor="#ff5b24" />
        </linearGradient>
        <radialGradient id={`${uid}sun`}>
          <stop offset="0" stopColor="#ffe3d3" />
          <stop offset=".5" stopColor="#ff8a5c" />
          <stop offset="1" stopColor="#ff5b24" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}clip`}>
          <rect x={296} y={51} width={208} height={250} rx={12} />
        </clipPath>
      </defs>
      <rect x={290} y={50} width={220} height={400} rx={18} fill="#17171d" stroke={C.line} transform="rotate(-11 400 250)" opacity=".7" />
      <rect x={290} y={50} width={220} height={400} rx={18} fill="#17171d" stroke={C.line} transform="rotate(9 400 250)" opacity=".85" />
      <Panel x={280} y={35} width={240} height={430} r={20} />
      <g clipPath={`url(#${uid}clip)`}>
        <rect x={296} y={51} width={208} height={250} fill={`url(#${uid}bg)`} />
        <circle cx={400} cy={160} r={90} fill={`url(#${uid}sun)`} />
        {[40, 58, 76].map((r) => (
          <circle key={r} cx={400} cy={160} r={r} fill="none" stroke="#fff" strokeOpacity=".22" />
        ))}
        <path d="M296,301 L350,226 L392,268 L440,214 L504,301 Z" fill="#0d0d11" opacity=".85" />
        <path d="M296,301 L330,262 L372,301 Z" fill="#0d0d11" />
      </g>
      <T x={300} y={330} size={16} weight={700}>Genesis #0427</T>
      <T x={300} y={350} size={11} fill={C.mute}>Genesis Collection</T>
      <T x={300} y={386} size={10} fill={C.mute}>Price</T>
      <T x={300} y={406} size={15} weight={700}>0.08 ETH</T>
      <rect x={420} y={380} width={84} height={36} rx={18} fill={C.accent} />
      <T x={462} y={403} size={13} weight={700} anchor="middle" fill="#111">Mint</T>
      <T x={400} y={446} size={10} mono anchor="middle" fill={C.mute}>ERC-721 · IPFS</T>

      <Panel x={70} y={130} width={160} height={74} />
      <T x={90} y={158} size={11} fill={C.mute}>Creator royalties</T>
      <T x={90} y={186} size={20} weight={700}>7.5%</T>
      <Panel x={570} y={300} width={170} height={74} />
      <T x={590} y={328} size={11} fill={C.mute}>Minted</T>
      <T x={590} y={356} size={18} weight={700}>1,204 / 5,000</T>
    </>
  )
}

/* ── 07 NFT Marketplace ────────────────────────────────────── */
function Marketplace({ uid }) {
  const hues = [18, 300, 200, 40, 150, 262, 330, 190]
  return (
    <>
      <defs>
        {hues.map((h, i) => (
          <linearGradient key={i} id={`${uid}g${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${h} 85% 55%)`} />
            <stop offset="1" stopColor={`hsl(${h + 50} 70% 22%)`} />
          </linearGradient>
        ))}
      </defs>
      <T x={50} y={62} size={18} weight={700}>Explore collections</T>
      <rect x={480} y={42} width={270} height={32} rx={16} fill={C.deep} stroke={C.line} />
      <circle cx={502} cy={58} r={6} fill="none" stroke={C.mute} strokeWidth="1.5" />
      <T x={518} y={62} size={11} fill={C.mute}>Search items, collections…</T>
      {['Trending', 'Art', 'Gaming', 'Music'].map((t, i) => (
        <T key={t} x={50 + i * 80} y={100} size={12} weight={600} fill={i === 0 ? C.text : C.mute}>{t}</T>
      ))}
      <rect x={50} y={107} width={56} height={2} fill={C.accent} />
      {hues.map((h, i) => {
        const x = 50 + (i % 4) * 180
        const y = 124 + Math.floor(i / 4) * 184
        const live = i === 1
        return (
          <g key={i}>
            <rect x={x} y={y} width={160} height={170} rx={12} fill={C.panel} stroke={live ? C.accent : C.line} strokeWidth={live ? 2 : 1} />
            <rect x={x + 8} y={y + 8} width={144} height={104} rx={8} fill={`url(#${uid}g${i})`} />
            <circle cx={x + 40 + ((i * 37) % 80)} cy={y + 50 + ((i * 23) % 40)} r={18 + (i % 3) * 8} fill="#fff" opacity=".18" />
            <circle cx={x + 110 - ((i * 19) % 50)} cy={y + 70} r={10} fill="#0d0d11" opacity=".35" />
            {live && (
              <>
                <rect x={x + 14} y={y + 14} width={92} height={18} rx={9} fill={C.accent} />
                <T x={x + 60} y={y + 27} size={9} mono weight={700} anchor="middle" fill="#111">LIVE 02:14:09</T>
              </>
            )}
            <T x={x + 10} y={y + 134} size={12} weight={700}>Item #{String(100 + i * 37).padStart(4, '0')}</T>
            <T x={x + 10} y={y + 154} size={11} mono fill={C.mute}>{(0.12 + i * 0.07).toFixed(2)} ETH</T>
          </g>
        )
      })}
    </>
  )
}

/* ── 08 Token ──────────────────────────────────────────────── */
function Token({ uid }) {
  const split = [
    ['Liquidity', 40, C.accent],
    ['Presale', 25, C.accentSoft],
    ['Team', 15, '#fbbf24'],
    ['Marketing', 10, '#8b8b96'],
    ['Rewards', 10, '#f4f4f6'],
  ]
  let acc = 0
  return (
    <>
      <defs>
        <radialGradient id={`${uid}coin`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffc3a8" />
          <stop offset=".45" stopColor="#ff5b24" />
          <stop offset="1" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id={`${uid}glow`}>
          <stop offset="0" stopColor="#ff5b24" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff5b24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={250} cy={250} r={210} fill={`url(#${uid}glow)`} />
      <g transform="rotate(-14 250 250)">
        <ellipse cx={262} cy={256} rx={140} ry={146} fill="#7c2d12" />
        <ellipse cx={256} cy={253} rx={140} ry={146} fill="#b8430f" />
        <circle cx={250} cy={250} r={140} fill={`url(#${uid}coin)`} />
        <circle cx={250} cy={250} r={122} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
        <circle cx={250} cy={250} r={131} fill="none" stroke="#000" strokeOpacity=".2" strokeDasharray="2 7" strokeWidth="4" />
        <polygon points="250,168 312,250 250,332 188,250" fill="none" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
        <polygon points="250,200 286,250 250,300 214,250" fill="#fff" fillOpacity=".9" />
        <ellipse cx={200} cy={180} rx={60} ry={26} fill="#fff" opacity=".12" transform="rotate(-35 200 180)" />
      </g>

      <g transform="translate(590 180)">
        {split.map(([label, v, col]) => {
          const el = (
            <circle
              key={label}
              r={78}
              fill="none"
              stroke={col}
              strokeWidth="26"
              pathLength="100"
              strokeDasharray={`${v - 0.8} ${100 - v + 0.8}`}
              strokeDashoffset={25 - acc}
            />
          )
          acc += v
          return el
        })}
        <T x={0} y={4} size={22} weight={700} anchor="middle">1B</T>
        <T x={0} y={22} size={10} anchor="middle" fill={C.mute}>total supply</T>
      </g>
      {split.map(([label, v, col], i) => {
        const x = 490 + (i % 2) * 140
        const y = 300 + Math.floor(i / 2) * 28
        return (
          <g key={label}>
            <rect x={x} y={y - 9} width={10} height={10} rx={2} fill={col} />
            <T x={x + 18} y={y} size={12}>{label}</T>
            <T x={x + 120} y={y} size={11} mono anchor="end" fill={C.mute}>{v}%</T>
          </g>
        )
      })}
      {['BEP-20', 'ERC-20', 'TRC-20'].map((s, i) => (
        <g key={s}>
          <rect x={490 + i * 86} y={400} width={76} height={26} rx={13} fill={C.chip} />
          <T x={528 + i * 86} y={417} size={10} weight={700} anchor="middle">{s}</T>
        </g>
      ))}
    </>
  )
}

/* ── 09 Messenger ──────────────────────────────────────────── */
function Messenger() {
  return (
    <>
      <Panel x={140} y={28} width={520} height={444} r={22} />
      <circle cx={180} cy={70} r={18} fill={C.accent} />
      <T x={180} y={75} size={14} weight={800} anchor="middle" fill="#111">C</T>
      <T x={208} y={66} size={15} weight={700}>Core Team</T>
      <T x={208} y={85} size={11} fill={C.green}>🔒 End-to-end encrypted</T>
      <T x={630} y={72} size={18} anchor="end" fill={C.mute}>⋯</T>
      <line x1={140} x2={660} y1={106} y2={106} stroke={C.line} />

      <rect x={170} y={124} width={250} height={44} rx={16} fill={C.chip} />
      <T x={186} y={151} size={13}>Contracts are live on testnet.</T>
      <rect x={390} y={182} width={240} height={44} rx={16} fill={C.accent} />
      <T x={406} y={209} size={13} weight={600} fill="#111">Great — sending the payment.</T>

      <rect x={170} y={242} width={276} height={96} rx={16} fill="#1b1b22" stroke={C.accent} strokeOpacity=".5" />
      <Coin cx={198} cy={276} r={15} color={C.usdt} sym="₮" />
      <T x={224} y={273} size={14} weight={700}>Sent 250 USDT</T>
      <T x={224} y={291} size={10} mono fill={C.mute}>to 0x7a3…9f2c · TRC-20</T>
      <T x={186} y={322} size={11} fill={C.green}>✓ Confirmed on-chain</T>

      <rect x={470} y={352} width={160} height={40} rx={16} fill={C.chip} />
      <T x={486} y={377} size={13}>Received ✓</T>

      <rect x={170} y={412} width={400} height={40} rx={20} fill={C.deep} stroke={C.line} />
      <T x={192} y={437} size={12} fill={C.mute}>Message…</T>
      <circle cx={604} cy={432} r={20} fill={C.accent} />
      <path d="M596,424 L614,432 L596,440 L599,432 Z" fill="#111" />
    </>
  )
}

/* ── 10 Custom ─────────────────────────────────────────────── */
function Custom({ uid }) {
  const nodes = [
    [170, 118, 'Smart contracts'],
    [630, 110, 'Mobile app'],
    [110, 300, 'Backend & APIs'],
    [690, 290, 'Payments'],
    [255, 425, 'GameFi'],
    [560, 425, 'AI + Web3'],
  ]
  return (
    <>
      <defs>
        <pattern id={`${uid}dots`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#fff" opacity=".12" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={800} height={500} fill={`url(#${uid}dots)`} />
      <T x={40} y={46} size={11} mono fill={C.mute} letterSpacing="2">/ BLUEPRINT · v0.1</T>
      {nodes.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M400,250 Q${(400 + x) / 2 + (y < 250 ? -40 : 40)},${(250 + y) / 2} ${x},${y}`}
          fill="none"
          stroke={C.accent}
          strokeOpacity=".5"
          strokeDasharray="5 6"
        />
      ))}
      <circle cx={400} cy={250} r={58} fill="none" stroke={C.accent}>
        <animate attributeName="r" from="58" to="100" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from=".7" to="0" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={400} cy={250} r={58} fill={C.panel} stroke={C.accent} strokeWidth="2" />
      <T x={400} y={248} size={15} weight={700} anchor="middle">Your idea</T>
      <T x={400} y={267} size={10} mono anchor="middle" fill={C.accentSoft}>→ product</T>
      {nodes.map(([x, y, label]) => {
        const w = label.length * 7.4 + 34
        return (
          <g key={label}>
            <rect x={x - w / 2} y={y - 17} width={w} height={34} rx={17} fill={C.panel} stroke={C.line} />
            <circle cx={x - w / 2 + 16} cy={y} r={4} fill={C.accent} />
            <T x={x - w / 2 + 27} y={y + 4} size={12} weight={600}>{label}</T>
          </g>
        )
      })}
    </>
  )
}

const scenes = {
  blockchain: Blockchain,
  dapp: DApp,
  wallet: Wallet,
  dex: Dex,
  cex: Cex,
  nft: Nft,
  marketplace: Marketplace,
  token: Token,
  messenger: Messenger,
  custom: Custom,
}

export default function ServiceVisual({ service, className = '' }) {
  const uid = 'v' + useId().replace(/[^a-zA-Z0-9]/g, '')

  if (service.image) {
    return <img src={service.image} alt={service.title} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  }

  const Scene = scenes[service.visual] ?? Custom
  const h = service.hue ?? 18

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(80% 70% at 85% 0%, hsl(${h} 90% 55% / .28), transparent 60%),
                     radial-gradient(70% 70% at 0% 100%, rgba(255,91,36,.16), transparent 60%), #0c0c10`,
      }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(75% 75% at 50% 50%, #000, transparent)',
        }}
      />
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" className="relative h-full w-full" role="img" aria-label={`${service.title} illustration`}>
        <Scene uid={uid} />
      </svg>
    </div>
  )
}
