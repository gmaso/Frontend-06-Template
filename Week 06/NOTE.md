# 第六周学习笔记

## 20201201 JavaScript 语言通识

语言按语法分类：

- 非形式语言：中文、英文等日常使用语言，比较自由，没有固定形式，语法没有严格的定义
- 形式语言：大部分计算机语言，语法有严格的定义



### 形式语言的分类（乔姆斯基谱系）：

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

​	<MultiplicativeExpression> :== <Number> |

​			<MultiplicativeExpression>"*"<Number>|

​			<MultiplicativeExpression>"/"<Number>|

​	<AddtiveExpression> :== <MultiplicativeExpression> |

​			<AddtiveExpression>"+"<MultiplicativeExpression>|

​			<AddtiveExpression>"-"<MultiplicativeExpression>|

​	<BracketExpression> :== "("<AddtiveExpression>")" |

##### TODO 习题：带问号的四则运算产生式



### 通过产生式理解乔姆斯基谱系

- 0 型 ? :== ?

  产生式左右都没有限制

- 1 型 ?<A>? :== ?<B>?

  左右都需要有不变的部分，即上下文

- 2 型 <A> :== ?

  左边只能有一个非终结符，右边没有限制

- 3 型 <A> :== <A>?

  右边 A 必须出现在产生式的最左边，不能出现在尾巴上

##### 思考：JavaScript 是哪型文法？

总体上属于上下文无关文法，表达式大部分是正则文法，但有特例：乘方（\*\*）是右结合，不是正则文法；get 方法和右边字符有关，get a 为获取 a 属性，get：1 时 get 为属性名，不是上下文无关文法。所以严格来说，是属于上下文相关文法。

### 不同的产生式类型

EBNF、ABNF 对 BNF 语法进行了扩展。

更常见的是，每个语言的标准里都自定义了产生式的书写方式。



## 20201202 JavaScript 类型





## 20201203 JavaScript 对象



