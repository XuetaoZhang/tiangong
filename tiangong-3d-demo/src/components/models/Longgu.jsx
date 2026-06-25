import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 龙骨水车 3D 模型（严格按《天工开物·乃粒·龙骨车》原版插图1:1复刻）
// 部件 ID: pedal(踏轴/拐木), chain(龙骨链), blade(刮水板), trough(水槽)
// 原版结构：斜置长水槽(从水中到岸上) + 龙骨链带刮板(循环运转) + 顶部踏轴(拐木,人踩驱动) + 底部从动轮(入水) + 扶手架 + 踩踏人形
export default function Longgu({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const pedalRef = useRef()
  const bottomWheelRef = useRef()
  const chainGroupRef = useRef()
  // 人腿关节 ref（左右各髋/膝/踝三关节，做踩踏动画）
  const leftHipRef = useRef()
  const leftKneeRef = useRef()
  const leftAnkleRef = useRef()
  const rightHipRef = useRef()
  const rightKneeRef = useRef()
  const rightAnkleRef = useRef()

  // 整体倾斜角度（约 -25°，低端在水中，高端在岸上，如原版插图）
  const tilt = -0.44
  const troughLen = 4.0  // 水槽长度（加长，如原版大型龙骨车）

  useFrame((_, delta) => {
    if (simSpeed > 0) {
      const s = simSpeed / 50
      // 踏轴旋转（人踩驱动）
      if (pedalRef.current) pedalRef.current.rotation.x += delta * s * 1.8
      // 底部从动轮旋转（被动）
      if (bottomWheelRef.current) bottomWheelRef.current.rotation.x += delta * s * 1.8
      // 龙骨链移动（沿环形路径循环）
      if (chainGroupRef.current) {
        const totalLen = troughLen + 1.4
        const speed = delta * s * 0.9
        chainGroupRef.current.children.forEach((child) => {
          const userData = child.userData
          if (userData && userData.t !== undefined) {
            userData.t += speed / totalLen
            if (userData.t > 1) userData.t -= 1
            updateLinkPosition(child, userData.t, troughLen)
          }
        })
      }
      // 人腿踩踏动画（髋/膝/踝三关节联动，与踏轴转动同步，左右脚交替）
      if (leftHipRef.current && pedalRef.current) {
        // 用踏轴当前转角作为相位（与踏板位置严格同步）
        const angle = pedalRef.current.rotation.x
        // 左脚相位：踩在对置踏板上，踏板在最低点时脚踩下去（伸直），最高点时抬起来（弯曲）
        const lp = Math.sin(angle)
        // 右脚相位（反相，踩在对面踏板上）
        const rp = Math.sin(angle + Math.PI)
        // 髋关节：大腿前后摆动（基础前倾0.35 + 摆动±0.3）
        leftHipRef.current.rotation.x = 0.35 + lp * 0.3
        rightHipRef.current.rotation.x = 0.35 + rp * 0.3
        // 膝关节：脚在最高点(lp=1)时膝盖弯曲最多，脚在最低点(lp=-1)踩下去时腿伸直
        // 弯曲量 = (1 - lp) / 2 * 0.7 + 0.15（基础微弯）
        leftKneeRef.current.rotation.x = (1 - lp) * 0.35 + 0.15
        rightKneeRef.current.rotation.x = (1 - rp) * 0.35 + 0.15
        // 踝关节：足部随踩踏上下点动，踩下去时脚尖下压
        leftAnkleRef.current.rotation.x = -lp * 0.25
        rightAnkleRef.current.rotation.x = -rp * 0.25
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

  // 程序化木纹纹理（模拟古农具实木质感）
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#6B4226'
    ctx.fillRect(0, 0, 128, 128)
    // 木纹线
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(${74 + Math.random() * 30}, ${46 + Math.random() * 20}, ${26 + Math.random() * 15}, ${0.3 + Math.random() * 0.3})`
      ctx.lineWidth = 0.5 + Math.random() * 1.5
      ctx.beginPath()
      const y = (i / 20) * 128 + Math.random() * 4
      ctx.moveTo(0, y)
      for (let x = 0; x <= 128; x += 4) {
        ctx.lineTo(x, y + Math.sin(x * 0.1 + i) * 2)
      }
      ctx.stroke()
    }
    // 木节
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = 'rgba(58, 37, 24, 0.4)'
      ctx.beginPath()
      ctx.arc(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 4)
    return tex
  }, [])

  const woodMat = (id, color) => new THREE.MeshStandardMaterial({
    color: isHi(id) ? '#FFE4B5' : color,
    emissive: isHi(id) ? '#FFA500' : '#000000',
    emissiveIntensity: isHi(id) ? 1.0 : 0,
    map: woodTexture,
    roughness: isHi(id) ? 0.45 : 0.78,
    metalness: 0.0,
  })

  // 龙骨链节：沿环形路径分布（上槽前进带水 + 顶折返 + 下槽返回 + 底折返）
  const linkCount = 24
  const links = useMemo(() => {
    const arr = []
    for (let i = 0; i < linkCount; i++) {
      arr.push({ t: i / linkCount })
    }
    return arr
  }, [])

  // 更新链节位置（沿环形路径循环）
  function updateLinkPosition(child, t, len) {
    const halfW = 0.14 // 链条上下间距（上槽与下槽间距）
    let x, y, z
    if (t < 0.45) {
      // 上槽（刮板在上，前进方向，带水上行）
      const tt = t / 0.45
      z = -len / 2 + tt * len
      y = halfW
      x = 0
    } else if (t < 0.5) {
      // 顶部折返（绕踏轴）
      const tt = (t - 0.45) / 0.05
      const angle = tt * Math.PI
      z = len / 2 + 0.2 + Math.sin(angle) * 0.2
      y = halfW * Math.cos(angle)
      x = 0
    } else if (t < 0.95) {
      // 下槽（返回，无刮水）
      const tt = (t - 0.5) / 0.45
      z = len / 2 - tt * len
      y = -halfW
      x = 0
    } else {
      // 底部折返（绕从动轮）
      const tt = (t - 0.95) / 0.05
      const angle = tt * Math.PI + Math.PI
      z = -len / 2 - 0.2 + Math.sin(angle) * 0.2
      y = halfW * Math.cos(angle)
      x = 0
    }
    child.position.set(x, y, z)
    // 刮水板只在上槽显示（y > 0 时）
    const blade = child.children[1]
    if (blade) {
      blade.visible = y > 0
    }
  }

  return (
    <>
    <group rotation={[tilt, 0, 0]} position={[0, 0.4, 0]}>
      {/* ===== 水槽主体（斜置木槽，如原版长条形水槽） ===== */}
      <group position={[0, 0, explode ? 0.5 : 0]}>
        {/* 槽底（厚木板，承托水流） */}
        <mesh
          material={woodMat('trough', '#6B4226')}
          castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart('trough') }}
        >
          <boxGeometry args={[0.62, 0.1, troughLen]} />
        </mesh>
        {/* 槽壁左（高挡水围边） */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[-0.33, 0.16, 0]}>
          <boxGeometry args={[0.06, 0.32, troughLen]} />
        </mesh>
        {/* 槽壁右 */}
        <mesh material={woodMat('trough', '#7B4F2E')} castShadow position={[0.33, 0.16, 0]}>
          <boxGeometry args={[0.06, 0.32, troughLen]} />
        </mesh>
        {/* 槽内水道（深色凹槽，水在此被刮板带上） */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.54, 0.04, troughLen - 0.1]} />
          <meshStandardMaterial color="#2A1810" roughness={0.9} />
        </mesh>
        {/* 槽底加固横木（每隔一段一根，如原版木作） */}
        {Array.from({ length: 8 }).map((_, i) => {
          const z = -troughLen / 2 + (i + 0.5) * (troughLen / 8)
          return (
            <mesh key={`brace-${i}`} position={[0, -0.1, z]} castShadow>
              <boxGeometry args={[0.68, 0.07, 0.1]} />
              <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
            </mesh>
          )
        })}
        {/* 槽内水流（半透明蓝色薄box，覆盖水道，模拟刮板带上的水） */}
        {simSpeed > 0 && (
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.04, troughLen - 0.2]} />
            <meshStandardMaterial color="#5BA3D0" transparent opacity={0.6} roughness={0.2} metalness={0.1} />
          </mesh>
        )}
      </group>

      {/* ===== 龙骨链 + 刮水板（沿环形路径循环移动） ===== */}
      <group ref={chainGroupRef} position={[0, 0.22, 0]}>
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
            {/* 链节（龙骨木节，连接链条） */}
            <mesh
              material={woodMat('chain', '#5C3A1E')}
              castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
            >
              <boxGeometry args={[0.2, 0.09, 0.11]} />
            </mesh>
            {/* 龙骨销（连接销，如原版鹤膝榫卯） */}
            <mesh position={[0, 0, 0.06]} material={woodMat('chain', '#3A2518')}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} rotation={[Math.PI / 2, 0, 0]} />
            </mesh>
            {/* 刮水板（矩形木板，垂直于槽底，刮水上行） */}
            <mesh
              material={woodMat('blade', '#8B6F3A')}
              castShadow
              position={[0, -0.2, 0]}
              onClick={(e) => { e.stopPropagation(); onSelectPart('blade') }}
            >
              <boxGeometry args={[0.52, 0.04, 0.22]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===== 顶部踏轴（主动链轮，人踩驱动，穿过龙骨链顶部折返处） ===== */}
      {/* 位置：穿过龙骨链顶部折返中心（z=troughLen/2+0.2, y=0.22），轴沿X方向 */}
      <group position={[0, 0.12, troughLen / 2 + 0.2]}>
        <group ref={pedalRef}>
          {/* 主轴（粗木大轴，沿X方向贯穿，穿过龙骨链） */}
          <mesh
            material={woodMat('pedal', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
          >
            <cylinderGeometry args={[0.26, 0.26, 0.85, 16]} />
          </mesh>
          {/* 轴端铁箍（两端限位） */}
          <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 12]} />
            <meshStandardMaterial color="#3A2518" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 12]} />
            <meshStandardMaterial color="#3A2518" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* 链轮齿（鹤膝，8个，在YZ平面分布，垂直于X轴，与轴转动方向一致，咬合龙骨链） */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <mesh
                key={`gear-${i}`}
                material={woodMat('pedal', '#6B4226')}
                castShadow
                position={[0, Math.cos(a) * 0.28, Math.sin(a) * 0.28]}
                rotation={[a, 0, 0]}
                onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
              >
                <boxGeometry args={[0.7, 0.14, 0.07]} />
              </mesh>
            )
          })}
          {/* 踏板+拐木（4组对置，绕X轴旋转，沿主轴长度方向错开排列，拐木从主轴中心径向延伸连接踏板） */}
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => {
            // 4组踏板沿主轴长度方向(X)错开，避免重叠，且都在主轴(长0.85)范围内
            const xPos = -0.3 + i * 0.2
            return (
              <group key={`pedal-${i}`} rotation={[a, 0, 0]}>
                {/* 拐木（曲柄，从主轴中心 y=0 径向延伸到踏板 y=0.42，穿过主轴表面牢牢连接） */}
                <mesh
                  material={woodMat('pedal', '#5C3A1E')}
                  castShadow
                  position={[xPos, 0.21, 0]}
                >
                  <boxGeometry args={[0.09, 0.42, 0.09]} />
                </mesh>
                {/* 踏板（拐木末端，人踩的脚踏板） */}
                <mesh
                  material={woodMat('pedal', '#7B4F2E')}
                  castShadow
                  position={[xPos, 0.44, 0]}
                  onClick={(e) => { e.stopPropagation(); onSelectPart('pedal') }}
                >
                  <boxGeometry args={[0.28, 0.05, 0.18]} />
                </mesh>
              </group>
            )
          })}
        </group>

        {/* 踏轴支架（左右木架，支撑踏轴） */}
        <mesh position={[-0.5, -0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.8, 0.14]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        <mesh position={[0.5, -0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.8, 0.14]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        {/* 站板（人踩的工作台） */}
        <mesh position={[0, -0.25, 0.7]} castShadow>
          <boxGeometry args={[0.9, 0.07, 0.65]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
        </mesh>

        {/* ===== 踩踏人形（如原版插图，站在踏轴上方，手扶横架） ===== */}
        <group position={[0, 0.8, 0.4]}>
          {/* 头 */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#C9A578" roughness={0.7} />
          </mesh>
          {/* 发髻 */}
          <mesh castShadow position={[0, 0.72, -0.02]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#2A1810" roughness={0.8} />
          </mesh>
          {/* 身（略前倾，踩踏姿势） */}
          <mesh castShadow position={[0, 0.2, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 0.65, 10]} />
            <meshStandardMaterial color="#8B6F3A" roughness={0.75} />
          </mesh>
          {/* 衣服下摆 */}
          <mesh castShadow position={[0, -0.15, 0.05]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.2, 0.3, 8]} />
            <meshStandardMaterial color="#7B4F2E" roughness={0.8} />
          </mesh>
          {/* 左腿（髋/膝/踝三关节，踩踏动画） */}
          <group ref={leftHipRef} position={[-0.1, -0.15, 0.05]}>
            {/* 大腿 */}
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.2, 8]} />
              <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
            </mesh>
            {/* 膝关节 */}
            <group ref={leftKneeRef} position={[0, -0.2, 0]}>
              {/* 小腿 */}
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.2, 8]} />
                <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
              </mesh>
              {/* 踝关节 */}
              <group ref={leftAnkleRef} position={[0, -0.2, 0]}>
                {/* 足部（脚掌） */}
                <mesh position={[0, -0.025, 0.05]} castShadow>
                  <boxGeometry args={[0.09, 0.05, 0.18]} />
                  <meshStandardMaterial color="#3A2518" roughness={0.8} />
                </mesh>
              </group>
            </group>
          </group>
          {/* 右腿（髋/膝/踝三关节，踩踏动画，与左腿反相） */}
          <group ref={rightHipRef} position={[0.1, -0.15, 0.05]}>
            {/* 大腿 */}
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.2, 8]} />
              <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
            </mesh>
            {/* 膝关节 */}
            <group ref={rightKneeRef} position={[0, -0.2, 0]}>
              {/* 小腿 */}
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.2, 8]} />
                <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
              </mesh>
              {/* 踝关节 */}
              <group ref={rightAnkleRef} position={[0, -0.2, 0]}>
                {/* 足部（脚掌） */}
                <mesh position={[0, -0.025, 0.05]} castShadow>
                  <boxGeometry args={[0.09, 0.05, 0.18]} />
                  <meshStandardMaterial color="#3A2518" roughness={0.8} />
                </mesh>
              </group>
            </group>
          </group>
          {/* 左臂（扶前方横架） */}
          <mesh castShadow position={[-0.15, 0.3, 0.25]} rotation={[1.4, 0, 0.2]}>
            <cylinderGeometry args={[0.05, 0.045, 0.4, 8]} />
            <meshStandardMaterial color="#C9A578" roughness={0.7} />
          </mesh>
          {/* 右臂 */}
          <mesh castShadow position={[0.15, 0.3, 0.25]} rotation={[1.4, 0, -0.2]}>
            <cylinderGeometry args={[0.05, 0.045, 0.4, 8]} />
            <meshStandardMaterial color="#C9A578" roughness={0.7} />
          </mesh>
        </group>

        {/* 扶手架（人手扶的横架，如原版插图） */}
        {/* 左立柱 */}
        <mesh position={[-0.15, 0.7, 0.7]} castShadow>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        {/* 右立柱 */}
        <mesh position={[0.15, 0.7, 0.7]} castShadow>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        {/* 横架（扶手） */}
        <mesh position={[0, 1.0, 0.55]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.85} />
        </mesh>
        {/* 斜撑（加固扶手架） */}
        <mesh position={[-0.15, 0.55, 0.85]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
        <mesh position={[0.15, 0.55, 0.85]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.85} />
        </mesh>
      </group>

      {/* ===== 底部从动轮（浸入水中，穿过龙骨链底部折返处，引导龙骨链） ===== */}
      {/* 位置：穿过龙骨链底部折返中心（z=-troughLen/2-0.2, y=0.22），轴沿X方向 */}
      <group position={[0, 0.12, -troughLen / 2 - 0.2]}>
        <group ref={bottomWheelRef}>
          {/* 从动轮主体（沿X方向，穿过龙骨链） */}
          <mesh
            material={woodMat('chain', '#5C3A1E')}
            castShadow
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => { e.stopPropagation(); onSelectPart('chain') }}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.7, 12]} />
          </mesh>
          {/* 从动轮齿（6个，在YZ平面分布，垂直于X轴，与轴转动方向一致，咬合龙骨链） */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={`bgear-${i}`}
                material={woodMat('chain', '#6B4226')}
                castShadow
                position={[0, Math.cos(a) * 0.24, Math.sin(a) * 0.24]}
                rotation={[a, 0, 0]}
              >
                <boxGeometry args={[0.65, 0.12, 0.05]} />
              </mesh>
            )
          })}
        </group>
      </group>

      {/* ===== 水面（移到group外，水平不倾斜，从动轮1/2没入水中） ===== */}
      {/* 从动轮中心世界y≈-0.43，轮半径0.22，水面设在y=-0.54让轮下半没入 */}
      {/* 水面已移到group外 */}

      {/* ===== 出水口（水槽高端出水，流入田地） ===== */}
      <group position={[0, 0.3, troughLen / 2 + 0.1]}>
        {/* 出水槽（导流到田） */}
        <mesh material={woodMat('trough', '#6B4226')} castShadow position={[0, 0, 0.3]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
        </mesh>
        {/* 出水水流（半透明蓝色薄box，模拟出水） */}
        {simSpeed > 0 && (
          <mesh position={[0, -0.02, 0.4]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color="#5BA3D0" transparent opacity={0.7} roughness={0.2} />
          </mesh>
        )}
      </group>

      {/* 水流粒子（模拟时显示，在底部水中流动） */}
      {simSpeed > 0 && <LongguWater speed={simSpeed} troughLen={troughLen} />}
    </group>

    {/* ===== 水面+水体（水平，不随龙骨倾斜，从动轮1/2没入水中） ===== */}
    {/* 从动轮中心世界y≈-0.43，轮半径0.22，水面设在y=-0.43让轮1/2没入 */}
    {/* 水面（水平半透明蓝plane） */}
    <mesh position={[0, -0.43, -3.0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.0, 3.0]} />
      <meshStandardMaterial color="#4A7A9A" transparent opacity={0.5} roughness={0.3} />
    </mesh>
    {/* 水体（水面以下实体水，水平） */}
    <mesh position={[0, -1.3, -3.0]}>
      <boxGeometry args={[4.0, 1.6, 3.0]} />
      <meshStandardMaterial color="#3A6A8A" transparent opacity={0.35} roughness={0.2} metalness={0.1} />
    </mesh>
    </>
  )
}

// 水流粒子（底部水中流动效果）
function LongguWater({ speed, troughLen }) {
  const ref = useRef()
  const count = 50
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.8
      arr[i * 3 + 1] = -1.6 - Math.random() * 0.4
      arr[i * 3 + 2] = -troughLen / 2 - 1.8 + Math.random() * 0.8
    }
    return arr
  }, [troughLen])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 2] += delta * (speed / 50) * 1.5
      if (pos.array[i * 3 + 2] > -troughLen / 2 - 1.0) {
        pos.array[i * 3 + 2] = -troughLen / 2 - 2.2
        pos.array[i * 3 + 1] = -1.6 - Math.random() * 0.4
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#5BA3D0" size={0.07} transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}
