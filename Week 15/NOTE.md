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



构造两个类：

1. Animation 动画类，动过参数初始化后，传入时间点 time 可以获取到对应的属性值
2. Timeline 时间线类，动态调用 Animation 类



## 手势与动画 | 设计时间线的更新

加强时间线，支持在 Timeline 开始后动态添加 Animation。



## 手势与动画 | 给动画添加暂停与重启功能

要点：在暂停时记录时间点，恢复时累计已经暂停的时间，获取位置时减掉暂停时间。恢复执行后把记录时间点清空，避免重复累计。



## 手势与动画 | 完善动画的其它功能

处理 delay 和 timingFunction 参数

三次贝塞尔曲线，使用牛顿积分法，直接抄代码就行。

完成 reset 函数，把 timeline 中的各项参数都重置。



## 手势与动画 | 对时间线进行状态管理

避免在错误的状态进行操作。比如多次点击暂停或恢复时动画错误。



## 手势与动画 | 手势的基本知识

由于鼠标尤其是触屏上操作精确性问题和差异性，用手势来统一操作，简化代码。

抽象到 start、move、end 事件中。

对 move 判断有一个容差，一般使用 5px（一倍屏），低于此值不判断为移动。

flick：类似 swipe，扫一下

![image-20210207214704087](http://static.gmaso.cn/blog/2021/02/07/21/3242703de99a2e9af22318761b644408-c053a8-image-20210207214704087.png?imageslim)



## 手势与动画 | 实现鼠标操作

移动端操作不会触发 mouse 系列事件。

touch 事件一旦 start 后，move 一定触发在同一个元素上，不管手移动到哪里。由于 move 肯定在 start 后才能触发，所以事件可以一起添加。而不像 mousemove，在没有 mousedown 时也能触发，所以必须在 mousedown 后才监听。

touch 事件可以有多个触点，保存在 event.changedTouches 中，是一系列的 touch 对象，其中有 identifier 参数唯一标识触点。

touchcancel 事件，当被异常打断时触发，比如 alert。