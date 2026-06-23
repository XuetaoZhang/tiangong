import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // ===== 页面路由 =====
  page: 'cover', // cover | catalog | reader | settings | about
  go: (page) => set({ page }),

  // ===== 当前器物 =====
  artifactId: null,
  openArtifact: (id) => set({ artifactId: id, page: 'reader', selectedPartId: null, highlightedPartId: null, simulate: false, explode: false }),
  closeArtifact: () => set({ artifactId: null, page: 'catalog', selectedPartId: null, highlightedPartId: null }),

  // ===== 3D 交互状态 =====
  selectedPartId: null,    // 点击选中的部件（弹出释义卡片）
  highlightedPartId: null, // 悬停高亮的部件（古文联动）
  selectPart: (id) => set({ selectedPartId: id }),
  clearSelect: () => set({ selectedPartId: null }),
  highlightPart: (id) => set({ highlightedPartId: id }),
  clearHighlight: () => set({ highlightedPartId: null }),

  // 高亮来源：'text' | 'part' | null，用于古文滚动联动
  highlightSource: null,
  setHighlight: (id, source) => set({ highlightedPartId: id, highlightSource: source }),

  // ===== 翻书 =====
  pageTurning: false,
  turnPage: (dir) => {
    if (get().pageTurning) return
    set({ pageTurning: true })
    setTimeout(() => set({ pageTurning: false }), 800)
  },

  // ===== 工具栏 =====
  explode: false,       // 拆解模式
  simulate: false,      // 运作模拟
  simParam: 50,         // 模拟参数（水流速度/踩踏速度）
  viewPreset: 'default',// default | front | side | top
  toggleExplode: () => set((s) => ({ explode: !s.explode })),
  toggleSimulate: () => set((s) => ({ simulate: !s.simulate })),
  setSimParam: (v) => set({ simParam: v }),
  setViewPreset: (v) => set({ viewPreset: v }),

  // ===== AI 问答抽屉 =====
  qaOpen: false,
  toggleQA: () => set((s) => ({ qaOpen: !s.qaOpen })),
  qaMessages: [],
  addQAMessage: (msg) => set((s) => ({ qaMessages: [...s.qaMessages, msg] })),
  clearQA: () => set({ qaMessages: [] }),

  // ===== 设置 =====
  theme: 'light',
  ttsEnabled: true,
  ttsRate: 'medium',
  aiLevel: 'standard', // student | standard | expert
  autoTranslate: true,
  quality: 'medium',
  reduceMotion: false,
  setTheme: (v) => set({ theme: v }),
  setTtsEnabled: (v) => set({ ttsEnabled: v }),
  setTtsRate: (v) => set({ ttsRate: v }),
  setAiLevel: (v) => set({ aiLevel: v }),
  setAutoTranslate: (v) => set({ autoTranslate: v }),
  setQuality: (v) => set({ quality: v }),
  setReduceMotion: (v) => set({ reduceMotion: v }),

  // ===== 译文浮层 =====
  translationHover: null, // { segId, x, y, text }
  setTranslationHover: (v) => set({ translationHover: v }),
}))
