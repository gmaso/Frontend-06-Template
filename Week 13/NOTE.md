# 第十三周学习笔记

[TOC]



## 重学 HTML | HTML 的定义：XML 与 SGML

SGML：产生于上世纪 60 年代末的由 IBM 使用的庞大的数据描述系统。

XML：SGML 的子级，加入了一些规定与改良。

XHTML：W3C 对 HTML 的 XML 尝试，还有之后的 XHTML 2.0，由于太严格流产

HTML 5：重新定义了与 SGML、XML 的关系



### DTD

http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd

http://www.w3.org/1999/xhtml

XHTML 1.0 相当于 HTML 4.2 左右。

![image-20210123205610994](http://static.gmaso.cn/blog/2021/01/23/20/ee47b9da6afabe5ad14ba4a0fd15c64d-6c761a-image-20210123205610994.png?imageslim)

DTD 中引入三个文件，定义了实体字符（& 符号开始，; 结尾）。

![image-20210123210132707](http://static.gmaso.cn/blog/2021/01/23/21/8d59a094716ec34dcf1c0e3e092d9954-e74b33-image-20210123210132707.png?imageslim)

xhtml-lat1.ent：

​	\&nbsp;：no-break space，可用于产生空格时，但会导致前后被连接成一个词，排版分词时会有问题。最好用 CSS 控制。

xhtml-symbol.ent：符号

xhtml-special：主要是四个， \&quot; \&amp; \&lt; \&gt;

DTD 中还定义了所有的元素、属性、事件、出现位置、嵌套关系等。

### namespace

每个 namespace 的 URL 都代表了唯一的一种语言，常用的 HTML、 SVG、MathML 四种 namespace。

HTML 5 会把 HTML 和 XHTML 作为两种语法供使用者选择，都会有 XML namespace。

![image-20210123212301756](http://static.gmaso.cn/blog/2021/01/23/21/0c369354a7321cca12d08aae7ecdabfe-cf28d4-image-20210123212301756.png?imageslim)



## 重学 HTML | HTML 标签语义

使用语义化标签，把样式留给 CSS。

- aside、main、nav、article、hgroup、figure、figcaption、dnf（之后有定义）、strong（表示在文章中重要与否，不改变语义）、em（表示语气的重音，如**一个**苹果、一个**苹果**，表示对不同部分的强调，语义会有差别）、addr（缩写）、pre、samp（包含举例）、code、header、footer。

- 当没有合适的标签时，可以添加语义相关的 class 来作为补充。

- 对于列表，如果元素存在先后顺序，那么不管前边使用的数字还是圆点序号，都应该使用 ol 标签，然后使用 CSS 修改序号。ul 标签用于表示其中的元素没有先后。



## 重学 HTML | HTML 语法

### 合法元素

- Element： \<tagname>...\</tagname>

- Text：text
- Comment：\<!-- comments -->
- Document Type：\<Doctype html>
- ProcessingInstruction：\<? a 1?>，其中 a 是处理器名称，空格后跟数据，PHP 模板语法有点类似，线上的 HTML 中理论上不应该出现这种语法
- CDATA：\<![CDATA[ ]]，产生文本节点，但其中的文本不需要转义

### 合法属性

### 字符引用

- \&#161;
- \&amp; \&lt; \&quot;



## 浏览器 API | DOM API

BOM 只是一组很小的 API。

DOM API 包含四部分：Traversal API（基本废弃）、节点 API、事件 API、Range API（难用但强大）。

### 节点 API

![image-20210123214546733](http://static.gmaso.cn/blog/2021/01/23/21/e244256d05b60806e0fdbf73c77869f4-b703ed-image-20210123214546733.png?imageslim)

DOM 树上的都是节点，但节点和元素需要区分。

节点的基类是 Node。

元素是 Node 的子类，Element 中还区分了 namespace，分 HTMLElement、SVGElement、MathMLElement 三类。



#### 导航内操作

分为节点系列和元素系列。

![image-20210123215228698](http://static.gmaso.cn/blog/2021/01/23/21/228fcab1532ef2fa9b96602f5ae715ff-ed1f01-image-20210123215228698.png?imageslim)

#### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

API 设计最小化的原则，所以没有 insertAfter。API 设计的原则也在不断变化。

#### 高级操作

- compareDocumentPosition：一个用于比较两个节点关系的函数，得到前后关系
- contains：检查一个节点是否包含另一个节点的函数
- isEqualNode：检查两个节点是否完全相同
- isSameNode：检查两个节点是否统一个节点，在 JavaScript 中可以用 === 替代
- cloneNode：复制一个节点，如果传入 true，会连同子元素一起做深拷贝



## 浏览器 API | 事件 API

target.addEventListener(type, listener [, options])

target.addEventListener(type, listener [, useCapture])

options 中包含：once、passive（是否会产生副作用，对高频操作可以提升性能，移动端会默认设为 false）、useCapture（默认为冒泡）

### 事件模型

捕获阶段、冒泡阶段。不管是否添加了事件处理函数，都会发生捕获和冒泡。



## 浏览器 API | Range API

可以操作半个节点，精确操作，非常强大，**微操手术能手**。DOM API 的最高等级。

##### 问题：把一个元素所有的子元素逆序



### Range API

```javascript
// 手工指定 range 的起始
var range = new Range();
range.setStart(element, 2);
range.setEnd(element, 9);
// 从选区新建 range。由于浏览器只支持一个选区，都取 getRangeAt(0) 就行
var range = document.getSelection().getRangeAt(0);
```

其它 API：

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents
- vvar fragment = range.exectContents()：把选中元素从 DOM 树上取下，Range 的 **删**
- range.insertNode(element)：往选区插入节点，Range 的 **增**



当用 Range API 去除半个标签后，会自动补上缺失的闭标签部分。



## 浏览器 API | CSSOM

对 CSS 文档的抽象。CSSOM 基本对应 CSS 语法，类似地，DOM 基本对应 HTML 语法。

通过 document.styleSheets 访问。

```
document.styleSheets[0].cssRules
document.styleSheets[0].insertRule("p { color: pink; }", 0)
document.styleSheets[0].removeRule(0)
```

window.getComputedStyle(ele, pseudoEle);



## 浏览器 API | CSSOM View

获取元素渲染后的  CSS 属性。与 CSS 语言关系已经不大，而是和浏览器相关。

window 对象：innerHeight、innerWidth、outerHeight、outerWidth、devicePixelRatio、screen（width、height、availWidth、availHeight）、open、moveTo、moveBy、resizeTo、resizeBy、scrollX、scrollY、scroll(x, y)、scrollBy(x, y)

element 对象：scrollTop、scrollLeft、scrollWidth、scrollHeight、scroll(x, y)、scrollBy(x, y)、scrollIntoView()、

​	**getClientRects()**：元素生成的所有盒，一个元素可能生成多个盒，伪元素也会参与盒生成过程（但不能被鼠标选中）

​	**getBoundingClientRect()**：包含所有盒的矩形



## 浏览器 API | 其它 API

主要来源于四个组织：

- khronos：openGL、WebGL
- ECMA：ECMAScript
- WHATWG：HTML
- W3C：webaudio、animation、IG/CG/WG（兴趣组/社区组/工作组）

#### 作业与实验：浏览器全部 API 的分类与整理
见 [apis.html](apis.html)

整理心得：
- 发现 window 下的属性来自很多不同的组织、不同的规范
- 规范的状态也有所不同，如 Recommendation、Proposed Recommendation、Working Draft、Editor's Draft、Unoffical Draft 等
- 有些规范已经较长事件没更新，可能不会称为正式标准
- 有些属性已经废弃，由于兼容性或时间原因，还保留在 window 中
- 规范中有些属性，浏览器还没有实现，尤其是比较早期的规范
- 浏览器已经添加了很多很多的接口 API，如支付、地理位置、投影、蓝牙、语音、XR 等，但还没有被充分发挥
- 碰到不了解的属性，应该首先查询 MDN，了解属性来源于什么规范、解决什么问题、当前状态
- HTML Live Standard 包含好多东西，而且 DOM 结构好复杂，好难用 js 提取，单页打开搜索又太卡，哈哈😂
- 大部分 W3C 相关的标准，可以参看目录最后的 IDL Index 子目录，里面包含接口和方法的定义