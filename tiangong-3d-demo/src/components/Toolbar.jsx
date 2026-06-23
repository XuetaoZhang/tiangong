import React, { useState } from 'react'
import { useStore } from '../store/useStore.js'

export default function Toolbar({ artifact, mobile }) {
  const explode = useStore((s) => s.explode)
  const simulate = useStore((s) => s.simulate)
  const simParam = useStore((s) => s.simParam)
  const viewPreset = useStore((s) => s.viewPreset)
  const toggleExplode = useStore((s) => s.toggleExplode)
  const toggleSimulate = useStore((s) => s.toggleSimulate)
  const setSimParam = useStore((s) => s.setSimParam)
  const setViewPreset = useStore((s) => s.setViewPreset)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`toolbar ${mobile ? 'toolbar-mobile' : ''} ${collapsed ? 'collapsed' : ''}`}>
      <button className="toolbar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '◀' : '▼'} 工具
      </button>

      {!collapsed && (
        <div className="toolbar-body">
          {/* 视角预设 */}
          <div className="tool-group">
            <div className="tool-label">视角</div>
            <div className="view-presets">
              <button className={viewPreset === 'default' ? 'active' : ''} onClick={() => setViewPreset('default')}>默认</button>
              <button className={viewPreset === 'front' ? 'active' : ''} onClick={() => setViewPreset('front')}>正视</button>
              <button className={viewPreset === 'side' ? 'active' : ''} onClick={() => setViewPreset('side')}>侧视</button>
              <button className={viewPreset === 'top' ? 'active' : ''} onClick={() => setViewPreset('top')}>俯视</button>
            </div>
          </div>

          <div className="tool-divider" />

          {/* 拆解模式 */}
          <div className="tool-group">
            <div className="tool-label">拆解模式</div>
            <button className={`tool-switch ${explode ? 'on' : ''}`} onClick={toggleExplode}>
              <span className="switch-track"><span className="switch-thumb" /></span>
              <span>{explode ? '已开启' : '关闭'}</span>
            </button>
          </div>

          <div className="tool-divider" />

          {/* 运作模拟 */}
          <div className="tool-group">
            <div className="tool-label">运作模拟</div>
            <button className={`tool-switch ${simulate ? 'on' : ''}`} onClick={toggleSimulate}>
              <span className="switch-track"><span className="switch-thumb" /></span>
              <span>{simulate ? '运转中' : '关闭'}</span>
            </button>
          </div>

          {simulate && (
            <div className="tool-group sim-param">
              <div className="tool-label">{artifact.simulation.paramLabel}</div>
              <input
                type="range"
                min={artifact.simulation.paramMin}
                max={artifact.simulation.paramMax}
                value={simParam}
                onChange={(e) => setSimParam(Number(e.target.value))}
              />
              <span className="param-value">{simParam}</span>
            </div>
          )}
        </div>
      )}

      <style>{`
        .toolbar {
          position: absolute; right: 1.2rem; bottom: 1.2rem; z-index: 18;
          background: rgba(247,244,239,0.92); backdrop-filter: blur(12px);
          border: 1px solid rgba(139,69,19,0.2); border-radius: 14px;
          padding: 0.8rem; min-width: 220px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: scaleIn 0.3s ease;
        }
        .toolbar-mobile {
          position: static; width: 100%; min-width: 0;
          border-radius: 10px; box-shadow: none;
        }
        .toolbar-toggle {
          width: 100%; text-align: left; font-size: 0.82rem; font-weight: 600;
          color: var(--accent); padding: 0.2rem 0.4rem;
        }
        .toolbar-body { display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.4rem; }
        .tool-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .tool-label { font-size: 0.72rem; color: var(--muted); font-weight: 500; }
        .view-presets { display: flex; gap: 0.25rem; flex-wrap: wrap; }
        .view-presets button {
          padding: 0.3rem 0.55rem; font-size: 0.74rem; border-radius: 6px;
          background: var(--bg); color: var(--muted); border: 1px solid var(--rule);
          transition: all 0.2s;
        }
        .view-presets button.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .tool-switch {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;
          color: var(--ink); padding: 0.2rem 0;
        }
        .switch-track {
          width: 36px; height: 20px; border-radius: 10px; background: var(--rule);
          position: relative; transition: background 0.2s;
        }
        .switch-thumb {
          position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
          border-radius: 50%; background: #fff; transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .tool-switch.on .switch-track { background: var(--accent2); }
        .tool-switch.on .switch-thumb { transform: translateX(16px); }
        .tool-divider { height: 1px; background: var(--rule); margin: 0.1rem 0; }
        .sim-param input[type=range] {
          width: 100%; accent-color: var(--accent2); height: 4px;
        }
        .param-value { font-size: 0.72rem; color: var(--accent); font-weight: 600; }
      `}</style>
    </div>
  )
}
