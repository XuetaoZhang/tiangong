import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 筒车 3D 模型（严格按明崇祯原版木刻+中国农业博物馆复原实物精修）
// 部件 ID: wheel(水轮主体/辐条/轮毂/横轴/立柱/底架), blade(卡扣+挡水板), tube(汲水竹筒), trough(导水槽天池/顶梁)
//
// 完整整改清单落实：
//  一、竹筒：40°内倾，筒口朝外下方，加密24根，竹节纹，卡扣托槽榫卯
//  二、轮内：多层X型交叉加固撑木 + 径向直辐条加粗1.5倍
//  三、导水槽：紧贴最高点正前方，宽浅长斜木槽，导流尾槽，底部斜撑
//  四、立柱：拉大间距，底部河滩斜撑木，榫卯咬合
//  五、主轴：加厚轮毂，主轴加粗3倍，外露，轴头限位榫
//  六、轮圈：分段拼接缝，外圈挡水木片，木纹质感
//  七、顶梁：加长延伸，榫卯拼接
//  八、环境：河滩石块底座，水下轮体镂空
export default function Tongche({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()

  // 水轮旋转（CCW，受水力推动）
  useFrame((_, delta) => {
    if (wheelRef.current && simSpeed > 0) {
      wheelRef.current.rotation.z += delta * (simSpeed / 50) * 0.4
    }
  })

  const radius = 1.7              // 主轮圈半径
  const hubRadius = 0.34          // 轮毂半径（厚重鼓形，加厚）
  const hubWidth = 0.7            // 轮毂厚度（加厚）
  const tubeCount = 24            // 汲水竹筒数量（加密，原版密集）
  const spokeCount = 16           // 径向直辐条数量（加粗）
  const xBraceLayers = 3          // X型交叉加固层数（多层）
  const xBracePerLayer = 8        // 每层X撑组数
  const pillarZ = 1.15            // 立柱Z位置（拉大间距，轮子悬空）
  const axleLen = 2.6             // 横轴长度（贯穿并外露）
  const axleRadius = 0.18         // 主轴半径（辐条3倍，加粗）
  const bladePlateCount = 24      // 外圈挡水木片数量

  const tubes = useMemo(() => {
    const arr = []
    for (let i = 0; i < tubeCount; i++) {
      arr.push({ angle: (i / tubeCount) * Math.PI * 2 })
    }
    return arr
  }, [])

  const isHi = (id) => highlightedPartId === id
  const partMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.72,
    metalness: 0.0,
    flatShading: false,
  })

  // 木纹材质（带程序化纹理，增加复古质感）
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128; canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#8B6F3A'
    ctx.fillRect(0, 0, 128, 128)
    // 木纹线条
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(60,40,20,${0.15 + Math.random() * 0.2})`
      ctx.lineWidth = 0.5 + Math.random()
      ctx.beginPath()
      const y = Math.random() * 128
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(40, y + (Math.random() - 0.5) * 8, 80, y + (Math.random() - 0.5) * 8, 128, y + (Math.random() - 0.5) * 6)
      ctx.stroke()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])

  const woodMat = (id, color, emissive) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? (emissive || '#FFA500') : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    roughness: isHi(id) ? 0.45 : 0.72,
    metalness: 0.0,
    map: woodTexture,
    flatShading: false,
  })

  // 竹筒倾斜角：40°向轮圈内侧上倾，筒口朝外下方
  // 在轮平面内：径向方向（朝外）+ 切向方向，组合成40°倾角
  const TILT = Math.PI * 40 / 180  // 40°
  const CT = Math.cos(TILT)
  const ST = Math.sin(TILT)

  return (
    <group position={[0, -0.4, 0]}>
      {/* ============================================================ */}
      {/* ===== 旋转部分：水轮主体（轮圈+辐条+轮毂+竹筒+卡扣+挡水板） ===== */}
      {/* ============================================================ */}
      <group ref={wheelRef}>
        {/* 单层主轮圈（厚实木轮，加粗） */}
        <mesh
          material={woodMat('wheel', '#8B6F3A')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <torusGeometry args={[radius, 0.11, 14, 96]} />
        </mesh>

        {/* 轮圈分段拼接缝隙（12段，暗色榫卯线） */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <mesh
              key={`seg-${i}`}
              position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.03, 0.26, 0.14]} />
              <meshStandardMaterial color="#2A1810" roughness={0.9} />
            </mesh>
          )
        })}

        {/* 外圈挡水木片（24片，凸起窄木片，增大水流冲击推力） */}
        {Array.from({ length: bladePlateCount }).map((_, i) => {
          const a = (i / bladePlateCount) * Math.PI * 2 + Math.PI / 24
          return (
            <mesh
              key={`bplate-${i}`}
              material={woodMat('blade', '#7B4F2E')}
              castShadow
              position={[Math.cos(a) * (radius + 0.08), Math.sin(a) * (radius + 0.08), 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.18, 0.035, 0.22]} />
            </mesh>
          )
        })}

        {/* 径向直辐条（16根，加粗1.5倍，厚实方木） */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const a = (i / spokeCount) * Math.PI * 2
          const midR = (radius + hubRadius) / 2
          return (
            <mesh
              key={`spoke-${i}`}
              material={woodMat('wheel', '#7B4F2E')}
              castShadow
              position={[Math.cos(a) * midR, Math.sin(a) * midR, 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
            >
              <boxGeometry args={[radius - hubRadius - 0.1, 0.1, 0.1]} />
            </mesh>
          )
        })}

        {/* 多层X型交叉加固撑木（3层，每层8组，每组2根交叉斜撑） */}
        {Array.from({ length: xBraceLayers }).map((_, layer) => {
          const layerOffset = (layer - 1) * 0.18  // 三层错开
          return Array.from({ length: xBracePerLayer }).map((_, i) => {
            const a = (i / xBracePerLayer) * Math.PI * 2 + layerOffset
            const midR = (radius + hubRadius) / 2
            const braceLen = (radius - hubRadius) * 0.92
            const tilt = Math.PI / 8 + layer * 0.05  // 每层斜撑角度不同
            return (
              <group key={`xbrace-${layer}-${i}`}>
                {/* 斜撑1（+tilt°） */}
                <mesh
                  material={woodMat('wheel', '#6B4226')}
                  castShadow
                  position={[Math.cos(a) * midR, Math.sin(a) * midR, 0]}
                  rotation={[0, 0, a + tilt]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
                >
                  <boxGeometry args={[braceLen, 0.055, 0.055]} />
                </mesh>
                {/* 斜撑2（-tilt°） */}
                <mesh
                  material={woodMat('wheel', '#6B4226')}
                  castShadow
                  position={[Math.cos(a) * midR, Math.sin(a) * midR, 0]}
                  rotation={[0, 0, a - tilt]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
                >
                  <boxGeometry args={[braceLen, 0.055, 0.055]} />
                </mesh>
              </group>
            )
          })
        })}

        {/* 中心轮毂（厚重鼓形实木，加厚加宽） */}
        <mesh
          material={woodMat('wheel', '#5C3A1E')}
          castShadow
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <cylinderGeometry args={[hubRadius, hubRadius * 0.85, hubWidth, 28]} />
        </mesh>
        {/* 轮毂端面装饰环（铁箍） */}
        <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, hubWidth / 2 + 0.01]}>
          <torusGeometry args={[hubRadius, 0.035, 8, 28]} />
        </mesh>
        <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, -hubWidth / 2 - 0.01]}>
          <torusGeometry args={[hubRadius, 0.035, 8, 28]} />
        </mesh>
        {/* 轮毂中心穿轴孔 */}
        <mesh material={woodMat('wheel', '#2A1810')} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[axleRadius + 0.02, axleRadius + 0.02, hubWidth + 0.1, 16]} />
        </mesh>

        {/* ===== 汲水竹筒（40°内倾，筒口朝外下方，加密24根，竹节纹） ===== */}
        {tubes.map((t, i) => {
          const px = Math.cos(t.angle) * radius
          const py = Math.sin(t.angle) * radius
          const tubeLen = 0.55  // 竹筒长度
          const tubeR = 0.05    // 竹筒半径（粗细统一）
          // 竹筒方向：径向(朝外)×CT + 切向×ST，形成40°内倾
          // 筒口在朝外下方（径向向外+切向向下分量）
          const radX = Math.cos(t.angle)
          const radY = Math.sin(t.angle)
          const tanX = -Math.sin(t.angle)
          const tanY = Math.cos(t.angle)
          // 竹筒轴向：径向×CT(朝外) + 切向×ST(顺时针方向，让筒口朝外下)
          const dirX = radX * CT + tanX * ST
          const dirY = radY * CT + tanY * ST
          // 竹筒中心 = 轮缘点 + 方向×半长
          const cx = px + dirX * tubeLen / 2
          const cy = py + dirY * tubeLen / 2
          // cylinder默认沿Y轴，旋转到dir方向
          const tubeAngle = Math.atan2(dirY, dirX) - Math.PI / 2
          // 筒口位置（朝外端）
          const mouthX = px + dirX * tubeLen
          const mouthY = py + dirY * tubeLen
          return (
            <group key={`tube-${i}`}>
              {/* 竹筒主体（中空竹筒，带竹节纹） */}
              <mesh
                material={woodMat('tube', '#A0824A')}
                castShadow
                position={[cx, cy, 0]}
                rotation={[0, 0, tubeAngle]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeR, tubeR, tubeLen, 12]} />
              </mesh>
              {/* 竹节纹（3道竹节箍，分段结构） */}
              {[0.25, 0.5, 0.75].map((p, j) => (
                <mesh
                  key={`node-${i}-${j}`}
                  material={woodMat('tube', '#6B5230')}
                  castShadow
                  position={[px + dirX * tubeLen * p, py + dirY * tubeLen * p, 0]}
                  rotation={[0, 0, tubeAngle]}
                >
                  <cylinderGeometry args={[tubeR + 0.008, tubeR + 0.008, 0.025, 12]} />
                </mesh>
              ))}
              {/* 竹筒开口（朝外端，开口朝外下方） */}
              <mesh
                material={woodMat('tube', '#8B6F3A')}
                castShadow
                position={[mouthX, mouthY, 0]}
                rotation={[0, 0, tubeAngle]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeR + 0.005, tubeR + 0.005, 0.06, 12]} openEnded />
              </mesh>

              {/* 卡扣（托槽榫卯造型：下半托槽+上半卡榫，带倒角） */}
              <group position={[px, py, 0]} rotation={[0, 0, t.angle]}>
                {/* 托槽底座（带倒角方块） */}
                <mesh
                  material={woodMat('blade', '#6B4226')}
                  castShadow
                  position={[0.06, 0, 0]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
                >
                  <boxGeometry args={[0.12, 0.16, 0.18]} />
                </mesh>
                {/* 下半圆弧托槽（半torus，托住竹筒筒身） */}
                <mesh
                  material={woodMat('blade', '#7B4F2E')}
                  castShadow
                  position={[0.1, 0, 0]}
                  rotation={[Math.PI / 2, 0, 0]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
                >
                  <torusGeometry args={[tubeR + 0.015, 0.025, 8, 14, Math.PI]} />
                </mesh>
                {/* 上半卡榫（半torus，卡住竹筒外壁） */}
                <mesh
                  material={woodMat('blade', '#7B4F2E')}
                  castShadow
                  position={[0.1, 0, 0]}
                  rotation={[Math.PI / 2, 0, Math.PI]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
                >
                  <torusGeometry args={[tubeR + 0.015, 0.022, 8, 14, Math.PI * 0.7]} />
                </mesh>
              </group>
            </group>
          )
        })}
      </group>

      {/* ============================================================ */}
      {/* ===== 固定部分：主轴+立柱+顶梁+导水槽+底架（不旋转） ===== */}
      {/* ============================================================ */}

      {/* ===== 中心主轴（粗圆木主轴，加粗3倍，贯穿两立柱并外露） ===== */}
      <mesh
        material={woodMat('wheel', '#5C3A1E')}
        castShadow
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
      >
        <cylinderGeometry args={[axleRadius, axleRadius, axleLen, 20]} />
      </mesh>
      {/* 轴端限位木榫（轴头固定细节） */}
      {[-1, 1].map((s) => (
        <group key={`axle-end-${s}`} position={[0, 0, s * (axleLen / 2 + 0.05)]}>
          {/* 限位木榫 */}
          <mesh material={woodMat('wheel', '#4A2E1A')} castShadow>
            <boxGeometry args={[0.32, 0.32, 0.12]} />
          </mesh>
          {/* 铁箍 */}
          <mesh material={woodMat('wheel', '#3A2518')}>
            <torusGeometry args={[axleRadius, 0.04, 8, 20]} />
          </mesh>
        </group>
      ))}

      {/* ===== 左右分立双立柱（拉大间距，轮子悬空，粗壮方木） ===== */}
      {[-pillarZ, pillarZ].map((z) => (
        <group key={`pillar-${z}`}>
          {/* 立柱主体（粗壮方木，宽度=半径1/5≈0.34） */}
          <mesh
            material={woodMat('wheel', '#7B4F2E')}
            castShadow
            position={[0, 0, z]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
          >
            <boxGeometry args={[0.34, radius * 2 + 1.6, 0.34]} />
          </mesh>
          {/* 立柱顶帽（榫卯咬合，凹凸拼接） */}
          <mesh material={woodMat('wheel', '#5C3A1E')} position={[0, radius + 0.9, z]} castShadow>
            <boxGeometry args={[0.44, 0.22, 0.44]} />
          </mesh>
          {/* 顶帽榫头（凸出） */}
          <mesh material={woodMat('wheel', '#6B4226')} position={[0, radius + 0.78, z]} castShadow>
            <boxGeometry args={[0.2, 0.06, 0.2]} />
          </mesh>
          {/* 立柱底榫 */}
          <mesh material={woodMat('wheel', '#4A2E1A')} position={[0, -radius - 0.9, z]} castShadow>
            <boxGeometry args={[0.44, 0.22, 0.44]} />
          </mesh>
          {/* 轴孔木（立柱中部的轴座，加粗，带凹槽） */}
          <mesh material={woodMat('wheel', '#6B4226')} position={[0, 0, z - Math.sign(z) * 0.06]} castShadow>
            <boxGeometry args={[0.4, 0.55, 0.26]} />
          </mesh>
          {/* 轴座铁箍 */}
          <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, z - Math.sign(z) * 0.2]}>
            <torusGeometry args={[axleRadius + 0.04, 0.03, 6, 16]} />
          </mesh>
        </group>
      ))}

      {/* ===== 顶部双横梁（加长延伸到右侧，榫卯拼接） ===== */}
      <group position={[0, radius + 0.95, 0]}>
        {/* 横梁1（前侧，加长延伸） */}
        <mesh
          material={woodMat('trough', '#7B4F2E')}
          castShadow
          position={[1.0, 0, pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.0, 0.2, 0.2]} />
        </mesh>
        {/* 横梁2（后侧，加长延伸） */}
        <mesh
          material={woodMat('trough', '#7B4F2E')}
          castShadow
          position={[1.0, 0, -pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.0, 0.2, 0.2]} />
        </mesh>
        {/* 横梁连接短木（稳定） */}
        <mesh material={woodMat('trough', '#6B4226')} position={[1.0, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, pillarZ * 2 - 0.3]} />
        </mesh>
        {/* 横梁与立柱榫卯节点（凸榫） */}
        {[-pillarZ, pillarZ].map((z) => (
          <mesh key={`beam-mortise-${z}`} material={woodMat('trough', '#5C3A1E')} position={[-0.5, 0, z]} castShadow>
            <boxGeometry args={[0.24, 0.24, 0.24]} />
          </mesh>
        ))}
      </group>

      {/* ===== 导水槽天池（紧贴最高点正前方，宽浅长斜木槽） ===== */}
      {/* 位置：水轮最高点(radius)正前方，正对翻转倒水的竹筒 */}
      <group position={[0.3, radius + 0.5, 0]} rotation={[0, 0, -0.22]}>
        {/* 槽体（宽浅长木槽，向右下倾斜导流） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[1.8, 0.1, 1.0]} />
        </mesh>
        {/* 槽内凹陷（水道，浅而宽） */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.7, 0.06, 0.88]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
        {/* 槽壁前（挡水围板） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0, 0.08, 0.5]}>
          <boxGeometry args={[1.8, 0.16, 0.06]} />
        </mesh>
        {/* 槽壁后（挡水围板） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0, 0.08, -0.5]}>
          <boxGeometry args={[1.8, 0.16, 0.06]} />
        </mesh>
        {/* 槽壁左（高端，接水处，加高） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[-0.9, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.24, 1.0]} />
        </mesh>
        {/* 槽壁右（低端，出水处，较低） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0.9, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.16, 1.0]} />
        </mesh>
        {/* 导流尾槽（末端细木槽延伸向下导水至农田） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          position={[1.5, -0.15, 0]}
          rotation={[0, 0, -0.35]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.9, 0.08, 0.5]} />
        </mesh>
        {/* 导流尾槽侧壁 */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[1.5, -0.07, 0.25]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.9, 0.12, 0.05]} />
        </mesh>
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[1.5, -0.07, -0.25]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.9, 0.12, 0.05]} />
        </mesh>
        {/* 水槽底部斜撑木（托举水槽，连接到横梁） */}
        <mesh material={woodMat('trough', '#5C3A1E')} castShadow position={[-0.6, -0.3, 0.35]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
        </mesh>
        <mesh material={woodMat('trough', '#5C3A1E')} castShadow position={[-0.6, -0.3, -0.35]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
        </mesh>
      </group>

      {/* ===== 底部河滩斜撑木架 + 河滩石块底座 ===== */}
      {[-pillarZ, pillarZ].map((z) => (
        <group key={`base-${z}`}>
          {/* 主立柱底接（连接立柱到地枕） */}
          <mesh material={woodMat('wheel', '#6B4226')} castShadow position={[0, -radius - 1.1, z]}>
            <boxGeometry args={[0.3, 0.55, 0.3]} />
          </mesh>
          {/* 分叉斜撑1（向外侧，扎根河床） */}
          <mesh
            material={woodMat('wheel', '#5C3A1E')}
            castShadow
            position={[0.6, -radius - 1.3, z * 0.5]}
            rotation={[0, 0, -Math.PI / 6]}
          >
            <boxGeometry args={[0.9, 0.16, 0.16]} />
          </mesh>
          {/* 分叉斜撑2（向内侧） */}
          <mesh
            material={woodMat('wheel', '#5C3A1E')}
            castShadow
            position={[-0.6, -radius - 1.3, z * 0.5]}
            rotation={[0, 0, Math.PI / 6]}
          >
            <boxGeometry args={[0.9, 0.16, 0.16]} />
          </mesh>
          {/* 地枕木（横向） */}
          <mesh material={woodMat('wheel', '#4A2E1A')} castShadow position={[0, -radius - 1.55, z * 0.3]}>
            <boxGeometry args={[1.8, 0.18, 0.26]} />
          </mesh>
          {/* 河滩石块底座（不规则石块） */}
          <mesh castShadow position={[0.4, -radius - 1.65, z * 0.3]}>
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#6B6B6B" roughness={0.95} flatShading />
          </mesh>
          <mesh castShadow position={[-0.3, -radius - 1.7, z * 0.3 + 0.2]}>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#5A5A5A" roughness={0.95} flatShading />
          </mesh>
        </group>
      ))}
      {/* 前后地枕连接木 */}
      <mesh material={woodMat('wheel', '#4A2E1A')} castShadow position={[0, -radius - 1.55, 0]}>
        <boxGeometry args={[0.22, 0.16, pillarZ * 1.8]} />
      </mesh>

      {/* ===== 水面（底部，半透明蓝，水下轮体镂空效果） ===== */}
      <mesh position={[0, -radius - 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 4]} />
        <meshStandardMaterial color="#4A7A9A" transparent opacity={0.32} roughness={0.3} />
      </mesh>
      {/* 水面波纹（水下区域装饰） */}
      <mesh position={[0, -radius - 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.6, radius * 0.9, 32]} />
        <meshStandardMaterial color="#5BA3D0" transparent opacity={0.2} roughness={0.3} />
      </mesh>

      {/* 水流粒子（模拟时显示，从右侧冲击挡水板） */}
      {simSpeed > 0 && <WaterFlow speed={simSpeed} />}
    </group>
  )
}

function WaterFlow({ speed }) {
  const ref = useRef()
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 2.8 + Math.random() * 1.3
      arr[i * 3 + 1] = -2.0 + Math.random() * 2.6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.7
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] -= delta * (speed / 50) * 2.5
      if (pos.array[i * 3] < 1.1) {
        pos.array[i * 3] = 4.1
        pos.array[i * 3 + 1] = -2.0 + Math.random() * 2.6
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
