import { useRef } from 'react'
import LazyCanvas from '../three/LazyCanvas'
import OrbitGraph from '../three/OrbitGraph'
import GraphPanel, { useAutoCycle } from './GraphPanel'
import { expertise } from '../data/content'
import { revealIn, useGSAP, useIsMobile } from '../lib/motion'

export default function Expertise() {
  const root = useRef(null)
  const isMobile = useIsMobile()
  const [active, select] = useAutoCycle(expertise.length)

  useGSAP(() => revealIn(root.current), { scope: root })

  return (
    <section id="expertise" ref={root} className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_65%_50%,rgba(255,91,36,0.08),transparent_70%)]" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow">Capabilities</p>
          <h2 data-reveal className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            One ecosystem,
            <br />
            <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">every</em> layer.
          </h2>
          <p data-reveal className="mt-6 max-w-sm leading-relaxed text-white/60">
            The core skills underneath every product we ship — connected, so nothing falls between the cracks.
          </p>
          <GraphPanel items={expertise} active={active} onSelect={select} className="mt-10 hidden lg:block" />
        </div>

        <div className="lg:col-span-8">
          <div className="relative">
            <LazyCanvas
              className="relative h-[440px] w-full md:h-[600px] lg:h-[680px]"
              camera={{ position: [0, 0, isMobile ? 10.5 : 9], fov: 45 }}
            >
              <OrbitGraph items={expertise} active={active} onSelect={select} radius={isMobile ? 2.5 : 3.3} compact={isMobile} />
            </LazyCanvas>
            {/* the hub always projects to the canvas centre */}
            <span className="center-label pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">WEB3 / CRYPTO</span>
          </div>
          <GraphPanel items={expertise} active={active} onSelect={select} className="lg:hidden" />
        </div>
      </div>
    </section>
  )
}
