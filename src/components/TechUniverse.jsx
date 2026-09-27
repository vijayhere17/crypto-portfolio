import { useRef } from 'react'
import LazyCanvas from '../three/LazyCanvas'
import OrbitGraph from '../three/OrbitGraph'
import GraphPanel, { useAutoCycle } from './GraphPanel'
import { stack } from '../data/content'
import { revealIn, useGSAP, useIsMobile } from '../lib/motion'

export default function TechUniverse() {
  const root = useRef(null)
  const isMobile = useIsMobile()
  const [active, select] = useAutoCycle(stack.length, 3200)

  useGSAP(() => revealIn(root.current), { scope: root })

  return (
    <section ref={root} className="relative overflow-hidden py-24 md:py-36">
      {/* oversized background type */}
      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[22vw] font-extrabold leading-none tracking-[-0.06em] text-white/[0.025]">
        STACK
      </p>

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="eyebrow">Technology</p>
          <h2 data-reveal className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            The stack behind <em className="font-serif font-normal italic tracking-[-0.02em] text-accent-soft">the</em> work.
          </h2>
        </div>

        <div className="relative mt-6">
          <LazyCanvas
            className="h-[440px] w-full md:h-[620px]"
            camera={{ position: [0, 0, isMobile ? 10 : 8.5], fov: 45 }}
          >
            <OrbitGraph items={stack} centerLabel="TECH STACK" active={active} onSelect={select} layout="sphere" radius={isMobile ? 2.6 : 3.1} compact={isMobile} />
          </LazyCanvas>
          <GraphPanel
            items={stack}
            active={active}
            onSelect={select}
            className="mx-auto max-w-md lg:absolute lg:bottom-8 lg:right-0 lg:w-[22rem]"
          />
        </div>
      </div>
    </section>
  )
}
