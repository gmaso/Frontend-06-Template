## 语句块

代码见 toy-js-10

语句块看起来很简单，用 Block。

##### break 处理

为了指定代码的执行状态，每个语句都需要返回状态，部分还需要 label。需要三元组：返回类型、返回值、label。

##### 完成记录类型

Completion Record：内部数据类型，有 type、value、target 三个字段。

用于返回值和控制流执行（break、continue、return 和 throw）。

每个 Statement 语句执行都需要返回 Completion Record。

添加 break 和 continue 语句。

break 能打断语句块中后续语句的执行。

在 while 中就会判断内部语句的执行状态，判断执行流程。

## 作用域

代码见 toy-js-11

要处理函数必须要有作用域。

在之前的标准中，用 scope chain 表示运行时的作用域对象，与 scope 代表的语义上的代码作用范围有歧义。在新标准中，用 environment 来表示运行时的作用域对象。

在 toy-js 中添加 EnvironmentRecord 对象来表示。

改造 evaluator 中的 ecs 对象。

改造 reference 对象。



#### block 作用域

切换 EnvironmentRecord ，才能切换作用域。

往 ecs 中压入一个新的 ExecutionContext。

在每个 block 的前部压入新的 ExecutionContext，执行完代码后弹出，然后返回执行结构。



## 函数声明和调用

函数要区分声明函数和调用函数两个不同阶段。FunctionDelaration 和 CallExpression 两个语法。

在全局对象中添加 log 对象，方便打印参数。

完善 CallExpression 的 Arguments 语法定义和运行时。

#### 定义

完善 FunctionDeclaration 的语法和运行时。

主要处理 Identifier 和 StatementList 部分。

新建 JSObject 保存 function，并添加到词法作用域中。

#### 处理函数作用域问题

函数变量需要保存函数定义时的值。词法作用域。

用 func.enviroment 保存词法作用域，旧标准对应 func.[[scope]]。执行时，先从 environment 新建上下文，并切换到此上下文执行，完成后弹出。

##### module

由于 module 需要引擎外部文件系统的支持，不能用 toy-js 实现。



