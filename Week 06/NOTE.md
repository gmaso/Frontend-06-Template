# 第六周学习笔记

## 20201201 JavaScript 语言通识

语言按语法分类：

- 非形式语言：中文、英文等日常使用语言，比较自由，没有固定形式，语法没有严格的定义
- 形式语言：大部分计算机语言，语法有严格的定义



### 形式语言的分类（乔姆斯基谱系：根据文法的复杂程度）：

- 0 型 无限制文法：包括所有的文法（1、2、3 型）
- 1 型 上下文相关文法：生成上下文相关语言（包括 2、3 型）
- 2 型 上下文无关文法：生成上下文无关语言（包括 3 型）
- 3 型 正则文法（正规文法 regular form）：生成正则语言



### 产生式（BNF 描述）：

- 用尖括号括起来的名称表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构成为终结符（terminal symbol）：最终在代码中出现的字符
  - 复合结构成为非终结符（nonterminal symbol）
- 引号和中间的字符表示终结符
- 可以有括号，把一些结构变成一组
- \* 表示重复多次
- | 表示或
- \+ 表示至少一次



举例：四则运算的产生式（BNF）

四则运算： 1 + 2 * 3

终结符：Number + - * /

非终结符：MultiplicativeExpression、AddtiveExpression

BNF：

​	\<MultiplicativeExpression> :== \<Number> |

​			\<MultiplicativeExpression>"*"\<Number>|

​			\<MultiplicativeExpression>"/"\<Number>|

​	\<AddtiveExpression> :== \<MultiplicativeExpression> |

​			\<AddtiveExpression>"+"\<MultiplicativeExpression>|

​			\<AddtiveExpression>"-"\<MultiplicativeExpression>|

​	\<BracketExpression> :== "("\<AddtiveExpression>")" |

##### TODO 习题：带问号的四则运算产生式



### 通过产生式理解乔姆斯基谱系

- 0 型 ? :== ?

  产生式左右都没有限制

- 1 型 ?\<A>? :== ?\<B>?

  左右都需要有不变的部分，即上下文

- 2 型 \<A> :== ?

  左边只能有一个非终结符，右边没有限制

- 3 型 \<A> :== \<A>?

  右边 A 必须出现在产生式的最左边，不能出现在尾巴上

##### 思考：JavaScript 是哪型文法？

总体上属于上下文无关文法，表达式大部分是正则文法，但有特例：乘方（\*\*）是右结合，不是正则文法；get 方法和右边字符有关，get a 为获取 a 属性，get：1 时 get 为属性名，不是上下文无关文法。所以严格来说，是属于上下文相关文法。

现代编程语言中基本都有特例，不会完全贴合乔姆斯基谱系来设计。比如：

- C++ 中，\* 可能表示乘号或者指针
- VB 中，< 可能是小于号，有可能是 XML 直接量的开始
- Python 中，行首的 tab 符和空格会根据上一行的行首空白以一定的规则被处理成虚拟终结符 indent 或者 dedent
- JavaScript 中，/ 可能是除号，也可能是正则表达式开头；字符串模板中需要特殊处理 }；还有自动插入分号规则。

### 不同的产生式类型

EBNF、ABNF 对 BNF 语法进行了扩展。

更常见的是，每个语言的标准里都自定义了产生式的书写方式。

### 现代语言的分类

其他分类方法

- 形式语言 - 用途
  - 数据描述语言：JSON、HTML、XAML、SQL、CSS
  - 编程语言：C、C++、Java 等
- 形式语言 - 表达方式
  - 声明式语言：结果是什么样的，主要是函数式语言
  - 命令型语言：步骤是什么样的

TODO：尽可能分类能找到的编程语言



## 20201202 JavaScript 语言通识

### 编程语言的性质

#### 图灵完备性

编程语言必备的特性。所有可计算的问题都可用此语言来描述，就是具有图灵完备性。

- 命令式 - 图灵机
  - goto
  - if 和 while
- 声明式 - lambda
- - 递归

#### 动态与静态

- 动态
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime
- 静态
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

#### 类型系统

- 动态类型系统（用户的机器上能找到类型）与静态类型系统（编译到目标机器代码时，所有的类型信息都被丢掉了）
- 强类型与弱类型：有无隐式转换
- 复合类型：结构体、函数签名
- 子类型
- 泛型：协变/逆变

### 一般命令式编程语言的设计方式

一般命令式编程语言的 5 个层级（从低到高）：

| Atom                    | Expression                         | Statement                               | Structure                                                   | Program                                       |
| ----------------------- | ---------------------------------- | --------------------------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| Identifier<br />Literal | Atom<br />Operator<br />Punctuator | Expression<br />Keyword<br />Punctuator | Function<br />Class<br />Process<br />Namespace<br />...... | Program<br />Module<br />Package<br />Library |

对每个层级的理解步骤：

语法 -》 语义 -》 运行时



## 20201203 JavaScript 类型





## 20201204 JavaScript 对象



