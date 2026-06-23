import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { artifacts } from '../data/artifacts.js'
import Scene3D from './Scene3D.jsx'
import Toolbar from './Toolbar.jsx'
import AICard from './AICard.jsx'
import TranslationOverlay from './TranslationOverlay.jsx'

export default function Reader() {
  const artifactId = useStore((s) => s.artifactId)
  const artifact = artifacts[artifactId]
  const closeArtifact = useStore((s) => s.closeArtifact)
  const toggleQA = useStore((s) => s.toggleQA)
  const pageTurning = useStore((s) => s.pageTurning)
  const turnPage = useStore((s) => s.turnPage)
  const [entered, setEntered] = useState(false)
  const [mobileTab, setMobileTab] = useState('object') // object | text | tools

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [artifactId])

  if (!artifact) return null

  return (
    <div className="reader-page">
      {/* 顶部导航 */}
      <nav className="reader-nav">
        <button className="reader-back" onClick={closeArtifact}>← 目录</button>
        <div className="reader-title">
          <span className="reader-name">{artifact.name}</span>
          <span className="reader-chapter">· {artifact.chapter}</span>
        </div>
        <div className="reader-nav-right">
          <span className="reader-page-indicator">第 2 页 / 共 18 页</span>
          <button className="ai-btn" onClick={toggleQA}>AI 助手 💬</button>
        </div>
      </nav>

      {/* 桌面端：书本展开布局 */}
      <div className="reader-desktop">
        <div className={`book-stage ${entered ? 'entered' : ''} ${pageTurning ? 'turning' : ''}`}>
          {/* 书本阴影底 */}
          <div className="book-shadow" />

          {/* 左页：古文 */}
          <div className="book-page book-left paper-texture">
            <div className="page-header">
              <span className="page-chapter-mark">{artifact.chapter}</span>
            </div>
            <AncientText artifact={artifact} />
            <div className="page-footer-mark">
              <span className="bookmark">🔖 {artifact.name}</span>
            </div>
            {/* 线装痕迹 */}
            <div className="binding-holes" />
          </div>

          {/* 书脊 */}
          <div className="book-spine" />

          {/* 右页：3D 浮空投影 */}
          <div className="book-page book-right paper-texture">
            <div className="page-header">
              <span className="page-illus-mark">〔 {artifact.name}图 〕</span>
            </div>
            <div className="scene-container">
              <Scene3D artifact={artifact} />
              <div className="scene-hint">拖拽旋转 · 滚轮缩放 · 点击热点 ●</div>
            </div>
            <div className="page-footer-mark right">
              <span>天工开物 · {artifact.chapter}</span>
            </div>
          </div>

          {/* 翻页动画层 */}
          {pageTurning && <div className="page-flip" />}
        </div>

        {/* 翻页按钮 */}
        <button className="page-nav page-prev" onClick={() => turnPage(-1)}>‹</button>
        <button className="page-nav page-next" onClick={() => turnPage(1)}>›</button>

        {/* 工具栏 */}
        <Toolbar artifact={artifact} />

        {/* AI 释义卡片 */}
        <AICard artifact={artifact} />

        {/* 译文浮层 */}
        <TranslationOverlay />
      </div>

      {/* 移动端：单页 + Tab */}
      <div className="reader-mobile">
        <div className="mobile-stage">
          <div className={`book-page-mobile paper-texture ${entered ? 'entered' : ''}`}>
            <div className="mobile-illus-mark">〔 {artifact.name}图 〕</div>
            {mobileTab === 'object' && (
              <div className="scene-container mobile">
                <Scene3D artifact={artifact} />
                <div className="scene-hint">双指旋转/缩放 · 点击 ●</div>
              </div>
            )}
            {mobileTab === 'text' && <AncientText artifact={artifact} />}
            {mobileTab === 'tools' && <Toolbar artifact={artifact} mobile />}
          </div>
        </div>

        <div className="mobile-tabs">
          <button className={mobileTab === 'object' ? 'active' : ''} onClick={() => setMobileTab('object')}>器物</button>
          <button className={mobileTab === 'text' ? 'active' : ''} onClick={() => setMobileTab('text')}>古文</button>
          <button className={mobileTab === 'tools' ? 'active' : ''} onClick={() => setMobileTab('tools')}>工具</button>
        </div>

        <AICard artifact={artifact} mobile />
        <TranslationOverlay mobile />
      </div>

      <ReaderStyles />
    </div>
  )
}

