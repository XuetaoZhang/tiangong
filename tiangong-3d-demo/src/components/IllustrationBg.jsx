import React from 'react'

// 古籍插图底图：用 SVG 模拟《天工开物》明刻本插图风格
// 作为右页底图，3D 器物从插图上方"浮起"
export default function IllustrationBg({ artifact }) {
  if (artifact.id === 'tongche') return <TongcheIllustration />
  if (artifact.id === 'longgu') return <LongguIllustration />
  return null
}

// 筒车插图（线描风格，仿明刻本）
function TongcheIllustration() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="illus-svg">
      <defs>
        <filter id="ink-tc">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.27  0 0 0 0 0.12  0 0 0 0.5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* 水流 */}
      <path d="M 20 180 Q 80 175 140 185 T 260 180 L 380 175" stroke="#6B4226" strokeWidth="1.2" fill="none" opacity="0.5" strokeDasharray="3 2" />
      <path d="M 20 195 Q 80 190 140 200 T 260 195 L 380 190" stroke="#6B4226" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="2 3" />
      {/* 水轮大圆 */}
      <circle cx="200" cy="150" r="70" stroke="#5C3A1E" strokeWidth="2" fill="none" opacity="0.55" />
      <circle cx="200" cy="150" r="55" stroke="#5C3A1E" strokeWidth="1.2" fill="none" opacity="0.45" />
      {/* 轮辐 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180
        return (
          <line
            key={a}
            x1={200 + Math.cos(rad) * 12}
            y1={150 + Math.sin(rad) * 12}
            x2={200 + Math.cos(rad) * 68}
            y2={150 + Math.sin(rad) * 68}
            stroke="#5C3A1E" strokeWidth="1" opacity="0.4"
          />
        )
      })}
      {/* 中心轴 */}
      <circle cx="200" cy="150" r="6" stroke="#3A2518" strokeWidth="1.5" fill="#3A2518" opacity="0.5" />
      {/* 竹筒（轮周小竖线） */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * 70}
            y1={150 + Math.sin(a) * 70}
            x2={200 + Math.cos(a) * 78}
            y2={150 + Math.sin(a) * 78}
            stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5"
          />
        )
      })}
      {/* 受水槽（顶部） */}
      <rect x="180" y="60" width="40" height="8" stroke="#5C3A1E" strokeWidth="1.2" fill="none" opacity="0.5" />
      <line x1="200" y1="68" x2="200" y2="80" stroke="#5C3A1E" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
      {/* 支架 */}
      <line x1="170" y1="220" x2="170" y2="250" stroke="#3A2518" strokeWidth="2" opacity="0.5" />
      <line x1="230" y1="220" x2="230" y2="250" stroke="#3A2518" strokeWidth="2" opacity="0.5" />
      <rect x="160" y="248" width="80" height="6" stroke="#3A2518" strokeWidth="1" fill="#3A2518" opacity="0.4" />
      {/* 题字 */}
      <text x="320" y="100" fontFamily="'Noto Serif SC', serif" fontSize="14" fill="#5C3A1E" opacity="0.4" writingMode="vertical-rl">筒車</text>
    </svg>
  )
}

// 龙骨水车插图
function LongguIllustration() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="illus-svg">
      {/* 水槽（斜置） */}
      <line x1="80" y1="220" x2="320" y2="100" stroke="#5C3A1E" strokeWidth="2" opacity="0.55" />
      <line x1="80" y1="240" x2="320" y2="120" stroke="#5C3A1E" strokeWidth="2" opacity="0.55" />
      {/* 槽内分段（刮板位） */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = i / 9
        const x = 80 + t * 240
        const y = 220 + t * (-120)
        return (
          <line
            key={i}
            x1={x} y1={y - 8}
            x2={x} y2={y + 8}
            stroke="#5C3A1E" strokeWidth="1" opacity="0.4"
          />
        )
      })}
      {/* 顶部踏轴（大圆） */}
      <circle cx="320" cy="100" r="22" stroke="#3A2518" strokeWidth="2" fill="none" opacity="0.55" />
      <circle cx="320" cy="100" r="4" fill="#3A2518" opacity="0.5" />
      {/* 踏板 */}
      <line x1="298" y1="100" x2="290" y2="90" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />
      <line x1="342" y1="100" x2="350" y2="90" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />
      {/* 底部从动轮 */}
      <circle cx="80" cy="230" r="14" stroke="#3A2518" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* 支架 */}
      <line x1="320" y1="122" x2="320" y2="160" stroke="#3A2518" strokeWidth="2" opacity="0.5" />
      <rect x="300" y="158" width="40" height="6" stroke="#3A2518" strokeWidth="1" fill="#3A2518" opacity="0.4" />
      {/* 水波 */}
      <path d="M 30 260 Q 60 255 90 260 T 150 260" stroke="#6B4226" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3 2" />
      {/* 题字 */}
      <text x="350" y="180" fontFamily="'Noto Serif SC', serif" fontSize="13" fill="#5C3A1E" opacity="0.4" writingMode="vertical-rl">龍骨車</text>
    </svg>
  )
}
