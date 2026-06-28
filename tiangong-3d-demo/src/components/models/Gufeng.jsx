import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 鼓风炉 3D 模型（依《天工开物》明崇祯十年刊本·冶铸卷·铸鼎图复原）
// 部件 ID: furnace(炉体), tuyere(风口风沟), bellows(风箱), stack(烟囱炉口)
// 结构：土筑竖炉 + 侧面风箱 + 风口送风 + 顶部炉口排烟加料
export default function Gufeng({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const pistonRef = useRef()
  const glowRef = useRef()
  const smokeRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = simSpeed > 0 ? simSpeed / 50 : 0
    // 活塞推拉（只有推杆和手柄移动，风箱主体固定）
    if (pistonRef.current) {
      pistonRef.current.position.x = Math.sin(t * 2.5 * speed) * 0.2 +0.55
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
  const furnaceRB = 0.6      // 炉底半径（缩小以匹配古籍插图）
  const furnaceRT = 0.45     // 炉顶半径（收口）
  const furnaceRM = 0.68     // 炉腰半径（减小腰鼓形宽度）

  return (
    <group position={[0, -0.3, 0]}>
      {/* ============ 炉体（土筑竖炉，腰鼓形：下圆柱+中腰鼓+上收口） ============ */}
      {/* 炉下段（圆柱形炉身，0.3-0.8m） */}
      <mesh material={clayMat('furnace', '#8B5A3C')} position={[0, 0.55, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}>
        <cylinderGeometry args={[furnaceRB, furnaceRB, 0.5, 24]} />
      </mesh>
      {/* 炉中段腰鼓（最宽处，0.8-1.4m） */}
      <mesh material={clayMat('furnace', '#8B5A3C')} position={[0, 1.1, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}>
        <cylinderGeometry args={[furnaceRM, furnaceRB, 0.6, 24]} />
      </mesh>
      {/* 炉上段（收口段，1.4-2.0m） */}
      <mesh material={clayMat('furnace', '#7B4A2E')} position={[0, 1.7, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}>
        <cylinderGeometry args={[furnaceRT, furnaceRM, 0.6, 24]} />
      </mesh>
      {/* 炉底基座（更宽的底座） */}
      <mesh material={clayMat('furnace', '#6B4226')} position={[0, 0.15, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('furnace') }}>
        <cylinderGeometry args={[furnaceRB + 0.05, furnaceRB + 0.15, 0.3, 20]} />
      </mesh>
      {/* 炉缸（底部积聚铜液的区域，内凹标记） */}
      <mesh material={clayMat('furnace', '#2A1810')} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[furnaceRB - 0.15, furnaceRB - 0.1, 0.2, 16]} />
      </mesh>
      {/* 炉口（顶部收口环） */}
      <mesh material={clayMat('furnace', '#5C3A1E')} position={[0, furnaceH + 0.05, 0]} castShadow>
        <cylinderGeometry args={[furnaceRT, furnaceRT + 0.08, 0.18, 20]} />
      </mesh>
      {/* 炉体加固铁箍（简化为2道） */}
      {[0.7, 1.3].map((y, i) => (
        <mesh key={i} material={clayMat('furnace', '#3A2518')} position={[0, y, 0]}>
          <torusGeometry args={[furnaceRM - 0.05 + (y > 1 ? -0.08 : 0), 0.022, 6, 24]} />
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

      {/* ============ 风箱（侧面活塞式鼓风器，箱体固定，只有推杆运动） ============ */}
      <group position={[1.3, 0.2, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('bellows') }}>
        {/* 风箱主体（固定的大木箱，不会移动） */}
        <mesh material={woodMat('bellows', '#8B6F3A')} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.4, 0.5]} />
        </mesh>

        {/* 风箱前端封板 */}
        <mesh material={woodMat('bellows', '#7B4F2E')} position={[-0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.52, 0.42, 0.04]} />
        </mesh>

        {/* 风箱后端封板（带有活塞孔） */}
        <mesh material={woodMat('bellows', '#7B4F2E')} position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.52, 0.42, 0.04]} />
        </mesh>

        {/* 风箱出风口 */}
        <mesh material={clayMat('bellows', '#7B4A2E')} position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.09, 0.2, 12]} />
        </mesh>

        {/* 风箱支撑腿（四根腿接地，固定箱体） */}
        {[
          [-0.35, -0.5, -0.18],
          [-0.35, -0.5, 0.18],
          [0.35, -0.5, -0.18],
          [0.35, -0.5, 0.18]
        ].map(([x, y, z], i) => (
          <mesh key={i} material={woodMat('bellows', '#5C3A1E')} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.0, 8]} />
          </mesh>
        ))}

        {/* 活塞推拉机构（这部分会移动） */}
        <group ref={pistonRef} position={[0.7, 0, 0]}>
          {/* 活塞推杆（从箱体后端伸出，明显可见） */}
          <mesh material={woodMat('bellows', '#5C3A1E')} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
          </mesh>

          {/* 推杆手柄（人推拉的地方，更大更明显） */}
          <mesh material={woodMat('bellows', '#3A2518')} position={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.25, 0.08]} />
          </mesh>

          {/* 手柄横木（便于抓握） */}
          <mesh material={woodMat('bellows', '#2A1810')} position={[0.35, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
          </mesh>
        </group>
      </group>

      {/* ============ 风口风沟（风箱到炉体的送风通道） ============ */}
      <group onClick={(e) => { e.stopPropagation(); onSelectPart('tuyere') }}>
        {/* 主送风管（从风箱连接到炉体，调整高度匹配新的风箱位置） */}
        <mesh material={clayMat('tuyere', '#5C3A1E')} position={[0.68, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.10, 0.65, 12]} />
        </mesh>
        {/* 炉体主风口（侧面穿孔） */}
        <mesh material={clayMat('tuyere', '#2A1810')} position={[furnaceRB - 0.05, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 10]} />
        </mesh>
        {/* 炉底风沟（地面通风道） */}
        <mesh material={clayMat('tuyere', '#6B4226')} position={[0, 0.08, 0.3]} castShadow>
          <boxGeometry args={[1.2, 0.10, 0.18]} />
        </mesh>
        {/* 风沟盖板（木制） */}
        <mesh material={woodMat('tuyere', '#5C3A1E')} position={[0, 0.14, 0.3]} castShadow>
          <boxGeometry args={[1.2, 0.03, 0.20]} />
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

      {/* 铁范（铸模，炉子前方承接铜汁，简化设计） */}
      <mesh material={clayMat('furnace', '#3A2518')} position={[-0.85, -0.18, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.38]} />
      </mesh>
      <mesh material={clayMat('furnace', '#1A0F08')} position={[-0.85, -0.08, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.35]} />
      </mesh>
    </group>
  )
}
