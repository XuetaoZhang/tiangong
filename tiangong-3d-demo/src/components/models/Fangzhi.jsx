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

  const frameLen = 3.2       // 机架总长（约1丈6尺，明代1尺≈31.1cm）
  const frameH = 0.65        // 机架高度
  const towerH = 1.5         // 花楼高度（更高耸，符合"隆起花楼"描述）
  const towerW = 0.85        // 花楼宽度

  return (
    <group position={[0, -0.4, 0]}>
      {/* ============ 机架主体（长方形木框） ============ */}
      {/* 前后两根纵梁 */}
      {[0.45, -0.45].map((z) => (
        <mesh key={`beam-${z}`} material={woodMat('frame', '#8B6F3A')} position={[0, 0, z]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
          <boxGeometry args={[frameLen, 0.12, 0.1]} />
        </mesh>
      ))}
      {/* 四根立柱 */}
      {[[-1.5, 0.45], [1.5, 0.45], [-1.5, -0.45], [1.5, -0.45]].map(([x, z], i) => (
        <mesh key={`post-${i}`} material={woodMat('frame', '#7B4F2E')} position={[x, -frameH / 2, z]} castShadow>
          <boxGeometry args={[0.12, frameH, 0.12]} />
        </mesh>
      ))}
      {/* 机架对角斜撑（底部结构加固，明代工艺特征） */}
      {[
        [[-1.5, 0.45], [1.5, -0.45]],
        [[1.5, 0.45], [-1.5, -0.45]],
      ].map(([[x1, z1], [x2, z2]], i) => {
        const len = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2)
        const midX = (x1 + x2) / 2
        const midZ = (z1 + z2) / 2
        const angle = Math.atan2(x2 - x1, z2 - z1)
        return (
          <mesh key={`frame-brace-${i}`} material={woodMat('frame', '#6B4226')}
            position={[midX, -frameH + 0.1, midZ]}
            rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, len]} />
          </mesh>
        )
      })}
      {/* 经轴（后端，缠绕经线） */}
      <mesh material={woodMat('frame', '#6B4226')} position={[-1.5, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <cylinderGeometry args={[0.13, 0.13, 1.0, 16]} />
      </mesh>
      {/* 卷布轴（前端，卷绕织成的布） */}
      <mesh material={woodMat('frame', '#6B4226')} position={[1.5, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <cylinderGeometry args={[0.13, 0.13, 1.0, 16]} />
      </mesh>

      {/* ============ 花楼（中部高耸，提花工操作台） ============ */}
      {/* 花楼四根高立柱（更粗壮） */}
      {[[-0.4, 0.45], [0.4, 0.45], [-0.4, -0.45], [0.4, -0.45]].map(([x, z], i) => (
        <mesh key={`tower-post-${i}`} material={woodMat('frame', '#7B4F2E')} position={[x, towerH / 2, z]} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
          <boxGeometry args={[0.1, towerH, 0.1]} />
        </mesh>
      ))}
      {/* 花楼对角斜撑（结构加固，符合明代木工技艺） */}
      {[
        [[-0.4, -0.45], [0.4, 0.45]],  // 左后到右前
        [[0.4, -0.45], [-0.4, 0.45]],  // 右后到左前
      ].map(([[x1, z1], [x2, z2]], i) => {
        const len = Math.sqrt((x2 - x1) ** 2 + towerH ** 2 + (z2 - z1) ** 2)
        const midX = (x1 + x2) / 2
        const midZ = (z1 + z2) / 2
        const angleY = Math.atan2(x2 - x1, z2 - z1)
        const angleZ = Math.atan2(towerH, Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2))
        return (
          <mesh key={`brace-${i}`} material={woodMat('frame', '#6B4226')}
            position={[midX, towerH / 2, midZ]}
            rotation={[0, angleY, angleZ]} castShadow>
            <boxGeometry args={[0.06, 0.06, len]} />
          </mesh>
        )
      })}
      {/* 花楼中部横向加固梁（前后） */}
      {[0.45, -0.45].map((z, i) => (
        <mesh key={`tower-beam-${i}`} material={woodMat('frame', '#7B4F2E')}
          position={[0, towerH * 0.6, z]} castShadow>
          <boxGeometry args={[0.88, 0.07, 0.08]} />
        </mesh>
      ))}
      {/* 花楼顶部横梁（坐板） */}
      <mesh material={woodMat('frame', '#8B6F3A')} position={[0, towerH, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('frame') }}>
        <boxGeometry args={[towerW + 0.2, 0.08, 1.0]} />
      </mesh>
      {/* 花楼顶蓬（小屋檐，符合原画） */}
      <mesh material={woodMat('frame', '#5C3A1E')} position={[0, towerH + 0.2, 0]} castShadow>
        <boxGeometry args={[towerW + 0.5, 0.05, 1.15]} />
      </mesh>
      {/* 花楼顶蓬支撑（四角） */}
      {[[-0.4, 0.5], [0.4, 0.5], [-0.4, -0.5], [0.4, -0.5]].map(([x, z], i) => (
        <mesh key={`roof-support-${i}`} material={woodMat('frame', '#6B4226')}
          position={[x, towerH + 0.1, z]} castShadow>
          <boxGeometry args={[0.05, 0.12, 0.05]} />
        </mesh>
      ))}

      {/* ============ 衢盘衢脚（花本：顶部线团+下垂牵引线系统） ============ */}
      <group ref={heddleRef} position={[0, 0.1, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('heddle') }}>
        {/* 衢盘横木（悬挂线团的主梁） */}
        <mesh material={woodMat('heddle', '#6B4226')} position={[0, towerH - 0.2, 0]} castShadow>
          <boxGeometry args={[towerW, 0.07, 0.09]} />
        </mesh>
        {/* 衢盘纵木（增加前后梁，形成框架结构） */}
        {[-0.35, 0.35].map((x, i) => (
          <mesh key={`qupan-beam-${i}`} material={woodMat('heddle', '#6B4226')}
            position={[x, towerH - 0.2, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, 0.8]} />
          </mesh>
        ))}
        {/* 衢盘线团组（提花程序的载体，增加到18组以体现"1800根"的规模感） */}
        {Array.from({ length: 18 }).map((_, i) => {
          const x = -0.42 + i * 0.048
          const zOffset = (i % 2) * 0.08 - 0.04  // 交错排列，增加密度感
          return (
            <group key={i} position={[x, towerH - 0.2, zOffset]}>
              {/* 线团（卷绕的提花线，更细密） */}
              <mesh material={silkMat('heddle', '#A0825A')} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.1, 10]} />
              </mesh>
              {/* 线团轴 */}
              <mesh material={woodMat('heddle', '#5C3A1E')} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
              </mesh>
            </group>
          )
        })}
        {/* 衢脚（下垂的牵引线束，增加到54根，每组3根） */}
        {Array.from({ length: 54 }).map((_, i) => {
          const groupIdx = Math.floor(i / 3)
          const subIdx = i % 3
          const x = -0.42 + groupIdx * 0.048 + (subIdx - 1) * 0.015
          const zOffset = (groupIdx % 2) * 0.08 - 0.04
          return (
            <mesh key={i} material={silkMat('heddle', '#D4A574')}
              position={[x, towerH / 2 - 0.05, zOffset]}>
              <cylinderGeometry args={[0.003, 0.003, towerH - 0.3, 6]} />
            </mesh>
          )
        })}
        {/* 衢脚底部连接横木（连接综片） */}
        <mesh material={woodMat('heddle', '#7B4F2E')} position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[towerW + 0.1, 0.05, 0.08]} />
        </mesh>
      </group>

      {/* ============ 综片（经线分层机构，被衢脚牵引，4片） ============ */}
      {[-0.25, -0.08, 0.08, 0.25].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* 综框上横木（粗壮） */}
          <mesh material={woodMat('heddle', '#7B4F2E')} position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[towerW + 0.1, 0.05, 0.05]} />
          </mesh>
          {/* 综框下横木 */}
          <mesh material={woodMat('heddle', '#7B4F2E')} position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[towerW + 0.1, 0.04, 0.04]} />
          </mesh>
          {/* 综框左右竖木 */}
          <mesh material={woodMat('heddle', '#6B4226')} position={[-towerW / 2 - 0.03, 0.05, 0]} castShadow>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
          </mesh>
          <mesh material={woodMat('heddle', '#6B4226')} position={[towerW / 2 + 0.03, 0.05, 0]} castShadow>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
          </mesh>
          {/* 综丝（细线，穿经线用，15根） */}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} material={silkMat('heddle', '#C9A578')} position={[-0.45 + i * 0.065, 0.05, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.3, 5]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ============ 经线（贯穿机架的水平线，密集排列） ============ */}
      {Array.from({ length: 48 }).map((_, i) => {
        const z = -0.44 + i * 0.0185
        return (
          <mesh key={i} material={silkMat('frame', '#E8DCC0')} position={[0, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.002, 0.002, frameLen - 0.3, 4]} />
          </mesh>
        )
      })}

      {/* ============ 踏板（机架下方，织工脚踏控制综片，4个对应4片综） ============ */}
      {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
        <group key={i} ref={(el) => (pedalRefs.current[i] = el)} position={[x, -frameH / 2 - 0.08, 0.4]}>
          <mesh material={woodMat('pedal', '#8B6F3A')} castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}>
            <boxGeometry args={[0.2, 0.05, 0.38]} />
          </mesh>
          {/* 踏板支点（前端连接地面的支点） */}
          <mesh material={woodMat('pedal', '#6B4226')} position={[0, -0.08, 0.16]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          </mesh>
          {/* 踏板连杆（连接对应的综片，更粗壮可见） */}
          <mesh material={woodMat('pedal', '#7B4F2E')} position={[0, 0.35, -0.18]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          </mesh>
          {/* 连杆与综框的连接点（小木块） */}
          <mesh material={woodMat('pedal', '#6B4226')} position={[0, 0.7, -0.18]} castShadow>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
          </mesh>
        </group>
      ))}

      {/* ============ 梭子（流线型小船，左右穿梭引纬） ============ */}
      <group ref={shuttleRef} position={[0, 0.15, 0]}>
        {/* 梭子主体（流线型船形，前后尖） */}
        <mesh material={woodMat('shuttle', '#5C3A1E')} castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('shuttle') }}>
          <boxGeometry args={[0.32, 0.06, 0.09]} />
        </mesh>
        {/* 梭子前尖 */}
        <mesh material={woodMat('shuttle', '#5C3A1E')} position={[-0.19, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.08, 0.05, 0.08]} />
        </mesh>
        {/* 梭子后尖 */}
        <mesh material={woodMat('shuttle', '#5C3A1E')} position={[0.19, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.08, 0.05, 0.08]} />
        </mesh>
        {/* 梭子内的纬线管（纡子） */}
        <mesh material={silkMat('shuttle', '#D4A574')} position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.16, 8]} />
        </mesh>
      </group>

      {/* 筘（打纬器，把纬线打紧，密集细条状） */}
      <group position={[0.7, 0.15, 0]}>
        {/* 筘框 */}
        <mesh material={woodMat('shuttle', '#7B4F2E')} castShadow>
          <boxGeometry args={[0.06, 0.2, 0.94]} />
        </mesh>
        {/* 筘齿（密集的细竖条，共30根） */}
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i} material={woodMat('shuttle', '#8B6F3A')} position={[0, 0, -0.44 + i * 0.03]}>
            <boxGeometry args={[0.03, 0.18, 0.008]} />
          </mesh>
        ))}
      </group>

      {/* 底座（更宽厚，稳固机架） */}
      <mesh material={woodMat('frame', '#3A2518')} position={[0, -frameH - 0.08, 0]} castShadow>
        <boxGeometry args={[frameLen + 0.6, 0.1, 1.3]} />
      </mesh>
    </group>
  )
}
