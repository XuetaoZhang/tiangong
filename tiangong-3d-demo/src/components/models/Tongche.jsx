import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 筒车 3D 模型（程序化几何）
// 部件 ID: wheel(水轮主体), blade(受水板), tube(竹筒), trough(受水槽)
export default function Tongche({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()
  const groupRef = useRef()

  // 旋转动画
  useFrame((_, delta) => {
    if (wheelRef.current && simSpeed > 0) {
      wheelRef.current.rotation.z -= delta * (simSpeed / 50) * 1.2
    }
  })

  const radius = 1.5
  const tubeCount = 12
  const bladeCount = 8

  // 竹筒位置
  const tubes = useMemo(() => {
    const arr = []
    for (let i = 0; i < tubeCount; i++) {
      const angle = (i / tubeCount) * Math.PI * 2
      arr.push({ angle, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })
    }
    return arr
  }, [])

  // 受水板位置
  const blades = useMemo(() => {
    const arr = []
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2
      arr.push({ angle, x: Math.cos(angle) * (radius + 0.15), y: Math.sin(angle) * (radius + 0.15) })
    }
    return arr
  }, [])

  // 拆解偏移
  const explodeOffset = (axis, base) => explode ? base : 0

  const isHi = (id) => highlightedPartId === id
  const partMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.78,  // 真木更粗糙；高亮时稍光滑更跳
    metalness: 0.0,                      // 木头无金属，归零消除塑料感
    flatShading: false,
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 水轮主体 */}
      <group ref={wheelRef} position={[0, 0, 0]}>
        {/* 外圈轮缘 */}
        <mesh
          material={partMat('wheel', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <torusGeometry args={[radius, 0.06, 8, 48]} />
        </mesh>
        <mesh material={partMat('wheel', '#6B4226')} castShadow>
          <torusGeometry args={[radius - 0.25, 0.05, 8, 48]} />
        </mesh>

        {/* 轮辐 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              material={partMat('wheel', '#7B4F2E')}
              castShadow
              position={[Math.cos(a) * (radius - 0.12), Math.sin(a) * (radius - 0.12), 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
            >
              <boxGeometry args={[radius * 1.7, 0.05, 0.05]} />
            </mesh>
          )
        })}

        {/* 中心轴 */}
        <mesh
          material={partMat('wheel', '#5C3A1E')}
          castShadow
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
        </mesh>

        {/* 竹筒 */}
        {tubes.map((t, i) => (
          <group key={`tube-${i}`} position={[t.x, t.y, 0.18 + explodeOffset(0, 0.3)]}>
            <mesh
              material={partMat('tube', '#8B6F3A')}
              castShadow
              rotation={[0, 0, t.angle + Math.PI / 2]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.3, 10]} />
            </mesh>
          </group>
        ))}
        {/* 竹筒另一侧 */}
        {tubes.map((t, i) => (
          <group key={`tube2-${i}`} position={[t.x, t.y, -0.18 - explodeOffset(0, 0.3)]}>
            <mesh
              material={partMat('tube', '#8B6F3A')}
              castShadow
              rotation={[0, 0, t.angle + Math.PI / 2]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.3, 10]} />
            </mesh>
          </group>
        ))}

        {/* 受水板（弧形） */}
        {blades.map((b, i) => (
          <group key={`blade-${i}`} position={[b.x, b.y, explode ? 0.4 : 0]}>
            <mesh
              material={partMat('blade', '#7B4F2E')}
              castShadow
              position={[0, 0, 0]}
              rotation={[0, 0, b.angle]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.35, 0.04, 0.5]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 受水槽（顶部，不随轮转） */}
      <group position={[0, radius + 0.5 + (explode ? 0.4 : 0), 0]}>
        <mesh
          material={partMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.5, 0.12, 0.6]} />
        </mesh>
        {/* 槽内（凹陷） */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.5]} />
          <meshStandardMaterial color="#3A2518" roughness={0.9} />
        </mesh>
      </group>

      {/* 支架（左右两根立柱） */}
      {[-0.6, 0.6].map((z) => (
        <group key={`support-${z}`}>
          <mesh position={[0, -radius - 0.3, z]} castShadow>
            <boxGeometry args={[0.12, 0.6, 0.12]} />
            <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
          </mesh>
          <mesh position={[0, -radius - 0.6, z]} castShadow>
            <boxGeometry args={[0.4, 0.08, 0.4]} />
            <meshStandardMaterial color="#3A2518" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* 水流（模拟时显示） */}
      {simSpeed > 0 && <WaterFlow speed={simSpeed} />}
    </group>
  )
}

// 水流粒子效果
function WaterFlow({ speed }) {
  const ref = useRef()
  const count = 40
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 2.2 + Math.random() * 0.3
      arr[i * 3 + 1] = -0.5 + Math.random() * 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] -= delta * (speed / 50) * 3
      if (pos.array[i * 3] < 1.4) {
        pos.array[i * 3] = 2.5
        pos.array[i * 3 + 1] = -0.5 + Math.random() * 2
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#5BA3D0" size={0.08} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}
