import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore.js'
import Tongche from './models/Tongche.jsx'
import Longgu from './models/Longgu.jsx'
import Shuidui from './models/Shuidui.jsx'
import Fangzhi from './models/Fangzhi.jsx'
import Gufeng from './models/Gufeng.jsx'
import Diaoban from './models/Diaoban.jsx'

// 视角预设（配合左斜前方俯视书本的视角）
const VIEW_PRESETS = {
  default: { position: [0.5, 2.2, 5.2], target: [0, 0.2, 0] },
  front: { position: [0, 1.2, 5.5], target: [0, 0.2, 0] },
  side: { position: [5.5, 1.5, 1], target: [0, 0.2, 0] },
  top: { position: [0.01, 5.5, 1.5], target: [0, 0, 0] },
}

function CameraRig({ viewPreset }) {
  const { camera, controls } = useThree()
  const targetPos = useRef(new THREE.Vector3(...VIEW_PRESETS[viewPreset].position))
  const targetLook = useRef(new THREE.Vector3(...VIEW_PRESETS[viewPreset].target))
  // 是否正在执行视角切换动画；切换完成后停止干预，让用户自由操控
  const animating = useRef(true)  // 初始进入时执行一次归位动画
  const settled = useRef(false)

  useEffect(() => {
    targetPos.current.set(...VIEW_PRESETS[viewPreset].position)
    targetLook.current.set(...VIEW_PRESETS[viewPreset].target)
    animating.current = true
    settled.current = false
  }, [viewPreset])

  useFrame(() => {
    if (!animating.current) return
    camera.position.lerp(targetPos.current, 0.1)
    if (controls) {
      controls.target.lerp(targetLook.current, 0.1)
      controls.update()
    }
    // 接近目标即停止干预，交还控制权给用户
    if (camera.position.distanceTo(targetPos.current) < 0.02) {
      animating.current = false
      settled.current = true
    }
  })
  return null
}

export default function Scene3D({ artifact }) {
  const highlightedPartId = useStore((s) => s.highlightedPartId)
  const selectedPartId = useStore((s) => s.selectedPartId)
  const explode = useStore((s) => s.explode)
  const simulate = useStore((s) => s.simulate)
  const simParam = useStore((s) => s.simParam)
  const viewPreset = useStore((s) => s.viewPreset)
  const selectPart = useStore((s) => s.selectPart)
  const quality = useStore((s) => s.quality)

  const simSpeed = simulate ? simParam : 0

  const handleSelectPart = (id) => {
    selectPart(id)
    // 点击热点 → 同时高亮部件 + 触发古文滚动联动
    useStore.getState().setHighlight(id, 'part')
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0.5, 2.2, 5.2], fov: 42 }}
      dpr={quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : 1}
      gl={{ antialias: quality !== 'low', alpha: true, preserveDrawingBuffer: false }}
      frameloop="always"
    >
      <CameraRig viewPreset={viewPreset} />

      {/* 灯光：纯本地灯光（去掉 drei Environment，避免从 githubusercontent 加载 HDR，确保国内可访问）
          主光塑造体积 + 暖色补光压暗部 + 半球光提供环境层次 */}
      <hemisphereLight intensity={0.5} color="#FFF1D6" groundColor="#3A2518" />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.2}
        color="#FFF1D6"
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#E8C88C" />
      {/* 后侧补光，避免背面纯黑 */}
      <directionalLight position={[0, 3, -5]} intensity={0.25} color="#C9A578" />

      {/* 浮空效果 —— 轻微上下呼吸；外层缩放适配视野，避免模型超出可视范围 */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3} floatingRange={[-0.06, 0.06]}>
        <group scale={artifact.fitScale || 0.85}>
          {artifact.id === 'tongche' && (
            <Tongche
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
          {artifact.id === 'longgu' && (
            <Longgu
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
          {artifact.id === 'shuidui' && (
            <Shuidui
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
          {artifact.id === 'fangzhi' && (
            <Fangzhi
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
          {artifact.id === 'gufeng' && (
            <Gufeng
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
          {artifact.id === 'diaoban' && (
            <Diaoban
              highlightedPartId={highlightedPartId}
              explode={explode}
              simSpeed={simSpeed}
              onSelectPart={handleSelectPart}
            />
          )}
        </group>
      </Float>

      {/* 柔和接触阴影 —— 悬浮感的灵魂：随器物形状的深棕软影投在书页上 */}
      <ContactShadows
        position={[0, -2.0, 0]}
        scale={8}
        resolution={1024}
        blur={2.6}
        opacity={0.5}
        far={3}
        color="#3A2518"
      />

      {/* 热点标记 */}
      {artifact.parts.map((p) => (
        <Hotspot
          key={p.id}
          position={p.hotspot}
          partId={p.id}
          name={p.name}
          active={highlightedPartId === p.id || selectedPartId === p.id}
          onClick={() => handleSelectPart(p.id)}
          onHover={(on) => {
            // 悬停热点 → 临时高亮部件（不影响已选中的）
            const st = useStore.getState()
            if (on) {
              st.setHighlight(p.id, 'part')
            } else if (st.highlightSource === 'part' && st.selectedPartId !== p.id) {
              st.setHighlight(null, null)
            }
          }}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={14}
        makeDefault
      />
    </Canvas>
  )
}

// 热点：3D 中的可点击标记
function Hotspot({ position, name, active, onClick, onHover }) {
  return (
    <Html position={position} center distanceFactor={8} occlude={false} zIndexRange={[10, 0]}>
      <div
        className={`hotspot ${active ? 'hotspot-active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <div className="hotspot-dot" />
        <div className="hotspot-ring" />
        <div className="hotspot-label">{name}</div>
      </div>
      <style>{`
        .hotspot {
          position: relative; width: 20px; height: 20px;
          cursor: pointer; transform: translate(-50%, -50%);
        }
        .hotspot-dot {
          position: absolute; top: 50%; left: 50%;
          width: 10px; height: 10px; border-radius: 50%;
          background: #C75B2A; transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(199,91,42,0.6);
          transition: all 0.2s;
        }
        .hotspot-ring {
          position: absolute; top: 50%; left: 50%;
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #C75B2A; transform: translate(-50%, -50%);
          opacity: 0.5; animation: hotspotPulse 2s ease-in-out infinite;
        }
        @keyframes hotspotPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        .hotspot-active .hotspot-dot {
          background: #E8C88C; width: 14px; height: 14px;
          box-shadow: 0 0 16px rgba(232,200,140,0.9);
        }
        .hotspot-label {
          position: absolute; top: 18px; left: 50%;
          transform: translateX(-50%);
          white-space: nowrap; font-size: 11px;
          font-family: var(--font-serif); font-weight: 600;
          color: #fff; background: rgba(139,69,19,0.92);
          padding: 2px 8px; border-radius: 4px;
          opacity: 0; transition: opacity 0.2s; pointer-events: none;
        }
        .hotspot:hover .hotspot-label, .hotspot-active .hotspot-label {
          opacity: 1;
        }
      `}</style>
    </Html>
  )
}
