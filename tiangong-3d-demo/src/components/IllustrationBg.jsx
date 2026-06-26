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
  if (artifact.id === 'shuidui') {
    return (
      <img
        src="/pic/shuidui.png"
        alt="天工开物·水碓原版插图（明崇祯十年刊本·粹精卷）"
        className="illus-img"
        draggable={false}
      />
    )
  }
  if (artifact.id === 'fangzhi') {
    return (
      <img
        src="/pic/fangzhi.png"
        alt="天工开物·花楼机原版插图（明崇祯十年刊本·乃服卷）"
        className="illus-img"
        draggable={false}
      />
    )
  }
  if (artifact.id === 'gufeng') {
    return (
      <img
        src="/pic/gufeng.png"
        alt="天工开物·鼓风炉原版插图（明崇祯十年刊本·冶铸卷）"
        className="illus-img"
        draggable={false}
      />
    )
  }
  if (artifact.id === 'diaoban') {
    return (
      <img
        src="/pic/diaoban.png"
        alt="天工开物·丹青卷松烟制墨原版插图（明崇祯十年涂绍煃刊本·法国国家图书馆藏）"
        className="illus-img"
        draggable={false}
      />
    )
  }
  return null
}
