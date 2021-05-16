[toc]

# 第七周学习笔记

## JavaScript 表达式 | 运算符和表达式

表达式属于构造 JavaScript 语言的 Expression 层级。分为 语法 和 运行时 分别讲解。

**Grammar**

- Grammar Tree vs Priority

  运算符优先级会影响语法树的构造。

- Left hand side & Right hand side

**Runtime**

- Type Convertion
- Reference



##### 一、运算符优先级最高

Member Expression

- a.b
- a[b]
- foo`` ` ``string`` ` ``
- super.b
- suber['b']
- new.target
- new Foo()

New

- new Foo

  new a()()：优先级为 new a()，然后是后一个括号

  new new a()：优先级为 new a()，然后和第一个 new

##### Reference 引用类型（运行时中的）

JavaScript 中属性取出来的不是值，而是一个 Reference 类型（标准中的类型，不在语言中），包含 Object 和 Key 前后两部分，完全记录了 member 运算的前半部分和后半部分。是一个运行时设施。

当进行普通的加法或减法运算时，会把 Reference 类型解引用，像普通变量一样使用。但 delete 和 assign 会用到 Reference 类型，必须知道要处理的对象和属性。

```javascript
delete obj.a;
obj.b = 5;
```

**JavaScript 语言就是用引用类型在运行时来处理删除或者赋值这样的写相关的操作的。**



##### 二、第二优先级

Call Expression

- foo()
- super()
- foo()['b']
- foo().b
- foo()`` ` ``abc`` ` ``

优先级低于 new，也低于 member expression。在调用的括号之后加上取属性，优先级会降级到 call expression，后边的点运算符优先级降级了。

语法结构能够表达的内容是要多于运算符优先级所能表达的，所以用优先级内解释运算符不是非常严谨的，真正严谨的是用产生式一级一级的语法结构来描述运算的优先顺序。

```javascript
new a()['b']
```

**Left Handside & Right Handside**

只有 Left Handside Expression 才有资格放到等号的左边。比如 a.b 是左手表达式，a + b 是右手表达式。不是左手表达式，就一定是右手表达式。JavaScript 中，左手表达式一定是右手表达式。

##### 三、第三优先级 从高到底

从这一级开始就是 Right Handside Expression，不能放到等号左边。

**Update Expression**

- a++
- a --
- -- a
- ++ a

++a++、++(a++) 不合法

**Unary Expression 单目运算符**

- delete a.b
- void foo() void 把不管后面的什么东西都编程 undefined，类似空白，起到改变语法结构的作用
- typeof a
- \+ a
- \- a
- \~ a 整数按位取反
- !a
- await a

**Exponental 乘方**

- ** JavaScript 中唯一右结合的运算符

**Multiplicative**

* \*	/	%

**Additive**

- \+ -

**Shift**

- <<	>>	>>>

**Relationship**

- <	>	<=	>= instanceof	in

**Equality**

- ==	!=	===	!==

**Bitwise**

- &	^	|

**Logical**

- &&	||	短路运算

**Conditional**

- ？：	唯一的三目运算符，短路运算



## JavaScript | 类型转换

根据要进行的运算进行类型转换。

- ==	类型转换规则很复制，基本是同类型直接比较，不同类型转换成 Number。推荐先类型转换后再比较，或使用 ===。
- \+

类型转换和 == 比较是两个**分开的体系**，能相互转换不代表用 == 比较会相等。 

