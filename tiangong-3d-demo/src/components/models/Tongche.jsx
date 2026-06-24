import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 筒车 3D 模型（严格按标准复原图5+明崇祯原版木刻精修）
// 部件 ID: wheel(水轮主体/双层轮圈/辐条/轮毂/横轴/立柱/底架), blade(卡扣+挡水木片), tube(汲水竹筒), trough(导水槽天池/顶梁)
//
// 完整9大模块整改：
//  一、双层等大同心轮圈 + 连接方木 + 分段榫卯缝 + 夹层挡水木片
//  二、竹筒：轮平面内与径向呈45°，筒口朝CCW前进方向(外侧下方)，托槽卡扣，竹节空心，加密统一
//  三、多层X型交叉加固斜撑 + 径向辐条加粗1.5倍 + 榫卯衔接
//  四、加厚鼓形轮毂 + 加粗主轴3倍 + 外露 + 轴头限位榫
//  五、立柱加宽间距 + 河滩斜撑 + 榫卯咬合 + 截面加厚 + 双层叠梁
//  六、导水槽右移对位 + 斜长导流 + 尾槽 + 底部斜撑
//  七、木纹材质 + 完整河滩底座 + 水下镂空
//  八、标注点位重新定位
export default function Tongche({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()

  // 水轮旋转（CCW，受水力推动）
  useFrame((_, delta) => {
    if (wheelRef.current && simSpeed > 0) {
      wheelRef.current.rotation.z += delta * (simSpeed / 50) * 0.4
    }
  })

  const radius = 1.7              // 双层轮圈半径（等大同心）
  const ringOffset = 0.2          // 双层轮圈Z方向间距
  const hubRadius = 0.36          // 轮毂半径（厚重鼓形，加厚）
  const hubWidth = 0.78           // 轮毂厚度（加厚）
  const tubeCount = 24            // 汲水竹筒数量（加密，整圈密集）
  const spokeCount = 16           // 径向直辐条数量
  const xBraceLayers = 3          // X型交叉加固层数
  const xBracePerLayer = 8        // 每层X撑组数
  const connectWoodCount = 12     // 双层轮圈连接方木数量
  const bladePlateCount = 24      // 夹层挡水木片数量
  const pillarZ = 1.35            // 立柱Z位置（加宽间距，给双层轮圈+竹筒预留空隙）
  const axleLen = 2.9             // 横轴长度（贯穿并外露）
  const axleRadius = 0.2          // 主轴半径（辐条3倍粗细）

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

  // 木纹材质（程序化CanvasTexture，增加复古写实质感）
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128; canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#8B6F3A'
    ctx.fillRect(0, 0, 128, 128)
    for (let i = 0; i < 24; i++) {
      ctx.strokeStyle = `rgba(60,40,20,${0.15 + Math.random() * 0.25})`
      ctx.lineWidth = 0.5 + Math.random() * 1.2
      ctx.beginPath()
      const y = Math.random() * 128
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(40, y + (Math.random() - 0.5) * 10, 80, y + (Math.random() - 0.5) * 10, 128, y + (Math.random() - 0.5) * 8)
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

  // 竹筒角度：在轮平面内与径向呈45°，筒口朝CCW前进方向(外侧下方)
  // 径向(朝外)×cos45 + 切向(CCW前进方向)×sin45
  // CCW前进切向 = (-sin(angle), cos(angle))
  const C45 = Math.cos(Math.PI / 4)
  const S45 = Math.sin(Math.PI / 4)

  const C90 = Math.cos(Math.PI / 2)
  // 筒口朝轮子转动方向(CCW)倾斜40°
  const TILT40 = Math.PI * 40 / 180
  const S40 = Math.sin(TILT40)   // 切向(CCW前进)分量
  const C40 = Math.cos(TILT40)   // Z轴(垂直轮面)分量
  const S90 = Math.sin(Math.PI / 2)

  return (
    <group position={[0, -0.4, 0]}>
      {/* ============================================================ */}
      {/* ===== 旋转部分：水轮主体（双层轮圈+辐条+轮毂+竹筒+卡扣+挡水板） ===== */}
      {/* ============================================================ */}
      <group ref={wheelRef}>
        {/* ===== 双层等大同心轮圈（两个torus，Z方向错开） ===== */}
        {/* 前圈（+Z侧） */}
        <mesh
          material={woodMat('wheel', '#8B6F3A')}
          castShadow
          position={[0, 0, ringOffset]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <torusGeometry args={[radius, 0.12, 14, 96]} />
        </mesh>
        {/* 后圈（-Z侧） */}
        <mesh
          material={woodMat('wheel', '#8B6F3A')}
          castShadow
          position={[0, 0, -ringOffset]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <torusGeometry args={[radius, 0.12, 14, 96]} />
        </mesh>

        {/* 双层轮圈分段拼接缝隙（前后圈各12段，暗色榫卯线） */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <group key={`seg-${i}`}>
              {/* 前圈缝隙 */}
              <mesh
                position={[Math.cos(a) * radius, Math.sin(a) * radius, ringOffset]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.035, 0.28, 0.16]} />
                <meshStandardMaterial color="#2A1810" roughness={0.9} />
              </mesh>
              {/* 后圈缝隙 */}
              <mesh
                position={[Math.cos(a) * radius, Math.sin(a) * radius, -ringOffset]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.035, 0.28, 0.16]} />
                <meshStandardMaterial color="#2A1810" roughness={0.9} />
              </mesh>
            </group>
          )
        })}

        {/* 双层轮圈连接方木（12根，固定两层圆环为整体，也是竹筒安装基座） */}
        {Array.from({ length: connectWoodCount }).map((_, i) => {
          const a = (i / connectWoodCount) * Math.PI * 2
          return (
            <mesh
              key={`conn-${i}`}
              material={woodMat('wheel', '#7B4F2E')}
              castShadow
              position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
            >
              <boxGeometry args={[0.14, 0.14, ringOffset * 2 + 0.06]} />
            </mesh>
          )
        })}

        {/* 夹层挡水推板（24片，与竹筒同角度一一对齐，垂直轮圈平面，增大水流推力，也是竹筒固定基座） */}
        {Array.from({ length: bladePlateCount }).map((_, i) => {
          const a = (i / bladePlateCount) * Math.PI * 2
          return (
            <mesh
              key={`bplate-${i}`}
              material={woodMat('blade', '#6B4226')}
              castShadow
              position={[Math.cos(a) * (radius + 0.05), Math.sin(a) * (radius + 0.05), 0]}
              rotation={[0, 0, a]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.18, 0.05, ringOffset * 2 + 0.12]} />
            </mesh>
          )
        })}

        {/* 径向直辐条（16根，加粗1.5倍，厚实方木，前后两层各一组） */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const a = (i / spokeCount) * Math.PI * 2
          const midR = (radius + hubRadius) / 2
          return (
            <group key={`spoke-${i}`}>
              {/* 前侧辐条 */}
              <mesh
                material={woodMat('wheel', '#7B4F2E')}
                castShadow
                position={[Math.cos(a) * midR, Math.sin(a) * midR, ringOffset * 0.5]}
                rotation={[0, 0, a]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
              >
                <boxGeometry args={[radius - hubRadius - 0.1, 0.1, 0.1]} />
              </mesh>
              {/* 后侧辐条 */}
              <mesh
                material={woodMat('wheel', '#7B4F2E')}
                castShadow
                position={[Math.cos(a) * midR, Math.sin(a) * midR, -ringOffset * 0.5]}
                rotation={[0, 0, a]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
              >
                <boxGeometry args={[radius - hubRadius - 0.1, 0.1, 0.1]} />
              </mesh>
            </group>
          )
        })}

        {/* 多层X型交叉加固斜撑木（3层，每层8组，每组2根交叉，穿插交错） */}
        {Array.from({ length: xBraceLayers }).map((_, layer) => {
          const layerZ = (layer - 1) * ringOffset * 0.6
          return Array.from({ length: xBracePerLayer }).map((_, i) => {
            const a = (i / xBracePerLayer) * Math.PI * 2 + layer * 0.12
            const midR = (radius + hubRadius) / 2
            const braceLen = (radius - hubRadius) * 0.92
            const tilt = Math.PI / 8 + layer * 0.04
            return (
              <group key={`xbrace-${layer}-${i}`}>
                {/* 斜撑1（+tilt°） */}
                <mesh
                  material={woodMat('wheel', '#6B4226')}
                  castShadow
                  position={[Math.cos(a) * midR, Math.sin(a) * midR, layerZ]}
                  rotation={[0, 0, a + tilt]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
                >
                  <boxGeometry args={[braceLen, 0.06, 0.06]} />
                </mesh>
                {/* 斜撑2（-tilt°） */}
                <mesh
                  material={woodMat('wheel', '#6B4226')}
                  castShadow
                  position={[Math.cos(a) * midR, Math.sin(a) * midR, layerZ]}
                  rotation={[0, 0, a - tilt]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
                >
                  <boxGeometry args={[braceLen, 0.06, 0.06]} />
                </mesh>
              </group>
            )
          })
        })}

        {/* 中心轮毂（厚重鼓形实木，加厚加宽，承接整圈辐条） */}
        <mesh
          material={woodMat('wheel', '#5C3A1E')}
          castShadow
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
        >
          <cylinderGeometry args={[hubRadius, hubRadius * 0.88, hubWidth, 28]} />
        </mesh>
        {/* 轮毂端面装饰环（铁箍） */}
        <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, hubWidth / 2 + 0.01]}>
          <torusGeometry args={[hubRadius, 0.04, 8, 28]} />
        </mesh>
        <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, -hubWidth / 2 - 0.01]}>
          <torusGeometry args={[hubRadius, 0.04, 8, 28]} />
        </mesh>
        {/* 轮毂中心穿轴孔 */}
        <mesh material={woodMat('wheel', '#2A1810')} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[axleRadius + 0.02, axleRadius + 0.02, hubWidth + 0.1, 16]} />
        </mesh>
        {/* 辐条与轮毂衔接榫卯（16个凸榫） */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const a = (i / spokeCount) * Math.PI * 2
          return (
            <mesh
              key={`hub-mortise-${i}`}
              material={woodMat('wheel', '#4A2E1A')}
              castShadow
              position={[Math.cos(a) * (hubRadius + 0.05), Math.sin(a) * (hubRadius + 0.05), 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.12, 0.08, hubWidth * 0.9]} />
            </mesh>
          )
        })}

        {/* ===== 汲水竹筒（筒身垂直轮面+45°倾斜，筒口朝外+Z侧，固定在挡水推板上） ===== */}
        {/* 标准模型：筒身与轮面垂直（有Z分量），与径向呈45° */}
        {/* 筒身平放在轮圈外侧，固定在挡水推板上（轮子外围），不插入轮边缘 */}
        {/* 低位入水兜水、高位自然倒水，45°倾斜是实现取水功能的关键 */}
        {tubes.map((t, i) => {
          // 挡水推板位置（竹筒固定基座）
          const bladeHalfW = 0.09  // 挡水推板半宽（径向）
          // 筒身固定在挡水推板外侧（轮子外围），径向向外偏移，不与挡水推板重合
          // 筒中心 = 挡水推板外侧位置（径向向外离开挡水推板表面）
          const tubeOffset = bladeHalfW + 0.04  // 挡水推板半宽 + 间隙，让筒身离开挡水推板
          const centerX = Math.cos(t.angle) * (radius + 0.05 + tubeOffset)
          const centerY = Math.sin(t.angle) * (radius + 0.05 + tubeOffset)
          const centerZ = 0
          const tubeLen = 0.62
          const tubeR = 0.055
          // 筒方向：径向×C90(=0,垂直轮面不沿径向) + 切向(CCW前进)×S40(朝转动方向倾斜40°) + Z轴×C40(垂直轮面分量)
          // CCW前进切向 = (-sin(angle), cos(angle))
          // 筒口朝轮子转动方向倾斜40°
          const tanX = -Math.sin(t.angle)
          const tanY = Math.cos(t.angle)
          const dirX = Math.cos(t.angle) * C90 + tanX * S40
          const dirY = Math.sin(t.angle) * C90 + tanY * S40
          const dirZ = C40
          // 用quaternion旋转Y轴(cylinder默认轴)到筒方向
          const dir = new THREE.Vector3(dirX, dirY, dirZ).normalize()
          const quatY = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
          // 用quaternion旋转Z轴(torus默认法线)到筒方向（用于绳索圆环）
          const quatZ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
          // 筒中心 = 挡水推板中心（筒身左右对齐）
          const cx = centerX
          const cy = centerY
          const cz = centerZ
          // 筒口位置（朝外端，突出轮子一点）= 中心 + 方向×半长
          const mouthX = cx + dirX * tubeLen / 2
          const mouthY = cy + dirY * tubeLen / 2
          const mouthZ = cz + dirZ * tubeLen / 2
          // 筒底位置（朝内端，在轮子内侧一点）= 中心 - 方向×半长
          const baseX = cx - dirX * tubeLen / 2
          const baseY = cy - dirY * tubeLen / 2
          const baseZ = cz - dirZ * tubeLen / 2
          return (
            <group key={`tube-${i}`}>
              {/* 竹筒主体（空心，openEnded，中空储水空间） */}
              <mesh
                material={woodMat('tube', '#A0824A')}
                castShadow
                position={[cx, cy, cz]}
                quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeR, tubeR, tubeLen, 14]} openEnded />
              </mesh>
              {/* 竹筒内壁（深色，体现中空腔体，BackSide渲染内壁） */}
              <mesh
                position={[cx, cy, cz]}
                quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
              >
                <cylinderGeometry args={[tubeR * 0.78, tubeR * 0.78, tubeLen * 0.96, 12]} openEnded />
                <meshStandardMaterial color="#3A2518" roughness={0.9} side={THREE.BackSide} />
              </mesh>
              {/* 筒封闭端（贴挡水推板端，圆盘封底） */}
              <mesh
                material={woodMat('tube', '#6B5230')}
                castShadow
                position={[baseX + dirX * 0.02, baseY + dirY * 0.02, baseZ + dirZ * 0.02]}
                quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
              >
                <cylinderGeometry args={[tubeR, tubeR, 0.04, 14]} />
              </mesh>
              {/* 筒头（开口端，圆弧形竹节造型，稍大圆环+圆弧收口） */}
              <mesh
                material={woodMat('tube', '#8B6F3A')}
                castShadow
                position={[mouthX, mouthY, mouthZ]}
                quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('tube') }}
              >
                <cylinderGeometry args={[tubeR + 0.015, tubeR + 0.005, 0.07, 14]} openEnded />
              </mesh>
              {/* 筒头圆弧（球形竹节造型，半圆球） */}
              <mesh
                material={woodMat('tube', '#8B6F3A')}
                castShadow
                position={[mouthX + dirX * 0.03, mouthY + dirY * 0.03, mouthZ + dirZ * 0.03]}
                quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
              >
                <sphereGeometry args={[tubeR + 0.012, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
              {/* 竹节纹（2道竹节箍，分段结构，基于筒中心相对位置） */}
              {[0.35, 0.7].map((p, j) => (
                <mesh
                  key={`node-${i}-${j}`}
                  material={woodMat('tube', '#6B5230')}
                  castShadow
                  position={[cx + dirX * tubeLen * (p - 0.5), cy + dirY * tubeLen * (p - 0.5), cz + dirZ * tubeLen * (p - 0.5)]}
                  quaternion={[quatY.x, quatY.y, quatY.z, quatY.w]}
                >
                  <cylinderGeometry args={[tubeR + 0.01, tubeR + 0.01, 0.03, 14]} />
                </mesh>
              ))}

              {/* 固定结构：绳索/木扎带（2道，斜绑在筒身与挡水推板连接处，基于筒中心） */}
              {[-0.15, 0.15].map((offset, j) => (
                <mesh
                  key={`strap-${i}-${j}`}
                  material={woodMat('blade', '#4A2E1A')}
                  castShadow
                  position={[cx + dirX * offset, cy + dirY * offset, cz + dirZ * offset]}
                  quaternion={[quatZ.x, quatZ.y, quatZ.z, quatZ.w]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
                >
                  <torusGeometry args={[tubeR + 0.018, 0.014, 6, 14]} />
                </mesh>
              ))}
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
        <group key={`axle-end-${s}`} position={[0, 0, s * (axleLen / 2 + 0.06)]}>
          {/* 限位木榫（方形） */}
          <mesh material={woodMat('wheel', '#4A2E1A')} castShadow>
            <boxGeometry args={[0.36, 0.36, 0.14]} />
          </mesh>
          {/* 铁箍 */}
          <mesh material={woodMat('wheel', '#3A2518')}>
            <torusGeometry args={[axleRadius, 0.045, 8, 20]} />
          </mesh>
        </group>
      ))}

      {/* ===== 左右分立双立柱（加宽间距，轮子悬空，粗壮方木） ===== */}
      {[-pillarZ, pillarZ].map((z) => (
        <group key={`pillar-${z}`}>
          {/* 立柱主体（粗壮方木，截面加厚） */}
          <mesh
            material={woodMat('wheel', '#7B4F2E')}
            castShadow
            position={[0, 0, z]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
          >
            <boxGeometry args={[0.38, radius * 2 + 1.8, 0.38]} />
          </mesh>
          {/* 立柱顶帽（榫卯咬合，凹凸拼接） */}
          <mesh material={woodMat('wheel', '#5C3A1E')} position={[0, radius + 1.0, z]} castShadow>
            <boxGeometry args={[0.48, 0.24, 0.48]} />
          </mesh>
          {/* 顶帽榫头（凸出，咬合横梁） */}
          <mesh material={woodMat('wheel', '#6B4226')} position={[0, radius + 0.86, z]} castShadow>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
          </mesh>
          {/* 立柱底榫 */}
          <mesh material={woodMat('wheel', '#4A2E1A')} position={[0, -radius - 1.0, z]} castShadow>
            <boxGeometry args={[0.48, 0.24, 0.48]} />
          </mesh>
          {/* 轴孔木（立柱中部的轴座，加粗，带凹槽） */}
          <mesh material={woodMat('wheel', '#6B4226')} position={[0, 0, z - Math.sign(z) * 0.07]} castShadow>
            <boxGeometry args={[0.44, 0.6, 0.28]} />
          </mesh>
          {/* 轴座铁箍 */}
          <mesh material={woodMat('wheel', '#3A2518')} position={[0, 0, z - Math.sign(z) * 0.22]}>
            <torusGeometry args={[axleRadius + 0.05, 0.035, 6, 16]} />
          </mesh>
        </group>
      ))}

      {/* ===== 顶部双层叠梁（加长延伸到右侧，榫卯拼接） ===== */}
      <group position={[0, radius + 1.05, 0]}>
        {/* 上层横梁1（前侧，加长延伸） */}
        <mesh
          material={woodMat('trough', '#7B4F2E')}
          castShadow
          position={[1.1, 0.12, pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.2, 0.2, 0.2]} />
        </mesh>
        {/* 上层横梁2（后侧，加长延伸） */}
        <mesh
          material={woodMat('trough', '#7B4F2E')}
          castShadow
          position={[1.1, 0.12, -pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.2, 0.2, 0.2]} />
        </mesh>
        {/* 下层叠梁1（前侧） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          position={[1.1, -0.1, pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.2, 0.18, 0.18]} />
        </mesh>
        {/* 下层叠梁2（后侧） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          position={[1.1, -0.1, -pillarZ]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[3.2, 0.18, 0.18]} />
        </mesh>
        {/* 横梁连接短木（稳定） */}
        <mesh material={woodMat('trough', '#5C3A1E')} position={[1.1, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, pillarZ * 2 - 0.3]} />
        </mesh>
        {/* 横梁与立柱榫卯节点（凸榫咬合） */}
        {[-pillarZ, pillarZ].map((z) => (
          <mesh key={`beam-mortise-${z}`} material={woodMat('trough', '#5C3A1E')} position={[-0.5, 0, z]} castShadow>
            <boxGeometry args={[0.28, 0.28, 0.28]} />
          </mesh>
        ))}
      </group>

      {/* ===== 导水槽天池（右移对位，紧贴最高点，宽浅长斜木槽） ===== */}
      {/* 位置：右移对位，紧贴水轮最高点正前方，精准承接竹筒倾倒的水流 */}
      <group position={[0.5, radius + 0.55, 0]} rotation={[0, 0, -0.24]}>
        {/* 槽体（宽浅长木槽，向右下倾斜导流） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[2.0, 0.1, 1.1]} />
        </mesh>
        {/* 槽内凹陷（水道，浅而宽） */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.9, 0.06, 0.96]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
        {/* 槽壁前（低矮挡水围边） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0, 0.08, 0.55]}>
          <boxGeometry args={[2.0, 0.16, 0.06]} />
        </mesh>
        {/* 槽壁后（低矮挡水围边） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0, 0.08, -0.55]}>
          <boxGeometry args={[2.0, 0.16, 0.06]} />
        </mesh>
        {/* 槽壁左（高端，接水处，加高） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[-1.0, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.24, 1.1]} />
        </mesh>
        {/* 槽壁右（低端，出水处，较低） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[1.0, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.16, 1.1]} />
        </mesh>
        {/* 导流尾槽（末端细长导流木槽，向下引导水流至农田） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          position={[1.7, -0.18, 0]}
          rotation={[0, 0, -0.38]}
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[1.0, 0.08, 0.55]} />
        </mesh>
        {/* 导流尾槽侧壁 */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[1.7, -0.1, 0.28]} rotation={[0, 0, -0.38]}>
          <boxGeometry args={[1.0, 0.12, 0.05]} />
        </mesh>
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[1.7, -0.1, -0.28]} rotation={[0, 0, -0.38]}>
          <boxGeometry args={[1.0, 0.12, 0.05]} />
        </mesh>
        {/* 水槽底部斜撑木（托举水槽，连接到顶梁延伸段） */}
        <mesh material={woodMat('trough', '#5C3A1E')} castShadow position={[-0.7, -0.32, 0.4]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.14, 0.65, 0.14]} />
        </mesh>
        <mesh material={woodMat('trough', '#5C3A1E')} castShadow position={[-0.7, -0.32, -0.4]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.14, 0.65, 0.14]} />
        </mesh>
      </group>

      {/* ===== 完整一体式实木河滩底座 + 河滩石块 ===== */}
      {/* 主底座（宽厚实木，模拟河岸河滩） */}
      <mesh
        material={woodMat('wheel', '#5C3A1E')}
        castShadow
        position={[0, -radius - 1.65, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}
      >
        <boxGeometry args={[4.5, 0.3, 3.2]} />
      </mesh>
      {/* 底座顶面（稍亮） */}
      <mesh position={[0, -radius - 1.49, 0]}>
        <boxGeometry args={[4.45, 0.04, 3.15]} />
        <meshStandardMaterial color="#7B4F2E" roughness={0.7} map={woodTexture} />
      </mesh>

      {/* 立柱底部河滩斜撑加固木（每侧2根，扎根河床） */}
      {[-pillarZ, pillarZ].map((z) => (
        <group key={`base-${z}`}>
          {/* 主立柱底接（连接立柱到底座） */}
          <mesh material={woodMat('wheel', '#6B4226')} castShadow position={[0, -radius - 1.25, z]}>
            <boxGeometry args={[0.34, 0.6, 0.34]} />
          </mesh>
          {/* 分叉斜撑1（向外侧，扎根河床） */}
          <mesh
            material={woodMat('wheel', '#5C3A1E')}
            castShadow
            position={[0.7, -radius - 1.45, z * 0.4]}
            rotation={[0, 0, -Math.PI / 6]}
          >
            <boxGeometry args={[1.0, 0.18, 0.18]} />
          </mesh>
          {/* 分叉斜撑2（向内侧） */}
          <mesh
            material={woodMat('wheel', '#5C3A1E')}
            castShadow
            position={[-0.7, -radius - 1.45, z * 0.4]}
            rotation={[0, 0, Math.PI / 6]}
          >
            <boxGeometry args={[1.0, 0.18, 0.18]} />
          </mesh>
          {/* 河滩石块（不规则石块，贴合古籍插图河岸场景） */}
          <mesh castShadow position={[0.5, -radius - 1.78, z * 0.3]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#6B6B6B" roughness={0.95} flatShading />
          </mesh>
          <mesh castShadow position={[-0.4, -radius - 1.82, z * 0.3 + 0.25]}>
            <dodecahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial color="#5A5A5A" roughness={0.95} flatShading />
          </mesh>
          <mesh castShadow position={[0.2, -radius - 1.8, z * 0.3 - 0.3]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#4A4A4A" roughness={0.95} flatShading />
          </mesh>
        </group>
      ))}

      {/* ===== 水面（底部，半透明蓝，水下轮体镂空分层效果） ===== */}
      <mesh position={[0, -radius - 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 4.5]} />
        <meshStandardMaterial color="#4A7A9A" transparent opacity={0.32} roughness={0.3} />
      </mesh>
      {/* 水下轮体镂空分层（水面波纹环，模拟河水漫过轮底） */}
      <mesh position={[0, -radius - 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.5, radius * 0.95, 32]} />
        <meshStandardMaterial color="#5BA3D0" transparent opacity={0.25} roughness={0.3} />
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
      arr[i * 3] = 3.0 + Math.random() * 1.4
      arr[i * 3 + 1] = -2.0 + Math.random() * 2.8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.8
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] -= delta * (speed / 50) * 2.5
      if (pos.array[i * 3] < 1.2) {
        pos.array[i * 3] = 4.4
        pos.array[i * 3 + 1] = -2.0 + Math.random() * 2.8
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
