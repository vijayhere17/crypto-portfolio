import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const ACCENT = new THREE.Color('#ff5b24')
const NODE = new THREE.Color('#d8d8e0')
const ORIGIN = new THREE.Vector3()

function layoutPositions(count, layout, radius) {
  return Array.from({ length: count }, (_, i) => {
    if (layout === 'sphere') {
      const y = 1 - ((i + 0.5) / count) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.399963
      return new THREE.Vector3(Math.cos(th) * r * radius, y * radius * 0.78, Math.sin(th) * r * radius)
    }
    const a = (i / count) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * radius, Math.sin(i * 1.9) * 1.15, Math.sin(a) * radius)
  })
}

/**
 * A central hub with labelled satellite nodes connected like a network.
 * Used for the Expertise ecosystem (ring) and the Tech universe (sphere).
 */
export default function OrbitGraph({ items, centerLabel, active, onSelect, layout = 'ring', radius = 3.2, compact = false }) {
  const group = useRef()
  const core = useRef()
  const pulse = useRef()
  const nodeRefs = useRef([])
  const labelRefs = useRef([])
  const hovering = useRef(false)
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const positions = useMemo(() => layoutPositions(items.length, layout, radius), [items.length, layout, radius])

  const linePositions = useMemo(() => {
    const segs = []
    positions.forEach((p, i) => {
      segs.push(ORIGIN, p)
      if (layout === 'ring') segs.push(p, positions[(i + 1) % positions.length])
      else {
        positions
          .map((q, j) => [j, p.distanceToSquared(q)])
          .filter(([j]) => j > i)
          .sort((a, b) => a[1] - b[1])
          .slice(0, 2)
          .forEach(([j]) => segs.push(p, positions[j]))
      }
    })
    const arr = new Float32Array(segs.length * 3)
    segs.forEach((v, k) => v.toArray(arr, k * 3))
    return arr
  }, [positions, layout])

  useFrame((state, dt) => {
    const g = group.current
    const k = 1 - Math.pow(0.03, dt)
    g.rotation.y += dt * (hovering.current ? 0.015 : 0.11)
    g.rotation.x += (0.3 + state.pointer.y * 0.12 - g.rotation.x) * k
    g.rotation.z += (state.pointer.x * -0.06 - g.rotation.z) * k
    core.current.rotation.x += dt * 0.2
    core.current.rotation.y += dt * 0.3

    g.updateMatrixWorld()
    positions.forEach((p, i) => {
      const node = nodeRefs.current[i]
      if (node) {
        const target = i === active ? 2.2 : 1
        node.scale.setScalar(node.scale.x + (target - node.scale.x) * k)
        node.material.color.lerp(i === active ? ACCENT : NODE, k)
      }
      // Fade labels on the far side of the orbit for depth.
      const label = labelRefs.current[i]
      if (label) {
        tmp.copy(p).applyMatrix4(g.matrixWorld)
        const depth = THREE.MathUtils.clamp((tmp.z + radius) / (radius * 2), 0, 1)
        label.style.opacity = i === active ? 1 : (0.28 + depth * 0.72).toFixed(2)
      }
    })

    // A transaction travelling from the hub to the selected node.
    const t = (state.clock.elapsedTime * 0.7) % 1
    const e = t * t * (3 - 2 * t)
    if (positions[active]) pulse.current.position.lerpVectors(ORIGIN, positions[active], e)
    pulse.current.scale.setScalar(1 - t * 0.5)
  })

  return (
    <group ref={group}>
      {/* hub */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color="#ff5b24" wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#0d0d11" />
      </mesh>
      <Html center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span className="center-label">{centerLabel}</span>
      </Html>

      {/* orbits */}
      {(layout === 'sphere' ? [0, 1.1, -1.1] : [0]).map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + r * 0.6, r, 0]}>
          <torusGeometry args={[radius * (layout === 'sphere' ? 0.95 : 1), 0.004, 6, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>

      <mesh ref={pulse}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ff5b24" toneMapped={false} />
      </mesh>

      {items.map((item, i) => (
        <group key={item.title} position={positions[i]}>
          <mesh
            ref={(el) => (nodeRefs.current[i] = el)}
            onPointerOver={() => onSelect(i)}
            onClick={() => onSelect(i)}
          >
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#d8d8e0" toneMapped={false} />
          </mesh>
          {/* larger invisible hit area for touch */}
          <mesh onClick={() => onSelect(i)} visible={false}>
            <sphereGeometry args={[0.38, 8, 8]} />
          </mesh>
          {/* on small screens only the selected label is shown, to avoid overlap */}
          {(!compact || i === active) && (
          <Html
            ref={(el) => (labelRefs.current[i] = el)}
            position={[0, 0.34, 0]}
            center
            zIndexRange={[20, 6]}
          >
            <button
              type="button"
              className="node-label"
              data-active={i === active}
              onMouseEnter={() => {
                hovering.current = true
                onSelect(i)
              }}
              onMouseLeave={() => (hovering.current = false)}
              onClick={() => onSelect(i)}
            >
              {item.title}
            </button>
          </Html>
          )}
        </group>
      ))}
    </group>
  )
}
