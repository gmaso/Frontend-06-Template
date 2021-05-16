/**
 * token 类型整理，得到 terminal symbol
 */

class XRegExp {
    constructor(source, flag, root) {
        this.table = new Map()
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag)
        // console.log(this.regexp)
        // console.log(this.table)
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
        for (let i = r.length - 1; i > 0; i--) {
            if (r[i] !== void 0) {
                const type = this.table.get(i - 1)
                r.type = type
                r[type] = r[0]
                break
            }
        }
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
    Keywords: /if|else|for|function|let|var/,
    Punctuator: /\+\+|=>|===|\+=|\=|\<|\+|-|\*|\/|=|\{|\}|\(|\)|\[|\]|\.|\?|:|,|;/
}

export function* scan(str) {
    let regexp = new XRegExp(xregexp, 'g', 'InputElement')
    // console.log(regexp, regexp.lastIndex, str.length)
    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str)
        // console.log(r.type, JSON.stringify(r[0]))
        // 分类型确定返回
        if (r.WhiteSpace || r.LineTerminator || r.Comment) {
            // 不处理
        } else if (r.NumbericLiteral) {
            yield {
                type: 'NumbericLiteral',
                value: r[0]
            }
        } else if (r.BooleanLiteral) {
            yield {
                type: 'BooleanLiteral',
                value: r[0]
            }
        } else if (r.StringLiteral) {
            yield {
                type: 'StringLiteral',
                value: r[0]
            }
        } else if (r.NullLiteral) {
            yield {
                type: 'NullLiteral',
                value: null
            }
        } else if (r.Identifier) {
            yield {
                type: 'Identifier',
                name: r[0]
            }
        } else if (r.Keywords) {
            yield {
                type: r[0]
            }
        } else if (r.Punctuator) {
            yield {
                type: r[0]
            }
        } else {
            throw new Error('unecpected token ' + r[0])
        }
    }
    yield {
        type: 'EOF'
    }
}
// 匹配
let source = (`
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

// for (let element of scan(source)) {
//     console.log(element)
// }