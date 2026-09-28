import { site } from '../data/site'

// Brand artwork lives in public/brand (transparent PNGs cut from the original logo; dark backgrounds only).
export const LOGO_SRC = './brand/rocyweb-logo.png'
export const MARK_SRC = './brand/rocyweb-mark.png'

export default function Logo({ className = '' }) {
  return (
    <img
      src={LOGO_SRC}
      alt={site.brand}
      width="1431"
      height="360"
      decoding="async"
      className={`block h-7 w-auto select-none md:h-8 ${className}`}
      draggable="false"
    />
  )
}
