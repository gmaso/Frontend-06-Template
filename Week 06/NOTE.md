# 第六周学习笔记

## 20201201 JavaScript 语言通识

#### 语言按语法分类：

- 非形式语言：中文、英文等日常使用语言，比较自由，没有固定形式，语法没有严格的定义
- 形式语言：大部分计算机语言，语法有严格的定义

编程语言的描述一般可以分为**语法**和**语义**。语法是说明编程语言中，哪些符号或文字的组合方式是正确的，语义则是对于编程的解释。

在数学、逻辑和计算机科学中，**形式语言**（Formal language）是用精确的数学或机器可处理的公式定义的语言。形式语言一般有两个方面：语法和语义。专门研究语言的语法的数学和计算机科学分支叫做**形式语言理论**，它只研究语言的语法而不致力于它的语义。

在形式语言理论中，**文法**（为避免歧义，常称作“形式文法”）是形式语言中字符串的一套产生式规则。这些规则描述了如何用语言的字母表生成符合语法的有效的字符串。文法不描述字符串的含义，也不描述在任何上下文中可以用它们做什么 -- 只描述它们的形式。

**形式语言理论**是应用数学的一个分支，是研究形式文法和语言的学科。

#### 形式语言的表示方法

不像自然语言，一个形式语言作为一个集合，需要有某种明确的标准来定义一个字符串是否是它的元素。可以有多种方法来定义：

- 枚举法：如果一个形式语言的元素数目是有限的，可以通过枚举它的各个字符串来严格地定义它。
- 形式文法：常见乔姆斯基谱系。
- 正则表达式：在形式语言领域内对应于正则语言。形式语言中的正则表达式和一般编程语言中所称的正则表达式在语法上有较大差异。
- 状态机：消耗输入符号，并在自身的不同状态间切换。



### 形式语言的分类（乔姆斯基谱系：根据文法的复杂程度）

乔姆斯基谱系是计算机科学中刻画形式文法表达能力的一个分类谱系，有语言学家诺姆·乔姆斯基于 1956 年提出。它包括四个层次：

- 0 型 无限制文法：包括所有的文法（1、2、3 型），能够产生所有可被图灵机识别的语言，又称为递归可枚举语言
- 1 型 上下文相关文法：生成上下文相关语言（包括 2、3 型）
- 2 型 上下文无关文法：生成上下文无关语言（包括 3 型）
- 3 型 正则文法（正规文法 regular form）：生成正则语言

![image-20201206174254843](http://static.gmaso.cn/blog/2020/12/06/17/df4b7455a508317c2ba9d2827a6071f4-2abaf9-image-20201206174254843.png?imageslim)

##### BNF（巴科斯范式）

巴科斯范式（Backus Normal Form，缩写为 BNF），又称为**巴科斯-诺尔范式**（Backus-Naur Form），是一种用于表示上下文无关文法的语言，是由 John Backus 和 Peter Naur 首先引入的用来描述计算机语言语法的符号集。

尽管 BNF 也能表示一部分自然语言的语法，它还是更广泛地使用于程序设计语言、指令集、通信协议的语法表示中。

##### 产生式

在计算机中指- Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（BNF）的语句。



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

​			\<MultiplicativeExpression>"/"\<Number>

​	\<AddtiveExpression> :== \<MultiplicativeExpression> |

​			\<AddtiveExpression>"+"\<MultiplicativeExpression>|

​			\<AddtiveExpression>"-"\<MultiplicativeExpression>

##### TODO 习题：带问号的四则运算产生式

四则运算： (1 + 2) * 3

终结符：Number + - * / ( )

非终结符：MultiplicativeExpression、AddtiveExpression、BracketExpression

BNF：

​	\<MultiplicativeExpression> :== \<BracketExpression> |

​			\<MultiplicativeExpression>"*"\<BracketExpression>|

​			\<MultiplicativeExpression>"/"\<BracketExpression>

​	\<AddtiveExpression> :== \<MultiplicativeExpression> |

​			\<AddtiveExpression>"+"\<MultiplicativeExpression>|

​			\<AddtiveExpression>"-"\<MultiplicativeExpression>

​	\<BracketExpression> :== \<Number> |

​			"("\<AddtiveExpression>")"



### 通过产生式理解乔姆斯基谱系

- 0 型 ? :== ?

  产生式左右都没有限制

- 1 型 ?\<A>? :== ?\<B>?

  左右都需要有不变的部分，即上下文

- 2 型 \<A> :== ?

  左边只能包含一个符号，并且该符号为非终结符，右边没有限制

- 3 型 \<A> :== \<A>?

  右边 A 必须出现在产生式的最左边，不能出现在尾巴上

##### 思考：JavaScript 是哪型文法？

总体上属于上下文无关文法，表达式大部分是正则文法，但有特例：乘方（\*\*）是右结合，不是正则文法；get 方法和右边字符有关，get a 为获取 a 属性，get：1 时 get 为属性名，不是上下文无关文法。所以严格来说，是属于上下文相关文法。

现代编程语言中基本都有特例，不会完全贴合乔姆斯基谱系来设计。比如：

- C++ 中，\* 可能表示乘号或者指针
- VB 中，< 可能是小于号，有可能是 XML 直接量的开始
- Python 中，行首的 tab 符和空格会根据上一行的行首空白以一定的规则被处理成虚拟终结符 indent 或者 dedent
- JavaScript 中，/ 可能是除号，也可能是正则表达式开头；字符串模板中需要特殊处理 }；还有自动插入分号规则。

