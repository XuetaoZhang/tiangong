import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 纺织机（花楼机）3D 模型（依《天工开物》明崇祯十年刊本·乃服卷·花机图复原）
// 部件 ID: frame(机架花楼), heddle(衢盘衢脚), pedal(踏板蹑), shuttle(梭子)
// 结构：长机架 + 中部高耸花楼（衢盘衢脚）+ 经轴/卷布轴 + 综片 + 踏板 + 梭子
export default function Fangzhi({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const heddleRef = useRef()
  const shuttleRef = useRef()
  const pedalRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = simSpeed > 0 ? simSpeed / 50 : 0
    // 综片上下浮动（提花动作）
    if (heddleRef.current) {
      heddleRef.current.position.y = 0.1 + Math.sin(t * 2 * speed) * 0.08
    }
    // 梭子左右穿梭
    if (shuttleRef.current) {
      shuttleRef.current.position.x = Math.sin(t * 1.5 * speed) * 1.2
    }
    // 踏板起伏
    pedalRefs.current.forEach((p, i) => {
      if (p) p.rotation.x = Math.sin(t * 2 * speed + i * Math.PI) * 0.15
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
  const silkMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.5,
    metalness: 0.0,
  })

  const frameLen = 3.4       // 机架总长
  const frameH = 0.7         // 机架高度
  const towerH = 1.3         // 花楼高度（中部隆起）
  const towerW = 0.9         // 花楼宽度

  return (
    <group position={[0, -0.4, 0]}>
      {/* ============ 机架主体（长方形木框） ============ */}
      {/* 前后两根纵梁 */}
      {[0.45, -0.45].map((z) => (
        <mesh key={`beam-${z}`} material={woodMat('frame', '#8B6F3A')} position={[0, 0, z]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
          <boxGeometry args={[frameLen, 0.1, 0.08]} />
        </mesh>
      ))}
      {/* 四根立柱 */}
      {[[-1.6, 0.45], [1.6, 0.45], [-1.6, -0.45], [1.6, -0.45]].map(([x, z], i) => (
        <mesh key={`post-${i}`} material={woodMat('frame', '#7B4F2E')} position={[x, -frameH / 2, z]} castShadow>
          <boxGeometry args={[0.1, frameH, 0.1]} />
        </mesh>
      ))}
      {/* 经轴（后端，缠绕经线） */}
      <mesh material={woodMat('frame', '#6B4226')} position={[-1.6, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 14]} />
      </mesh>
      {/* 卷布轴（前端，卷绕织成的布） */}
      <mesh material={woodMat('frame', '#6B4226')} position={[1.6, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 14]} />
      </mesh>

      {/* ============ 花楼（中部高耸，提花工操作台） ============ */}
      {/* 花楼四根高立柱 */}
      {[[-0.4, 0.45], [0.4, 0.45], [-0.4, -0.45], [0.4, -0.45]].map(([x, z], i) => (
        <mesh key={`tower-post-${i}`} material={woodMat('frame', '#7B4F2E')} position={[x, towerH / 2, z]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
          <boxGeometry args={[0.08, towerH, 0.08]} />
        </mesh>
      ))}
      {/* 花楼顶部横梁（坐板） */}
      <mesh material={woodMat('frame', '#8B6F3A')} position={[0, towerH, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <boxGeometry args={[towerW + 0.2, 0.06, 1.0]} />
      </mesh>
      {/* 花楼顶蓬（小屋檐） */}
      <mesh material={woodMat('frame', '#5C3A1E')} position={[0, towerH + 0.18, 0]} castShadow>
        <boxGeometry args={[towerW + 0.4, 0.06, 1.1]} />
      </mesh>

      {/* ============ 衢盘衢脚（花本：顶部线团+下垂牵引线） ============ */}
      <group ref={heddleRef} position={[0, 0.1, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('heddle') }}>
        {/* 衢盘（顶部线轴架，多组线团） */}
        {Array.from({ length: 7 }).map((_, i) => {
          const x = -0.42 + i * 0.14
          return (
            <mesh key={i} material={woodMat('heddle', '#A0825A')} position={[x, towerH - 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.18, 10]} />
            </mesh>
          )
        })}
        {/* 衢盘横木 */}
        <mesh material={woodMat('heddle', '#6B4226')} position={[0, towerH - 0.15, 0]}>
          <boxGeometry args={[towerW, 0.04, 0.04]} />
        </mesh>
        {/* 衢脚（下垂的牵引线，连接综片） */}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = -0.45 + i * 0.07
          return (
            <mesh key={i} material={silkMat('heddle', '#D4A574')} position={[x, towerH / 2 - 0.1, 0]}>
              <cylinderGeometry args={[0.005, 0.005, towerH - 0.3, 6]} />
            </mesh>
          )
        })}
      </group>

      {/* ============ 综片（经线分层机构，被衢脚牵引） ============ */}
      {/* 两片综框，前后各一 */}
      {[0.2, -0.2].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* 综框上下横木 */}
          <mesh material={woodMat('heddle', '#7B4F2E')} position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[towerW, 0.04, 0.04]} />
          </mesh>
          <mesh material={woodMat('heddle', '#7B4F2E')} position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[towerW, 0.04, 0.04]} />
          </mesh>
          {/* 综丝（细线，穿经线用） */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} material={silkMat('heddle', '#C9A578')} position={[-0.4 + i * 0.09, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.3, 5]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ============ 经线（贯穿机架的水平线） ============ */}
      {Array.from({ length: 18 }).map((_, i) => {
        const z = -0.4 + i * 0.047
        return (
          <mesh key={i} material={silkMat('frame', '#E8DCC0')} position={[0, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.003, 0.003, frameLen - 0.3, 4]} />
          </mesh>
        )
      })}

      {/* ============ 踏板（机架下方，织工脚踏控制综片） ============ */}
      {[-0.25, 0.25].map((x, i) => (
        <group key={i} ref={(el) => (pedalRefs.current[i] = el)} position={[x, -frameH / 2 - 0.05, 0.3]}>
          <mesh material={woodMat('pedal', '#8B6F3A')} castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}>
            <boxGeometry args={[0.22, 0.04, 0.4]} />
          </mesh>
          {/* 踏板连杆（连接综片） */}
          <mesh material={woodMat('pedal', '#6B4226')} position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
          </mesh>
        </group>
      ))}

      {/* ============ 梭子（流线型小船，左右穿梭引纬） ============ */}
      <mesh ref={shuttleRef} material={woodMat('shuttle', '#5C3A1E')} position={[0, 0.15, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('shuttle') }}>
        <boxGeometry args={[0.28, 0.05, 0.08]} />
      </mesh>
      {/* 梭子内的纬线管 */}
      <mesh material={silkMat('shuttle', '#D4A574')} position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
      </mesh>

      {/* 筘（打纬器，把纬线打紧） */}
      <mesh material={woodMat('shuttle', '#7B4F2E')} position={[0.7, 0.15, 0]} castShadow>
        <boxGeometry args={[0.06, 0.18, 0.9]} />
      </mesh>

      {/* 底座 */}
      <mesh material={woodMat('frame', '#3A2518')} position={[0, -frameH - 0.05, 0]} castShadow>
        <boxGeometry args={[frameLen + 0.4, 0.08, 1.2]} />
      </mesh>
    </group>
  )
}
