import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 雕版印刷 3D 模型
// 依《天工开物》明崇祯十年刊本·丹青卷·松烟制墨插图 + 明代雕版印刷工艺复原
// 部件 ID: block(雕版), ink(松烟墨), brush(棕刷), paper(宣纸印页)
// 结构：木雕版平放 → 棕刷蘸松烟墨匀刷版面 → 覆宣纸 → 棕刷擦压 → 揭纸成页
export default function Diaoban({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const brushRef = useRef()
  const paperRef = useRef()
  const inkBallRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = simSpeed > 0 ? simSpeed / 50 : 0
    // 棕刷：先在墨池蘸墨(左)，再到版面匀刷(右)，循环
    if (brushRef.current) {
      const cycle = (t * 0.6 * speed) % 1
      if (cycle < 0.3) {
        // 蘸墨阶段：移到墨池
        brushRef.current.position.x = -0.9 + Math.sin(cycle * 10) * 0.05
        brushRef.current.position.z = 0.5
        brushRef.current.position.y = 0.45
      } else {
        // 刷版阶段：在版面左右擦
        brushRef.current.position.x = -0.3 + (cycle - 0.3) * 1.5
        brushRef.current.position.z = 0
        brushRef.current.position.y = 0.4
      }
    }
    // 纸张：覆下-擦印-揭起 循环
    if (paperRef.current) {
      const cycle = (t * 0.6 * speed) % 1
      if (cycle < 0.6) {
        // 覆纸擦印阶段（贴近版面）
        paperRef.current.position.y = 0.42 + Math.sin(cycle * 8) * 0.02
      } else {
        // 揭纸阶段（上升）
        paperRef.current.position.y = 0.42 + (cycle - 0.6) * 1.2
      }
    }
    // 墨池表面波动
    if (inkBallRef.current) {
      inkBallRef.current.position.y = 0.38 + Math.sin(t * 3) * 0.01
    }
  })

  const isHi = (id) => highlightedPartId === id
  const woodMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.72,
    metalness: 0.0,
  })
  const inkMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.4,
    metalness: 0.1,
  })
  const paperMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: 0.85,
    metalness: 0.0,
  })

  // 雕版上的字（程序化凸起小方块，模拟反刻阳文）
  const typeChars = useMemo(() => {
    const arr = []
    const chars = ['天', '工', '開', '物', '丹', '青', '松', '烟', '製', '墨', '雕', '版', '印', '刷', '術', '梨', '木', '棗']
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        arr.push({
          x: -0.5 + c * 0.18,
          z: -0.18 + r * 0.18,
          char: chars[r * 6 + c],
        })
      }
    }
    return arr
  }, [])

  return (
    <group position={[0, -0.3, 0]}>
      {/* ============ 雕版（梨木厚板，平放，凸起阳文字） ============ */}
      <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('block') }}>
        {/* 版身（厚木板） */}
        <mesh material={woodMat('block', '#8B6F3A')} position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.18, 0.7]} />
        </mesh>
        {/* 版面边框（刻槽） */}
        <mesh material={woodMat('block', '#6B4226')} position={[0, 0.245, 0]}>
          <boxGeometry args={[1.4, 0.02, 0.62]} />
        </mesh>
        {/* 凸起阳文字（18个，反刻模拟） */}
        {typeChars.map((t, i) => (
          <mesh key={i} material={woodMat('block', '#5C3A1E')} position={[t.x, 0.265, t.z]} castShadow>
            <boxGeometry args={[0.14, 0.04, 0.14]} />
          </mesh>
        ))}
        {/* 版侧把手（两端） */}
        {[-0.78, 0.78].map((x) => (
          <mesh key={x} material={woodMat('block', '#6B4226')} position={[x, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.75, 8]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        ))}
      </group>

      {/* ============ 松烟墨（墨池+墨锭） ============ */}
      <group position={[-0.9, 0, 0.5]} onClick={(e) => { e.stopPropagation(); onSelectPart('ink') }}>
        {/* 墨池（圆形浅碟） */}
        <mesh material={woodMat('ink', '#5C3A1E')} position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.08, 20]} />
        </mesh>
        {/* 墨汁（黑色液体面） */}
        <mesh ref={inkBallRef} material={inkMat('ink', '#1A1410')} position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 20]} />
        </mesh>
        {/* 墨锭（长条形固体墨） */}
        <mesh material={inkMat('ink', '#2A2520')} position={[0.3, 0.22, 0.1]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.25, 0.06, 0.08]} />
        </mesh>
      </group>

      {/* ============ 棕刷（棕榈纤维束，用于蘸墨刷版+擦印） ============ */}
      <group ref={brushRef} position={[-0.9, 0.45, 0.5]} onClick={(e) => { e.stopPropagation(); onSelectPart('brush') }}>
        {/* 刷柄（木柄） */}
        <mesh material={woodMat('brush', '#8B6F3A')} position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.22, 8]} />
        </mesh>
        {/* 刷毛束（棕榈纤维） */}
        <mesh material={woodMat('brush', '#3A2518')} position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.16, 12]} />
        </mesh>
        {/* 刷毛尖端散开 */}
        <mesh material={woodMat('brush', '#2A1810')} position={[0, -0.08, 0]}>
          <coneGeometry args={[0.09, 0.08, 12]} />
        </mesh>
      </group>

      {/* ============ 宣纸印页（覆于版上，上下移动模拟覆纸-揭纸） ============ */}
      <mesh ref={paperRef} material={paperMat('paper', '#F4ECD8')} position={[0, 0.42, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart('paper') }}>
        <boxGeometry args={[1.45, 0.012, 0.68]} />
      </mesh>
      {/* 已印好的印页（堆叠在右侧） */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={paperMat('paper', '#EDE3CC')} position={[1.1, 0.05 + i * 0.02, -0.1 + i * 0.05]} castShadow rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.7, 0.008, 0.5]} />
        </mesh>
      ))}

      {/* ============ 工作台（雕版印刷台案） ============ */}
      <mesh material={woodMat('block', '#5C3A1E')} position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.1, 1.5]} />
      </mesh>
      {/* 台案支腿 */}
      {[[-1.1, 0.6], [1.1, 0.6], [-1.1, -0.6], [1.1, -0.6]].map(([x, z], i) => (
        <mesh key={i} material={woodMat('block', '#3A2518')} position={[x, -0.55, z]} castShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
        </mesh>
      ))}

      {/* 雕版工具：刻刀（搁在台案上） */}
      <mesh material={inkMat('brush', '#4A4038')} position={[0.8, 0.02, 0.4]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.25]} />
      </mesh>
      <mesh material={woodMat('brush', '#8B6F3A')} position={[0.8, 0.02, 0.52]} rotation={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
      </mesh>
    </group>
  )
}
