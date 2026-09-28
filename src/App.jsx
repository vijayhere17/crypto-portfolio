import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import ServiceDetail from './components/ServiceDetail'
import Expertise from './components/Expertise'
import TechUniverse from './components/TechUniverse'
import Process from './components/Process'
import WhyUs from './components/WhyUs'
import Ecosystem from './components/Ecosystem'
import Contact from './components/Contact'
import Marquee from './components/Marquee'
import Preloader from './components/Preloader'
import { LenisContext, ScrollTrigger, gsap, useReducedMotion } from './lib/motion'

export default function App() {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState(null)
  const [openService, setOpenService] = useState(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (t) => instance.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  useEffect(() => {
    // Layout can shift once fonts and images arrive — re-measure pinned sections.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const close = useCallback(() => setOpenService(null), [])

  return (
    <LenisContext.Provider value={lenis}>
      <Preloader />
      <div className="bg-ambient" aria-hidden="true">
        <div className="grid-lines" />
      </div>
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services onOpen={setOpenService} />
        <Marquee />
        <Expertise />
        <TechUniverse />
        <Process />
        <WhyUs />
        <Ecosystem onOpen={setOpenService} />
        <Contact />
      </main>
      {openService !== null && <ServiceDetail index={openService} onClose={close} onNavigate={setOpenService} />}
    </LenisContext.Provider>
  )
}
