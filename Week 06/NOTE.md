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

### Atom

Grammar

- Literal
- Variable
- Keywords
- Whitespace
- Line Terminator

Runtime

- Types
- Execution Context



JavaScript 类型：

- **Number**
- **String**
- **Boolean**
- **Object**
- **Null**
- undefined
- Symbol

JavaScript 中的七种类型，常用前面五种。undefined 用于检测是否被定义，不要用于赋值。Symbol 用于作为属性名。

### Number

JavaScript 中的 Number 使用 IEEE 754 双精度表示法，1 位符号 + 11 位指数 + 52 位有效位数。表示越大的数，能表示的精度就越稀疏。11 位指数是以一个基准值来计算的。52 位有效位数前有一个隐藏位，值为 1。

TODO 查看数字的真实二进制表示

进度损失从十进制转换成二进制时就参数了，每次操作可能产生 1e 的损失。

Number 字面量表示有 十进制（整数、小数、科学记数法）、二进制（0b 开头）、八进制（0o 开头）、十六进制（0x 开头）。注意：数字后跟 . 时，. 会被作为小数点被数字吞掉，所以要取属性时需要注意词法：0 .toString()，中间留一个空格。

### String

- Character 字符，直观的形象
- Code Point 码点，字符的二进制表示
- Encoding 编码，码点的存储形式

##### 编码标准

ASCII、Unicode、UCS（Unicode Character Set，UCS-2 为 0000 到 FFFF，两个字节表示）、GB2312（GB/T 2312-80，收字 7445 个）、GBK（汉字内码扩展规范，不是国家标准，收字 21886 个，兼容 GB2312，并收录 GB13000 的全部字符。GB13000 等同 ISO/IEC 10646）、GB18030（GB18030-2005，收字 70244 个，兼容 GB2312 和 GBK，为中国境内软件支持的中文编码字符集**强制性标准**）、ISO-8859（东欧编码的一系列标准）、BIG5（台湾大五码）

大部分编码都兼容 ASCII 编码，但大都不互相兼容。GB、8859 系列、BIG5 都是各个国家地区的编码，且互相不兼容，所以系统或软件会要求选择语言或编码，免得用错编码取不出正确的字符😂。

![image-20201203223541809](http://static.gmaso.cn/blog/2020/12/03/22/20023f9bff77ea1b66f007a7e1c85af7-0e478f-image-20201203223541809.png?imageslim)

黄色的为 UTF8 中的控制位，第一个字节中的控制位中 1 的个数表示全部有几个字节，后续的字节都用 10 开头。

TODO 编码与字符集的概念区别？

字符（Character）是各种文字和符合的总称，包括各国家文字、标点符号、图形符号、数字等。字符集（Character set）就是字符的集合，与计算机无关。

编码是对字符的计算机表示，从字符映射到字节。对字符的不同编码方式就产生了不同的编码方案标准，比如 UTF-8、GBK。不同编码方案标准中包含的字符个数不同，产生了不同的字符集。使用 Unicode 编码规则出来的字符的集合称为 Unicode 字符集。此外，还有 ASCII 字符集、GB2312 字符集、BIG5 字符集等。

[常见乱码问题分析和总结 - IBM Developer](https://developer.ibm.com/zh/articles/analysis-and-summary-of-common-random-code-problems/)

TODO 用 js 函数把 string 进行编码

#### String - Grammar

表示方法：单引号、双引号、反引号、反斜杠转义

![image-20201203230354593](http://static.gmaso.cn/blog/2020/12/03/23/381aaf60a21328a52fc4490d20e95fc3-df6ff2-image-20201203230354593.png?imageslim)

对于反引号的字符模板，实际解析时，是如上图，下边的 3 个是解析出来的 token，剩余的变量实际是直接在代码中。看起来被大括号括起来的变量实际上是没被包含的。

#### 其他类型
true false 是关键字。
null 是关键字。
undefined 不是关键字，可以重新赋值，但强烈不建议这么用。为避免使用到被修改过的 undefined，最好是使用 void 来获得 undefined，通常用 void 0。

## 20201204 JavaScript 对象

### Object
对象的：identifier、state、behavior
在设计对象的状态和行为时，我们总是遵循“行为改变状态”的原则。

#### class
类是一种常见的描述对象的方式。
归类和分类是两个主要的流派。对于归类方法而言，多继承是非常自然的事情，如 C++。而采用分类思想的计算机语言，这是单继承结构，并且会有一个基类 Object。

#### Prototype
原型是一种更接近人类原始认知的描述对象的方法。并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。任何对象仅仅需要描述它自己与原型的区别即可。比如可以选 蛇 为原型，那描述猫、鱼就比较费事，描述的差异比较多。

class 适合更严谨分类的场合，原型适合更自由的不清晰分类的场合。

#### JavaScript 中的对象
在 JavaScript 运行时，原生对象的描述方式非常简单，只需要关注 属性（状态 + 行为） + 原型 两个部分。
内存地址作为唯一标识符。


### Symbol