![image-20201213130140979](http://static.gmaso.cn/blog/2020/12/13/13/d06e9c35e98a44847befba2f6c61dfc2-eed2bc-image-20201213130140979.png?imageslim)



**Boxing & Unboxing 装箱转换和拆箱转换**

装箱转换：把 Number、String、Boolean、Symbol 用包装类转换成对象。null 和 undefined 没有包装类，不能转换成对象。基本类型的变量调用属性时会进行装箱转换。

​	Symbol('a') 不能用 new 调用，会报错。

拆箱转换：把 Object 转成基本类型时的操作。

- toPremitive 过程，主要是依赖对象三定义的下面三个方法
- toString vs valueOf 会根据不同的转换决定优先调用哪个。加法优先调用 valueOf，作为属性名优先调用 toString。每个表达式都有一定的类型转换的机制。
- Symbol.toPremitive 会最先调用，忽略 toString 和 valueOf



## JavaScript 语句 | 运行时相关概念

构造 JavaScript 语言的 Statement 层级。语句用于控制流程，确定执行顺序。

Grammar

- 简单语句
- 复合语句
- 声明（也可归类为语句的一种）

Runtime

- Completion Record
- Lexical Environment



**Completion Record**

用于记录语句完成状态的运行时类型，不在 JavaScript 语言的类型中。包含以下字段：

- [[type]]：normal、break、continue、return、or throw
- [[value]]：基本类型，返回值
- [[target]]：label，break 或 continue 可以指定的跳转到位置

Completion Record 决定了语句的执行流程，是继续还是停止。不同的语句都会使用 Completion Record 来实现流程的控制。



## JavaScript 语句 | 简单语句和复合语句

**简单语句**

- ExpressionStatement
- EmptyStatement
- DebuggerStatement
- ThrowStatement
- ContinueStatement
- BreakStatement
- ReturnStatement

**复合语句**

- BlockStatement    大括号

- IfStatement

- SwitchStatement    不建议使用，不像 C/C++ 中有性能加成

- IterationStatement    包含 while、do ... while、for 家族

  for 语句中的 let/const 声明（for 循环不能使用 const，迭代重新赋值会报错；for in 等可以使用 const，每次迭代会重新生成变量）会产生单独作用域，与大括号中的作用域不同，在外层。

  for 循环的结构里面，大部分不允许 in 操作符出现。❓

- WithStatement    不确定性高，不建议是使用

- LabelledStatement    在任何语句前添加 label 和冒号，主要配合 IterationStatement 使用，可以一次跳出多层循环。

- TryStatement    大括号不是表示块语句，是 try 语法必须的。catch 后的变量会自动赋值为 try 中抛出的值。finally 中的语句一定会执行，不受 return 影响。

## JavaScript 语句 | 声明

概念上的声明：对后续的语句发生作用的语句。

- FunctionDeclaration
- GeneratorDeclaration
- AsyncFunctionDeclaration
- AsyncGeneratorDeclaration
- VariableStatement    var 语句
- ClassDeclaration
- LexicalDeclaration    let/const

函数提升，变量提升，暂时性死区

由于老一代 function/var 声明的行为历史包袱，鼓励使用 class、let、const 新一代声明风格的代码。



**预处理（pre-process）**

导致 var 变量提升到函数级别。也导致 let/const 的暂时性死区。

所有的变量声明都有预处理机制。



**作用域**

作用域链概念来自 ES3.0，已经基本不用了。

var、function 的作用域为函数级，前后都有效。

let/const 的作用域是大括号范围内。可以通过在语句中用大括号配合 class/let/const 来生成多个作用域，避免变量冲突，代码结构也更清晰。



## JavaScript 结构化 | 宏任务和微任务

JavaScript的执行粒度（运行时）：宏任务、微任务（Promise）、函数调用（Execution Context）、语句/声明（Completion Record）、表达式（Reference）、直接量/变量/this...



JavaScript 引擎是类似静态库的形式，代码被传递给 JavaScript 引擎。

**MicroTask（Job）vs MacroTask**

![image-20201213200848495](http://static.gmaso.cn/blog/2020/12/13/20/70eabe62b4a6eb31e733be04aaf0910b-ceffee-image-20201213200848495.png?imageslim)

**事件循环 event loop**

获取代码 -》执行代码 -》等待（等待时间、事件或者锁）。不属于 JavaScript 语言本身的内容。



## JavaScript 结构化 | 函数调用

函数调用形成 Execution Context Stack。每个 Execution Context （执行上下文）保存执行语句需要的全部信息。当前的称为 Running Execution Context。

**Execution Context**

可能包含七个字段：code evalution state、Function、Script or Module、Generator（只有 Generator 函数创建的上下文才有）、Realm（所有的内置对象）、LexicalEnvironment、VariableEnvironment

**LexicalEnvironment**

- this
- new.target
- super
- 变量

**VariableEnvironment**

专门用于处理 var 声明的，eval 中的 var 声明到 VariableEnvironment 中。是个历史遗留问题。

**Environment Record**

LexicalEnvironment 和 VariableEnvironment 的保存结构。基类是 Environment Record，有三个子类：

- Declaration Environment Record：主要的，包含 Function  Environment Record、module  Environment Record
- Global Environment Record：给全局用
- Object Environment Record：给 with 用

**Function Closure**

每一个函数都会生成一个闭包。包含两个部分：代码部分和环境部分（Environment Record）。

**不管函数被哪里使用，都会带上定义时的 Environment Record。**

**Realm**

标准中定义的用于存储 JavaScript 引擎实例的所有内置对象的结构。不同的 Realm 实例是完全独立的。使用一个 Realm 中的原型去判断另一个 Realm 中的对象，instanceof 会失效。

Realm 会根据外部的条件去创建实例，比如 iframe。