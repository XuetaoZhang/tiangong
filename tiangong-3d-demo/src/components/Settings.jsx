import React from 'react'
import { useStore } from '../store/useStore.js'

export default function Settings() {
  const s = useStore()
  const go = s.go

  return (
    <div className="settings-page">

      <div className="settings-body">
        <button className="back-btn" onClick={() => go('cover')}>← 返回</button>
        <h1 className="page-title">设 置</h1>

        <Section title="外观">
          <Row label="主题">
            <RadioGroup value={s.theme} onChange={s.setTheme} options={[
              { v: 'light', l: '浅色' }, { v: 'dark', l: '深色' }, { v: 'system', l: '跟随系统' }
            ]} />
          </Row>
        </Section>

        <Section title="音频">
          <Row label="语音朗读">
            <Toggle value={s.ttsEnabled} onChange={s.setTtsEnabled} />
          </Row>
          <Row label="朗读语速">
            <RadioGroup value={s.ttsRate} onChange={s.setTtsRate} options={[
              { v: 'slow', l: '慢' }, { v: 'medium', l: '中' }, { v: 'fast', l: '快' }
            ]} />
          </Row>
        </Section>

        <Section title="AI 讲解">
          <Row label="讲解详细程度">
            <RadioGroup value={s.aiLevel} onChange={s.setAiLevel} options={[
              { v: 'student', l: '学生版' }, { v: 'standard', l: '标准版' }, { v: 'expert', l: '专家版' }
            ]} />
          </Row>
          <Row label="悬停自动翻译">
            <Toggle value={s.autoTranslate} onChange={s.setAutoTranslate} />
          </Row>
        </Section>

        <Section title="性能">
          <Row label="画质">
            <RadioGroup value={s.quality} onChange={s.setQuality} options={[
              { v: 'high', l: '高' }, { v: 'medium', l: '中' }, { v: 'low', l: '低' }
            ]} />
          </Row>
          <Row label="减少动效">
            <Toggle value={s.reduceMotion} onChange={s.setReduceMotion} />
          </Row>
        </Section>

        <Section title="关于">
          <div className="about-line muted">《天工开物》内容基于公有领域版本整理</div>
        </Section>
      </div>

      <style>{`
        .settings-page { position: fixed; inset: 0; overflow-y: auto; background: var(--bg); }
        .settings-nav { background: var(--bg2); border-bottom: 1px solid var(--rule); }
        .settings-nav .logo-text { color: var(--ink); }
        .settings-nav .nav-links button { color: var(--muted); }
        .settings-nav .nav-links button:hover { color: var(--accent); background: var(--accent-light); }
        .settings-body { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .back-btn { color: var(--accent); font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 6px; }
        .back-btn:hover { background: var(--accent-light); }
        .page-title { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--ink); letter-spacing: 0.3em; margin: 1rem 0 2rem; }
        .settings-section { background: var(--bg2); border: 1px solid var(--rule); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem; }
        .section-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600; color: var(--accent); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .section-title::before { content: ''; width: 4px; height: 18px; background: var(--accent2); border-radius: 2px; }
        .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 0; border-bottom: 1px solid var(--rule); }
        .settings-row:last-child { border-bottom: none; }
        .row-label { font-size: 0.92rem; color: var(--ink); }
        .radio-group { display: flex; gap: 0.4rem; }
        .radio-btn { padding: 0.35rem 0.9rem; font-size: 0.82rem; border-radius: 100px; border: 1px solid var(--rule); color: var(--muted); transition: all 0.2s; }
        .radio-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .toggle { width: 42px; height: 24px; border-radius: 12px; background: var(--rule); position: relative; transition: background 0.2s; }
        .toggle.on { background: var(--accent); }
        .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .toggle.on::after { transform: translateX(18px); }
        .about-line { font-size: 0.88rem; color: var(--ink); margin-bottom: 0.4rem; }
        .about-line.muted { color: var(--muted); font-size: 0.8rem; }
      `}</style>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="settings-section">
      <div className="section-title">{title}</div>
      {children}
    </div>
  )
}
function Row({ label, children }) {
  return <div className="settings-row"><span className="row-label">{label}</span>{children}</div>
}
function RadioGroup({ value, onChange, options }) {
  return (
    <div className="radio-group">
      {options.map((o) => (
        <button key={o.v} className={`radio-btn ${value === o.v ? 'active' : ''}`} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}
function Toggle({ value, onChange }) {
  return <button className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)} />
}
