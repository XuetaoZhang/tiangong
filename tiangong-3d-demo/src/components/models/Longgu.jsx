import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 龙骨水车 3D 模型（严格按天工开物·乃粒·龙骨车原版插图结构）
// 部件 ID: pedal(踏轴/拐木), chain(龙骨链), blade(刮水板), trough(水槽)
// 原版结构：斜置水槽(从水中到岸上) + 龙骨链带刮板(循环运转) + 顶部踏轴(拐木,人踩驱动) + 底部从动轮(入水)
export default function Longgu({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const pedalRef = useRef()
  const bottomWheelRef = useRef()
  const chainGroupRef = useRef()

  // 整体倾斜角度（约 -25°，低端在水中，高端在岸上）
  const tilt = -0.44
  const troughLen = 3.8

  useFrame((_, delta) => {
    if (simSpeed > 0) {
      // 踏轴旋转
      if (pedalRef.current) pedalRef.current.rotation.x += delta * (simSpeed / 50) * 1.8
      // 底部从动轮旋转
      if (bottomWheelRef.current) bottomWheelRef.current.rotation.x += delta * (simSpeed / 50) * 1.8
      // 链条移动（更新链节位置）
      if (chainGroupRef.current) {
        chainGroupRef.current.children.forEach((child) => {
          const totalLen = troughLen + 1.3
          const speed = delta * (simSpeed / 50) * 0.8
          const userData = child.userData
          if (userData && userData.t !== undefined) {
            userData.t += speed / totalLen
            if (userData.t > 1) userData.t -= 1
            updateLinkPosition(child, userData.t, troughLen)
          }
        })
      }
    }
  })

  const isHi = (id) => highlightedPartId === id
  const partMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.78,
    metalness: 0.0,
    flatShading: false,
  })

  // 链节：沿环形路径分布
  const linkCount = 22
  const links = useMemo(() => {
    const arr = []
    for (let i = 0; i < linkCount; i++) {
      arr.push({ t: i / linkCount })
    }
    return arr
  }, [])

  // 更新链节位置（沿环形路径：上槽前进 + 顶部折返 + 下槽返回 + 底部折返）
  function updateLinkPosition(child, t, len) {
    const halfW = 0.15 // 链条上下间距
    let x, y, z
    if (t < 0.45) {
      // 上槽（刮板在上，前进方向）
      const tt = t / 0.45
      z = -len / 2 + tt * len
      y = halfW
      x = 0
    } else if (t < 0.5) {
      // 顶部折返（绕踏轴）
      const tt = (t - 0.45) / 0.05
      const angle = tt * Math.PI
      z = len / 2 + 0.18 + Math.sin(angle) * 0.18
      y = halfW * Math.cos(angle)
      x = 0
    } else if (t < 0.95) {
      // 下槽（返回）
      const tt = (t - 0.5) / 0.45
      z = len / 2 - tt * len
      y = -halfW
      x = 0
    } else {
      // 底部折返（绕从动轮）
      const tt = (t - 0.95) / 0.05
      const angle = tt * Math.PI + Math.PI
      z = -len / 2 - 0.18 + Math.sin(angle) * 0.18
      y = halfW * Math.cos(angle)
      x = 0
    }
    child.position.set(x, y, z)
  }

  return (
    <group rotation={[tilt, 0, 0]} position={[0, 0.3, 0]}>
      {/* ===== 水槽主体（斜置木槽） ===== */}
      <group position={[0, 0, explode ? 0.5 : 0]}>
        {/* 槽底（厚木板） */}
        <mesh
          material={partMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.6, 0.1, troughLen]} />
        </mesh>
        {/* 槽壁左 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[-0.32, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, troughLen]} />
        </mesh>
        {/* 槽壁右 */}
        <mesh material={partMat('trough', '#7B4F2E')} castShadow position={[0.32, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, troughLen]} />
        </mesh>
        {/* 槽内深色（水道） */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.52, 0.04, troughLen - 0.1]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
        {/* 槽底加固横木（每隔一段一根，如原版） */}
        {Array.from({ length: 7 }).map((_, i) => {
          const z = -troughLen / 2 + (i + 0.5) * (troughLen / 7)
          return (
            <mesh key={`brace-${i}`} position={[0, -0.1, z]} castShadow>
              <boxGeometry args={[0.65, 0.07, 0.1]} />
              <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
            </mesh>
          )
        })}
      </group>

      {/* ===== 龙骨链 + 刮水板（沿环形路径移动） ===== */}
      <group ref={chainGroupRef} position={[0, 0.2, 0]}>
        {links.map((l, i) => (
          <group
            key={i}
            ref={(el) => {
              if (el) {
                el.userData = { t: l.t }
                updateLinkPosition(el, l.t, troughLen)
              }
            }}
          >
            {/* 链节（龙骨木节） */}
            <mesh
              material={partMat('chain', '#5C3A1E')}
              castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
            >
              <boxGeometry args={[0.18, 0.08, 0.1]} />
            </mesh>
            {/* 刮水板（矩形木板，垂直于链方向） */}
            <mesh
              material={partMat('blade', '#8B6F3A')}
              castShadow
              position={[0, -0.18, 0]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.5, 0.04, 0.2]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===== 顶部踏轴（主动链轮，人踩驱动） ===== */}
      <group position={[0, 0.35, troughLen / 2 + 0.3]}>
        <group ref={pedalRef}>
          {/* 主轴（粗木轴） */}
          <mesh
            material={partMat('pedal', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
          >
            <cylinderGeometry args={[0.24, 0.24, 0.75, 16]} />
          </mesh>
          {/* 链轮齿（鹤膝，8个，咬合龙骨链） */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <mesh
                key={`gear-${i}`}
                material={partMat('pedal', '#6B4226')}
                castShadow
                position={[Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0]}
                rotation={[0, 0, a]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
              >
                <boxGeometry args={[0.13, 0.06, 0.65]} />
              </mesh>
            )
          })}
          {/* 踏板（拐木，4组对置，随轴旋转） */}
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
            <group key={`pedal-${i}`} rotation={[0, 0, a]}>
              {/* 踏板左 */}
              <mesh
                material={partMat('pedal', '#7B4F2E')}
                castShadow
                position={[0, 0.48, 0.32]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
              >
                <boxGeometry args={[0.15, 0.05, 0.48]} />
              </mesh>
              {/* 踏板右 */}
              <mesh
                material={partMat('pedal', '#7B4F2E')}
                castShadow
                position={[0, 0.48, -0.32]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
              >
                <boxGeometry args={[0.15, 0.05, 0.48]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 踏轴支架（木架，人站立处） */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <boxGeometry args={[0.75, 0.75, 0.17]} />
          <meshStandardMaterial color="#3A2518" roughness={0.85} />
        </mesh>
        {/* 站板（人踩的工作台） */}
        <mesh position={[0, -0.22, 0.6]} castShadow>
          <boxGeometry args={[0.85, 0.07, 0.6]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>

        {/* ===== 踩踏人形（简笔，站在踏轴上方） ===== */}
        <group position={[0, 0.75, 0.35]}>
          {/* 头 */}
          <mesh castShadow position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#C9A578" roughness={0.7} />
          </mesh>
          {/* 身（略前倾） */}
          <mesh castShadow position={[0, 0.18, 0]} rotation={[0.18, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.14, 0.6, 10]} />
            <meshStandardMaterial color="#8B6F3A" roughness={0.75} />
          </mesh>
          {/* 左腿 */}
          <mesh castShadow position={[-0.09, -0.22, 0.06]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.42, 8]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
          </mesh>
          {/* 右腿 */}
          <mesh castShadow position={[0.09, -0.22, 0.06]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.42, 8]} />
            <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
          </mesh>
          {/* 手（扶前方木架） */}
          <mesh castShadow position={[0, 0.28, 0.22]} rotation={[1.3, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.38, 8]} />
            <meshStandardMaterial color="#C9A578" roughness={0.7} />
          </mesh>
        </group>

        {/* 扶手架（人手扶的木架） */}
        <mesh position={[0, 0.65, 0.6]} castShadow>
          <boxGeometry args={[0.09, 0.55, 0.07]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.92, 0.45]} castShadow>
          <boxGeometry args={[0.45, 0.07, 0.07]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.85} />
        </mesh>
      </group>

      {/* ===== 底部从动轮（浸入水中） ===== */}
      <group position={[0, 0.28, -troughLen / 2 - 0.3]}>
        <group ref={bottomWheelRef}>
          <mesh
            material={partMat('chain', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.65, 12]} />
          </mesh>
          {/* 从动轮齿 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={`bgear-${i}`}
                material={partMat('chain', '#6B4226')}
                castShadow
                position={[Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.11, 0.05, 0.6]} />
              </mesh>
            )
          })}
        </group>
      </group>

      {/* ===== 水面（底部，半透明蓝） ===== */}
      <mesh position={[0, -0.35, -troughLen / 2 - 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#4A7A9A" transparent opacity={0.35} roughness={0.3} />
      </mesh>

      {/* 水流粒子（模拟时显示，在底部水中） */}
      {simSpeed > 0 && <LongguWater speed={simSpeed} troughLen={troughLen} />}
    </group>
  )
}

function LongguWater({ speed, troughLen }) {
  const ref = useRef()
  const count = 45
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.6
      arr[i * 3 + 1] = -1.5 - Math.random() * 0.3
      arr[i * 3 + 2] = -troughLen / 2 - 1.7 + Math.random() * 0.7
    }
    return arr
  }, [troughLen])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 2] += delta * (speed / 50) * 1.5
      if (pos.array[i * 3 + 2] > -troughLen / 2 - 0.9) {
        pos.array[i * 3 + 2] = -troughLen / 2 - 2.0
        pos.array[i * 3 + 1] = -1.5 - Math.random() * 0.3
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
