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

