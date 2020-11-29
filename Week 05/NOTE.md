# 第五周学习笔记

## 作业代码
### [Reactive 实现原理（一）](./proxy_01.html)
### [Reactive 实现原理（二）](./proxy_02.html)
   
   问题：由于每次操作都会触发所有 callbacks 的调用，导致性能问题和多余的操作。
### [Reactive 实现原理（三）](./proxy_03_b.html)

   优化上一步中的性能问题。实现只在对应的对象和属性上，才触发 callback。
   
   建立 reactive 和 effect 中间的连接。通过调用 callback 函数，然后在代理对象上监控到访问，从而建立对象属性和 callback 的关系。

一、 实现一

使用 callbacks.set(reactivity, callback) 保存依赖，reactivity 结构为 [obj, prop]。

存在问题：
1. 使用 reactivity 做为键值保存回调，触发时需要循环所有元素判断对象和属性，性能差。
2. 回调直接保存为 callback，只能有一个回调。


一、 实现二

使用对象和属性分层保存依赖，且把回调保存为数组。

### [优化 reactive](./proxy_04.html)
处理嵌套的对象。

技巧：使用一个全局 Map 对象来存储所有 proxy 的实例，以目标对象作为键值，既是缓存，也防止生成重复代理。

### [reactivity 响应式对象](./proxy_05.html)
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

## 小结
代理是 ES6 新增的令人兴奋和动态十足的新特性，尽管不支持向后兼容，但它开辟了一片前所未有的 JavaScript 元编程及抽象的新天地。

代理是真实 JavaScript 对象的透明抽象层，可以定义捕获器来拦截和操作对象的绝大部分基本操作和方法，前提是遵循捕获器不变式。

反射 API 封装了一整套与捕获器拦截的操作相应的方法。可以把反射 API 方法看作一套基本操作，这些操作是绝大部分 JavaScript 对象 API 的基础。

代理的应用场景是不可限量的。Vue 3.0 响应式的基础就是代理。

代理提供了对 ECMAScript 语言本身行为的修改，元编程🐂。