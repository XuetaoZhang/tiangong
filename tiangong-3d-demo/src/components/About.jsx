import React from 'react'
import { useStore } from '../store/useStore.js'

export default function About() {
  const go = useStore((s) => s.go)
  return (
    <div className="about-page">
      <nav className="top-nav about-nav">
        <div className="logo" onClick={() => go('cover')}>
          <span className="logo-seal">天</span>
          <span className="logo-text">天工开物·3D 书</span>
        </div>
        <div className="nav-links">
          <button onClick={() => go('cover')}>首页</button>
          <button onClick={() => go('catalog')}>目录</button>
          <button onClick={() => go('settings')}>设置</button>
        </div>
      </nav>

      <div className="about-body">
        <button className="back-btn" onClick={() => go('cover')}>← 返回</button>
        <h1 className="page-title">关 于</h1>

        <div className="about-card">
          <p className="about-lead">
            <strong>天工开物·3D 书</strong>是一款 Web 端 3D 交互古籍，让《天工开物》中 130 余项古代工艺在浏览器里"活"起来——可翻、可转、可拆、可问、可玩。
          </p>

          <h3>核心理念：书中有物，物在书上</h3>
          <p>3D 器物不是独立窗口，而是从书页中"浮现"，与古文深度关联。悬停古文，器物部件同步高亮；点击器物，古文滚动定位，形成闭环。</p>

          <h3>技术栈</h3>
          <ul>
            <li>React + Vite 前端框架</li>
            <li>React Three Fiber + Three.js 3D 渲染</li>
            <li>AI 大模型（古文翻译 / 部件释义 / 智能问答）</li>
            <li>Zustand 状态管理</li>
          </ul>

          <h3>内容来源</h3>
          <p>《天工开物》（明·宋应星）公有领域版本。3D 模型基于程序化几何构建，AI 讲解内容基于古籍原文整理。</p>

          <h3>赛事</h3>
          <p>TRAE AI 创造力大赛参赛作品。</p>

          <div className="about-quote">
            "天工开物，盖言人巧乃天之工所开也。"
          </div>
        </div>
      </div>

      <style>{`
        .about-page { position: fixed; inset: 0; overflow-y: auto; background: var(--bg); }
        .about-nav { background: var(--bg2); border-bottom: 1px solid var(--rule); }
        .about-nav .logo-text { color: var(--ink); }
        .about-nav .nav-links button { color: var(--muted); }
        .about-nav .nav-links button:hover { color: var(--accent); background: var(--accent-light); }
        .about-body { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .back-btn { color: var(--accent); font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 6px; }
        .back-btn:hover { background: var(--accent-light); }
        .page-title { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--ink); letter-spacing: 0.3em; margin: 1rem 0 2rem; }
        .about-card { background: var(--bg2); border: 1px solid var(--rule); border-radius: 14px; padding: 2rem; }
        .about-lead { font-size: 1rem; color: var(--ink); line-height: 1.9; margin-bottom: 1.5rem; }
        .about-card h3 { font-family: var(--font-serif); font-size: 1.05rem; color: var(--accent); margin: 1.5rem 0 0.6rem; }
        .about-card p { font-size: 0.9rem; color: var(--ink-light); line-height: 1.8; margin-bottom: 0.8rem; }
        .about-card ul { padding-left: 1.2rem; margin-bottom: 0.8rem; }
        .about-card li { font-size: 0.88rem; color: var(--ink-light); line-height: 1.9; }
        .about-quote { margin-top: 2rem; padding: 1.2rem; background: var(--accent-light); border-left: 3px solid var(--accent2); border-radius: 0 8px 8px 0; font-family: var(--font-serif); font-size: 1rem; color: var(--accent); text-align: center; }
      `}</style>
    </div>
  )
}
