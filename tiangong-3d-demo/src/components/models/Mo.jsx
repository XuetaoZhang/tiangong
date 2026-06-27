import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 墨（松烟制墨·烧取松烟）3D 模型
// 依《天工开物》明崇祯十年刊本·丹青卷·"烧取松烟"插图 + 原文复原
// 原文："凡烧松烟，伐松斩成尺寸，鞠篾为圆屋如舟中雨篷式，接连十余丈。
//        内外与接口皆以纸及席糊固完成。隔位数节，小孔出烟，
//        其下掩土砌砖先为通烟道路。燃薪数日，歇冷入中扫刮。"
// 场景：野外山坡，大型竹篾拱棚隧道窑（长十余丈），分段出烟，烧松取烟
// 部件 ID: kiln(烧烟窑篷), sweep(扫烟取烟), soot(烟炱料), mold(和胶捣制压模)
export default function Mo({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const smokeRef = useRef()
  const sweepArmRef = useRef()
  const fireLightRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const speed = simSpeed > 0 ? simSpeed / 50 : 0
    // 出烟孔的烟气上飘
    if (smokeRef.current) {
      smokeRef.current.children.forEach((p, i) => {
        const phase = (t * 0.8 * (0.5 + speed) + i * 0.6) % 2.6
        p.position.y = 2.4 + phase
        p.scale.setScalar(0.55 + phase * 0.4)
        if (p.material) p.material.opacity = 0.55 * (1 - phase / 2.6)
      })
    }
    // 扫烟匠人手臂左右扫动
    if (sweepArmRef.current) {
      sweepArmRef.current.rotation.z = Math.sin(t * 1.6 * (0.4 + speed)) * 0.5
    }
    // 火光闪烁
    if (fireLightRef.current) {
      fireLightRef.current.intensity = 1.6 + Math.sin(t * 8) * 0.4
    }
  })

  const isHi = (id) => highlightedPartId === id
  const hiMat = (id, color, rough = 0.72) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 0.9 : 0,
    roughness: rough,
    metalness: 0.0,
  })

  // 拱棚参数
  const archRadius = 1.15
  const archCount = 9
  const archSpacing = 1.55
  const archTotalLen = (archCount - 1) * archSpacing
  const archStartX = -archTotalLen / 2

  // 出烟孔（隔数节一个）
  const smokeHoles = useMemo(() => {
    const holes = []
    for (let i = 1; i < archCount; i += 2) holes.push(archStartX + i * archSpacing)
    return holes
  }, [archStartX])

  // 松树
  const trees = useMemo(() => [
    { x: -9, z: -5, s: 1.2 }, { x: 9, z: -4, s: 1.0 },
    { x: -7, z: 5, s: 0.9 }, { x: 8, z: 4.5, s: 1.1 },
    { x: -10, z: 0, s: 0.8 }, { x: 10, z: -1, s: 1.0 },
  ], [])

  // 松木薪柴
  const firewoodLogs = useMemo(() => {
    const logs = []
    for (let i = 0; i < 5; i++) logs.push({ x: 4.5 + (i % 3) * 0.3, y: 0.15 + Math.floor(i / 3) * 0.25, z: -0.3 + (i % 2) * 0.3 })
    for (let i = 0; i < 6; i++) logs.push({ x: 7.5 + (i % 3) * 0.3, y: 0.15 + Math.floor(i / 3) * 0.25, z: -0.4 + (i % 2) * 0.35 })
    return logs
  }, [])

  return (
    <group position={[0, -0.5, 0]}>
      {/* ============ 野外地形 ============ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial color="#8a6b4a" roughness={0.95} />
      </mesh>
      {/* 后方山坡 */}
      <mesh position={[0, 1.2, -9]} receiveShadow>
        <sphereGeometry args={[6, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a6b3a" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 0.8, -8.5]} receiveShadow>
        <sphereGeometry args={[4, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6a7b4a" roughness={0.9} />
      </mesh>
      <mesh position={[7, 0.9, -8.8]} receiveShadow>
        <sphereGeometry args={[4.5, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#525a3a" roughness={0.9} />
      </mesh>

      {/* 松树 */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <mesh position={[0, 0.9, 0]} castShadow material={hiMat('kiln', '#5a3a1e')}>
            <cylinderGeometry args={[0.12, 0.18, 1.8, 8]} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow material={hiMat('kiln', '#3a5a2a')}>
            <coneGeometry args={[0.7, 1.0, 8]} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow material={hiMat('kiln', '#32521f')}>
            <coneGeometry args={[0.55, 0.9, 8]} />
          </mesh>
          <mesh position={[0, 2.75, 0]} castShadow material={hiMat('kiln', '#2a4a1a')}>
            <coneGeometry args={[0.4, 0.8, 8]} />
          </mesh>
        </group>
      ))}

      {/* ============ 烧烟窑篷（大型竹篾拱棚隧道窑）============ */}
      <group onClick={(e) => { e.stopPropagation(); onSelectPart('kiln') }}>
        {/* 竹篾拱骨架（9节半圆拱） */}
        {Array.from({ length: archCount }).map((_, i) => (
          <mesh
            key={i}
            material={hiMat('kiln', i % 2 === 0 ? '#9aa05a' : '#8a9650', 0.6)}
            position={[archStartX + i * archSpacing, archRadius, 0]}
            castShadow
          >
            <torusGeometry args={[archRadius, 0.045, 8, 20, Math.PI]} />
          </mesh>
        ))}
        {/* 拱顶纵向脊索 */}
        <mesh material={hiMat('kiln', '#7a864a', 0.6)} position={[0, archRadius * 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, archTotalLen + 0.6, 6]} />
        </mesh>
        {/* 两侧纵向竹篾 */}
        {[-archRadius * 0.7, archRadius * 0.7].map((z, i) => (
          <mesh key={i} material={hiMat('kiln', '#7a864a', 0.6)} position={[0, archRadius * 0.6, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, archTotalLen + 0.6, 6]} />
          </mesh>
        ))}

        {/* 纸席蒙皮（半圆柱壳，半透明米黄，覆盖拱棚） */}
        <mesh position={[0, archRadius, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[archRadius + 0.04, archRadius + 0.04, archTotalLen + 0.4, 24, 1, true, 0, Math.PI * 2]} />
          <meshStandardMaterial
            color={isHi('kiln') ? '#FFE4B5' : '#e8d9a8'}
            emissive={isHi('kiln') ? '#FFA500' : '#000000'}
            emissiveIntensity={isHi('kiln') ? 0.9 : 0}
            roughness={0.85}
            transparent
            opacity={0.78}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 砖砌火路（通烟道路） */}
        <mesh material={hiMat('kiln', '#9c5a3a')} position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[archTotalLen + 0.8, 0.24, archRadius * 1.8]} />
        </mesh>
        <mesh position={[0, 0.245, 0]}>
          <boxGeometry args={[archTotalLen + 0.6, 0.02, archRadius * 0.8]} />
          <meshStandardMaterial color="#2a1810" roughness={0.9} />
        </mesh>

        {/* 出烟小孔（拱顶深色圆点） */}
        {smokeHoles.map((x, i) => (
          <mesh key={i} position={[x, archRadius * 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.1, 12]} />
            <meshStandardMaterial color="#1a1410" side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* 烟气粒子（上飘） */}
        <group ref={smokeRef}>
          {smokeHoles.map((x, i) => (
            <mesh key={i} position={[x, 2.4, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#b0b0b0" transparent opacity={0.5} depthWrite={false} />
            </mesh>
          ))}
        </group>

        {/* 燃薪端火光（X正端） */}
        <mesh position={[4.8, 0.5, 0]}>
          <sphereGeometry args={[0.25, 10, 10]} />
          <meshStandardMaterial color="#FF6A1A" emissive="#FF4500" emissiveIntensity={2} />
        </mesh>
        <pointLight ref={fireLightRef} position={[4.8, 0.8, 0]} intensity={1.6} distance={4} color="#FF6A1A" />

        {/* 松木薪柴 */}
        {firewoodLogs.map((log, i) => (
          <mesh key={i} material={hiMat('kiln', '#8B5A2B')} position={[log.x, log.y, log.z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 8]} />
          </mesh>
        ))}
      </group>

      {/* ============ 扫烟取烟（匠人在棚内尾节刮扫）============ */}
      <group position={[-4, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('sweep') }}>
        {/* 躯干 */}
        <mesh position={[0, 0.75, 0]} castShadow material={hiMat('sweep', '#6b4226', 0.85)}>
          <boxGeometry args={[0.4, 0.9, 0.25]} />
        </mesh>
        {/* 头 */}
        <mesh position={[0, 1.35, 0]} castShadow material={hiMat('sweep', '#d4a570', 0.85)}>
          <sphereGeometry args={[0.16, 12, 12]} />
        </mesh>
        {/* 腿 */}
        {[-0.1, 0.1].map((z, i) => (
          <mesh key={i} position={[0, 0.25, z]} castShadow material={hiMat('sweep', '#4a3020', 0.85)}>
            <cylinderGeometry args={[0.07, 0.06, 0.5, 6]} />
          </mesh>
        ))}
        {/* 手臂+扫帚（左右扫动） */}
        <group ref={sweepArmRef} position={[0, 1.05, 0.15]}>
          <mesh position={[0.3, -0.2, 0]} castShadow material={hiMat('sweep', '#d4a570', 0.85)}>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} rotation={[0, 0, 0.6]} />
          </mesh>
          <mesh position={[0.55, -0.55, 0]} castShadow material={hiMat('sweep', '#8B6F3A')} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.025, 0.025, 1.0, 6]} />
          </mesh>
          <mesh position={[0.68, -1.0, 0]} castShadow material={hiMat('sweep', '#3A2518', 0.85)} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.1, 0.25, 10]} />
          </mesh>
        </group>
      </group>

      {/* ============ 烟炱料（收集筐+分选缸，棚旁）============ */}
      <group position={[0, 0, 3.5]} onClick={(e) => { e.stopPropagation(); onSelectPart('soot') }}>
        {/* 竹筐 */}
        <mesh position={[-0.5, 0.2, 0]} castShadow material={hiMat('soot', '#8a7050', 0.6)}>
          <cylinderGeometry args={[0.28, 0.22, 0.4, 12]} />
        </mesh>
        <mesh position={[-0.5, 0.4, 0]} material={hiMat('soot', '#1a1410', 0.5)}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 12]} />
        </mesh>
        <mesh position={[-0.5, 0.48, 0]} material={hiMat('soot', '#241818', 0.5)}>
          <coneGeometry args={[0.25, 0.15, 12]} />
        </mesh>
        {/* 分选缸 */}
        <mesh position={[0.5, 0.25, 0]} castShadow material={hiMat('soot', '#7a5230', 0.85)}>
          <cylinderGeometry args={[0.26, 0.2, 0.5, 14]} />
        </mesh>
        <mesh position={[0.5, 0.42, 0]} material={hiMat('soot', '#3a2a1a', 0.5)}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 14]} />
        </mesh>
        <mesh position={[0.5, 0.435, 0]} material={hiMat('soot', '#2a2018', 0.5)}>
          <cylinderGeometry args={[0.2, 0.2, 0.008, 14]} />
        </mesh>
      </group>

      {/* ============ 和胶捣制压模（远景，后续工序示意）============ */}
      <group position={[-3, 0, -3.5]} onClick={(e) => { e.stopPropagation(); onSelectPart('mold') }}>
        <mesh position={[0, 0.2, 0]} castShadow material={hiMat('mold', '#4a3828')}>
          <cylinderGeometry args={[0.28, 0.22, 0.4, 14]} />
        </mesh>
        <mesh position={[0, 0.32, 0]} material={hiMat('mold', '#1a1410', 0.5)}>
          <cylinderGeometry args={[0.2, 0.14, 0.16, 14]} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow material={hiMat('mold', '#8B6F3A')}>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow material={hiMat('mold', '#5C5048')}>
          <cylinderGeometry args={[0.08, 0.06, 0.14, 8]} />
        </mesh>
        <mesh position={[0.5, 0.12, 0.1]} castShadow material={hiMat('mold', '#6B4226')}>
          <boxGeometry args={[0.3, 0.1, 0.14]} />
        </mesh>
        {[0, 1].map((i) => (
          <mesh key={i} material={hiMat('mold', '#1a1410', 0.5)} position={[0.5, 0.22 + i * 0.03, -0.3 + i * 0.05]} castShadow rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.22, 0.028, 0.09]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
