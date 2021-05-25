## 产生式的定义及写法




## 产生式在语言中的应用
现代复杂语言一般有两份产生式，分别定义词法规范和语法规范：
词法规范：去除无效字符，得到 token，一般称为 lexer 或 tokenizer，正则文法
语法规范：解析 token 得到语法树，语法树可以处理成 AST，一般称为 syntax, parser，2型文法
两个规范合称 grammer，文法。




## 用产生式定义 JavaScript 词法和语法
和标准的定义可能有差异，形成自己脑中的 JavaScript 产生式定义。当通过不断的补全，和标准一样时，对 JavaScript 就算是有了比较深入的了解了。

```javascript
InputElement ::= WhiteSpace | LineTerminator | Comment | Token

// 所有的 unicode 规定的空白符
WhiteSpace ::= " " | " "

// unicode 中还有更多，如分页符等
LineTerminator ::= "\n" | "\r"

Comment ::= SingleLineComment | MultilineComment
SingleLineComment ::= "/" "/" <any>*
MultiLineComment ::= "/" "*" ([^*] | "*" [^\/])* "*" "/"

Token ::= Literal | Keywords | Identifier | Punctuator  
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
Keywords ::= "if" | "else" | "for" | "function" | ......
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | ......

```



## JavaScript 词法基本框架

标准的附录 A.1

InputElment 分成了四种，主要是处理 "/" （除号、正则）和 "}" （模板字符串、右括号）的情况。

WhiteSpace 有 7 种：<TAB> <VT> <FF> <SP> <NBSP> <ZWNBSP> <USP>

NBSP 不在此处断行的空格

ZWNBSP 以前用于在文件头部标记 BOM（Byte Order Mark）。

LineTerminator：JavaScript 中换行符不能跟空白符混在一起。<LF>、<CR>[lookahead ≠ <LF>]、<LS>、<PS>、<CR><LF>（支持 windows 的换行）

ReservedWord：Keyword、FutureReservedWord、NullLiteral、BooleanLiteral

Punctuator、DivPunctuator、RightBracePunctuator



## JavaScript 语法基本框架

回忆 JavaScript 的语法定义。可以一层层往下定义。

目标：心中有产生式的图。

```javascript
Program ::= Statement+
Statement ::= ExpressionStatement | IfStatement 
	| ForStatement | WhileStatement 
	| VariableDeclaration | FunctionDeclaration | ClassDeclaration
	| BreakStatement | ContinueStatement | ReturnStatement | ThrowSTatement
	| TryStatement
	| BlockStatement

ExpressionStatement ::= Expression ";"
Expression ::= ......

BlockStatement ::= "{" Statement+ "}"
TryStatement ::= "try" "{" Statement+ "}" "catch" "(" Expression ")" "{" Statement+ "}"
```



## JavaScript 词法和语法的代码分析

使用正则来进行词法分析。要用比较多的正则覆盖各种情况。

```javascript
function scan(str) {
    let regexp = / |\n|\/\*([^*]|\*[^\/])*\*\/|\/\/[^\n]*|[1-9][0-9]*|0/g
    while(regexp.lastIndex < str.length) {
        let r = regexp.exec(str)
        console.log(JSON.stringify(r[0]))
    }
}
scan(`
5 0 2230
// hello
/* sh */
/* ch */`)
```

存在的问题，正则全在一起，不方便管理，而且和产生式没有对应关系。整理成如下格式：

```javascript
let xregexp = {
	InputElement: /<WhiteSpace>|<LineTerminator>|<Comments>|<Token>/,
	WhiteSpace: / /,
	LineTerminator: /\n/,
	Comments: /\/\*([^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
	Token: /<Literal>|<Keywords>|<Identifier>|<Punctuator>/, // Keywords 必须写在 Identifier 前面，优先匹配
    Literal: /<NumbericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>/,
    NumbericLiteral: /[1-9][0-9]*|0/, // 需要继续支持小数、十六进制、科学计数法等
    BooleanLiteral: /true|false/,
    StringLiteral: /\"([^"\n]|\\[\s\S])*\"|\'([^'\n]|\\[\s\S])*\'/,
    NullLiteral: /null/,
    Identifier: /[a-zA-Z$_][a-zA-Z0-9$_]*/,
    Keywords: /if|else|for|function|let/,
    Punctuator: /\+\+|=>|===|\+=|\=|\<|\+|-|\*|\/|=|\{|\}|\(|\)|\[|\]|\.|\?|:|,|;/
}
function compileRegExp(xregexp, name) {
	let regexp = xregexp[name].source.replace(/\<([^>]+)\>/g, function (str, $1) {
		return compileRegExp(xregexp, $1)
	});
	return regexp;
}
function scan(str) {
    let regexp = new RegExp(compileRegExp(xregexp, 'InputElement'), 'g')
    while(regexp.lastIndex < str.length) {
        let r = regexp.exec(str)
        console.log(JSON.stringify(r[0]))
    }
}
scan(`
5 0 2230
// hello
/* sh */
/* ch */`)
```

