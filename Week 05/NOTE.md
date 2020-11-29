# 第五周学习笔记

## 作业代码
### 1. [Reactive 实现原理（一）](./proxy_01.html)
### 2. [Reactive 实现原理（二）](./proxy_02.html)
   
   问题：由于每次操作都会触发所有 callbacks 的调用，导致性能问题和多余的操作。
### 3. [Reactive 实现原理（三）](./proxy_03_b.html)

   优化上一步中的性能问题。实现只在对应的对象和属性上，才触发 callback。
   
   建立 reactive 和 effect 中间的连接。通过调用 callback 函数，然后在代理对象上监控到访问，从而建立对象属性和 callback 的关系。

一、 实现一

使用 callbacks.set(reactivity, callback) 保存依赖，reactivity 结构为 [obj, prop]。

存在问题：
1. 使用 reactivity 做为键值保存回调，触发时需要循环所有元素判断对象和属性，性能差。
2. 回调直接保存为 callback，只能有一个回调。


二、 实现二

使用对象和属性分层保存依赖，且把回调保存为数组。

### 4. [优化 reactive](./proxy_04.html)
处理嵌套的对象。

技巧：使用一个全局 Map 对象来存储所有 proxy 的实例，以目标对象作为键值，既是缓存，也防止生成重复代理。

### 5. [reactivity 响应式对象](./proxy_05.html)
reactivity 提供半成品的双向绑定，负责数据到 DOM 的监听。

技巧：**把 effect 拆开写**。把依赖对象和属性的每个改变，放入单独的 effect 中，可以减少数据改变时的 DOM 操作。
```JavaScript
// good 每个数据的改变，只会触发相应的 DOM 操作
effect(() => {
  document.getElementById('r').value = po.r;
});
effect(() => {
  document.getElementById('g').value = po.g;
});
effect(() => {
  document.getElementById('b').value = po.b;
});
effect(() => {
  document.getElementById('color').style.backgroundColor = `rgb(${po.r},${po.g},${po.b})`;
});

// bad 任何数据的改变，都会触发所有的 DOM 操作
effect(() => {
  document.getElementById('r').value = po.r;
  document.getElementById('g').value = po.g;
  document.getElementById('b').value = po.b;
  document.getElementById('color').style.backgroundColor = `rgb(${po.r},${po.g},${po.b})`;
});

```

### 6. [使用 Range 实现 DOM 精确操作 | 基本拖拽](./range_01.html)
实现任意位置的拖拽。

重点：mousemove 时间必须添加到 document 上。

### 7. [使用 Range 实现 DOM 精确操作 | 精确拖拽](./range_02.html)
实现插入正常流排版的拖拽。认识 DOM API Range 与 CSSOM 的应用。

由于文字没有分节点，必须要使用 range 产生可以插入的空位。然后判断与鼠标位置最近的 range，把滑块放入该 range。

---
## 20201127 Proxy 与 Reflect
### 介绍
代理与反射是 ES6 新增的能力，可以让开发者拦截并向基本操作嵌入额外行为。

具体使用是用一个代理对象关联目标对象，然后在之后就可以把这个代理对象作为抽象的目标对象来使用。在对目标对象进行任何操作前，都可以在代理对象上进行控制。直接操作目标对象时不受控制。

代理的问题：Proxy 是一种新的基础性语言能力，没法转译成 ES5 的代码，因为 Proxy 的行为没有可以替代的，也就是说没法 polyfill。所以，Proxy 只能在百分百支持的平台上使用。

### 基础
代理是目标对象的抽象。

代理使用 Proxy 构造函数创建，必须接收两个参数：目标对象和处理程序对象。缺少任一个会抛出 TypeError。
```JavaScript
const target = {
  id: 'target'
}
const proxy = new Proxy(target, {})
```
处理程序对象为空对象时，对代理的所有操作都会畅通无阻地作用到目标对象上。

代理有点类似防火墙，把目标对象包裹在里边，任何进出防火墙的操作都会受到监控，也可以加以控制。

Proxy.prototype 是 undefined，所以不能用 instanceof 操作符。
```JavaScript
console.log(proxy instanceof Proxy);
// TypeError: Function has non-object prototype 'undefined' in instanceof check;
```

## 20201129
学习 《JavaScript 高级程序设计》 4e 第 9 章：代理与反射

### 捕获器
使用代理的主要目的是可以定义**捕获器（trap）**。捕获器就是处理程序对象中的元素，是“基本操作的拦截器”。每次在代理对象上调用基本操作时，都会先调用对应的捕获器函数，然后再作用到目标对象上。
> 捕获器是从操作系统中借用的概念，表示程序流中的一个同步中断，可以暂停程序流，转而执行一段子例程，之后再返回原始程序流。

