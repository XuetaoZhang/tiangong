import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 鼓风炉 3D 模型（依《天工开物》明崇祯十年刊本·冶铸卷·铸鼎图复原）
// 部件 ID: furnace(炉体), tuyere(风口风沟), bellows(风箱), stack(烟囱炉口)
// 结构：土筑竖炉 + 侧面风箱 + 风口送风 + 顶部炉口排烟加料
export default function Gufeng({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const bellowsRef = useRef()
  const glowRef = useRef()
  const smokeRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = simSpeed > 0 ? simSpeed / 50 : 0
    // 风箱推拉
    if (bellowsRef.current) {
      bellowsRef.current.position.x = 1.5 + Math.sin(t * 2.5 * speed) * 0.18
    }
    // 炉内火光闪烁
    if (glowRef.current) {
      const flicker = 0.6 + Math.sin(t * 8) * 0.15 + Math.random() * 0.1
      glowRef.current.material.opacity = speed > 0 ? flicker : 0.2
    }
    // 烟囱烟气
    if (smokeRef.current) {
      smokeRef.current.position.y = 2.0 + (t * speed * 0.5) % 0.8
      smokeRef.current.material.opacity = speed > 0 ? 0.4 - ((t * speed * 0.5) % 0.8) * 0.4 : 0.15
    }
  })

  const isHi = (id) => highlightedPartId === id
  const clayMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.95,
    metalness: 0.0,
  })
  const woodMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.72,
    metalness: 0.0,
  })

  const furnaceH = 2.0       // 炉体高度
  const furnaceRB = 0.75     // 炉底半径
  const furnaceRT = 0.55     // 炉顶半径（腰鼓形上口）
  const furnaceRM = 0.85     // 炉腰半径（腰鼓形最宽处）

  return (
    <group position={[0, -0.3, 0]}>
      {/* ============ 炉体（土筑竖炉，腰鼓形） ============ */}
      {/* 主炉身（用球体压扁模拟腰鼓形） */}
      <mesh material={clayMat('furnace', '#8B5A3C')} position={[0, furnaceH / 2, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}
        scale={[1, furnaceH / (furnaceRM * 2), 1]}>
        <sphereGeometry args={[furnaceRM, 24, 24]} />
      </mesh>
      {/* 炉底基座（更宽的底座） */}
      <mesh material={clayMat('furnace', '#6B4226')} position={[0, 0.1, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}>
        <cylinderGeometry args={[furnaceRB, furnaceRB + 0.1, 0.3, 20]} />
      </mesh>
      {/* 炉口（顶部收口环） */}
      <mesh material={clayMat('furnace', '#5C3A1E')} position={[0, furnaceH + 0.05, 0]} castShadow>
        <cylinderGeometry args={[furnaceRT, furnaceRT + 0.08, 0.18, 20]} />
      </mesh>
      {/* 炉体加固铁箍（3道） */}
      {[0.5, 1.0, 1.5].map((y, i) => (
        <mesh key={i} material={clayMat('furnace', '#3A2518')} position={[0, y, 0]}>
          <torusGeometry args={[furnaceRM - 0.05 + (y > 1 ? -0.1 : 0), 0.025, 6, 24]} />
        </mesh>
      ))}

      {/* 炉内火光（透过炉口的发光体） */}
      <mesh ref={glowRef} position={[0, furnaceH - 0.1, 0]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color='#FF6B1A' emissive='#FF4500' emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>

      {/* ============ 烟囱炉口（顶部排烟加料口） ============ */}
      <group position={[0, furnaceH + 0.4, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('stack') }}>
        {/* 烟气柱 */}
        <mesh ref={smokeRef} position={[0, 0.3, 0]}>
          <coneGeometry args={[0.3, 1.0, 12]} />
          <meshStandardMaterial color='#5A5048' transparent opacity={0.3} depthWrite={false} />
        </mesh>
        {/* 炉口边缘标记 */}
        <mesh material={clayMat('stack', '#3A2518')}>
          <torusGeometry args={[furnaceRT - 0.05, 0.04, 6, 20]} />
        </mesh>
      </group>

      {/* ============ 风箱（侧面活塞式鼓风器） ============ */}
      <group ref={bellowsRef} position={[1.5, 0.9, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('bellows') }}>
        {/* 风箱箱体（长方形木箱） */}
        <mesh material={woodMat('bellows', '#8B6F3A')} castShadow>
          <boxGeometry args={[1.0, 0.5, 0.5]} />
        </mesh>
        {/* 风箱活塞杆（外露的拉杆） */}
        <mesh material={woodMat('bellows', '#5C3A1E')} position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        </mesh>
        {/* 拉杆把手 */}
        <mesh material={woodMat('bellows', '#3A2518')} position={[1.0, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.18, 0.06]} />
        </mesh>
        {/* 风箱出风口（连接炉体） */}
        <mesh material={woodMat('bellows', '#6B4226')} position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.2, 12]} />
        </mesh>
        {/* 风箱支架 */}
        <mesh material={woodMat('bellows', '#5C3A1E')} position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
        </mesh>
      </group>

      {/* ============ 风口风沟（风箱到炉体的送风通道） ============ */}
      <group onClick={(e) => { e.stopPropagation(); onSelectPart('tuyere') }}>
        {/* 送风管（连接风箱与炉体） */}
        <mesh material={clayMat('tuyere', '#5C3A1E')} position={[0.85, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.6, 12]} />
        </mesh>
        {/* 炉体风口（穿孔标记） */}
        <mesh material={clayMat('tuyere', '#2A1810')} position={[furnaceRM - 0.05, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 10]} />
        </mesh>
        {/* 炉底风沟（地面通风道） */}
        <mesh material={clayMat('tuyere', '#6B4226')} position={[0, 0.05, 0.3]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.15]} />
        </mesh>
      </group>

      {/* ============ 炉基与工作台 ============ */}
      {/* 夯土炉基 */}
      <mesh material={clayMat('furnace', '#6B4226')} position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[furnaceRB + 0.3, furnaceRB + 0.5, 0.3, 20]} />
      </mesh>
      {/* 工作地面 */}
      <mesh material={woodMat('furnace', '#3A2518')} position={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[3.5, 0.08, 1.6]} />
      </mesh>
      {/* 炉体加固木支撑（4根斜撑） */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        return (
          <mesh key={i} material={woodMat('furnace', '#5C3A1E')}
            position={[Math.cos(a) * (furnaceRB + 0.3), 0.5, Math.sin(a) * (furnaceRB + 0.3)]}
            rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 1.4, 0.08]} />
          </mesh>
        )
      })}

      {/* 铁范（铸模，炉子前方承接铜汁） */}
      <mesh material={clayMat('furnace', '#3A2518')} position={[-0.9, -0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
      </mesh>
      <mesh material={clayMat('furnace', '#1A0F08')} position={[-0.9, -0.1, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
      </mesh>
    </group>
  )
}
