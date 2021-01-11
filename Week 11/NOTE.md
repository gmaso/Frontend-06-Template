# 第十一周学习笔记

## CSS 语法
最后一份完整的单文件 CSS 规范是 CSS2.1，之后由于采用了模块式发布策略，CSS 的各个模块单独发布规范文档，导致 CSS3 分散到了几十上百个标准规范中。
因此，CSS3 及之后版本 的语法也不再有一份统一的语法。
文档查看：
[Appendix G. Grammar of CSS 2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)
[CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)
[CSS Snapshot 2020](https://www.w3.org/TR/CSS/)：CSS 2020 稳定规范汇总

### CSS Level
> Cascading Style Sheets does not have versions in the traditional sense; instead it has levels. Each level of CSS builds on the previous, refining definitions and adding features. The feature set of each higher level is a superset of any lower level, and the behavior allowed for a given feature in a higher level is a subset of that allowed in the lower levels. A user agent conforming to a higher level of CSS is thus also conformant to all lower levels.

#### CSS Level 1
CSS1 specification 已废弃，CSS Level 1 是使用 CSS2.1 specification 中的语法和定义来定义的 CSS1 specification 中的所有特性（properties, values, at-rules, etc）。

#### CSS Level 2
CSS2 specification 已废弃。
> The CSS2.1 specification defines CSS Level 2 and the CSS Style Attributes specification defines its inclusion in element-specific style attributes.

#### CSS Level 3
> CSS Level 3 builds on CSS Level 2 module by module, using the CSS2.1 specification as its core. Each module adds functionality and/or replaces part of the CSS2.1 specification. The CSS Working Group intends that the new CSS modules will not contradict the CSS2.1 specification: only that they will add functionality and refine definitions. As each module is completed, it will be plugged in to the existing system of CSS2.1 plus previously-completed modules.
> From this level on modules are levelled independently: for example Selectors Level 4 may well be completed before CSS Line Module Level 3. Modules with no CSS Level 2 equivalent start at Level 1; modules that update features that existed in CSS Level 2 start at Level 3.

#### CSS Level 4 and beyond
> There is no CSS Level 4. Independent modules can reach level 4 or beyond, but CSS the language no longer has levels. ("CSS Level 3" as a term is used only to differentiate it from the previous monolithic versions.)

## CSS 总体结构
- @charset
- @import
- rules
  - @media
  - @page
  - rule

### @规则
- @charset
- @import
- **@media**
- @page
- @counter-style
- **@keyframes**
- **@fontface**
- @supports
- @namespace

### rule 规则
- Selector 选择器
  https://www.w3.org/TR/selectors-3/
  https://www.w3.org/TR/selectors-4/
- Rule 规则
  - Key
    - properties
    - Variables：-- 开头，https://www.w3.org/TR/css-variables/
  - Value：多种类型的值，https://www.w3.org/TR/css-values-4/
    - number
    - length
    - calc
    - ......



## 收集标准
使用 js 配合 iframe，抓取相关标准的页面内容，然后进行处理。

## 选择器
### 语法
简单选择器：*、div 或 svg|a（带命名空间 svg，接命名空间分割线|）、.cls、#id、\[attr=value]、:hover、::before 七类
复合选择器：简单选择器组合，要求元素同时满足选择器条件，* 或 div 必须写在最前，伪类或伪元素必须写在最后
复杂选择器：复合选择器中间用连接符（\<sp\>、>、~、||）组合，针对元素的结构进行选择

### 优先级
对于优先级数组 [a, b, c, d]，。优先级可以计算为：
S = a * N^3 + b * N ^ 2 + c * N + d
其中，N 为一个足够大的值，一般为 256 的幂，如 65536。如果 N 取得不够大，可能出现多个类选择器优先级等于一个 id 选择器优先级的情况。

### 伪类
- 链接/行为
  - :any-link
  - :link :visited：一旦对元素设置了此伪类，就不能更改除颜色外的其它属性，避免用程序判断处链接是否访问，产生安全问题。
  - :hover
  - :active
  - :focus
  - :target
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()：破坏了回溯原则，性能可能不太好
  - :first-child、:last-child、:only-child
- 逻辑型
  - :not() 伪类，括号内只能支持复合选择器，不支持带连接符

不建议 CSS 选择器写得比较复杂，可以通过在 HTML 结构优化或添加 class 等，来简化选择器。

## 伪元素
### before，after
新生成一个元素，在添加 content 属性后，可以和一般 DOM 元素一样处理。

### first-letter，first-line
把已有的内容包起来。

问题：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
答：first-line 是对块级元素的第一行文字生效，且只作用于文本属性，所以不支持 margin、padding、border、float 等非文本属性。