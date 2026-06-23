import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 龙骨水车 3D 模型（程序化几何）
// 部件 ID: pedal(踏轴), chain(龙骨链), blade(刮水板), trough(水槽)
export default function Longgu({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const chainRef = useRef()
  const pedalRef = useRef()
  const bottomWheelRef = useRef()

  // 整体倾斜角度
  const tilt = -0.35 // 约 -20°
  const troughLen = 3.2

  useFrame((_, delta) => {
    if (simSpeed > 0) {
      if (pedalRef.current) pedalRef.current.rotation.x += delta * (simSpeed / 50) * 2
      if (bottomWheelRef.current) bottomWheelRef.current.rotation.x += delta * (simSpeed / 50) * 2
      if (chainRef.current) {
        // 链条通过纹理偏移模拟移动
        const mat = chainRef.current.material
        if (mat.map) mat.map.offset.x -= delta * (simSpeed / 50) * 0.5
      }
    }
  })

  const isHi = (id) => highlightedPartId === id
  const partMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.78,  // 真木更粗糙；高亮时稍光滑更跳
    metalness: 0.0,                      // 木头无金属，归零消除塑料感
    flatShading: false,
  })

  // 链节位置（沿槽分布）
  const linkCount = 14
  const links = useMemo(() => {
    const arr = []
    for (let i = 0; i < linkCount; i++) {
      const t = i / (linkCount - 1)
      arr.push({ t, z: -troughLen / 2 + t * troughLen })
    }
    return arr
  }, [])

  return (
    <group rotation={[tilt, 0, 0]} position={[0, 0.2, 0]}>
      {/* 水槽主体 */}
      <group position={[0, 0, explode ? 0.5 : 0]}>
        <mesh
          material={partMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.5, 0.12, troughLen]} />
        </mesh>
        {/* 槽壁左 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[-0.27, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.2, troughLen]} />
        </mesh>
        {/* 槽壁右 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[0.27, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.2, troughLen]} />
        </mesh>
        {/* 槽内深色 */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.42, 0.06, troughLen - 0.1]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
      </group>

      {/* 龙骨链 + 刮水板（沿槽分布） */}
      <group ref={chainRef} position={[0, 0.16, 0]}>
        {links.map((l, i) => (
          <group key={i} position={[0, 0, l.z]}>
            {/* 链节 */}
            <mesh
              material={partMat('chain', '#5C3A1E')}
              castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
            >
              <boxGeometry args={[0.12, 0.08, 0.06]} />
            </mesh>
            {/* 刮水板 */}
            <mesh
              material={partMat('blade', '#8B6F3A')}
              castShadow
              position={[0, -0.08, 0]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.4, 0.04, 0.18]} />
            </mesh>
          </group>
        ))}
        {/* 连接线（链条） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.04, troughLen]} />
          <meshStandardMaterial color={isHi('chain') ? '#E8C88C' : '#4A2E1A'} emissive={isHi('chain') ? '#C75B2A' : '#000'} emissiveIntensity={isHi('chain') ? 0.6 : 0} roughness={0.8} />
        </mesh>
      </group>

      {/* 顶部踏轴（主动链轮） */}
      <group position={[0, 0.2, troughLen / 2 + 0.15]}>
        <group ref={pedalRef}>
          {/* 主轴 */}
          <mesh
            material={partMat('pedal', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
          >
            <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
          </mesh>
          {/* 链轮齿 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <mesh
                key={i}
                material={partMat('pedal', '#6B4226')}
                castShadow
                position={[Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0]}
                rotation={[0, 0, a]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
              >
                <boxGeometry args={[0.08, 0.04, 0.5]} />
              </mesh>
            )
          })}
        </group>
        {/* 踏板（拐木）— 不随轴转，示意 */}
        {[-0.35, 0.35].map((z) => (
          <mesh key={z} material={partMat('pedal', '#7B4F2E')} castShadow position={[0, 0.35, z]}>
            <boxGeometry args={[0.5, 0.05, 0.12]} />
          </mesh>
        ))}
        {/* 支架 */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.12]} />
          <meshStandardMaterial color="#3A2518" roughness={0.85} />
        </mesh>
      </group>

      {/* 底部从动轮 */}
      <group position={[0, 0.2, -troughLen / 2 - 0.15]}>
        <group ref={bottomWheelRef}>
          <mesh
            material={partMat('chain', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
          >
            <cylinderGeometry args={[0.14, 0.14, 0.5, 12]} />
          </mesh>
        </group>
      </group>

      {/* 水流（模拟时显示，在底部） */}
      {simSpeed > 0 && <LongguWater speed={simSpeed} />}
    </group>
  )
}

function LongguWater({ speed }) {
  const ref = useRef()
  const count = 30
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.3
      arr[i * 3 + 1] = -1.2 - Math.random() * 0.3
      arr[i * 3 + 2] = -1.8 + Math.random() * 0.4
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 2] += delta * (speed / 50) * 1.5
      if (pos.array[i * 3 + 2] > -1.4) {
        pos.array[i * 3 + 2] = -1.8
        pos.array[i * 3 + 1] = -1.2 - Math.random() * 0.3
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#5BA3D0" size={0.06} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}