##### HTML 的文法

> 所有的常规解析器都不适用于 HTML（我并不是开玩笑，它们可以用于解析 CSS 和 JavaScript）。HTML 并不能很容易地用解析器所需的与上下文无关的语法来定义。
>
> 有一种可以定义 HTML 的正规格式：DTD（Document Type Definition，文档类型定义），但它不是与上下文无关的语法。

DTD 就是 HTML 的文法定义。XML 有很多解析器可以使用，但 HTML 由于对文法的处理更为“宽容”，导致不再是上下文无关文法。



### 不同的产生式类型

EBNF、ABNF 对 BNF 语法进行了扩展。

更常见的是，每个语言的标准里都自定义了产生式的书写方式。



### 现代语言的分类

其他分类方法

- 形式语言 - 用途
  - 数据描述语言：JSON、HTML、XAML、SQL、CSS
  - 编程语言：C、C++、Java 等大部分语言
- 形式语言 - 表达方式
  - 声明式语言：描述目标的性质，让电脑明白结果是什么样的，而非流程。主要是函数式语言
  - 命令型语言：明确指出步骤是什么样的



尽可能分类能找到的编程语言

##### 声明式语言

- 约束式编程

- 领域专属语言（DSL）

  yacc 语法分析器、Make 编译说明语言、Puppet 管理配置语言、正则表达式、SQL（SQL、XQuery）、很多文本标记语言（如 HTML、MXML、XAML、XSLT）

- 逻辑式编程

  Prolog（创建在逻辑学的理论基础之上， 最初被运用于自然语言等研究领域。现在已广泛的应用在人工智能的研究中，它可以用来建造专家系统、自然语言理解、智能知识库等）、Curry（基于 Haskell，在许多层面可以被视为是 Haskell 的超集）、Datalog（一种数据查询语言）

- 函数式编程

  （Lisp、Common Lisp、Emacs Lisp、Scheme、Racket、Clojure、ML、OCaml、Standard ML、Unlambda、F#、Haskell）、JavaScript

- 组态管理系统

声明式编程通常被看做是形式逻辑的理论，把计算看做推导。通常用作解决人工智能和约束满足问题。因大幅简化了并行计算的编写难度，自 2009 年起备受关注。

##### 命令式语言

大部分编程语言都是命令式的。

- 结构化 - 过程式

  Ada、BASIC、Fortran、C、Pascal、Go、JavaScript

- 结构化- 面向对象

  Smalltalk、Java、C#、Objective-C、C++、Eiffel、Python、Ruby、Rust、Swift

- 非结构化

  COBOL、SNOBOL



##### 更多资料参考

