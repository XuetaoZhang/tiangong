import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { artifacts, upcomingArtifacts } from '../data/artifacts.js'

// 古籍目录数据：按篇章分组，仿《天工开物》原书目录样式
const tocData = [
  {
    juan: '卷之上',
    chapters: [
      {
        name: '乃粒',
        sub: '农具·水利',
        items: [
          { id: 'tongche', name: '筒车', page: '一' },
          { id: 'longgu', name: '龙骨水车', page: '三' },
          { id: 'shuidui', name: '水碓', page: '七', soon: true },
        ],
      },
      {
        name: '乃服',
        sub: '纺织·织造',
        items: [
          { id: 'fangzhi', name: '纺织机', page: '九', soon: true },
        ],
      },
    ],
  },
  {
    juan: '卷之下',
    chapters: [
      {
        name: '治铸',
        sub: '铸造·冶铁',
        items: [
          { id: 'gufeng', name: '鼓风炉', page: '十三', soon: true },
        ],
      },
      {
        name: '杀青',
        sub: '造纸·印刷',
        items: [
          { id: 'huozi', name: '活字印刷', page: '十五', soon: true },
        ],
      },
    ],
  },
]

export default function Catalog() {
  const go = useStore((s) => s.go)
  const openArtifact = useStore((s) => s.openArtifact)
  // 入场动画：从封面放大淡出衔接过来，目录书淡入+缩放显现（不跳过）
  const [entered, setEntered] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState(0) // 1=翻开进入正文, -1=返回封面
  const flipTimer = useRef(null)

  // 挂载即触发入场动画（与封面放大淡出衔接：封面书放大靠近→淡出，目录书淡入显现）
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60)
    return () => clearTimeout(t)
  }, [])

  // 点击目录条目 → 多翻几页动画 → 进入正文
  const handleSelect = (item) => {
    if (item.soon) return
    if (flipping) return
    setFlipDir(1)
    setFlipping(true)
    flipTimer.current = setTimeout(() => {
      openArtifact(item.id)
    }, 1100)
  }

  const handleBack = () => {
    if (flipping) return
    setFlipDir(-1)
    setFlipping(true)
    flipTimer.current = setTimeout(() => {
      go('cover')
    }, 900)
  }

  return (
    <div className="catalog-page">
      {/* 书本舞台 —— 与正文一致的翻开书本 */}
      <div className="catalog-desktop">
        <div className={`catalog-stage ${entered ? 'entered' : ''} ${flipping ? (flipDir > 0 ? 'flipping-fwd' : 'flipping-back') : ''}`}>
          {/* 左侧立体书脊立柱（与封面 3D 模型一致） */}
          <div className="book-spine-3d" />
          {/* 右侧书页层叠厚度（与封面 3D 模型一致） */}
          <div className="book-pages-edge">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="page-layer" style={{ right: i * 0.5 }} />
            ))}
          </div>

          <div className="book-shadow" />

          {/* 左页：书名页 / 序言 */}
          <div className="book-page book-left">
            <div className="page-texture-overlay" />
            <div className="page-edge-curl left" />
            <div className="catalog-titlepage">
              <div className="title-seal">天</div>
              <h1 className="title-main">天工開物</h1>
              <p className="title-sub">宋應星 著</p>
              <div className="title-rule" />
              <p className="title-quote">「天覆地載，物數號萬，而事亦因之。」</p>
              <p className="title-quote-en">物成於天，工存於人</p>
            </div>
            <div className="binding-holes binding-right" />
          </div>

          {/* 书脊 */}
          <div className="book-spine">
            <div className="spine-shadow-left" />
            <div className="spine-shadow-right" />
          </div>

          {/* 右页：目录正文（writing-mode 竖排，flex column 布局，可点击） */}
          <div className="book-page book-right catalog-right">
            <div className="page-texture-overlay" />
            <div className="page-edge-curl right" />
            <div className="catalog-header-mark">目　錄</div>
            <div className="catalog-vertical">
              {tocData.map((juan) => (
                <div className="toc-juan" key={juan.juan}>
                  <div className="toc-juan-title">{juan.juan}</div>
                  {juan.chapters.map((ch) => (
                    <div className="toc-chapter" key={ch.name}>
                      <div className="toc-ch-name">{ch.name}</div>
                      {ch.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`toc-item ${item.soon ? 'soon' : ''}`}
                          onClick={() => handleSelect(item)}
                          disabled={item.soon}
                        >
                          {item.name}　{item.page}
                          {item.soon && <span className="toc-soon-tag">未刊</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="page-footer-mark right">
              <span>點擊篇目 · 翻閱正文</span>
            </div>
          </div>

          {/* 翻页动画层（多翻几页） */}
          {flipping && <div className="catalog-flip-layer" />}
        </div>

        {/* 返回按钮 */}
        <button className="catalog-back-btn" onClick={handleBack} disabled={flipping}>← 返回封面</button>
      </div>

      <style>{`
        .catalog-page {
          position: fixed; inset: 0; overflow: hidden;
          background: linear-gradient(135deg, #2A1810 0%, #4A2E1A 40%, #6B3F22 100%);
          display: flex; flex-direction: column;
        }
        .catalog-page::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 30% 20%, rgba(232,200,140,0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(199,91,42,0.06) 0%, transparent 40%);
        }
        .catalog-nav { background: rgba(42,24,16,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(232,200,140,0.15); position: relative; z-index: 50; }
        .catalog-nav .logo-text { color: #E8C88C; }
        .catalog-nav .nav-links button { color: rgba(232,200,140,0.7); }
        .catalog-nav .nav-links button:hover { color: #E8C88C; background: rgba(232,200,140,0.1); }

        /* ===== 书本舞台（与正文一致） ===== */
        .catalog-desktop {
          flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
          height: 100%; padding: 0 1rem;
          perspective: 900px; perspective-origin: 50% 30%;
        }
        .catalog-stage {
          position: relative; display: flex;
          width: min(92vw, 1080px); height: min(78vh, 660px);
          transform: rotateX(12deg) rotateY(-6deg) scale(0.9);
          transform-style: preserve-3d;
          opacity: 0; transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .catalog-stage.entered { transform: rotateX(12deg) rotateY(-6deg) scale(1); opacity: 1; }
        .catalog-stage.flipping-fwd { animation: catalogFlipFwd 1.1s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
        .catalog-stage.flipping-back { animation: catalogFlipBack 0.9s cubic-bezier(0.5, 0, 0.5, 1) forwards; }

        @keyframes catalogFlipFwd {
          0% { transform: rotateX(12deg) rotateY(-6deg) scale(1); }
          30% { transform: rotateX(6deg) rotateY(-3deg) scale(0.96); }
          100% { transform: rotateX(12deg) rotateY(-6deg) scale(0.9); opacity: 0; }
        }
        @keyframes catalogFlipBack {
          0% { transform: rotateX(12deg) rotateY(-6deg) scale(1); }
          100% { transform: rotateX(12deg) rotateY(-6deg) scale(0.85); opacity: 0; }
        }

        /* 左侧立体书脊立柱（与封面 3D 模型一致：深色木布质感 + 厚度） */
        .book-spine-3d {
          position: absolute; left: -14px; top: 0; bottom: 0; width: 14px;
          background: linear-gradient(90deg, #3A2518 0%, #5C3A1E 40%, #2A1810 100%);
          border-radius: 2px 0 0 2px;
          box-shadow: -3px 0 12px rgba(0,0,0,0.5);
          transform: translateZ(-0.5px);
          z-index: 1;
        }
        /* 右侧书页层叠厚度（与封面 3D 模型一致：宣纸切口纹理） */
        .book-pages-edge {
          position: absolute; right: -8px; top: 4px; bottom: 4px; width: 8px;
          background: linear-gradient(90deg, #EDE3CC, #D8CBA8, #EDE3CC);
          border-radius: 0 2px 2px 0;
          box-shadow: 2px 0 6px rgba(0,0,0,0.2);
          overflow: hidden; z-index: 1;
        }
        .page-layer {
          position: absolute; top: 0; bottom: 0; width: 1px;
          background: rgba(74,63,54,0.18);
        }

        .book-shadow {
          position: absolute; bottom: -28px; left: 4%; right: 4%; height: 40px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%);
          filter: blur(12px); z-index: 0;
        }

        .book-page {
          flex: 1; position: relative; padding: 2rem 2.2rem; overflow: hidden;
          background: linear-gradient(135deg, #F4ECD8 0%, #EDE3CC 50%, #E8DCC0 100%);
          box-shadow: 0 12px 48px rgba(0,0,0,0.4);
        }
        .catalog-stage .book-left {
          border-radius: 6px 0 0 6px;
          box-shadow: inset -10px 0 18px -10px rgba(58,37,24,0.45), inset 0 0 60px rgba(139,69,19,0.06), 0 12px 48px rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
        }
        .catalog-stage .book-right {
          border-radius: 0 6px 6px 0;
          box-shadow: inset 10px 0 18px -10px rgba(58,37,24,0.45), inset 0 0 60px rgba(139,69,19,0.06), 0 12px 48px rgba(0,0,0,0.4);
        }
        .page-texture-overlay {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image:
            radial-gradient(circle at 15% 25%, rgba(139,69,19,0.05) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(139,69,19,0.04) 0%, transparent 45%),
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,69,19,0.015) 3px, rgba(139,69,19,0.015) 4px);
          mix-blend-mode: multiply;
        }
        .page-edge-curl { position: absolute; pointer-events: none; z-index: 2; width: 24px; height: 100%; top: 0; }
        .page-edge-curl.left { left: 0; background: linear-gradient(90deg, rgba(58,37,24,0.18) 0%, transparent 100%); }
        .page-edge-curl.right { right: 0; background: linear-gradient(270deg, rgba(58,37,24,0.18) 0%, transparent 100%); }
        .book-spine {
          width: 5px; align-self: stretch; position: relative; z-index: 3;
          background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(58,37,24,0.35) 30%, rgba(42,24,16,0.55) 50%, rgba(58,37,24,0.35) 70%, rgba(0,0,0,0.05) 100%);
        }
        .spine-shadow-left { position: absolute; left: -8px; top: 0; bottom: 0; width: 12px; background: linear-gradient(270deg, rgba(0,0,0,0.25), transparent); }
        .spine-shadow-right { position: absolute; right: -8px; top: 0; bottom: 0; width: 12px; background: linear-gradient(90deg, rgba(0,0,0,0.25), transparent); }
        .binding-holes {
          position: absolute; right: 0.5rem; top: 0; bottom: 0; width: 8px; z-index: 4;
          /* 4个线装孔（与封面一致：均匀分布） */
          background:
            radial-gradient(circle at 4px 12%, rgba(42,24,16,0.5) 2px, transparent 3px),
            radial-gradient(circle at 4px 37%, rgba(42,24,16,0.5) 2px, transparent 3px),
            radial-gradient(circle at 4px 63%, rgba(42,24,16,0.5) 2px, transparent 3px),
            radial-gradient(circle at 4px 88%, rgba(42,24,16,0.5) 2px, transparent 3px);
        }

        /* ===== 左页：书名页 ===== */
        .catalog-titlepage { text-align: center; position: relative; z-index: 5; }
        .title-seal {
          width: 56px; height: 56px; margin: 0 auto 1.2rem;
          background: var(--accent2); color: #fff;
          font-family: var(--font-serif); font-size: 2rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; box-shadow: 0 4px 12px rgba(199,91,42,0.4);
        }
        .title-main {
          font-family: var(--font-serif); font-size: 3rem; font-weight: 700;
          color: var(--ink); letter-spacing: 0.3em; margin-bottom: 0.6rem;
          writing-mode: vertical-rl; margin: 0 auto 1rem; line-height: 1.4;
        }
        .title-sub { font-family: var(--font-serif); font-size: 0.95rem; color: var(--muted); letter-spacing: 0.2em; margin-bottom: 1.5rem; }
        .title-rule { width: 60px; height: 1px; background: var(--accent2); margin: 0 auto 1.5rem; opacity: 0.6; }
        .title-quote { font-family: var(--font-serif); font-size: 0.92rem; color: var(--muted); line-height: 1.9; margin-bottom: 0.4rem; }
        .title-quote-en { font-family: var(--font-serif); font-size: 0.82rem; color: rgba(139,69,19,0.5); letter-spacing: 0.15em; }

        /* ===== 右页：目录正文（writing-mode 竖排 + flex column，可点击） ===== */
        .catalog-right { display: flex; flex-direction: column; }
        .catalog-header-mark {
          font-family: var(--font-serif); font-size: 1rem; color: var(--accent2);
          letter-spacing: 0.4em; text-align: center; padding-bottom: 0.8rem;
          border-bottom: 1px solid rgba(139,69,19,0.2); margin-bottom: 1rem;
          position: relative; z-index: 5;
        }
        /* 容器：writing-mode 竖排 + flex column 布局 */
        .catalog-vertical {
          flex: 1; position: relative; z-index: 6;
          writing-mode: vertical-rl;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding: 0.5rem;
          overflow: auto;
          font-family: var(--font-serif);
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        .toc-juan { display: block; }
        .toc-juan-title {
          display: block; font-size: 1.1rem; font-weight: 700; color: var(--accent2);
          letter-spacing: 0.3em; margin-bottom: 0.8rem; padding: 0.2rem 0;
          border-bottom: 2px solid rgba(199,91,42,0.3);
        }
        .toc-chapter { display: block; margin-bottom: 0.5rem; }
        .toc-ch-name {
          display: block; font-size: 1rem; font-weight: 600; color: var(--ink);
          letter-spacing: 0.2em; margin-bottom: 0.5rem;
        }
        /* 条目：block 级别，保证可点击 */
        .toc-item {
          display: block;
          padding: 0.4rem 0.6rem; margin: 0 0 0.4rem 0;
          cursor: pointer; border-radius: 4px; transition: background 0.2s;
          font-family: var(--font-serif); font-size: 0.95rem;
          background: transparent; border: none; color: var(--ink);
          -webkit-appearance: none; appearance: none;
          text-align: start;
        }
        .toc-item:hover { background: rgba(232,200,140,0.5); }
        .toc-item:disabled, .toc-item.soon { cursor: not-allowed; opacity: 0.5; }
        .toc-soon-tag {
          font-size: 0.62rem; color: #E65100; background: #FFF3E0;
          padding: 0.1rem 0.4rem; border-radius: 3px; margin-left: 0.4rem;
        }

        .page-footer-mark { position: absolute; bottom: 0.8rem; font-size: 0.72rem; color: var(--muted); z-index: 5; }
        .page-footer-mark.right { left: auto; right: 2.2rem; }

        /* ===== 翻页动画层（多翻几页效果） ===== */
        .catalog-flip-layer {
          position: absolute; top: 0; right: 0; width: 50%; height: 100%;
          background: linear-gradient(135deg, #F4ECD8, #E8DCC0);
          transform-origin: left center; z-index: 30; pointer-events: none;
          box-shadow: -8px 0 24px rgba(0,0,0,0.25);
          animation: catalogMultiFlip 1.1s cubic-bezier(0.4, 0, 0.3, 1);
        }
        @keyframes catalogMultiFlip {
          0% { transform: rotateY(0deg); opacity: 1; }
          25% { transform: rotateY(-90deg); opacity: 0.9; }
          26% { transform: rotateY(-180deg); opacity: 0.7; }
          50% { transform: rotateY(-270deg); opacity: 0.9; }
          51% { transform: rotateY(-360deg); opacity: 1; }
          75% { transform: rotateY(-450deg); opacity: 0.85; }
          100% { transform: rotateY(-540deg); opacity: 0; }
        }

        .catalog-back-btn {
          position: absolute; top: 1rem; left: 1.5rem; z-index: 60;
          color: #E8C88C; font-size: 0.9rem; padding: 0.5rem 1rem;
          border-radius: 6px; background: rgba(42,24,16,0.6); backdrop-filter: blur(8px);
          border: 1px solid rgba(232,200,140,0.2); transition: all 0.2s;
        }
        .catalog-back-btn:hover { background: rgba(199,91,42,0.3); }
        .catalog-back-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 768px) {
          .catalog-stage { width: 96vw; height: 70vh; }
          .book-page { padding: 1.2rem; }
          .title-main { font-size: 2rem; }
          .catalog-vertical { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  )
}
