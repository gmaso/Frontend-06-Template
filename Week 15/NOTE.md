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



