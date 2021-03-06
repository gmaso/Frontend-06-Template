# 第二周学习笔记

## 20201102 实现[地图编辑器](./map-editor.html)
使用 mouseover、mousedown、mouseup 事件实现地图的绘制，使用 localStorage 保存地图数据。

contextmenu: 右键弹出菜单事件


## 20201103 [广度优先搜索](./map-editor_01.html)

### 我的算法
1. 判断起点是否是终点，如果是，搜索结束；
2. 从一个点出发，搜索周边能达到的点，加入数组中作为第一步可达的点，判断其中是否有终点，是则搜索结束；
3. 依次搜索第一步的所有点，得到第二层的点，判断其中是否有要找的点，是则搜索结束；
4. 重复上一步骤，直到找到终点，或搜索完地图所有点。

缺点：每层搜索都要搜索完才判断是否包括终点，可以提早结束。

### 老师的算法
用 quene 队列存储搜索的点，quene 中初始包括起点左边，从队列头部取点进行搜索，如果是终点则结束搜索，否则新增的点加入队列尾部，依次搜索，直到队列为空，停止搜索。

quene 是广度优先搜索的关键，如果改为使用 stack 栈存储，则是深度优先搜索。

通过使用不同的存储结构，可以实现不同的搜索方法。 **TODO**



## 20201104 [寻路算法可视化和路径显示](./map-editor_02.html)
思路：过程中通过停顿把搜寻点颜色标出来。

碰到问题：sleep 函数执行一次后就停止，不能继续往下搜索。
原因：函数 insertPoint 是异步函数，调用时也要加 await，包裹函数需要加 async。至少要在最后一次调用 insertPoint 时加 await。

**async 函数想要同步地调用都需要加 await**


- 只搜索上下左右四个点时，得到的路径是直角路线
- 搜索包括斜向八个点时，路径中会有斜线，路径更短

用异步函数赋值得到的是一个 promise 对象。例如： let path = findPath([10, 10], [20, 19])，path 是一个 promise 对象：
```
Promise {<fulfilled>: Array(20)}
  __proto__: Promise
  [[PromiseState]]: "fulfilled"
  [[PromiseResult]]: Array(20)
```


## 20201105 [启发式搜索](./map-editor_03.html)
数学上可以证明，只要使用合适的启发式函数，一定可以找到最佳路径，这种启发式寻路称为 A\* 寻路。不一定能找到最佳路径的启发式寻路称为 A 寻路。A\* 是 A 的特例。

策略：构建一个新的存储结构，每次取点时通过自定义的方法取出一个点。

1. 方法是比较和终点之间的距离，取离终点最近的点。
  遇到问题：搜索时会和终点错过，从旁边绕 n 多圈。
  原因：比较点时判断条件错误，this.compare(this.data[i], min) < 0 写成了 this.compare(this.data[i], min)，一直都为真，没起到作用。

1. 待优化：
   
   [] 路径获取最短

   [x] 换为二叉堆结构


## 20201106 学习二叉树、二叉堆
二叉堆的优势：最大值或最小值位于堆顶，能更快的获取最大最小值。


## 20201107 [替换为二叉堆](./map-editor_04.html)
把搜索点的数据用二叉堆存储，测试运行时间和队列差不多。

下一步：查看二叉堆代码是否有问题，没有带来应有的提升。


## 20201108 [二叉堆问题](./map-editor_04.html)
- 二叉堆代码问题修复，几个判断条件错误。

抄的二叉堆代码和老师的差异比较大，可以对比下实现的差异。

## 本周小结
在数据结构方面很弱，需要补。


## 20201109 数据结构学习
数据结构的作用：优化对大规模数据的插入、删除、查找、排序效率。

常用数据结构：
- 队列
- 栈
- 堆
- 二叉树
- 链表
- hash 表


## 20201110 数据结构学习

- 二叉堆
- 优先队列