// 古文竖排组件
function AncientText({ artifact }) {
  const setHighlight = useStore((s) => s.setHighlight)
  const setTranslationHover = useStore((s) => s.setTranslationHover)
  const selectPart = useStore((s) => s.selectPart)
  const highlightedPartId = useStore((s) => s.highlightedPartId)
  const autoTranslate = useStore((s) => s.autoTranslate)
  const segRefs = useRef({})

  // 当从器物点击部件时，滚动到对应古文段落
  useEffect(() => {
    if (highlightedPartId && segRefs.current) {
      const targetSeg = artifact.textSegments.find((s) => s.partId === highlightedPartId)
      if (targetSeg && segRefs.current[targetSeg.id]) {
        segRefs.current[targetSeg.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [highlightedPartId, artifact])

  return (
    <div className="ancient-text">
      {artifact.textSegments.map((seg) => {
        const isLinked = seg.partId
        const isHi = isLinked && highlightedPartId === seg.partId
        return (
          <div
            key={seg.id}
            ref={(el) => (segRefs.current[seg.id] = el)}
            className={`text-segment ${isLinked ? 'linked' : ''} ${isHi ? 'highlighted' : ''}`}
            onMouseEnter={() => {
              if (isLinked) setHighlight(seg.partId, 'text')
              if (autoTranslate) {
                setTranslationHover({ segId: seg.id, text: seg.translation })
              }
            }}
            onMouseLeave={() => {
              if (isLinked) setHighlight(null, null)
              setTranslationHover(null)
            }}
            onClick={() => {
              if (isLinked) selectPart(seg.partId)
            }}
          >
            {seg.original}
          </div>
        )
      })}
    </div>
  )
}

function ReaderStyles() {
  return (
    <style>{`
      .reader-page {
        position: fixed; inset: 0; overflow: hidden;
        background: linear-gradient(135deg, #2A1810 0%, #3A2518 50%, #4A2E1A 100%);
        display: flex; flex-direction: column;
      }
      .reader-page::before {
        content: ''; position: absolute; inset: 0;
        background:
          radial-gradient(circle at 30% 20%, rgba(232,200,140,0.06) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(199,91,42,0.04) 0%, transparent 50%);
        pointer-events: none;
      }

      /* ===== 顶部导航 ===== */
      .reader-nav {
        position: relative; z-index: 20;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0.9rem 1.5rem;
        background: rgba(42,24,16,0.6); backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(232,200,140,0.15);
      }
      .reader-back {
        color: #E8C88C; font-size: 0.88rem; padding: 0.4rem 0.8rem;
        border-radius: 6px; transition: all 0.2s;
      }
      .reader-back:hover { background: rgba(232,200,140,0.1); }
      .reader-title { display: flex; align-items: baseline; gap: 0.5rem; }
      .reader-name {
        font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;
        color: #F4ECD8; letter-spacing: 0.1em;
      }
      .reader-chapter { font-size: 0.82rem; color: rgba(232,200,140,0.7); }
      .reader-nav-right { display: flex; align-items: center; gap: 1rem; }
      .reader-page-indicator { font-size: 0.78rem; color: rgba(232,200,140,0.5); }
      .ai-btn {
        background: var(--accent2); color: #fff; padding: 0.4rem 0.9rem;
        border-radius: 100px; font-size: 0.82rem; font-weight: 500;
        transition: all 0.2s;
      }
      .ai-btn:hover { background: #A8481F; transform: translateY(-1px); }

      /* ===== 桌面端书本舞台 ===== */
      .reader-desktop { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; }
      .book-stage {
        position: relative; display: flex;
        width: min(92vw, 1100px); height: min(78vh, 680px);
        transform: perspective(1500px) rotateX(2deg) scale(0.92);
        opacity: 0; transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .book-stage.entered { transform: perspective(1500px) rotateX(2deg) scale(1); opacity: 1; }
      .book-stage.turning { animation: bookShake 0.8s ease; }
      @keyframes bookShake {
        0%, 100% { transform: perspective(1500px) rotateX(2deg) scale(1); }
        50% { transform: perspective(1500px) rotateX(2deg) scale(0.98) translateY(4px); }
      }

      .book-shadow {
        position: absolute; bottom: -20px; left: 5%; right: 5%; height: 30px;
        background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
        filter: blur(8px); z-index: 0;
      }

      .book-page {
        flex: 1; position: relative; padding: 1.5rem 1.8rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        overflow: hidden;
      }
      .book-left {
        border-radius: 4px 0 0 4px;
        box-shadow: inset -8px 0 12px -8px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.3);
      }
      .book-right {
        border-radius: 0 4px 4px 0;
        box-shadow: inset 8px 0 12px -8px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.3);
        display: flex; flex-direction: column;
      }
      .book-spine {
        width: 16px; align-self: stretch;
        background: linear-gradient(90deg, rgba(0,0,0,0.3), rgba(58,37,24,0.6), rgba(0,0,0,0.3));
        box-shadow: 0 0 12px rgba(0,0,0,0.4);
        z-index: 2;
      }

      .page-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
      .page-chapter-mark, .page-illus-mark {
        font-family: var(--font-serif); font-size: 0.78rem; color: var(--muted);
        letter-spacing: 0.1em;
      }
      .page-footer-mark {
        position: absolute; bottom: 0.8rem; left: 1.8rem;
        font-size: 0.72rem; color: var(--muted);
      }
      .page-footer-mark.right { left: auto; right: 1.8rem; }
      .bookmark { color: var(--accent2); }

      /* 线装痕迹 */
      .binding-holes {
        position: absolute; left: 0.4rem; top: 0; bottom: 0; width: 8px;
        background:
          radial-gradient(circle at 4px 20%, rgba(58,37,24,0.4) 2px, transparent 3px),
          radial-gradient(circle at 4px 50%, rgba(58,37,24,0.4) 2px, transparent 3px),
          radial-gradient(circle at 4px 80%, rgba(58,37,24,0.4) 2px, transparent 3px);
      }

      /* ===== 古文竖排 ===== */
      .ancient-text {
        writing-mode: vertical-rl; text-orientation: upright;
        height: calc(100% - 3rem); overflow-y: auto;
        font-family: var(--font-serif); font-size: 1.15rem; line-height: 2.2;
        color: var(--ink); padding: 0.5rem 0.5rem 0.5rem 0;
        direction: rtl;
        scrollbar-width: thin;
      }
      .text-segment {
        display: inline; padding: 2px 4px; border-radius: 3px;
        transition: all 0.2s; cursor: default;
      }
      .text-segment.linked {
        cursor: pointer; border-bottom: 2px solid rgba(199,91,42,0.3);
      }
      .text-segment.linked:hover {
        background: rgba(232,200,140,0.35);
        border-bottom-color: var(--accent2);
      }
      .text-segment.highlighted {
        background: rgba(232,200,140,0.5);
        border-bottom: 2px solid var(--accent2);
        box-shadow: 0 0 0 1px rgba(199,91,42,0.3);
        animation: textGlow 0.3s ease;
      }
      @keyframes textGlow {
        from { background: rgba(232,200,140,0.8); }
        to { background: rgba(232,200,140,0.5); }
      }

      /* ===== 3D 场景容器 ===== */
      .scene-container { flex: 1; position: relative; border-radius: 4px; overflow: hidden; }
      .scene-container.mobile { height: 100%; }
      .scene-hint {
        position: absolute; bottom: 0.6rem; left: 50%; transform: translateX(-50%);
        font-size: 0.72rem; color: var(--muted);
        background: rgba(247,244,239,0.7); padding: 0.2rem 0.7rem; border-radius: 100px;
        backdrop-filter: blur(4px); pointer-events: none; white-space: nowrap;
      }

      /* ===== 翻页按钮 ===== */
      .page-nav {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 44px; height: 44px; border-radius: 50%;
        background: rgba(232,200,140,0.15); color: #E8C88C;
        font-size: 1.5rem; display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(8px); border: 1px solid rgba(232,200,140,0.2);
        transition: all 0.2s; z-index: 15;
      }
      .page-nav:hover { background: rgba(232,200,140,0.25); transform: translateY(-50%) scale(1.1); }
      .page-prev { left: 1rem; }
      .page-next { right: 1rem; }

      /* 翻页动画层 */
      .page-flip {
        position: absolute; top: 0; right: 0; width: 50%; height: 100%;
        background: linear-gradient(135deg, #F4ECD8, #E8DCC0);
        transform-origin: left center;
        animation: pageFlip 0.8s ease; z-index: 10;
        box-shadow: -8px 0 20px rgba(0,0,0,0.2);
        pointer-events: none;
      }
      @keyframes pageFlip {
        0% { transform: rotateY(0deg); opacity: 1; }
        100% { transform: rotateY(-180deg); opacity: 0; }
      }

      /* ===== 移动端 ===== */
      .reader-mobile { display: none; }
      .mobile-stage { flex: 1; padding: 0.8rem; display: flex; }
      .book-page-mobile {
        flex: 1; position: relative; padding: 1rem; border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;
        transform: scale(0.95); opacity: 0; transition: all 0.5s;
      }
      .book-page-mobile.entered { transform: scale(1); opacity: 1; }
      .mobile-illus-mark { font-family: var(--font-serif); font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; text-align: center; }
      .scene-container.mobile { height: calc(100% - 2rem); }
      .mobile-tabs {
        display: flex; background: rgba(42,24,16,0.8); backdrop-filter: blur(10px);
        padding: 0.4rem; gap: 0.3rem;
      }
      .mobile-tabs button {
        flex: 1; padding: 0.5rem; font-size: 0.82rem; color: rgba(232,200,140,0.6);
        border-radius: 6px; transition: all 0.2s;
      }
      .mobile-tabs button.active { background: var(--accent2); color: #fff; }

      @media (max-width: 768px) {
        .reader-desktop { display: none; }
        .reader-mobile { display: flex; flex-direction: column; flex: 1; }
        .reader-nav { padding: 0.7rem 1rem; }
        .reader-name { font-size: 1rem; }
        .reader-page-indicator { display: none; }
        .ancient-text { font-size: 1rem; }
      }
    `}</style>
  )
}
