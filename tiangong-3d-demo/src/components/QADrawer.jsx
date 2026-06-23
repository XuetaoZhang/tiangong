import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { artifacts, qaPresets, recommendedQuestions } from '../data/artifacts.js'

export default function QADrawer() {
  const toggleQA = useStore((s) => s.toggleQA)
  const artifactId = useStore((s) => s.artifactId)
  const messages = useStore((s) => s.qaMessages)
  const addQAMessage = useStore((s) => s.addQAMessage)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)
  const artifact = artifacts[artifactId]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, thinking])

  const send = (text) => {
    const q = text || input
    if (!q.trim() || thinking) return
    addQAMessage({ role: 'user', text: q })
    setInput('')
    setThinking(true)

    // 模拟 AI 流式回答
    setTimeout(() => {
      const answer = qaPresets[q] || generateFallback(q, artifact)
      addQAMessage({ role: 'ai', text: answer })
      setThinking(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <div className="qa-drawer">
      <div className="qa-header">
        <div>
          <div className="qa-title">✦ 天工小助手</div>
          {artifact && <div className="qa-context">当前：{artifact.name} · {artifact.chapter}</div>}
        </div>
        <button className="qa-close" onClick={toggleQA}>✕</button>
      </div>

      <div className="qa-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="qa-welcome">
            <div className="qa-welcome-icon">📜</div>
            <p>我是天工小助手，可以为你讲解《天工开物》中的器物原理。</p>
            <p className="qa-welcome-hint">试试这些问题：</p>
            <div className="qa-suggestions">
              {recommendedQuestions.map((q) => (
                <button key={q} className="qa-suggestion" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`qa-msg ${m.role}`}>
            <div className="qa-msg-avatar">{m.role === 'user' ? '我' : '✦'}</div>
            <div className="qa-msg-bubble">
              <pre className="qa-msg-text">{m.text}</pre>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="qa-msg ai">
            <div className="qa-msg-avatar">✦</div>
            <div className="qa-msg-bubble thinking">
              <span className="dot" /><span className="dot" /><span className="dot" />
              天工正在思考…
            </div>
          </div>
        )}
      </div>

      <div className="qa-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入你的问题…"
        />
        <button className="qa-send" onClick={() => send()} disabled={!input.trim()}>➤</button>
      </div>

      <style>{`
        .qa-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 100;
          width: 400px; max-width: 92vw;
          background: rgba(247,244,239,0.98); backdrop-filter: blur(16px);
          border-left: 1px solid rgba(139,69,19,0.2);
          box-shadow: -8px 0 32px rgba(0,0,0,0.2);
          display: flex; flex-direction: column;
          animation: slideInRight 0.3s ease;
        }
        .qa-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.2rem; border-bottom: 1px solid var(--rule);
          background: var(--bg2);
        }
        .qa-title { font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--accent); }
        .qa-context { font-size: 0.72rem; color: var(--muted); margin-top: 0.2rem; }
        .qa-close { color: var(--muted); font-size: 1rem; padding: 0.3rem; }
        .qa-close:hover { color: var(--ink); }

        .qa-messages { flex: 1; overflow-y: auto; padding: 1.2rem; }

        .qa-welcome { text-align: center; padding: 1.5rem 0.5rem; }
        .qa-welcome-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
        .qa-welcome p { font-size: 0.88rem; color: var(--ink); margin-bottom: 0.5rem; }
        .qa-welcome-hint { color: var(--muted) !important; font-size: 0.8rem !important; margin-top: 1rem !important; }
        .qa-suggestions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.6rem; }
        .qa-suggestion {
          text-align: left; padding: 0.6rem 0.9rem; font-size: 0.82rem;
          background: var(--bg2); border: 1px solid var(--rule); border-radius: 10px;
          color: var(--ink); transition: all 0.2s;
        }
        .qa-suggestion:hover { border-color: var(--accent); background: var(--accent-light); }

        .qa-msg { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .qa-msg.user { flex-direction: row-reverse; }
        .qa-msg-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 600;
        }
        .qa-msg.ai .qa-msg-avatar { background: var(--accent); color: #fff; }
        .qa-msg.user .qa-msg-avatar { background: var(--accent2); color: #fff; }
        .qa-msg-bubble {
          max-width: 78%; padding: 0.6rem 0.9rem; border-radius: 12px;
          font-size: 0.85rem; line-height: 1.7;
        }
        .qa-msg.ai .qa-msg-bubble { background: var(--bg2); border: 1px solid var(--rule); color: var(--ink); border-top-left-radius: 4px; }
        .qa-msg.user .qa-msg-bubble { background: var(--accent); color: #fff; border-top-right-radius: 4px; }
        .qa-msg-text { white-space: pre-wrap; font-family: inherit; margin: 0; }
        .qa-msg-bubble.thinking { display: flex; align-items: center; gap: 0.3rem; color: var(--muted); font-size: 0.8rem; }
        .qa-msg-bubble.thinking .dot {
          width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
          animation: pulse 1s infinite;
        }
        .qa-msg-bubble.thinking .dot:nth-child(2) { animation-delay: 0.2s; }
        .qa-msg-bubble.thinking .dot:nth-child(3) { animation-delay: 0.4s; }

        .qa-input-area {
          display: flex; gap: 0.5rem; padding: 0.9rem 1.2rem;
          border-top: 1px solid var(--rule); background: var(--bg2);
        }
        .qa-input-area input {
          flex: 1; padding: 0.6rem 0.9rem; border: 1px solid var(--rule);
          border-radius: 100px; font-size: 0.86rem; color: var(--ink);
          background: var(--bg); outline: none; transition: border 0.2s;
        }
        .qa-input-area input:focus { border-color: var(--accent); }
        .qa-send {
          width: 40px; height: 40px; border-radius: 50%; background: var(--accent2);
          color: #fff; font-size: 1rem; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .qa-send:hover { background: #A8481F; transform: scale(1.05); }
        .qa-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

// 兜底回答
function generateFallback(q, artifact) {
  return `关于"${q}"：\n\n这是一个很好的问题。在《天工开物》中，${
    artifact ? artifact.name : '相关器物'
  }体现了古人对自然规律的深刻理解与巧妙运用。\n\n${
    artifact ? artifact.summary : ''
  }\n\n📖 来源：《天工开物·${artifact ? artifact.chapter : '相关篇章'}》\n\n（注：Demo 版本仅预设了部分问答，完整版将接入大模型实时回答。）`
}
