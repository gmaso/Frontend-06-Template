# 语法树



## 构建语法树

基于 token 构建语法树，语法树做精简后得到 AST。以应用为主，会简化。

社区里语法分析较多使用 **LL 风格**，代码与 BNF 一致。以下采用 **LR 风格**。

首先改造 BNF 为 JavaScript 表示。

```javascript
let syntax = {
    Program: [
        ['StatementList']
    ],
    StatementList: [
        ['Statement'], 
        ['StatementList', 'Statement']
    ],
    Statement: [
        ['ExpressionStatement'],
        ['IfStatement'],
        ['VairableDelaration'],
        ['FunctionDelaration']
    ],
    ExpressionStatement: [
        ['Expression', ';'],
    ],
    Expression: [
        ['AdditiveExpression'],
    ],
    IfStatement: [
        ['if', '(', 'Expression', ')', 'Statement']
    ],
    VariableDeclaration: [
        ['var', 'Identifier', ';']
    ],
    FunctionDeclaration: [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}']
    ],
    AdditiveExpression: [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression']
        ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ],
    MultiplicativeExpression: [
        ['PrimaryExpression'],
        ['MultiplicativeExpression', '*', 'PrimaryExpression']
        ['MultiplicativeExpression', '/', 'PrimaryExpression']
    ],
    PrimaryExpression: [
        ['(', 'Expression', ')'],
        ['Literal'],
        ['Identifier']
    ],
    Literal: [
        ['Number']
    ],
}
```

思考：当前能够接受的 token 是什么？需要通过规则展开，使用 BFS，查找允许的终结符，称为**求 closure**。

代码实现见 toy-js-02。

把词法分析器的 terminal symbol 输入语法分析器中，进行规则匹配，当匹配到规则末尾的时候进行 **reduce**，合成 no-terminal symbol，同时存储 children。通过递归 reduce，最终就能得到一颗语法树。语法树中

注意：syntax 规则一定要定义完成，否则会导致 unexpected token 报错。（var 声明规则少定义了个分号，调试了 1 个多小时😂）。

步骤：

1. 编写 syntax 规则
2. 根据规则求 closure，得到状态转移规则
3. 逐个处理词法解析得到的 symbol，规则匹配则进入对应的状态，到达规则末尾后进行 reduce，生成 non-terminal symbol
4. 逐级 reduce 后，得到语法树



## 执行语法树

ECMA-262 标准：

A.2 Expressions 最复杂的部分，级联定义。语法定义的结构就决定了优先级问题。

A.3 Statements

A.4 Functions and Classes

A.5 Scripts and Modules

代码见 toy-js-03。

从语法树的根开始，分别处理。

对于变量声明，需要有个地方存储变量，由此引出了运行时的相关问题，如 EnvironmentRecord 用于存储变量。

## 运行时

#### 运行时中定义的 Number 类型

IEEE754 双精度浮点数表示法。1 符号位 + 11 指数位 + 52 精度位。指数位为指数 + 1024，避免小数需要用负号表示。52位前还有个默认的1隐藏。

对于高精度的场景，不要用浮点数进行运算。

#### String 类型

字符集、码点（code point）、字形、字体。

字符集：ASCII、Unicode、UCS（大概相当于 Unicode 2.0，码点与编码统一，固定2个字节）、GB、ISO-8859（欧洲的一批字符集标准）、BIG5

JavaScript 选择了 Unicode 字符集。

编码（计算机保存码点的方式）：UTF-8（变长存储，需要有控制位）、UTF-16（晚于 UCS，规定了超出 2个字节时的控制位，前两个字节用 110110 开头，后连个用 110111 开头，有效位数最多 20位）

JavaScript 在内存中采用 UTF-16 进行存储，String 也是用 UTF-16 存储的 。char 系列 API 其实是针对 UTF-16 资源的。

codePoint 系列的 API 用于处理超出基本平面的字符处理。

## JavaScript 语义处理

代码见 toy-js-04

#### 数值字面量的处理

通过对语法树的执行，把语法分析中的数值转化成运行时的数字，也就是语义。

语法、语义、运行时。

#### 字符串字面量的处理

需要处理转义、\u 等情况。

#### 对象

对象是符合人类直觉的对世界的认知。

 对象的三要素：Identifier、State、Behavior

唯一标识：JavaScript 中对象的内存地址作为唯一标识

状态：用状态来描述对象

行为；状态的改变

##### Object——Class

常用类来描述对象。

归类流派：多继承，如 C++

分类流派：单继承结构，有一个基类 Object

##### Object——Prototype

原型是一种更接近人类原始认知的描述对象的方法。并不做严谨的分类，而是采用“相似”这样的方式来描述对象。任何对象仅仅需要描述自己与原型的区别即可。

Nihilo：Null 对象

JavaScript 使用引用型的原型。运行中修改后会影响所有修改对象。

优先使用 class，替代 new 方式。

#### JavaScript 对象

JavaScript 运行时中，原生对象只需要关心 property 和 prototype 即可。

property：key-value 键值对，分数据属性或访问器属性 getter/setter

prototype：原型链，属性访问时生效

##### Object API/Grammer 四组

- {} . [] Object.defineProperty
- Object.create / Object.setPrototypeOf / Object.getPrototypeOf
- new / class / extends
- new / function prototype

##### Function Object

函数有一个 [[call]] 行为。

JavaScript 中很多对象都有特殊的行为。

##### Host Object

宿主环境提供的对象。

## 为 toy-js 添加对象类型

代码见 toy-js-05

套路：先理解运行时的样子，再添加语法，再语义解析。

## 执行上下文 ExecutionContext

代码见 toy-js-06

词法环境 LexicalEnvirontment

realm：保存 global、Object、Object 的 prototype

VariableEnvironment：大部分情况下与 LexicalEnvironment 相同

#### Reference 类型

用于保存变量的对象和值，JavaScript 运行时中真实存在的数据类型，不能直接访问到。

#### 增加支持赋值

通过在当前 EC 中的 LexicalEnvironment 中保存 Reference 对象来存储变量和值，赋值时修改此对象。

## 表达式和运算

代码见 toy-js-07

四则运算和 member 调用、function call、new

语法规则添加时优先级低的在前面。

new 运算优先级很复杂

根据 ECMA-262 语法精简来实现，修改添加语法规则。

#### 为便于代码管理，拆分文件

见 toy-js-08

Realm 等类拆分到单独文件 runtime.js 中

Evaluator 通常就是 JavaScript 的一个实例。

增加 and、or、call、member 等的解析

## 语句

代码见 toy-js-09

表达式和语句搭配，基本就能达到图灵完备，能表达所有逻辑。函数、对象不是必备的，但现代语言基本都有。

三种逻辑结构：顺序、分支、循环。

处理三种语句包含：if、while、JavaScript 中的特殊语句

#### IfStatement

语句块的 “{” 会与对象的语法冲突，之后处理。

取值到 Reference 时需要解应用

待调试

#### 类型转换

为处理 IfStatement 条件判断，必须要有类型转换。

为每个类型新建类，在类上添加相关的类型获取和转换规则。

##### while 逻辑

更 IfStatement 逻辑很类似。加减法执行代码少写了个 type，调好一会儿。

