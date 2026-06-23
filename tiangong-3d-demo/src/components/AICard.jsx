import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'

export default function AICard({ artifact, mobile }) {
  const selectedPartId = useStore((s) => s.selectedPartId)
  const clearSelect = useStore((s) => s.clearSelect)
  const aiLevel = useStore((s) => s.aiLevel)
  const ttsEnabled = useStore((s) => s.ttsEnabled)
  const setHighlight = useStore((s) => s.setHighlight)

  const [displayLevel, setDisplayLevel] = useState(aiLevel)
  const [streaming, setStreaming] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showSource, setShowSource] = useState(false)
  const cardRef = useRef(null)

  const part = artifact.parts.find((p) => p.id === selectedPartId)

  // 流式输出模拟
  useEffect(() => {
    if (!part) return
    setDisplayLevel(aiLevel)
    setStreaming(true)
    setDisplayedText('')
    setShowSource(false)
    const fullText = part.explanation[aiLevel]
    let i = 0
    const timer = setInterval(() => {
      i += 2
      setDisplayedText(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timer)
        setStreaming(false)
        setShowSource(true)
      }
    }, 20)
    return () => clearInterval(timer)
  }, [part, aiLevel])

  if (!part) return null

  const switchLevel = (lvl) => {
    setDisplayLevel(lvl)
    setStreaming(true)
    setDisplayedText('')
    setShowSource(false)
    const fullText = part.explanation[lvl]
    let i = 0
    const timer = setInterval(() => {
      i += 2
      setDisplayedText(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timer)
        setStreaming(false)
        setShowSource(true)
      }
    }, 20)
  }

  const handleSpeak = () => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(part.explanation[displayLevel])
    utter.lang = 'zh-CN'
    utter.rate = useStore.getState().ttsRate === 'fast' ? 1.3 : useStore.getState().ttsRate === 'slow' ? 0.8 : 1
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className={`ai-card ${mobile ? 'ai-card-mobile' : ''}`} ref={cardRef}>
      <div className="ai-card-header">
        <div className="ai-card-title">
          <span className="ai-icon">✦</span>
          <span className="part-name">{part.name}</span>
          <span className="ai-tag">AI 释义</span>
        </div>
        <button className="ai-close" onClick={clearSelect}>✕</button>
      </div>

      {/* 风格切换 */}
      <div className="ai-level-tabs">
        <button className={displayLevel === 'student' ? 'active' : ''} onClick={() => switchLevel('student')}>学生版</button>
        <button className={displayLevel === 'standard' ? 'active' : ''} onClick={() => switchLevel('standard')}>标准版</button>
        <button className={displayLevel === 'expert' ? 'active' : ''} onClick={() => switchLevel('expert')}>专家版</button>
      </div>

      {/* 释义内容（流式） */}
      <div className="ai-content">
        {displayedText}
        {streaming && <span className="cursor">▍</span>}
      </div>

      {/* 现代对照 */}
      {showSource && (
        <div className="ai-modern fade-in">
          <span className="modern-label">现代对应：</span>
          <span className="modern-value">{part.modern}</span>
        </div>
      )}

      {/* 来源 */}
      {showSource && (
        <div className="ai-source fade-in">📖 来源：《天工开物·{part.source}》</div>
      )}

      {/* 操作按钮 */}
      {showSource && (
        <div className="ai-actions fade-in">
          <button onClick={() => switchLevel(displayLevel)}>🔄 换个说法</button>
          <button onClick={() => setHighlight(part.id, 'part')}>✨ 定位部件</button>
          <button onClick={handleSpeak}>🔊 朗读</button>
        </div>
      )}

      <style>{`
        .ai-card {
          position: absolute; left: 1.2rem; bottom: 1.2rem; z-index: 19;
          width: 340px; max-width: calc(100vw - 2.4rem);
          background: rgba(255,252,245,0.92); backdrop-filter: blur(14px);
          border: 1px solid rgba(139,69,19,0.25); border-radius: 14px;
          padding: 1rem 1.1rem;
          box-shadow: 0 12px 36px rgba(0,0,0,0.25);
          animation: scaleIn 0.3s ease;
        }
        .ai-card-mobile {
          position: fixed; left: 0.8rem; right: 0.8rem; bottom: 0.8rem; width: auto;
        }
        .ai-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.7rem; }
        .ai-card-title { display: flex; align-items: center; gap: 0.4rem; }
        .ai-icon { color: var(--accent2); font-size: 0.9rem; }
        .part-name { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--ink); }
        .ai-tag { font-size: 0.65rem; color: var(--accent2); background: rgba(199,91,42,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; }
        .ai-close { color: var(--muted); font-size: 0.9rem; padding: 0.2rem 0.4rem; }
        .ai-close:hover { color: var(--ink); }

        .ai-level-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.7rem; }
        .ai-level-tabs button {
          flex: 1; padding: 0.3rem; font-size: 0.72rem; border-radius: 6px;
          background: var(--bg); color: var(--muted); border: 1px solid var(--rule);
          transition: all 0.2s;
        }
        .ai-level-tabs button.active { background: var(--accent); color: #fff; border-color: var(--accent); }

        .ai-content {
          font-size: 0.86rem; line-height: 1.8; color: var(--ink);
          min-height: 3rem; font-family: var(--font-serif);
        }
        .cursor { color: var(--accent2); animation: pulse 0.8s infinite; }

        .ai-modern {
          margin-top: 0.7rem; padding: 0.5rem 0.7rem; border-radius: 8px;
          background: rgba(232,200,140,0.15); border-left: 3px solid var(--gold);
          font-size: 0.8rem;
        }
        .modern-label { color: var(--muted); }
        .modern-value { color: var(--accent); font-weight: 600; }

        .ai-source { margin-top: 0.5rem; font-size: 0.72rem; color: var(--muted); }

        .ai-actions { display: flex; gap: 0.4rem; margin-top: 0.7rem; flex-wrap: wrap; }
        .ai-actions button {
          font-size: 0.74rem; padding: 0.35rem 0.6rem; border-radius: 100px;
          background: var(--bg); color: var(--accent); border: 1px solid var(--accent);
          transition: all 0.2s;
        }
        .ai-actions button:hover { background: var(--accent); color: #fff; }
      `}</style>
    </div>
  )
}
