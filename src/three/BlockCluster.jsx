import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from '../lib/motion'

/**
 * A 3×3×3 cluster of blocks that assembles as the section reaches the
 * centre of the viewport and drifts apart as it enters or leaves.
 */
export default function BlockCluster({ progress }) {
  const group = useRef()
  const refs = useRef([])
  const ring = useRef()

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.86, 0.86, 0.86)), [])
  const cubes = useMemo(() => {
    const rng = mulberry32(42)
    const out = []
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const base = new THREE.Vector3(x, y, z).multiplyScalar(1.02)
          out.push({
            base,
            dir: base.clone().normalize(),
            spread: 0.7 + rng() * 0.9,
            spin: (rng() - 0.5) * 2,
            lit: rng() < 0.2,
          })
        }
    return out
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    const k = 1 - Math.pow(0.03, dt)
    const p = progress.current
    const explode = Math.min(1, Math.abs(p - 0.5) * 2.2) * 2.4
    const t = state.clock.elapsedTime

    g.rotation.y += dt * 0.22
    g.rotation.x += (0.45 + state.pointer.y * 0.25 - g.rotation.x) * k
    g.rotation.z += (-state.pointer.x * 0.12 - g.rotation.z) * k

    cubes.forEach((c, i) => {
      const m = refs.current[i]
      if (!m) return
      const d = explode * c.spread + Math.sin(t * 1.2 + i) * 0.03
      m.position.lerp(tmp.copy(c.base).addScaledVector(c.dir, d), k)
      m.rotation.x = c.spin * explode * 0.6
      m.rotation.y = c.spin * explode * 0.4
    })
    ring.current.rotation.z += dt * 0.3
  })

  return (
    <group ref={group} scale={0.95}>
      {cubes.map((c, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={c.base}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshBasicMaterial color={c.lit ? '#ff5b24' : '#15151b'} toneMapped={false} />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={c.lit ? '#ffb08a' : '#ffffff'} transparent opacity={c.lit ? 0.9 : 0.3} toneMapped={false} />
          </lineSegments>
        </group>
      ))}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.1, 0.006, 6, 200]} />
        <meshBasicMaterial color="#ff5b24" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

const tmp = new THREE.Vector3()
