import React, { Suspense, lazy } from 'react'
import { useStore } from './store/useStore'
import Cover from './components/Cover.jsx'
import Catalog from './components/Catalog.jsx'
import Settings from './components/Settings.jsx'
import About from './components/About.jsx'
import QADrawer from './components/QADrawer.jsx'

// 3D 阅读页懒加载
const Reader = lazy(() => import('./components/Reader.jsx'))

export default function App() {
  const page = useStore((s) => s.page)
  const qaOpen = useStore((s) => s.qaOpen)

  return (
    <div className="app-root">
      {page === 'cover' && <Cover />}
      {page === 'catalog' && <Catalog />}
      {page === 'settings' && <Settings />}
      {page === 'about' && <About />}
      {page === 'reader' && (
        <Suspense fallback={<LoadingScreen />}>
          <Reader />
        </Suspense>
      )}
      {qaOpen && <QADrawer />}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #3A2518 0%, #5C3A1E 50%, #8B4513 100%)',
      color: '#fff', zIndex: 9999
    }}>
      <div className="scroll-loading" style={{ marginBottom: 20 }} />
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
        正在展开卷轴…
      </p>
      <style>{`
        .scroll-loading {
          width: 48px; height: 48px;
          border: 3px solid rgba(255,255,255,0.2);
          border-top-color: #E8C88C;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
      `}</style>
    </div>
  )
}
