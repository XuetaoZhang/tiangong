import React from 'react'
import { useStore } from '../store/useStore.js'

// 古文悬停译文浮层
export default function TranslationOverlay({ mobile }) {
  const translationHover = useStore((s) => s.translationHover)

  if (!translationHover) return null

  return (
    <div className={`translation-overlay ${mobile ? 'mobile' : ''}`}>
      <div className="translation-card">
        <div className="translation-label">白话译文</div>
        <div className="translation-text">{translationHover.text}</div>
      </div>
      <style>{`
        .translation-overlay {
          position: absolute; left: 1.5rem; bottom: 1.5rem;
          z-index: 17; max-width: 340px; width: 42%;
          animation: fadeInUp 0.25s ease; pointer-events: none;
        }
        .translation-overlay.mobile {
          position: fixed; bottom: 4rem; left: 1rem; right: 1rem; width: auto; max-width: none;
        }
        .translation-card {
          background: rgba(255,252,245,0.95); backdrop-filter: blur(12px);
          border: 1px solid rgba(139,69,19,0.25); border-radius: 12px;
          padding: 0.8rem 1.1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          border-left: 3px solid var(--accent2);
        }
        .translation-label {
          font-size: 0.68rem; color: var(--accent2); font-weight: 600;
          letter-spacing: 0.1em; margin-bottom: 0.3rem;
        }
        .translation-text {
          font-family: var(--font-serif); font-size: 0.9rem; line-height: 1.7;
          color: var(--ink);
        }
      `}</style>
    </div>
  )
}
