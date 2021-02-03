# 第十四周学习笔记

[TOC]

## 手势与动画 | 初步建立动画与时间线

对轮播组件的完善：

- 整合自动播放与手动拖拽
- 适配移动端 touch 事件



#### 用 JS 书写动画

需要处理帧数据，有几个方法：

```javascript
// 不推荐，可能导致事件积压
setInterval(() => {}, 16)

let tick = () => {
	setTimeout(tick, 16)
}

// 现代浏览器推荐
let tick = () => {
	let handler = requestAnimationFrame(tick)
    // cancelAnimationFrame(handler)
}
```



##### 属性动画

改变某个属性

##### 帧动画

每帧给一个图

