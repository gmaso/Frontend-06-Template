# 第三周学习笔记

## 20201108 [AST 词法解析](./tokenize.html)
### LL 算法
代码分析的步骤： 分词 -》 构建 AST（抽象语法树） -》 解析 -》 执行

构建 AST 的过程被称为语法分析，最著名的是 LL 算法和 LR 算法。

Left Left 算法，代表从左到右扫描，从左到右规约。

### 四则运算的 AST 构建
1. 词法定义

    允许的元素：数字（0-9，小数点），操作符（*/+-），空格，结束符

2. 语法定义
  由于乘除的优先级问题，需要用 JavaScript 的产生式来定义嵌套结构：
  - 加法认为是由左右两个乘法组成，还能连加；
  - 单独的数字认为是特殊的只有一项乘法；
  - 只有乘号（除号）的认为是特殊的只有一项加法；



### 具体代码实现
使用正则解析四则运算的字符串，获取到单个 token 和对应的类型。

难点：第一课里面的 JavaScript 产生式概念


## 2020109 [AST 语法解析](./ast.html)
流程：先进行词法解析，然后去除空格和换行，得到有效的 token 数组。对数组进行语法解析，表达式、加法表达式、乘法表达式嵌套递归地调用。
