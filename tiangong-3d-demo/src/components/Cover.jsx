import React from 'react'
import { useStore } from '../store/useStore.js'

export default function Cover() {
  const go = useStore((s) => s.go)

  return (
    <div className="cover">
      {/* 顶部导航 */}
      <nav className="top-nav">
        <div className="logo" onClick={() => go('cover')}>
          <span className="logo-seal">天</span>
          <span className="logo-text">天工开物·3D 书</span>
        </div>
        <div className="nav-links">
          <button onClick={() => go('catalog')}>目录</button>
          <button onClick={() => go('about')}>关于</button>
          <button onClick={() => go('settings')}>设置</button>
        </div>
      </nav>

      {/* 主视觉 */}
      <div className="cover-hero">
        <div className="cover-bg-decoration" />
        <div className="cover-content fade-in-up">
          <h1 className="cover-title">
            天工开物
            <span className="cover-title-sub">· 3D 书 ·</span>
          </h1>
          <p className="cover-subtitle">让古代工程智慧在指尖"活"起来</p>
          <p className="cover-desc">
            让《天工开物》中的传统工艺真正可触、可玩、可理解。
          </p>

          <div className="cover-cta">
            <button className="btn btn-primary cover-cta-main" onClick={() => go('catalog')}>
              开启阅读 →
            </button>
            <button className="btn btn-ghost" onClick={() => go('catalog')}>
              观看演示 ▶
            </button>
          </div>

          <div className="cover-tags">
            <span>Web 3D 交互</span>
            <span>古籍活化</span>
            <span>AI 智能讲解</span>
            <span>教育科技</span>
          </div>
        </div>

        {/* 装饰：3D 书本预览 */}
        <div className="cover-book-preview">
          <div className="floating-book">
            <div className="book-spine" />
            <div className="book-page book-page-left">
              <div className="book-line" />
              <div className="book-line" />
              <div className="book-line short" />
              <div className="book-line" />
              <div className="book-line short" />
              <div className="book-seal" />
            </div>
            <div className="book-page book-page-right">
              <div className="book-illustration" />
            </div>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <footer className="cover-footer">
        <span>让 130 余项古代工艺在浏览器里"活"起来</span>
      </footer>

      <style>{`
        .cover {
          position: fixed; inset: 0; overflow: hidden;
          background: linear-gradient(135deg, #2A1810 0%, #4A2E1A 40%, #6B3F22 100%);
          display: flex; flex-direction: column;
        }
        .cover::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 30% 20%, rgba(232,200,140,0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(199,91,42,0.06) 0%, transparent 40%);
          pointer-events: none;
        }

        .top-nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2rem;
        }
        .logo { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
        .logo-seal {
          width: 36px; height: 36px;
          background: #C75B2A; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-serif); font-weight: 700; font-size: 1.2rem;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(199,91,42,0.4);
        }
        .logo-text { color: #F0E6D8; font-family: var(--font-serif); font-weight: 600; font-size: 1.05rem; }
        .nav-links { display: flex; gap: 0.5rem; }
        .nav-links button {
          color: rgba(240,230,216,0.8); padding: 0.4rem 0.9rem;
          font-size: 0.88rem; border-radius: 6px; transition: all 0.2s;
        }
        .nav-links button:hover { color: #fff; background: rgba(255,255,255,0.1); }

        .cover-hero {
          flex: 1; position: relative; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          padding: 0 2rem;
        }
        .cover-content { max-width: 560px; text-align: center; z-index: 2; }
        .cover-badge {
          display: inline-block; font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.15em; color: rgba(232,200,140,0.8);
          border: 1px solid rgba(232,200,140,0.3);
          padding: 0.3rem 0.9rem; border-radius: 100px; margin-bottom: 1.5rem;
        }
        .cover-title {
          font-family: var(--font-serif); font-weight: 900;
          font-size: 4.2rem; color: #F4ECD8; line-height: 1.1;
          letter-spacing: 0.05em; margin-bottom: 0.5rem;
          text-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        .cover-title-sub {
          display: block; font-size: 1.4rem; font-weight: 400;
          color: #E8C88C; margin-top: 0.3rem; letter-spacing: 0.15em;
        }
        .cover-subtitle {
          font-family: var(--font-serif); font-size: 1.15rem;
          color: rgba(244,236,216,0.85); margin: 1rem 0 1.5rem;
          letter-spacing: 0.08em;
        }
        .cover-desc {
          font-size: 0.92rem; color: rgba(244,236,216,0.6);
          line-height: 1.9; margin-bottom: 2rem;
        }
        .cover-cta { display: flex; gap: 0.8rem; justify-content: center; margin-bottom: 2rem; }
        .cover-cta-main { padding: 0.75rem 1.8rem; font-size: 0.95rem; }
        .cover-tags { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
        .cover-tags span {
          font-size: 0.75rem; color: rgba(244,236,216,0.7);
          background: rgba(255,255,255,0.08); padding: 0.3rem 0.8rem;
          border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
        }

        /* 3D 书本预览装饰 */
        .cover-book-preview {
          position: absolute; right: 8%; top: 50%; transform: translateY(-50%);
          z-index: 1; pointer-events: none;
        }
        .floating-book {
          display: flex; perspective: 1200px;
          animation: floatBook 6s ease-in-out infinite;
        }
        @keyframes floatBook {
          0%, 100% { transform: translateY(0) rotateY(-8deg); }
          50% { transform: translateY(-15px) rotateY(-4deg); }
        }
        .book-spine {
          width: 14px; align-self: stretch;
          background: linear-gradient(90deg, #5C3A1E, #3A2518, #5C3A1E);
          border-radius: 2px 0 0 2px;
          box-shadow: 2px 0 8px rgba(0,0,0,0.3);
        }
        .book-page {
          width: 180px; height: 240px;
          background: linear-gradient(135deg, #F4ECD8, #E8DCC0);
          padding: 1.5rem 1.2rem; position: relative;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        .book-page-left { border-radius: 0 2px 2px 0; }
        .book-page-right { border-radius: 2px 4px 4px 2px; }
        .book-line {
          height: 2px; background: rgba(74,63,54,0.25); margin-bottom: 0.7rem;
          border-radius: 1px;
        }
        .book-line.short { width: 60%; }
        .book-seal {
          position: absolute; bottom: 1.2rem; right: 1.2rem;
          width: 28px; height: 28px; background: #C75B2A; border-radius: 4px;
          opacity: 0.7;
        }
        .book-illustration {
          position: absolute; inset: 1.5rem;
          border: 1px solid rgba(139,69,19,0.2); border-radius: 4px;
          background:
            radial-gradient(circle at 50% 50%, rgba(139,69,19,0.12) 0%, transparent 60%),
            repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 8px, rgba(139,69,19,0.06) 8px, rgba(139,69,19,0.06) 9px);
        }

        .cover-footer {
          position: relative; z-index: 5;
          text-align: center; padding: 1.5rem;
          color: rgba(244,236,216,0.4); font-size: 0.8rem;
        }
        .cover-footer .dot { margin: 0 0.6rem; }

        @media (max-width: 768px) {
          .cover-book-preview { display: none; }
          .cover-title { font-size: 2.8rem; }
          .cover-title-sub { font-size: 1.1rem; }
          .cover-desc { font-size: 0.85rem; }
          .nav-links button { padding: 0.4rem 0.6rem; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  )
}
