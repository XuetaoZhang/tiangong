import React, { useState, useRef } from 'react'
import { useStore } from '../store/useStore.js'

// 与目录页一致的目录数据（卷之上/卷之下 + 篇章 + 篇目页码）
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
          { id: 'shuidui', name: '水碓', page: '七' },
        ],
      },
      {
        name: '乃服',
        sub: '纺织·织造',
        items: [
          { id: 'fangzhi', name: '纺织机', page: '九' },
        ],
      },
    ],
  },
  {
    juan: '卷之下',
    chapters: [
      {
        name: '冶铸',
        sub: '铸造·冶铁',
        items: [
          { id: 'gufeng', name: '鼓风炉', page: '十三' },
        ],
      },
      // {
      //   name: '丹青',
      //   sub: '制墨·松烟',
      //   items: [
      //     { id: 'mo', name: '墨', page: '十五' },
      //   ],
      // },
    ],
  },
]

export default function Cover() {
  const go = useStore((s) => s.go)
  // 阶段：idle=合上 | opening=封面翻开 | expanding=放大到大书形态 | done
  const [phase, setPhase] = useState('idle')
  const timer = useRef(null)

  // 点击"开始阅读"：封面翻开 → 放大到目录页大书形态 → 无黑屏切入 catalog
  const handleStart = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    // 1) 封面翻开（1.5s）
    timer.current = setTimeout(() => {
      setPhase('expanding')
      // 2) 放大+位移+旋转到目录页大书形态（1.2s）
      timer.current = setTimeout(() => {
        setPhase('done')
        // 3) done 阶段：书保持打开放大状态，淡出封面书（不关上书）
        //    淡出过程中切到目录页，目录此时开始入场动画（淡入+缩放），无缝衔接
        timer.current = setTimeout(() => {
          go('catalog')
        }, 500)
      }, 1200)
    }, 1500)
  }

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

      {/* 主视觉：左文案 + 右合上的线装本 */}
      <div className="cover-hero">
        <div className="cover-bg-decoration" />
        <div className={`cover-content fade-in-up ${phase !== 'idle' ? 'fading' : ''}`}>
          <h1 className="cover-title">
            天工开物
            <span className="cover-title-sub">· 3D 书 ·</span>
          </h1>
          <p className="cover-subtitle">让古代工程智慧在指尖"活"起来</p>
          <p className="cover-desc">
            让《天工开物》中的传统工艺真正可触、可玩、可理解。
          </p>

          <div className="cover-cta">
            <button
              className="btn btn-primary cover-cta-main"
              onClick={handleStart}
              disabled={phase !== 'idle'}
            >
              {phase !== 'idle' ? '正在翻开…' : '开启阅读 →'}
            </button>
          </div>

          <div className="cover-tags">
            <span>Web 3D 交互</span>
            <span>古籍活化</span>
            <span>AI 智能讲解</span>
            <span>教育科技</span>
          </div>
        </div>

        {/* ===== 3D 线装本（合上状态，点击翻页打开 → 放大到目录页大书形态） ===== */}
        <div
          className={`cover-book-stage phase-${phase}`}
          onClick={handleStart}
        >
          <div className="book-3d">
            {/* 书脊（左侧立柱，深色木布质感） */}
            <div className="book-spine-3d" />

            {/* 书页厚度（右侧切口，宣纸层叠纹理） */}
            <div className="book-pages-edge">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="page-layer" style={{ right: i * 0.5 }} />
              ))}
            </div>

            {/* 内页（翻开封面后露出，书脊右侧）= 目录页 book-right 目录正文，整页都是目录正文 */}
            <div className="book-inside">
              <div className="catalog-header-mark">目　錄</div>
              <div className="catalog-vertical">
                {tocData.map((juan) => (
                  <div className="toc-juan" key={juan.juan}>
                    <div className="toc-juan-title">{juan.juan}</div>
                    {juan.chapters.map((ch) => (
                      <div className="toc-chapter" key={ch.name}>
                        <div className="toc-ch-name">{ch.name}</div>
                        {ch.items.map((item) => (
                          <div
                            key={item.id}
                            className={`toc-item ${item.soon ? 'soon' : ''}`}
                          >
                            {item.name}　{item.page}
                            {item.soon && <span className="toc-soon-tag">未刊</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 封面（最外层，可翻动；正面=书名页，背面=扉页） */}
            <div className="book-cover">
              {/* 封面正面 */}
              <div className="cover-face cover-front">
                <div className="cover-border-frame">
                  <div className="cover-tie-label">
                    <span className="tie-line">天</span>
                    <span className="tie-line">工</span>
                    <span className="tie-line">開</span>
                    <span className="tie-line">物</span>
                  </div>
                  <div className="cover-author">明 · 宋應星 著</div>
                  {/* <div className="cover-seal">天</div> */}
                </div>
                <div className="binding-holes-cover">
                  <span /><span /><span /><span />
                </div>
              </div>
              {/* 封面背面（翻开后面向读者，书脊左侧）= 目录页 book-left 书名页 */}
              <div className="cover-face cover-back">
                <div className="catalog-titlepage">
                  {/* <div className="title-seal">天</div> */}
                  <h1 className="title-main">天工開物</h1>
                  <p className="title-sub">宋應星 著</p>
                  <div className="title-rule" />
                  <p className="title-quote">「天覆地載，物數號萬，而事亦因之。」</p>
                  <p className="title-quote-en">物成於天，工存於人</p>
                </div>
              </div>
            </div>

            {/* 书底投影 */}
            <div className="book-shadow-3d" />
          </div>
        </div>
      </div>

      {/* 底部 */}
      <footer className="cover-footer">
        <span>点击「开启阅读」翻开这本线装古籍 →</span>
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
          padding: 0 2rem; gap: 3rem;
        }
        .cover-content {
          max-width: 480px; text-align: left; z-index: 2;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .cover-content.fading { opacity: 0; transform: translateX(-30px); }
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
        .cover-cta { display: flex; gap: 0.8rem; margin-bottom: 2rem; }
        .cover-cta-main { padding: 0.75rem 1.8rem; font-size: 0.95rem; }
        .cover-cta-main:disabled { opacity: 0.6; cursor: not-allowed; }
        .cover-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .cover-tags span {
          font-size: 0.75rem; color: rgba(244,236,216,0.7);
          background: rgba(255,255,255,0.08); padding: 0.3rem 0.8rem;
          border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
        }

        /* ===== 3D 线装本舞台 ===== */
        .cover-book-stage {
          position: relative; z-index: 3;
          perspective: 1600px; perspective-origin: 50% 40%;
          cursor: pointer;
          /* 拉近透视：放大阶段 perspective 从 1600 → 900，营造靠近阅读的纵深感 */
          transition: perspective 1.2s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s linear 1.2s;
        }
        .book-3d {
          position: relative; width: 220px; height: 300px;
          transform-style: preserve-3d;
          transform: rotateY(-12deg) rotateX(4deg);
          /* 整体放大用 scale，不改变书本身的 width/height，避免变形 */
          transition: transform 0.8s ease;
          animation: bookFloat 6s ease-in-out infinite;
        }
        @keyframes bookFloat {
          0%, 100% { transform: rotateY(-12deg) rotateX(4deg) translateY(0); }
          50% { transform: rotateY(-8deg) rotateX(2deg) translateY(-12px); }
        }
        /* 阶段1：封面翻开（小书尺寸不变，封面 rotateY 翻开） */
        .phase-opening .book-3d {
          animation: none;
          transform: rotateY(-6deg) rotateX(2deg) translateY(-6px);
        }
        /* 阶段2：翻开后靠近+放大到目录页大书尺寸（不变形、不超限），并居中对齐目录页大书位置
           目录页大书显示尺寸 ≈ min(92vw,1080px)×min(78vh,660px)，比例约1.64:1
           封面小书 220×300，scale(2.2)后 484×660（短边=目录页高度上限，长边<宽度上限）
           perspective 拉近 + 旋转到目录页大书视角，营造翻开靠近阅读的纵深感
           书舞台绝对定位+居中，让放大后的书正对页面中央（与目录页大书位置一致） */
        .phase-expanding .book-3d,
        .phase-done .book-3d {
          animation: none;
          transform: scale(2.2) rotateX(12deg) rotateY(-6deg);
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
        }
        /* done 阶段：书保持打开+放大状态，只淡出不关上（与目录入场淡入衔接） */
        .phase-done .book-3d { opacity: 0; }
        .phase-expanding.cover-book-stage,
        .phase-done.cover-book-stage {
          perspective: 900px;  /* 拉近透视，强化"靠近"感 */
          z-index: 50;         /* 放大时盖在文案上方 */
          /* 舞台绝对定位居中，脱离 flex 流，让书正对页面中央 */
          position: absolute;
          left: 65%; top: 50%;
          transform: translate(-50%, -50%);
          /* 舞台本身尺寸缩小到书原始大小，让书 scale 后基于舞台中心放大居中 */
          width: 220px; height: 300px;
        }

        /* 书脊（左侧立柱） */
        .book-spine-3d {
          position: absolute; left: -14px; top: 0; bottom: 0; width: 14px;
          background: linear-gradient(90deg, #3A2518 0%, #5C3A1E 40%, #2A1810 100%);
          border-radius: 2px 0 0 2px;
          box-shadow: -3px 0 12px rgba(0,0,0,0.5);
          transform: translateZ(-0.5px);
        }

        /* 书页厚度（右侧切口） */
        .book-pages-edge {
          position: absolute; right: -8px; top: 4px; bottom: 4px; width: 8px;
          background: linear-gradient(90deg, #EDE3CC, #D8CBA8, #EDE3CC);
          border-radius: 0 2px 2px 0;
          box-shadow: 2px 0 6px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .page-layer {
          position: absolute; top: 0; bottom: 0; width: 1px;
          background: rgba(74,63,54,0.18);
        }

        /* 内页（翻开封面后露出，书脊右侧）= 目录页 book-right 目录正文，整页目录正文不分栏 */
        .book-inside {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          background: linear-gradient(135deg, #F4ECD8 0%, #EDE3CC 50%, #E8DCC0 100%);
          border-radius: 2px;
          box-shadow: inset 0 0 20px rgba(139,69,19,0.08);
          transform: translateZ(-1px);
          padding: 0.6rem 0.5rem;
          overflow: hidden;
        }
        /* 目录正文样式（复刻目录页 catalog-right） */
        .book-inside .catalog-header-mark {
          font-family: var(--font-serif); font-size: 0.55rem; color: #C75B2A;
          letter-spacing: 0.3em; text-align: center; padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(139,69,19,0.2); margin-bottom: 0.4rem;
          position: relative; z-index: 5;
        }
        .book-inside .catalog-vertical {
          flex: 1; position: relative; z-index: 6;
          writing-mode: vertical-rl;
          display: flex; flex-direction: column; gap: 0.3rem;
          padding: 0.2rem; overflow: hidden;
          font-family: var(--font-serif);
        }
        .book-inside .toc-juan { display: block; }
        .book-inside .toc-juan-title {
          display: block; font-size: 0.6rem; font-weight: 700; color: #C75B2A;
          letter-spacing: 0.2em; margin-bottom: 0.3rem; padding: 0.1rem 0;
          border-bottom: 1px solid rgba(199,91,42,0.3);
        }
        .book-inside .toc-chapter { display: block; margin-bottom: 0.2rem; }
        .book-inside .toc-ch-name {
          display: block; font-size: 0.55rem; font-weight: 600; color: #2A231E;
          letter-spacing: 0.15em; margin-bottom: 0.2rem;
        }
        .book-inside .toc-item {
          display: block; padding: 0.1rem 0.2rem; margin: 0 0 0.15rem 0;
          font-family: var(--font-serif); font-size: 0.5rem;
          color: #2A231E; opacity: 0.85;
        }
        .book-inside .toc-item.soon { opacity: 0.45; }
        .book-inside .toc-soon-tag {
          font-size: 0.36rem; color: #E65100; background: #FFF3E0;
          padding: 0.05rem 0.2rem; border-radius: 2px; margin-left: 0.2rem;
        }

        /* 封面（可翻动的最外层） */
        .book-cover {
          position: absolute; inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 1.6s cubic-bezier(0.45, 0.05, 0.3, 1);
          transform: translateZ(2px);
          z-index: 5;
        }
        .cover-book-stage.phase-opening .book-cover,
        .cover-book-stage.phase-expanding .book-cover,
        .cover-book-stage.phase-done .book-cover {
          transform: translateZ(2px) rotateY(-168deg);
        }
        .cover-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          border-radius: 2px 4px 4px 2px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
        }
        /* 封面正面：深蓝布面线装本 */
        .cover-front {
          background:
            linear-gradient(135deg, #3A4A5C 0%, #2C3A48 50%, #1E2832 100%);
          display: flex; align-items: center; justify-content: center;
        }
        /* 封面题签框 */
        .cover-border-frame {
          position: relative; width: 70%; height: 78%;
          border: 1.5px solid rgba(232,200,140,0.4);
          border-radius: 2px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background:
            radial-gradient(circle at 50% 30%, rgba(232,200,140,0.06) 0%, transparent 60%);
        }
        .cover-border-frame::before {
          content: ''; position: absolute; inset: 4px;
          border: 0.5px solid rgba(232,200,140,0.2);
          border-radius: 1px; pointer-events: none;
        }
        .cover-tie-label {
          display: flex; flex-direction: column; gap: 0.3rem;
          margin-bottom: 1rem;
        }
        .tie-line {
          font-family: var(--font-serif); font-weight: 700;
          font-size: 1.6rem; color: #E8C88C;
          letter-spacing: 0; text-align: center;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }
        .cover-author {
          font-family: var(--font-serif); font-size: 0.6rem;
          color: rgba(232,200,140,0.6); letter-spacing: 0.15em;
        }
        .cover-seal {
          position: absolute; bottom: 0.4rem; right: 0.4rem;
          width: 26px; height: 26px; background: #C75B2A;
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-family: var(--font-serif); font-weight: 700; font-size: 0.85rem;
          border-radius: 2px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        /* 线装洞（封面左侧装订线） */
        .binding-holes-cover {
          position: absolute; left: 8px; top: 0; bottom: 0;
          display: flex; flex-direction: column; justify-content: space-around;
          padding: 1.5rem 0;
        }
        .binding-holes-cover span {
          width: 5px; height: 5px; border-radius: 50%;
          background: radial-gradient(circle, #1A1208 30%, #3A2518 100%);
          box-shadow: 0 0 2px rgba(0,0,0,0.6);
        }
        /* 封面背面（翻开时看到的内侧扉页） */
        /* 封面背面 = 目录页 book-left 书名页（翻开后面向读者，书脊左侧） */
        .cover-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #F4ECD8, #E8DCC0);
          display: flex; flex-direction: column; align-items: center; justify-content: space-around;
          padding: 0.6rem 0.5rem;
          overflow: hidden;
        }
        .cover-back .catalog-titlepage { text-align: center; position: relative; z-index: 5; margin-top: 0.3rem; }
        .cover-back .title-seal {
          width: 24px; height: 24px; margin: 0 auto 0.5rem;
          background: #C75B2A; color: #fff;
          font-family: var(--font-serif); font-size: 0.85rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border-radius: 4px; box-shadow: 0 2px 6px rgba(199,91,42,0.4);
        }
        .cover-back .title-main {
          font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700;
          color: #2A231E; letter-spacing: 0.2em; margin: 0 auto 0.4rem;
          writing-mode: vertical-rl; line-height: 1.4;
        }
        .cover-back .title-sub {
          font-family: var(--font-serif); font-size: 0.55rem;
          color: #5C3A1E; letter-spacing: 0.15em; margin-bottom: 0.6rem;
        }
        .cover-back .title-rule {
          width: 28px; height: 1px; background: #C75B2A; margin: 0 auto 0.5rem; opacity: 0.6;
        }
        .cover-back .title-quote {
          font-family: var(--font-serif); font-size: 0.5rem;
          color: #5C3A1E; line-height: 1.7; margin-bottom: 0.2rem;
        }
        .cover-back .title-quote-en {
          font-family: var(--font-serif); font-size: 0.42rem;
          color: rgba(139,69,19,0.5); letter-spacing: 0.1em;
        }

        /* 书底投影 */
        .book-shadow-3d {
          position: absolute; left: 50%; bottom: -28px;
          width: 200px; height: 24px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%);
          filter: blur(10px);
          z-index: -1;
        }

        .cover-footer {
          position: relative; z-index: 5;
          text-align: center; padding: 1.5rem;
          color: rgba(244,236,216,0.5); font-size: 0.82rem;
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .cover-hero { flex-direction: column; gap: 1.5rem; padding: 0 1rem; }
          .cover-content { text-align: center; max-width: 100%; }
          .cover-cta { justify-content: center; }
          .cover-tags { justify-content: center; }
          .cover-title { font-size: 2.8rem; }
          .cover-title-sub { font-size: 1.1rem; }
          .cover-desc { font-size: 0.85rem; }
          .nav-links button { padding: 0.4rem 0.6rem; font-size: 0.8rem; }
          .book-3d { width: 180px; height: 245px; }
          .tie-line { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  )
}
