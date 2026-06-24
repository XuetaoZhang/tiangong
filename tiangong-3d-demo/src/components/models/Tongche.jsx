import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 筒车 3D 模型（严格按天工开物·乃粒·筒车原版插图结构）
// 部件 ID: wheel(水轮主体), blade(受水板), tube(竹筒), trough(受水槽)
// 原版结构：大立轮立于河中 + 轮缘斜布竹筒(与轴呈45°角，筒口朝前进方向) + 顶部受水槽 + 木架
export default function Tongche({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()

  // 水轮旋转（CCW，受水力推动）
  useFrame((_, delta) => {
    if (wheelRef.current && simSpeed > 0) {
      wheelRef.current.rotation.z += delta * (simSpeed / 50) * 0.7
    }
  })

  const radius = 1.7          // 外轮缘半径
  const innerRadius = 1.45    // 内轮缘半径
  const tubeCount = 16        // 竹筒数量（原版密集）
  const bladeCount = 14       // 受水板数量
  const spokeCount = 18       // 轮辐数量（原版密集辐条）

  // 竹筒位置（外轮缘上）
  const tubes = useMemo(() => {
    const arr = []
    for (let i = 0; i < tubeCount; i++) {
      const angle = (i / tubeCount) * Math.PI * 2
      arr.push({ angle })
    }
    return arr
  }, [])

  // 受水板位置
  const blades = useMemo(() => {
    const arr = []
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2
      arr.push({ angle })
    }
    return arr
  }, [])

  const isHi = (id) => highlightedPartId === id
  const partMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.78,
    metalness: 0.0,
    flatShading: false,
  })

  // 45° 角的余弦/正弦值
  const C45 = Math.cos(Math.PI / 4) // 0.707
  const S45 = Math.sin(Math.PI / 4) // 0.707
  const tubeLen = 0.55
  const tubeRadius = 0.055

  return (
    <group position={[0, -0.3, 0]}>
      {/* ===== 水轮主体（绕Z轴旋转，CCW） ===== */}
      <group ref={wheelRef}>
        {/* 外圈轮缘（双圈，粗木轮） */}
        <mesh
          material={partMat('wheel', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <torusGeometry args={[radius, 0.07, 8, 72]} />
        </mesh>
        <mesh material={partMat('wheel', '#5C3A1E')} castShadow>
          <torusGeometry args={[radius - 0.09, 0.04, 8, 64]} />
        </mesh>

        {/* 内圈轮缘 */}
        <mesh material={partMat('wheel', '#6B4226')} castShadow>
          <torusGeometry args={[innerRadius, 0.05, 8, 64]} />
        </mesh>

        {/* 轮辐（18根，密集如原版） */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const a = (i / spokeCount) * Math.PI * 2
          const midR = (innerRadius + 0.18) / 2
          return (
            <mesh
              key={`spoke-${i}`}
              material={partMat('wheel', '#7B4F2E')}
              castShadow
              position={[Math.cos(a) * midR, Math.sin(a) * midR, 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
            >
              <boxGeometry args={[innerRadius - 0.18, 0.045, 0.045]} />
            </mesh>
          )
        })}

        {/* 中心轴毂（粗木轴） */}
        <mesh
          material={partMat('wheel', '#4A2E1A')}
          castShadow
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.75, 16]} />
        </mesh>
        {/* 轴端铁箍 */}
        <mesh material={partMat('wheel', '#3A2518')} position={[0, 0, 0.4]}>
          <torusGeometry args={[0.2, 0.03, 6, 16]} />
        </mesh>
        <mesh material={partMat('wheel', '#3A2518')} position={[0, 0, -0.4]}>
          <torusGeometry args={[0.2, 0.03, 6, 16]} />
        </mesh>

        {/* ===== 竹筒：斜布于外轮缘，与轴呈45°角 ===== */}
        {/* 筒口朝CCW前进方向，倒水向+Z侧（便于水槽接水） */}
        {tubes.map((t, i) => {
          const px = Math.cos(t.angle) * radius
          const py = Math.sin(t.angle) * radius
          // 筒轴 = C45 * CCW切向 + S45 * +Z
          const halfLen = tubeLen / 2
          const mouthDx = -Math.sin(t.angle) * C45 * halfLen
          const mouthDy = Math.cos(t.angle) * C45 * halfLen
          const mouthDz = S45 * halfLen
          return (
            <group key={`tube-${i}`} position={[px, py, 0]}>
              {/* 竹筒主体：先绕X轴倾斜45°，再绕Z轴转到切向 */}
              <mesh
                material={partMat('tube', '#8B6F3A')}
                castShadow
                rotation={[Math.PI / 4, 0, t.angle]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeRadius, tubeRadius, tubeLen, 10]} />
              </mesh>
              {/* 竹筒筒口（开口端，朝CCW前进方向+Z） */}
              <mesh
                material={partMat('tube', '#A0824A')}
                castShadow
                position={[mouthDx, mouthDy, mouthDz]}
                rotation={[Math.PI / 4, 0, t.angle]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeRadius + 0.008, tubeRadius + 0.008, 0.06, 10]} openEnded />
              </mesh>
              {/* 竹节箍（装饰） */}
              <mesh
                material={partMat('tube', '#6B5230')}
                position={[-mouthDx * 0.5, -mouthDy * 0.5, -mouthDz * 0.5]}
                rotation={[Math.PI / 4, 0, t.angle]}
              >
                <cylinderGeometry args={[tubeRadius + 0.004, tubeRadius + 0.004, 0.04, 10]} />
              </mesh>
            </group>
          )
        })}

        {/* ===== 受水板（叶片，弧形，受水力推动轮转） ===== */}
        {blades.map((b, i) => (
          <group key={`blade-${i}`} position={[Math.cos(b.angle) * (radius + 0.02), Math.sin(b.angle) * (radius + 0.02), 0]}>
            <mesh
              material={partMat('blade', '#7B4F2E')}
              castShadow
              rotation={[0, 0, b.angle]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.38, 0.03, 0.55]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===== 受水槽：位于顶部+Z侧，接住竹筒倒出的水 ===== */}
      {/* 竹筒到顶时，因45°倾斜，水泻向+Z侧，槽在此接水 */}
      <group position={[0, radius + 0.4 + (explode ? 0.5 : 0), 0.4]}>
        {/* 槽体（木槽） */}
        <mesh
          material={partMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.85, 0.13, 0.42]} />
        </mesh>
        {/* 槽内凹陷（水道） */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.72, 0.08, 0.34]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
        {/* 槽壁左 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[-0.38, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.17, 0.42]} />
        </mesh>
        {/* 槽壁右 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[0.38, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.17, 0.42]} />
        </mesh>
        {/* 出水口（导流到田间，向右） */}
        <mesh position={[0.55, -0.02, 0]} material={partMat('trough', '#6B4226')} castShadow>
          <boxGeometry args={[0.25, 0.1, 0.28]} />
        </mesh>
        {/* 槽支架（连接到水轮支架） */}
        <mesh position={[-0.38, -0.28, 0]} castShadow>
          <boxGeometry args={[0.08, 0.55, 0.08]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
      </group>

      {/* ===== 支架（左右两根立柱+底座+横撑+斜撑，如原版木架） ===== */}
      {[-0.55, 0.55].map((z) => (
        <group key={`support-${z}`}>
          {/* 立柱 */}
          <mesh position={[0, -radius - 0.55, z]} castShadow>
            <boxGeometry args={[0.17, 0.85, 0.17]} />
            <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
          </mesh>
          {/* 底座 */}
          <mesh position={[0, -radius - 1.0, z]} castShadow>
            <boxGeometry args={[0.55, 0.13, 0.55]} />
            <meshStandardMaterial color="#3A2518" roughness={0.85} />
          </mesh>
          {/* 横撑 */}
          <mesh position={[0, -radius - 0.35, z]} castShadow>
            <boxGeometry args={[0.13, 0.06, 0.45]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.85} />
          </mesh>
          {/* 斜撑 */}
          <mesh position={[0, -radius - 0.5, z * 0.6]} castShadow rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.1, 0.5, 0.1]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ===== 水面（底部，半透明蓝） ===== */}
      <mesh position={[0, -radius - 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 3.2]} />
        <meshStandardMaterial color="#4A7A9A" transparent opacity={0.35} roughness={0.3} />
      </mesh>

      {/* 水流粒子（模拟时显示，从右侧冲击受水板） */}
      {simSpeed > 0 && <WaterFlow speed={simSpeed} />}
    </group>
  )
}

// 水流粒子效果（从+X方向流来，冲击轮的右下侧受水板）
function WaterFlow({ speed }) {
  const ref = useRef()
  const count = 70
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 2.2 + Math.random() * 1.0
      arr[i * 3 + 1] = -1.6 + Math.random() * 2.2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] -= delta * (speed / 50) * 2.5
      if (pos.array[i * 3] < 0.9) {
        pos.array[i * 3] = 3.2
        pos.array[i * 3 + 1] = -1.6 + Math.random() * 2.2
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
