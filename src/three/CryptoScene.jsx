import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from '../lib/motion'

const ACCENT = new THREE.Color('#ff5b24')
const NODE = new THREE.Color('#e6e6ee')

let dotTex
function dotTexture() {
  if (dotTex) return dotTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  dotTex = new THREE.CanvasTexture(c)
  return dotTex
}

/* Ambient dust that gives the space depth. */
function Particles({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const rng = mulberry32(3)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 34
      arr[i * 3 + 1] = (rng() - 0.5) * 18
      arr[i * 3 + 2] = (rng() - 0.5) * 26 - 4
    }
    return arr
  }, [count])

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dotTexture()}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        color="#cfcfd8"
      />
    </points>
  )
}

/* A distributed ledger: nodes, peer connections and transactions travelling between them. */
function Network({ count, pulses }) {
  const group = useRef()
  const mesh = useRef()
  const pulseRef = useRef()

  const { nodes, edges, edgePositions } = useMemo(() => {
    const rng = mulberry32(11)
    const nodes = []
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(2 * rng() - 1)
      const r = 3.1 * (0.62 + rng() * 0.5)
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta) * 1.3,
          r * Math.cos(phi) * 0.78,
          r * Math.sin(phi) * Math.sin(theta),
        ),
      )
    }
    const seen = new Set()
    const edges = []
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => [j, a.distanceToSquared(b)])
        .filter(([j]) => j !== i)
        .sort((x, y) => x[1] - y[1])
        .slice(0, 3)
        .forEach(([j]) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(key)) {
            seen.add(key)
            edges.push([i, j])
          }
        })
    })
    const edgePositions = new Float32Array(edges.length * 6)
    edges.forEach(([i, j], k) => {
      nodes[i].toArray(edgePositions, k * 6)
      nodes[j].toArray(edgePositions, k * 6 + 3)
    })
    return { nodes, edges, edgePositions }
  }, [count])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const rng = mulberry32(5)
    nodes.forEach((p, i) => {
      const s = 0.6 + rng() * 0.9
      m.makeScale(s, s, s).setPosition(p)
      mesh.current.setMatrixAt(i, m)
      mesh.current.setColorAt(i, i % 7 === 0 ? ACCENT : NODE)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [nodes])

  const pulseState = useMemo(() => {
    const rng = mulberry32(21)
    return {
      rng,
      items: Array.from({ length: pulses }, () => ({
        edge: Math.floor(rng() * edges.length),
        t: rng(),
        speed: 0.25 + rng() * 0.45,
      })),
      positions: new Float32Array(pulses * 3),
    }
  }, [pulses, edges.length])

  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.045
    const { items, positions, rng } = pulseState
    items.forEach((p, k) => {
      p.t += dt * p.speed
      if (p.t >= 1) {
        p.t = 0
        p.edge = Math.floor(rng() * edges.length)
      }
      const [i, j] = edges[p.edge]
      tmp.lerpVectors(nodes[i], nodes[j], p.t).toArray(positions, k * 3)
    })
    pulseRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.13} depthWrite={false} />
      </lineSegments>
      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulseState.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dotTexture()}
          size={0.32}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={ACCENT}
          toneMapped={false}
        />
      </points>
      {/* faint core structure */}
      <mesh>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial color="#ff5b24" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

/* The chain itself — blocks linked along a curve, a packet travelling through them. */
function BlockChain({ count }) {
  const refs = useRef([])
  const packet = useRef()

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-11, -1.6, -5),
        new THREE.Vector3(-6.5, -2.3, -0.5),
        new THREE.Vector3(-2.5, -2.9, 1.8),
        new THREE.Vector3(2, -2.4, 1.2),
        new THREE.Vector3(6, -2.9, -1),
        new THREE.Vector3(11, -1.8, -5),
      ]),
    [],
  )
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(200)), [curve])
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), [])
  const blocks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pos: curve.getPointAt((i + 0.5) / count),
        size: 0.38 + (i % 3) * 0.09,
        spin: (i % 2 ? 1 : -1) * (0.15 + (i % 4) * 0.05),
        lit: i % 4 === 1,
      })),
    [count, curve],
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((g, i) => {
      if (!g) return
      g.rotation.x += dt * blocks[i].spin
      g.rotation.y += dt * blocks[i].spin * 0.7
      g.position.y = blocks[i].pos.y + Math.sin(t * 0.8 + i) * 0.12
    })
    curve.getPointAt((t * 0.045) % 1, packet.current.position)
  })

  return (
    <group>
      <line geometry={lineGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.16} />
      </line>
      {blocks.map((b, i) => (
        <group
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={b.pos}
          scale={b.size}
          rotation={[i * 0.4, i * 0.7, 0]}
        >
          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial color={b.lit ? '#ff5b24' : '#ffffff'} transparent opacity={b.lit ? 0.95 : 0.5} toneMapped={false} />
          </lineSegments>
          <mesh scale={0.62}>
            <boxGeometry />
            <meshBasicMaterial color={b.lit ? '#ff5b24' : '#1a1a20'} transparent opacity={b.lit ? 0.85 : 0.9} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh ref={packet}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  )
}

/* Camera follows the pointer and dives forward as the hero scrolls away. */
function Rig({ progress, offsetX }) {
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const p = progress.current
    const k = 1 - Math.pow(0.02, dt)
    const cam = state.camera
    cam.position.x += (state.pointer.x * 0.7 - cam.position.x) * k
    cam.position.y += (state.pointer.y * 0.4 + p * 1.6 - cam.position.y) * k
    cam.position.z += (9 - p * 5 - cam.position.z) * k
    look.set(offsetX * 0.35, -p * 0.8, 0)
    cam.lookAt(look)
  })
  return null
}

export default function CryptoScene({ progress, compact = false }) {
  const offsetX = compact ? 0 : 3.2
  return (
    <>
      <fog attach="fog" args={['#08080a', 7, 24]} />
      <Rig progress={progress} offsetX={offsetX} />
      <group position={[offsetX, compact ? 0.9 : 0.4, compact ? -3 : 0]} scale={compact ? 0.85 : 1}>
        <Network count={compact ? 48 : 80} pulses={compact ? 14 : 28} />
      </group>
      <BlockChain count={compact ? 8 : 12} />
      <Particles count={compact ? 450 : 1300} />
      <gridHelper args={[70, 70, '#26262e', '#141419']} position={[0, -4.2, 0]} />
    </>
  )
}