### 反射
所有可以捕获的方法都有对应的**反射（Reflect）API** 方法。这些方法与捕获器拦截的方法具有相同的名称和函数签名，而且也具有与被拦截方法相同的行为。

通过 Reflect 对象可以轻松编写捕获器，不用完全手写。
```JavaScript
// 代理 get
const proxy = new Proxy(target, {
  get() {
    return Reflect.get(...arguments);
  }
});

// 代理 get 简写
const proxy = new Proxy(target, {
  get: Reflect.get
});

// 空代理
const proxy = new Proxy(target, Reflect);
```
反射 API 为开发者准备好了样本代码，在此基础上可以用最少的代码修改捕获的方法行为。
```JavaScript
// 修改 get 返回值
const proxy = new Proxy(target, {
  get(trapTarget, property, receiver) {
    let decoration = '';
    if (property === 'foo') {
      decoration = '!!!';
    }
    return Reflect.get(...arguments) + decoration;
  }
});
```

### 捕获器不变式（trap invariant）
捕获器几乎可以改变所有基本方法的行为，但也有限制。ECMAScript 规范规定捕获器的行为必须遵循“捕获器不变式”。捕获器不变式因捕获的方法不同而异，通常防止捕获器定义出现过于反常的行为。

比如，目标对象有一个不可配置且不可写的数据属性，那么捕获器返回一个与该属性不同的值时，就会抛出 TypeError：
```JavaScript
const target = {};
Object.defineProperty(target, 'foo', {
  configurable: false,
  writable: false,
  value: 'bar'
});

const proxy = new Proxy(target, {
  get() {
    return 'qux';
  }
});

console.log(proxy.foo);
// Uncaught TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'bar' but got 'qux')
```

### 撤销代理
使用 new Proxy() 创建的普通代理，会在代理对象的生命周期内一直持续存在。

Proxy 也暴露了 revocable() 方法，可以支持撤销代理对象与目标对象间的关联。撤销操作不可逆。撤销操作也是幂等的，调用多少次结果都一样。

撤销操作后，再调用代理会抛出 TypeError。

撤销函数与代理对象再实例化时同时生成。

