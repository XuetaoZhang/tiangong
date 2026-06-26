import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 水碓 3D 模型（依《天工开物》明崇祯十年刊本·粹精卷·水碓图复原）
// 部件 ID: wheel(立式水轮), shaft(主轴拐木), hammer(碓杵), mortar(石臼)
// 结构：水流冲击立式水轮 → 水平主轴旋转 → 轴上拐木拨动碓杵末端 → 杵头起落舂击石臼
export default function Shuidui({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()
  const shaftRef = useRef()
  const hammerRefs = useRef([])

  useFrame((state, delta) => {
    const speed = simSpeed > 0 ? (simSpeed / 50) * 0.6 : 0
    if (wheelRef.current) wheelRef.current.rotation.x += delta * speed
    if (shaftRef.current) shaftRef.current.rotation.x += delta * speed

    // 碓杵起落：拐木4根（每90°一根），3个碓杵错相位
    const shaftAngle = shaftRef.current ? shaftRef.current.rotation.x : 0
    hammerRefs.current.forEach((hammer, i) => {
      if (!hammer) return
      const phase = i * (Math.PI / 2)  // 3个碓杵错开90°
      const pegAngle = shaftAngle + phase
      // 拐木接触时抬起，4根拐木每转一周拨动4次
      const lift = Math.max(0, Math.sin(pegAngle * 4)) * 0.35
      hammer.rotation.z = THREE.MathUtils.lerp(hammer.rotation.z, -lift, 0.3)
    })
  })

  const isHi = (id) => highlightedPartId === id
  const woodMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.72,
    metalness: 0.0,
  })
  const stoneMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.9,
    metalness: 0.05,
  })

  const radius = 1.15          // 水轮半径
  const wheelX = -1.7          // 水轮X位置（左侧）
  const wheelY = 0.3           // 水轮中心高度
  const shaftLen = 2.4         // 主轴长度
  const pegCount = 4           // 拐木数量
  const hammerCount = 3        // 碓杵数量

  return (
    <group position={[0, -0.3, 0]}>
      {/* ============ 立式水轮（YZ平面，绕X轴旋转） ============ */}
      <group ref={wheelRef} position={[wheelX, wheelY, 0]}>
        {/* 外圈轮圈 */}
        <mesh material={woodMat('wheel', '#8B6F3A')} rotation={[0, Math.PI / 2, 0]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}>
          <torusGeometry args={[radius, 0.08, 10, 48]} />
        </mesh>
        {/* 挡水叶片（12片，倾斜接收水流） */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <mesh key={`blade-${i}`} material={woodMat('wheel', '#6B4226')}
              position={[0, Math.sin(a) * radius, Math.cos(a) * radius]}
              rotation={[a, 0, Math.PI / 8]} castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}>
              <boxGeometry args={[0.04, 0.38, 0.32]} />
            </mesh>
          )
        })}
        {/* 辐条（8根） */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={`spoke-${i}`} material={woodMat('wheel', '#7B4F2E')}
              position={[0, Math.sin(a) * radius * 0.5, Math.cos(a) * radius * 0.5]}
              rotation={[a, 0, 0]} castShadow>
              <boxGeometry args={[0.06, radius * 0.9, 0.06]} />
            </mesh>
          )
        })}
        {/* 轮毂 */}
        <mesh material={woodMat('wheel', '#5C3A1E')} rotation={[0, Math.PI / 2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
        </mesh>
      </group>

      {/* 水轮立柱支架（两侧） */}
      {[-0.3, 0.3].map((z) => (
        <mesh key={`pillar-${z}`} material={woodMat('wheel', '#5C3A1E')}
          position={[wheelX, -0.8, z]} castShadow>
          <boxGeometry args={[0.12, 2.2, 0.12]} />
        </mesh>
      ))}

      {/* 导水槽（从高处引水冲轮） */}
      <mesh material={woodMat('wheel', '#7B4F2E')} position={[wheelX - 0.8, 1.3, 0]} rotation={[0, 0, -Math.PI / 7]} castShadow>
        <boxGeometry args={[1.0, 0.08, 0.4]} />
      </mesh>

      {/* ============ 主轴与拐木（水平X轴，随水轮旋转） ============ */}
      <group ref={shaftRef} position={[0, wheelY, 0]}>
        {/* 主轴 */}
        <mesh material={woodMat('shaft', '#7B4F2E')} rotation={[0, 0, Math.PI / 2]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('shaft') }}>
          <cylinderGeometry args={[0.11, 0.11, shaftLen, 16]} />
        </mesh>
        {/* 拐木（4根，沿圆周方向，像凸轮拨齿） */}
        {Array.from({ length: pegCount }).map((_, i) => {
          const a = (i / pegCount) * Math.PI * 2
          return (
            <group key={`peg-${i}`}>
              {/* 沿轴长方向3个拨位，对应3个碓杵 */}
              {[-0.7, 0, 0.7].map((px, j) => (
                <mesh key={j} material={woodMat('shaft', '#6B4226')}
                  position={[px, Math.sin(a) * 0.22, Math.cos(a) * 0.22]}
                  rotation={[a, 0, 0]} castShadow
                  onClick={(e) => { e.stopPropagation(); onSelectPart('shaft') }}>
                  <boxGeometry args={[0.18, 0.05, 0.05]} />
                </mesh>
              ))}
            </group>
          )
        })}
        {/* 主轴轴承支架（木质轴承座） */}
        {[-0.9, 0.9].map((x) => (
          <mesh key={`bearing-${x}`} material={woodMat('shaft', '#5C3A1E')}
            position={[x, -0.5, 0]} castShadow>
            <boxGeometry args={[0.18, 1.6, 0.22]} />
          </mesh>
        ))}
      </group>

      {/* ============ 碓杵（3个，杠杆式，被拐木拨起后落下） ============ */}
      {Array.from({ length: hammerCount }).map((_, i) => {
        const px = -0.7 + i * 0.7  // 碓杵沿X位置
        const pivotX = px + 0.5    // 支点位置（靠水轮侧）
        const headX = px - 0.5     // 杵头位置（靠石臼侧）
        return (
          <group key={`hammer-${i}`}>
            {/* 支点立柱 */}
            <mesh material={woodMat('hammer', '#5C3A1E')} position={[pivotX, -0.85, 0]} castShadow>
              <boxGeometry args={[0.1, 1.7, 0.1]} />
            </mesh>
            {/* 支点横轴 */}
            <mesh material={woodMat('hammer', '#3A2518')} position={[pivotX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
            </mesh>
            {/* 碓杵杆（绕支点旋转） */}
            <group ref={(el) => (hammerRefs.current[i] = el)} position={[pivotX, 0, 0]}>
              <mesh material={woodMat('hammer', '#8B6F3A')} position={[-0.5, 0, 0]} castShadow
                onClick={(e) => { e.stopPropagation(); onSelectPart('hammer') }}>
                <boxGeometry args={[1.8, 0.1, 0.1]} />
              </mesh>
              {/* 杵尾（被拐木拨动的一端，靠主轴） */}
              <mesh material={woodMat('hammer', '#6B4226')} position={[0.4, 0.05, 0]} castShadow>
                <boxGeometry args={[0.3, 0.06, 0.16]} />
              </mesh>
              {/* 杵头（落入石臼的一端，装铁套） */}
              <mesh material={woodMat('hammer', '#3A2518')} position={[-1.0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 0.25, 12]} />
              </mesh>
            </group>
          </group>
        )
      })}

      {/* ============ 石臼（3个，承接杵头） ============ */}
      {Array.from({ length: hammerCount }).map((_, i) => {
        const px = -0.7 + i * 0.7 - 1.5
        return (
          <group key={`mortar-${i}`} position={[px, -1.25, 0]}>
            {/* 臼身 */}
            <mesh material={stoneMat('mortar', '#9B9080')} castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart('mortar') }}>
              <cylinderGeometry args={[0.32, 0.38, 0.5, 20]} />
            </mesh>
            {/* 臼内凹坑 */}
            <mesh material={stoneMat('mortar', '#3A3530')} position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.2, 0.12, 0.3, 16]} />
            </mesh>
          </group>
        )
      })}

      {/* 地面木质底架 */}
      <mesh material={woodMat('wheel', '#5C3A1E')} position={[-0.3, -1.55, 0]} castShadow>
        <boxGeometry args={[3.6, 0.1, 1.0]} />
      </mesh>
    </group>
  )
}
