# 第十周学习笔记

## 排版
排版、布局都是指 Layout 阶段，得到带 position 的 DOM。

三代 CSS 布局：
- 正常流、position、float等构成的第一代布局
- flex 的第二代布局
- grid 的第三代布局

ToyBrowser 中以 flex 布局来进行实现。

### 把元素收集进行
元素分配到行里，判断 no-wrap 的值分别处理。

### 计算主轴