```JavaScript
const { proxy, revoke } = Proxy.revocable(target, {});

revoke();

proxy.foo; // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

### 使用反射 API
某些情况下应该优先使用反射 API。
1. 反射 API 与对象 API

   大多数反射 API 方法在 Object 类型上都有对应的方法。通常，Object 上的方法适用于通用程序，Reflect 上的方法适用于细粒度的对象控制与操作（高阶技能😀）。
2. 状态标记

   很多反射方法返回布尔值，表示执行的操作是否成功。有时候，这比那些返回修改后的对象或者抛出错误的反射方法更有用。
3. 用一等函数替代操作符

   以下反射方法提供只用通过操作符才能完成的操作：
   - Reflect.get()：替代对象访问操作符
   - Reflect.set()：替代 = 赋值操作符
   - Reflect.has()：替代 in 操作符或 with()
   - Reflect.deleteProperty()：替代 delete 操作符
   - Reflect.construct()：替代 new 操作符
4. 安全地应用函数

   有时候，为了避免调用的函数行为被修改，可以使用反射方法。反射方法就像是**百分百原版的纯净的方法**，不会被用户修改。
  ```JavaScript
  Function.prototype.apply.call(myFunc, thisVal, argumentsList);
  // 可修改为
  Reflect.apply(myFunc, thisVal, argumentsList);
  ```
### 代理另一个代理
代理的目标对象也可以是一个代理对象。套娃。

### 代理的问题与不足
作为在 ECMAScript 现有基础之上构建起来的一套新 API，代理其实已经尽力做到最好了。（**又要兼容旧规范，又要引入新特性，真的太难了😂**）很大程度上，代理作为对象的虚拟层可以正常使用。但某些情况下，也不能与现有的 ECMAScript 机制很好地协同。
1. 代理中的 this
2. 代理与内部槽位

### 代理捕获器与反射方法
捕获器可以捕获 13 种不同的基本操作，各自有不同的反射 API 方法、参数、关联的 ECMAScript 操作和不变式。
1. get(target, property, receiver)
2. set(target, property, value, receiver)
3. has(target, property)
4. defineProperty(target, property, descriptor)
5. getOwnPropertyDescriptor(target, property)
6. deleteProperty(target, property)
7. ownKeys(target)
8. getPrototypeOf(target)
9. setPortotypeOf(target, prototype)
10. isExtensible(target)
11. preventExtensions(target)
12. apply(target, thisArg, ...argumentsList)
13. construct(target, argumentsList, newTarget)

## 代理模式
使用代理可以在代码中实现一些有用的编程模式。

1. 跟踪属性访问：捕获 get、set、has 等操作，跟踪属性什么时候被访问、被查询。
2. 隐藏属性：捕获 get、has 操作，隐藏目标对象上的属性。
3. 属性验证：捕获 set 操作，根据赋的值，决定是否允许赋值。
4. 函数与构造函数参数验证：捕获 apply、construct 操作，判断函数调用和实例化时的参数。
5. 数据绑定与可观察对象：通过代理可以把运行时中原本不相干的部分联系到一起。这样就可以实现各种模式，让不同的代码互操作。（**实现依赖的收集与分派。**）

## 代理小结
代理是 ES6 新增的令人兴奋和动态十足的新特性，尽管不支持向后兼容，但它开辟了一片前所未有的 JavaScript 元编程及抽象的新天地。

代理是真实 JavaScript 对象的透明抽象层，可以定义捕获器来拦截和操作对象的绝大部分基本操作和方法，前提是遵循捕获器不变式。

反射 API 封装了一整套与捕获器拦截的操作相应的方法。可以把反射 API 方法看作一套基本操作，这些操作是绝大部分 JavaScript 对象 API 的基础。

代理的应用场景是不可限量的。Vue 3.0 响应式的基础就是代理。

代理提供了对 ECMAScript 语言本身行为的修改，元编程🐂。

---
## DOM 和 CSSOM
浏览器渲染页面需要先构建 DOM 树和 CSSOM 树。

CSSOM是一组允许 JavaScript 操作 CSS 的 API。它很像 DOM，但是用于 CSS 而不是 HTML。它允许用户动态地读取和修改 CSS 样式。

HTML 标记转换成文档对象模型（DOM）；CSS 标记转换成 CSS 对象模型（CSSOM）。DOM 和 CSSOM 是独立的数据结构。

浏览器解析网页的步骤：字节 → 字符 → token → 节点 → 对象模型。

![DOM 解析流程](./full-process.png)
1. 转换：浏览器读取 HTML 原始直接，根据指定编码转换成字符。
2. 令牌化：将字符串转换成 W3C HTML5 标准规定的各种令牌，如 “<html>”、“<body>”，以及尖括号内的字符串。每个令牌都具有特殊含义和一组规则。
3. 词法分析：令牌转换成定义其属性和规则的节点对象。
4. DOM 构建：把创建的对象链接在一个树数据结构内。


![CSSOM 解析流程](./cssom-construction.png)
```CSS
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```
![CSSOM 树结构](./cssom-tree.png)
为页面上任何对象计算样式时，都会从该对象所属树的根节点开始，向下级联样式。

## 渲染树
DOM 和 CSSOM 是独立的数据结构，如何作用到屏幕上？

CSSOM 树和 DOM 树合并成**渲染树**，用于计算每个可见元素的**布局**，并输出给**绘制**流程，然后将像素渲染到屏幕上。

![渲染树结构](./render-tree-construction.png)

### 构建渲染树
1. 从 DOM 树的根节点开始遍历每个可见节点。
   - 某些节点不可见（如脚本标记、原标记等），不会体现在渲染输出中，会被忽略。
   - 某些节点通过 CSS 隐藏，也会被忽略。
1. 对于每个可见节点，为其找到适配的 CSSOM 规则并应用他们。
1. 输出此可见节点，包含内容和样式。

### 布局
计算节点在设备视口内的确切位置和大小 -- 这就是“布局”阶段，也称为“自动重排（auto Reflow）”。

布局阶段的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸；所有相对测量值都转换为屏幕上的绝对像素。

### 绘制
将上一步中的信息绘制到屏幕上，也称为“栅格化”。

## 简要概述浏览器渲染的步骤：
1. 处理 HTML 标记并构建 DOM 树。
1. 处理 CSS 标记并构建 CSSOM 树。
1. 将 DOM 与 CSSOM 合并成一个渲染树。
1. 根据渲染树来布局，以计算每个节点的几何信息。
1. 将各个节点绘制到屏幕上。

优化关键渲染路径就是指最大限度缩短执行上述第 1 步至第 5 步耗费的总时间。

- [1] [渲染树构建、布局及绘制 | Google](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)

## CSS 选择器匹配方向
CSS 选择器是从右到左匹配的，为什么？
如果采用从左至右的方式读取 CSS 规则，那么大多数规则读到最后（最右）才会发现是不匹配的，这样会做费时耗能，很多无用功；而如果采取从右向左的方式，那么只要发现最右边选择器不匹配，就可以直接舍弃了，避免了许多无效匹配，性能大大提升。