[编程语言列表 - wikipedia](https://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%E5%88%97%E8%A1%A8)

[Comparison of multi-paradigm programming languages - wikipedia](https://en.wikipedia.org/wiki/Comparison_of_multi-paradigm_programming_languages)





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



Unicode 存在的问题是，它只是一个符号集，只规定了符号的二进制代码，却没有规定这个二进制代码应该如何存储（占用几个字节，每个字节内怎么放等）。所以就出现了 UTF8、UTF16、UTF32 等不同的实现方式。

![image-20201203223541809](http://static.gmaso.cn/blog/2020/12/03/22/20023f9bff77ea1b66f007a7e1c85af7-0e478f-image-20201203223541809.png?imageslim)

UTF-8 就是在互联网上使用最广的一种 Unicode 的实现方式。黄色的为 UTF8 中的控制位，第一个字节中的控制位中 1 的个数表示全部有几个字节，后续的字节都用 10 开头。

UTF-8 的编码规则很简单，只有二条：

1）对于单字节的符号，字节的第一位设为 0，后面7位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。

2）对于 n 字节的符号（n > 1），第一个字节的前n位都设为 1，第 n + 1 位设为 0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。

下表总结了编码规则，字母x表示可用编码的位。

```
Unicode 符号范围     |        UTF-8 编码方式
(十六进制)        |              （二进制）
----------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

举例：严的 Unicode 是 4E25（100111000100101），根据上表，可以发现 4E25 处在第三行的范围内（0000 0800 - 0000 FFFF），因此严的 UTF-8 编码需要三个字节，即格式是1110xxxx 10xxxxxx 10xxxxxx。然后，从严的最后一个二进制位开始，依次从后向前填入格式中的x，多出的位补0。这样就得到了，严的 UTF-8 编码是11100100 10111000 10100101，转换成十六进制就是 E4B8A5。

可以看到严的 Unicode码 是 4E25，UTF-8 编码是 E4B8A5，两者是不一样的。

UTF8 规范为最长六个字节，但在 RFC3629 中限制只使用原来 Unicode 定义的区域，U+0000到U+10FFFF，也就是最长四个字节。

在计算机内存中，统一使用 Unicode 码（就是个字符的序号，没有控制位等水分），当需要保存到硬盘或者需要传输的时候，再转换为 UTF-8 等具体编码方式。（不同编程语言内部实现由差异，比如 Rust 内部是 UTF8）



##### Little endian 和 Big endian

对于字符编码，第一个字节在前，就是"大头方式"（Big endian），第二个字节在前就是"小头方式"（Little endian）。比如 严 的编码为 4E25，第一个字节是 4E，第二个字节是 25，那么：4E 存在前面就是大头方式，25 存在前面就是小头方式。

计算机怎么区分文件采用的是大头存储还是小头存储？Unicode 规范定义，每一个文件的最前面分别加入一个表示编码顺序的字符，这个字符的名字叫做"零宽度非换行空格"（zero width no-break space），用 FEFF 表示。这正好是两个字节，而且 FF 比 FE 大 1。如果一个文本文件的头两个字节是 FE FF，就表示该文件采用大头方式；如果头两个字节是 FF FE，就表示该文件采用小头方式。升序是大头，降序是小头。

##### 资料参考

[字符编码笔记：ASCII，Unicode 和 UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)



编码与字符集的概念区别？

字符（Character）是各种文字和符合的总称，包括各国家文字、标点符号、图形符号、数字等。字符集（Character set）就是字符的集合，与计算机无关。

编码是对字符的计算机表示，从字符映射到字节。对字符的不同编码方式就产生了不同的编码方案标准，比如 UTF-8、GBK。不同编码方案标准中包含的字符个数不同，产生了不同的字符集。使用 Unicode 编码规则出来的字符的集合称为 Unicode 字符集。此外，还有 ASCII 字符集、GB2312 字符集、BIG5 字符集等。

[常见乱码问题分析和总结 - IBM Developer](https://developer.ibm.com/zh/articles/analysis-and-summary-of-common-random-code-problems/)



用 JavaScript 函数获取字符串的 UTF8 二进制编码

```
function UTF8_encoding(str) {
  const bytes = Buffer.from(str, 'utf8');
  const array = [];
  for (var i = 0; i < bytes.length; i++) {
    const binary = bytes[i];
    array.push(binary.toString(2).padStart(8, '0'));
  }

  console.log(array);
  return bytes;
}

// UTF8_encoding('极客');

UTF8_encoding('1');
```



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
对象的三种性质：identifier、state、behavior
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


