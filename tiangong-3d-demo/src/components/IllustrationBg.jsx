import React from 'react'

// 古籍插图底图：使用《天工开物》原版古籍原图
// 作为右页底图，3D 器物从插图上方"浮起"
export default function IllustrationBg({ artifact }) {
  if (artifact.id === 'tongche') {
    return (
      <img
        src="/pic/tongche.png"
        alt="天工开物·筒车原版插图"
        className="illus-img"
        draggable={false}
      />
    )
  }
  if (artifact.id === 'longgu') {
    return (
      <img
        src="/pic/longgushuiche.png"
        alt="天工开物·龙骨水车原版插图"
        className="illus-img"
        draggable={false}
      />
    )
  }
  return null
}
