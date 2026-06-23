import React, { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { artifacts, upcomingArtifacts } from '../data/artifacts.js'

const categories = [
  { id: 'all', name: '全部' },
  { id: '乃粒·农具', name: '乃粒·农具' },
  { id: '乃服·纺织', name: '乃服·纺织' },
  { id: '治铸·铸造', name: '治铸·铸造' },
  { id: '杀青·造纸', name: '杀青·造纸' },
]

export default function Catalog() {
  const go = useStore((s) => s.go)
  const openArtifact = useStore((s) => s.openArtifact)
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')

  const allItems = [
    ...Object.values(artifacts),
    ...upcomingArtifacts,
  ]

  const filtered = allItems.filter((a) => {
    const catOk = activeCat === 'all' || a.chapter === activeCat
    const qOk = !query || a.name.includes(query) || a.chapter.includes(query)
    return catOk && qOk
  })

  return (
    <div className="catalog-page">
      {/* 顶部导航 */}
      <nav className="top-nav catalog-nav">
        <div className="logo" onClick={() => go('cover')}>
          <span className="logo-seal">天</span>
          <span className="logo-text">天工开物·3D 书</span>
        </div>
        <div className="nav-links">
          <button onClick={() => go('cover')}>首页</button>
          <button onClick={() => go('about')}>关于</button>
          <button onClick={() => go('settings')}>设置</button>
        </div>
      </nav>

      <div className="catalog-body">
        <div className="catalog-header fade-in-up">
          <button className="back-btn" onClick={() => go('cover')}>← 返回</button>
          <h1 className="catalog-title">目 录</h1>
          <div className="catalog-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索器物名称或篇章…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 分类 Tab */}
        <div className="catalog-tabs">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`cat-tab ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 器物卡片网格 */}
        <div className="catalog-grid">
          {filtered.map((item, idx) => (
            <ArtifactCard
              key={item.id}
              item={item}
              index={idx}
              onClick={() => item.status === 'online' && openArtifact(item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>未找到相关器物</p>
              <button className="btn btn-outline" onClick={() => { setQuery(''); setActiveCat('all') }}>
                查看全部
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .catalog-page {
          position: fixed; inset: 0; overflow-y: auto;
          background: var(--bg);
        }
        .catalog-nav { background: var(--bg2); border-bottom: 1px solid var(--rule); }
        .catalog-nav .logo-text { color: var(--ink); }
        .catalog-nav .nav-links button { color: var(--muted); }
        .catalog-nav .nav-links button:hover { color: var(--accent); background: var(--accent-light); }

        .catalog-body { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .catalog-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .back-btn {
          color: var(--accent); font-size: 0.9rem; padding: 0.4rem 0.8rem;
          border-radius: 6px; transition: all 0.2s;
        }
        .back-btn:hover { background: var(--accent-light); }
        .catalog-title {
          font-family: var(--font-serif); font-size: 2rem; font-weight: 700;
          color: var(--ink); letter-spacing: 0.3em; flex: 1;
        }
        .catalog-search {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--bg2); border: 1px solid var(--rule);
          border-radius: 100px; padding: 0.4rem 1rem; min-width: 240px;
        }
        .search-icon { font-size: 0.85rem; opacity: 0.6; }
        .catalog-search input {
          border: none; outline: none; background: transparent;
          font-size: 0.88rem; color: var(--ink); flex: 1;
        }

        .catalog-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .cat-tab {
          padding: 0.45rem 1rem; font-size: 0.85rem; border-radius: 100px;
          color: var(--muted); border: 1px solid var(--rule); transition: all 0.2s;
          font-family: var(--font-serif);
        }
        .cat-tab:hover { color: var(--accent); border-color: var(--accent); }
        .cat-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }

        .catalog-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .artifact-card {
          background: var(--bg2); border: 1px solid var(--rule);
          border-radius: 14px; overflow: hidden; cursor: pointer;
          transition: all 0.3s; position: relative;
          animation: fadeInUp 0.5s ease backwards;
        }
        .artifact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139,69,19,0.15);
          border-color: var(--accent);
        }
        .artifact-card.soon { cursor: default; opacity: 0.7; }
        .artifact-card.soon:hover { transform: none; box-shadow: none; border-color: var(--rule); }

        .card-thumb {
          height: 160px; position: relative; overflow: hidden;
          background: linear-gradient(135deg, #F4ECD8, #E8DCC0);
          display: flex; align-items: center; justify-content: center;
        }
        .card-thumb-icon {
          font-family: var(--font-serif); font-size: 3.5rem; font-weight: 700;
          color: var(--accent); opacity: 0.5;
        }
        .card-thumb-deco {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 50% 50%, rgba(139,69,19,0.08) 0%, transparent 60%),
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(139,69,19,0.03) 20px, rgba(139,69,19,0.03) 21px);
        }
        .card-badge {
          position: absolute; top: 0.8rem; right: 0.8rem;
          font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 100px;
          font-weight: 600;
        }
        .card-badge.online { background: #E8F5E9; color: #2E7D32; }
        .card-badge.soon { background: #FFF3E0; color: #E65100; }

        .card-info { padding: 1rem 1.2rem 1.2rem; }
        .card-name {
          font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700;
          color: var(--ink); margin-bottom: 0.3rem; letter-spacing: 0.05em;
        }
        .card-chapter { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.6rem; }
        .card-stars { font-size: 0.8rem; color: var(--gold); letter-spacing: 0.1em; }

        .empty-state {
          grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;
          color: var(--muted);
        }

        @media (max-width: 640px) {
          .catalog-title { font-size: 1.5rem; }
          .catalog-search { min-width: 100%; }
          .catalog-grid { grid-template-columns: 1fr 1fr; gap: 0.8rem; }
          .card-thumb { height: 110px; }
          .card-thumb-icon { font-size: 2.5rem; }
          .card-name { font-size: 1rem; }
        }
      `}</style>
    </div>
  )
}

function ArtifactCard({ item, index, onClick }) {
  const isOnline = item.status === 'online'
  return (
    <div
      className={`artifact-card ${isOnline ? '' : 'soon'}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={onClick}
    >
      <div className="card-thumb">
        <div className="card-thumb-deco" />
        <div className="card-thumb-icon">{item.name[0]}</div>
        <span className={`card-badge ${item.status}`}>
          {isOnline ? '已上线' : '敬请期待'}
        </span>
      </div>
      <div className="card-info">
        <div className="card-name">{item.name}</div>
        <div className="card-chapter">{item.chapter}</div>
        <div className="card-stars">{'★'.repeat(item.difficulty)}{'☆'.repeat(5 - item.difficulty)}</div>
      </div>
    </div>
  )
}
