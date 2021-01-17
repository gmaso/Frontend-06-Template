# 第十二周学习笔记

## CSS 排版 | 盒（Box）

概念区分：标签（Tag）、元素（Element）、盒（Box）
HTML 中的是标签，DOM 中的是元素，CSS 排版的是盒。CSS 选择器选中的元素，在排版时可能产生多个盒。排版和渲染的基本单位时盒。

### 盒模型
content-box、padding、border-box、margin
box-sizing 默认为 content-box，可设置为 border-box。

## CSS 排版 | 正常流（Normal Flow）
正常流是第一代的排版技术，比第二代的 flex 排版技术能力差，实现却更复杂。
CSS 的排版里，只排两样东西，盒和文字。一切 CSS 的东西，都不外乎这两样。
正常流与平时书写文字的习惯完全一致，所以称为正常流。

### 正常流排版步骤
1. 收集**盒和文字**进**行**
1. 计算盒和文字在行中的排布
1. 计算行的排布

文字和 inline-level-box 组成 line-box，再和 block-level-box 进行排布。

![image-20210112214701933](http://static.gmaso.cn/blog/2021/01/12/21/9b706abb7b564a29a9822a2efe866f9c-6b186b-image-20210112214701933.png?imageslim)

注：暂不考虑 writing-mode 的影响，只以从左到右、从上到下排版来理解

行内（IFC：Inline level Formating Context，行内级格式化上下文）：

盒和文字在一个行内的，从左到右排，有一定的对齐规则。inline-box，即inline-level-box（行内级别的盒）。

block-level-box，块级盒，单独占一行。

文字和 inline-box 排出来的行，叫做 行盒（line-box）。

行间（BFC：Block level Formating Context，块级格式化上下文）：

正常流就是 line-box 和 block-level-box 从上到下排布。

### CSS 排版 | 正常流的行级排布

Baseline：基线对齐。英文为小写字母 x 的下沿

Text：字形，由字体决定。origin 指示了基线的位置。

![image-20210112220637305](http://static.gmaso.cn/blog/2021/01/12/22/0cd9c6d6657288c7b8d9caf1742e9a37-19375c-image-20210112220637305.png?imageslim)

行模型：

![image-20210112224752015](http://static.gmaso.cn/blog/2021/01/12/22/cb7d86f54612a4fc4cf0a8b9a5cda83f-9eb9e2-image-20210112224752015.png?imageslim)

行的 base-line 会根据行内的文字和盒改变。

text-top 和 text-bottom 由行内字体的最大字高确定，确定后本行内的都不变。

行内盒的基线是随着内部文字的基线变化的，大部分情况下不建议对行内盒使用基线对齐。通过设置 vertical-align 会影响行内盒的 top 和 bottom。



## CSS 排版 | 正常流的块级排布

### float 与 clear

float：先排到正常的位置，然后再往指定方向浮动，再根据 float 元素占据的区域调整行盒的位置。float 元素不止影响一行，高度范围内的行盒都会受影响。float 元素间不会重叠。

clear：找一个干净的空间来执行浮动的操作。设置后会调整元素的纵向位置，不与已有的 float 元素在纵向有重合。

通过给同级元素都设置 float，可以模拟正常流的布局效果。此时使用 br 强制换行不生效，需要使用 clear 来开始新行。

### margin 折叠

上下同级元素之间的 margin 会折叠。**Margin Collapse 只会发生在同一个 BFC 里面**。



## CSS 排版 | BFC 合并

### Block 相关概念

- Block Container：里面能容纳 BFC 的盒，里面默认是正常流
  - block
  - inline-block
  - table-cell
  - flex item
  - grid item
  - table-caption
- Block-level Box：外面有 BFC 的盒
  - block level：block、flex、table、grid
  - inline level：inline-block、inline-flex、inline-table、inline-grid
  - run-in（继承父级的 display）
- **Block Box** = Block Container + Block-level Box：里外都有 BFC 的盒

### 设立 BFC

- floats
- absolutely positioned elements
- block containers（such as inline-blocks, table-cells, and table-captions）that are **not block boxes**，
  - flex items
  - grid cell
  - ...
- and block boxes with 'overflow' other than 'visible'

### BFC 合并（复习理解）

默认能容纳正常流的盒都会创建 BFC，只有一种情况例外：block box && overflow: visible。此时里外都是 BFC，会发生 BFC 合并，导致：

	- BFC 合并与 float
	- BFC 合并与边距折叠



## CSS 排版 | Flex 排版

- 收集盒进**行**
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布



## CSS 动画与绘制 | 动画

- @keyframes 定义 与 animation 调用
- transition

##### 时间曲线

三次贝塞尔曲线效果：[cubic-bezier.com](https://cubic-bezier.com)

​	两个控制点，构成直线，是一次贝塞尔曲线；增加一个控制点，可以得到二次贝塞尔曲线；增加两个控制点（共四个），得到三次贝塞尔曲线。

​	贝塞尔曲线有强大的拟合能力，可以完美拟合直线和抛物线，但不能完美拟合圆（只能分段近似）。

## CSS 动画与绘制 | 颜色

人眼可见光波长范围：400nm - 760nm。

自然界中没有纯色的光。

红绿蓝三原色：之所以只有三种，是因为人眼中只有三种视锥细胞。

RGB：用于反射光的方式。

三原色的补色：品红、黄、青，用于印刷行业（CMYK），因为颜料是吸收光。

![image-20210114071622673](http://static.gmaso.cn/blog/2021/01/14/07/953718db6ea142b81159c4b0fb32de49-2f865f-image-20210114071622673.png?imageslim)

HSL：更符合人类直觉的语义化颜色表示方式。Hue：色相，就是常说的颜色；Saturation：饱和度，指色彩的纯度，取值 0 到 1，越高颜色越纯，0 为黑色；Lightness：亮度，取值 0 到 1，0 为黑色，1 为最亮。还有 HSV（Hue - Saturation - Value）。

![，](http://static.gmaso.cn/blog/2021/01/14/07/4dc144508f64c0ccc2a34f58a6e8950a-15956c-image-20210114071650409.png?imageslim)

HSL 的优势：可以单独只修改颜色或纯度或亮度中的一个，不改变其它两个。



## CSS 动画与绘制 | 绘制

主要分为三类。

- 几何图形

- 文字

- 位图

CSS 图形的最佳实践：使用 data uri + svg



作业：对 CSS 的属性进行分类。

