import { createContext, useContext, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

export const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

/** Smoothly scroll to an in-page anchor, falling back to native scrolling. */
export function scrollToTarget(lenis, target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

/** Fade-and-rise every [data-reveal] element inside `scope` as it enters the viewport. */
export function revealIn(scope) {
  gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset.reveal || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

/** Deterministic pseudo-random generator so 3D layouts are stable between renders. */
export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
