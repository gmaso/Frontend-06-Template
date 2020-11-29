# 第五周学习笔记

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