通过把正则组织成类似产生式的格式，可以大大方便管理和调试。每个正则都可以继续完善或继续拆分，覆盖标准中的各种情况。

到这里，能匹配出 token，但不能确定是匹配到哪个规则。需要改进 compileRegExp 函数。**思路是封装 RegExp，保持行为一致的情况下，能保存查找捕获组的对应关系。**注意：正则中不要出现捕获组，否则会影响对应关系。

```javascript
class XRegExp {
    constructor(source, flag, root) {
        this.table = new Map()
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag)
        console.log(this.regexp)
        console.log(this.table)
    }
    compileRegExp(source, name, start) {
        // 跳过正则的处理
        if (source[name] instanceof RegExp) {
            return {
                source: source[name].source,
                length: 0
            }
        }

        // 匹配产生式定义
        let length = 0
        let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
            // 保存捕获组和规则的对应关系
            this.table.set(start + length, $1)
            // this.table.set($1, start + length)

            ++length
            let r = this.compileRegExp(source, $1, start + length)
            length += r.length

            // 添加捕获组
            return '(' + r.source + ')'
        })
        return {
            source: regexp,
            length: length
        }
    }
    exec(str) {
        let r = this.regexp.exec(str)
        // console.log(r)
        return r;
    }
    get lastIndex() {
        return this.regexp.lastIndex
    }
    set lastIndex(value) {
        return this.regexp.lastIndex = value
    }
}
let xregexp = {
    InputElement: '<WhiteSpace>|<LineTerminator>|<Comments>|<Token>', // 改为字符串，和正则区分
    WhiteSpace: / /,
    LineTerminator: /\n/,
    Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/, // 括号的必须用 ?: 非捕获组
    Token: '<Literal>|<Keywords>|<Identifier>|<Punctuator>', // Keywords 必须写在 Identifier 前面，优先匹配
    Literal: '<NumbericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>',
    NumbericLiteral: /[1-9][0-9]*|0/, // 需要继续支持小数、十六进制、科学计数法等
    BooleanLiteral: /true|false/,
    StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/,
    NullLiteral: /null/,
    Identifier: /[a-zA-Z$_][a-zA-Z0-9$_]*/,
    Keywords: /if|else|for|function|let/,
    Punctuator: /\+\+|=>|===|\+=|\=|\<|\+|-|\*|\/|=|\{|\}|\(|\)|\[|\]|\.|\?|:|,|;/
}


let colors = {
    InputElement: '',
    WhiteSpace: '',
    LineTerminator: '',
    Comments: 'yellow',
    Token: '',
    Literal: '',
    NumbericLiteral: '',
    BooleanLiteral: 'blue',
    StringLiteral: '',
    NullLiteral: '',
    Identifier: '',
    Keywords: 'red',
    Punctuator: 'green'
}

function scan(str) {
    let regexp = new XRegExp(xregexp, 'g', 'InputElement')
    console.log(regexp, regexp.lastIndex, str.length)
    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str)
        for (let i = r.length - 1; i > 0; i--) {
            if (r[i] !== void 0) {
                const type = regexp.table.get(i-1)
                console.log(type, JSON.stringify(r[0]))
                // 可以通过类型进行语法高亮
                document.write('<span style="color:' + colors[type] + '">' + r[0] + '</span>')
                break
            }
        }
    }
}
// 匹配
scan(`
for (let i = 0; i < 100; i += 1) {
    for (let j = 0; j < 100; j += 1) {
        let div = document.createElement('div');
        div.classList.add('cell');
        if (map[i * 100 + j] === 1) {
            div.classList.add('black');
        }

        div.addEventListener('mouseover', () => {
            if (mouseDown) {
                if (clear) {
                    div.classList.remove('black');
                    map[i * 100 + j] = 0;
                } else {
                    div.classList.add('black');
                    map[i * 100 + j] = 1;
                }
            }
        })
        container.appendChild(div);
    }
}
`)
```

通过对代码进行词法分析，得到 token。



## 小结

- 通过正则处理得到 token。

- 为方便管理正则，把正则组织成类似产生式的结构，通过处理产生正则。

- 为找到正则匹配的类型，封装原生的正则类型，保存对照关系。