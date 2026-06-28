import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 水碓 3D 模型（严格依《天工开物》明崇祯十年刊本·粹精卷·水碓版画复原）
// 部件 ID: wheel(动力水轮), shaft(主轴凸轮), hammer(碓杆杵头), mortar(石臼)
// 力学：水流冲卧式水轮（绕Y轴垂直旋转） → 通过齿轮/连杆转换为横轴旋转（绕X轴） → 3个拐木错相位从下推起碓杆尾 → 杵头下落舂石臼
// 碓杆为跷跷板结构：沿Z向（垂直于主轴），支点在杆1/3处，架在贯通前后主梁凹槽内
export default function Shuidui({ highlightedPartId, explode, simSpeed, onSelectPart }) {
  const wheelRef = useRef()
  const shaftRef = useRef()
  const hammerRefs = useRef([])

  useFrame((state, delta) => {
    const speed = simSpeed > 0 ? (simSpeed / 50) * 0.9 : 0
    // 立式水轮绕X轴（水平）旋转
    if (wheelRef.current) wheelRef.current.rotation.x += delta * speed
    // 横轴（驱动碓杆的轴）绕X轴（水平）旋转
    if (shaftRef.current) shaftRef.current.rotation.x += delta * speed
    const angle = shaftRef.current ? shaftRef.current.rotation.x : 0
    hammerRefs.current.forEach((hammer, i) => {
      if (!hammer) return
      // 3拐木错120°相位，拐木从下方向上推起碓杆尾
      const phase = i * (Math.PI * 2 / 3)
      // 拐木在下方位置(angle+phase在0到π之间)时向上推起
      const camAngle = (angle + phase) % (Math.PI * 2)
      const lift = camAngle < Math.PI ? Math.max(0, Math.sin(camAngle)) * 0.5 : 0
      // 碓杆绕支点摆动（绕X轴，因为碓杆沿Z向）
      hammer.rotation.x = THREE.MathUtils.lerp(hammer.rotation.x, -lift * 0.85, 0.28)
    })
  })

  const isHi = (id) => highlightedPartId === id
  const matW = (id, c, r = 0.72) => new THREE.MeshStandardMaterial({ color: isHi(id) ? '#FFE4B5' : c, emissive: isHi(id) ? '#FFA500' : '#000', emissiveIntensity: isHi(id) ? 0.9 : 0, roughness: r, metalness: 0.0 })
  const matS = (id, c) => new THREE.MeshStandardMaterial({ color: isHi(id) ? '#FFE4B5' : c, emissive: isHi(id) ? '#FFA500' : '#000', emissiveIntensity: isHi(id) ? 0.9 : 0, roughness: 0.95, metalness: 0.05 })

  // ===== 尺寸（比例：水轮直径≈碓架总长；碓杆长=石臼高×3）=====
  const R = 1.1                  // 水轮半径（直径2.2）
  const wheelX = -1.7            // 水轮X
  const axisY = 0.8              // 主轴高度
  const shaftLen = 3.6           // 通长原木横轴
  // 3根碓杆沿Z方向（垂直主轴），3杆在X方向并排
  const stations = [0.15, 0.95, 1.75]   // 3杆X位置
  // 跷跷板：支点在杆1/3处，+Z杆尾(短臂)靠凸轮，-Z杆头(长臂)带杵
  const tailZ = 0.45             // 杆尾Z（1/3杆长，被凸轮抬）
  const headZ = -0.9             // 杆头Z（2/3杆长，带杵对石臼）
  const barLen = tailZ + Math.abs(headZ)  // 杆总长1.35
  const barCenterZ = (tailZ + headZ) / 2  // 杆中心Z=-0.225
  // 注：碓杆沿Z方向，3杆在X方向并排，摆动绕X轴
  // —— 但碓杆并排应沿X，杆长方向应垂直于主轴(沿Z)，支点在杆长1/3
  // 修正：碓杆沿Z向，3杆X并排；凸轮抬+Z端(杆尾)，-Z端(杆头)带杵对石臼

  const blades = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), [])
  const spokes = useMemo(() => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2), [])

  return (
    <group position={[0, -0.3, 0]}>
      {/* ============================================================
          一、左侧动力水轮（立式：YZ平面垂直，绕X轴水平旋转）
          双层同心轮圈 + 8主辐 + 内层交叉斜撑 + 12垂直拨水板(带木托) + 轮毂
          + 左右两根立式轴承立柱(顶部压木栓承横轴)
      ============================================================ */}
      <group ref={wheelRef} position={[wheelX, axisY, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('wheel') }}>
        {/* 双层同心轮圈（YZ平面，沿X分开 dx=±0.13） */}
        {[-0.13, 0.13].map((dx, i) => (
          <mesh key={i} position={[dx, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={matW('wheel', i === 0 ? '#6B4226' : '#7B4F2E')} castShadow>
            <torusGeometry args={[R, 0.05, 10, 48]} />
          </mesh>
        ))}
        {/* 双层轮圈连接木（6根贯穿两层，沿圆周均匀） */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh key={`cn-${i}`} material={matW('wheel', '#5C3A1E')} castShadow
              position={[0, Math.cos(a) * R, Math.sin(a) * R]} rotation={[0, 0, a]}>
              <cylinderGeometry args={[0.022, 0.022, 0.28, 8]} />
            </mesh>
          )
        })}
        {/* 8根径向主辐（圆木，YZ平面，两层各8根共16根） */}
        {spokes.map((a, i) => {
          const ry = Math.cos(a), rz = Math.sin(a)
          return [-0.13, 0.13].map((dx, j) => (
            <mesh key={`sp-${i}-${j}`} material={matW('wheel', '#7B4F2E')} castShadow
              position={[dx, ry * R * 0.5, rz * R * 0.5]} rotation={[a, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, R * 0.92, 10]} />
            </mesh>
          ))
        })}
        {/* 内层交叉斜撑加固（4根X形，与主辐交错45°，两层各4根） */}
        {Array.from({ length: 4 }).map((_, i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 8
          const ry = Math.cos(a), rz = Math.sin(a)
          return [-0.13, 0.13].map((dx, j) => (
            <mesh key={`xb-${i}-${j}`} material={matW('wheel', '#8B6F3A')} castShadow
              position={[dx, ry * R * 0.35, rz * R * 0.35]} rotation={[a + Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, R * 0.6, 8]} />
            </mesh>
          ))
        })}
        {/* 12块拨水板（在YZ平面内，接受水流推动） */}
        {blades.map((a, i) => {
          const by = Math.cos(a) * R, bz = Math.sin(a) * R
          return (
            <group key={`bl-${i}`} position={[0, by, bz]} rotation={[a, 0, 0]}>
              {/* 拨水板主体 */}
              <mesh material={matW('wheel', '#8B6F3A')} position={[0, 0.15, 0]} castShadow>
                <boxGeometry args={[0.3, 0.32, 0.24]} />
              </mesh>
              {/* 斜撑木托 */}
              <mesh material={matW('wheel', '#6B4226')} position={[0, 0.07, 0.05]} rotation={[0.6, 0, 0]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.16, 6]} />
              </mesh>
            </group>
          )
        })}
        {/* 中心鼓形轮毂（水平通长，贯穿两层） */}
        <mesh material={matW('wheel', '#5C3A1E')} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.36, 16]} />
        </mesh>
      </group>


      {/* ============================================================
          二、横轴凸轮传动（通长原木横轴 + 3半圆凸轮 + 木销锁死 + 铁箍）
      ============================================================ */}
      <group ref={shaftRef} position={[0, axisY, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart('shaft') }}>
        {/* 通长原木横轴 */}
        <mesh material={matW('shaft', '#7B4F2E')} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, shaftLen, 16]} />
        </mesh>
        {/* 3根拐木（向下突出木棒，错120°相位，木销锁死在轴上，从下方推起碓杆尾） */}
        {stations.map((sx, i) => (
          <group key={`cam-${i}`} position={[sx, 0, 0]} rotation={[0, 0, i * (Math.PI * 2 / 3)]}>
            {/* 拐木主体（圆木棒，向-Y方向突出，从下推起碓杆） */}
            <mesh material={matW('shaft', '#8B6F3A')} position={[0, -0.22, 0]} castShadow>
              <boxGeometry args={[0.16, 0.44, 0.16]} />
            </mesh>
            {/* 拐木根部加厚（连接主轴） */}
            <mesh material={matW('shaft', '#7B4F2E')} position={[0, -0.08, 0]} castShadow>
              <boxGeometry args={[0.2, 0.18, 0.2]} />
            </mesh>
            {/* 木销锁死（拐木穿轴的销钉） */}
            <mesh material={matW('shaft', '#3A2518')} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
            </mesh>
          </group>
        ))}
        {/* 铁箍（3道） */}
        {stations.map((sx, i) => (
          <mesh key={`ring-${i}`} position={[sx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.115, 0.012, 8, 20]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* 横轴右端轴承立柱（碓架端支撑） */}
      <group position={[2.25, 0, 0]}>
        <mesh material={matW('shaft', '#5C3A1E')} position={[0, axisY - 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 2.0, 10]} />
        </mesh>
        <mesh material={matW('shaft', '#6B4226')} position={[0, axisY + 0.18, 0]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.1]} />
        </mesh>
        <mesh material={matW('shaft', '#3A2518')} position={[0, axisY + 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 6]} />
        </mesh>
      </group>

      {/* ============================================================
          三、核心碓杆杠杆系统（跷跷板：沿Z向，3杆X并排）
          双层横向主梁(贯通前后) + 落地立柱 + 透榫木楔销钉
      ============================================================ */}
      {/* 双层贯通主梁（沿X，架立柱顶，开凹槽承支点） */}
      {[0.12, -0.12].map((dy, i) => (
        <mesh key={`beam-${i}`} material={matW('hammer', i === 0 ? '#6B4226' : '#7B4F2E')} position={[0.95, axisY + dy, 0]} castShadow>
          <boxGeometry args={[2.6, 0.1, 0.12]} />
        </mesh>
      ))}
      {/* 上主梁3个支点凹槽（半圆槽，承碓杆支点轴） */}
      {stations.map((sx, i) => (
        <mesh key={`pv-${i}`} position={[sx, axisY + 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 10, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#3A2518" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 落地立柱（4根，支撑双层主梁四角） */}
      {[[0.0, 0.32], [0.0, -0.32], [1.9, 0.32], [1.9, -0.32]].map(([x, z], i) => (
        <mesh key={`col-${i}`} material={matW('hammer', '#5C3A1E')} position={[x, axisY - 0.55, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.4, 8]} />
        </mesh>
      ))}
      {/* 立柱横向拉木（前后各一道，加固框架） */}
      {[0.32, -0.32].map((z, i) => (
        <mesh key={`tie-${i}`} material={matW('hammer', '#6B4226')} position={[0.95, axisY - 0.3, z]} castShadow>
          <boxGeometry args={[2.0, 0.07, 0.06]} />
        </mesh>
      ))}
      {/* 透榫、木楔、销钉（主梁与立柱交接，8处） */}
      {[[0.0, 0.32], [0.0, -0.32], [1.9, 0.32], [1.9, -0.32]].map(([x, z], i) => (
        <mesh key={`mortise-${i}`} material={matW('hammer', '#3A2518')} position={[x, axisY + 0.05, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.16, 6]} />
        </mesh>
      ))}

      {/* 3根平行等长圆木碓杆（沿Z向，跷跷板：+Z杆尾靠凸轮，-Z杆头带杵） */}
      {stations.map((sx, i) => (
        <group key={`hm-${i}`} ref={(el) => (hammerRefs.current[i] = el)} position={[sx, axisY + 0.14, 0]}>
          {/* 支点销轴（穿上主梁凹槽，在杆1/3处） */}
          <mesh material={matW('hammer', '#3A2518')} position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.14, 8]} />
          </mesh>
          {/* 碓杆主体（圆木，沿Z方向，从杆尾+Z到杆头-Z，中心在barCenterZ） */}
          <mesh material={matW('hammer', '#8B6F3A')} position={[0, 0, barCenterZ]} rotation={[Math.PI / 2, 0, 0]} castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart('hammer') }}>
            <cylinderGeometry args={[0.055, 0.055, barLen, 12]} />
          </mesh>
          {/* 杆尾受拨块（+Z端，被拐木抬起，连在杆上，向下延伸以便拐木推动） */}
          <mesh material={matW('hammer', '#6B4226')} position={[0, -0.08, tailZ]} castShadow>
            <boxGeometry args={[0.14, 0.18, 0.14]} />
          </mesh>
          {/* 杆头加粗端（-Z端，连在杆上） */}
          <mesh material={matW('hammer', '#5C3A1E')} position={[0, 0, headZ]} castShadow
            rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          </mesh>
          {/* 圆柱形实木碓杵（从杆头垂直向下，与杆头一体，对准石臼） */}
          <mesh material={matW('hammer', '#3A2518')} position={[0, -0.2, headZ]} castShadow>
            <cylinderGeometry args={[0.06, 0.075, 0.36, 12]} />
          </mesh>
          {/* 杵头铁套（最底端，舂捣接触） */}
          <mesh material={matW('hammer', '#2A2018')} position={[0, -0.38, headZ]} castShadow>
            <cylinderGeometry args={[0.075, 0.06, 0.06, 12]} />
          </mesh>
        </group>
      ))}

      {/* ============================================================
          四、石臼与底座（贯通长底座+四角矮脚+3石臼+木垫板+舂捣接触面）
      ============================================================ */}
      {/* 贯通长方形实木落地底座 */}
      <mesh material={matW('mortar', '#5C3A1E')} position={[0.95, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.26, 1.0]} />
      </mesh>
      {/* 四角矮脚 */}
      {[[0.0, 0.4], [0.0, -0.4], [1.9, 0.4], [1.9, -0.4]].map(([x, z], i) => (
        <mesh key={`leg-${i}`} material={matW('mortar', '#3A2518')} position={[x, -0.32, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        </mesh>
      ))}
      {/* 3只青灰色圆台形石臼（上宽下窄，对准杵头，嵌入底座凹槽） */}
      {stations.map((sx, i) => (
        <group key={`mt-${i}`} position={[sx, 0, headZ]} onClick={(e) => { e.stopPropagation(); onSelectPart('mortar') }}>
          {/* 圆形木垫板（石臼底垫） */}
          <mesh material={matW('mortar', '#6B4226')} position={[0, -0.04, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.06, 20]} />
          </mesh>
          {/* 臼身（上宽下窄圆台） */}
          <mesh material={matS('mortar', '#8A8A82')} position={[0, 0.16, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.24, 0.34, 24]} />
          </mesh>
          {/* 臼口外沿 */}
          <mesh material={matS('mortar', '#9A9A92')} position={[0, 0.34, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.32, 0.06, 24]} />
          </mesh>
          {/* 臼口深色舂捣接触面（内凹） */}
          <mesh material={matS('mortar', '#2A2823')} position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.2, 0.12, 0.2, 20]} />
          </mesh>
          {/* 臼底 */}
          <mesh material={matS('mortar', '#1A1815')} position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
          </mesh>
        </group>
      ))}

      
    </group>
  )
}
