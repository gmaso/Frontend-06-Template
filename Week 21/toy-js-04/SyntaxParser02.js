/**
 * 02、parse 得到语法树
 */

import { scan } from './LexParser02.js'

let syntax = {
    Program: [
        ['StatementList', 'EOF']
    ],
    StatementList: [
        ['Statement'], 
        ['StatementList', 'Statement']
    ],
    Statement: [
        ['ExpressionStatement'],
        ['IfStatement'],
        ['VariableDeclaration'],
        ['FunctionDelaration']
    ],
    ExpressionStatement: [
        ['Expression', ';'],
    ],
    Expression: [
        ['AdditiveExpression'],
    ],
    IfStatement: [
        ['if', '(', 'Expression', ')', 'Statement']
    ],
    VariableDeclaration: [
        ['var', 'Identifier', ';'],
        ['let', 'Identifier', ';']
    ],
    FunctionDeclaration: [
        ['function', 'Identifier', '(', ')', '{', 'StatementList', '}']
    ],
    AdditiveExpression: [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        ['AdditiveExpression', '-', 'MultiplicativeExpression']
    ],
    MultiplicativeExpression: [
        ['PrimaryExpression'],
        ['MultiplicativeExpression', '*', 'PrimaryExpression'],
        ['MultiplicativeExpression', '/', 'PrimaryExpression']
    ],
    PrimaryExpression: [
        ['(', 'Expression', ')'],
        ['Literal'],
        ['Identifier']
    ],
    Literal: [ // 语法定义的四种字面量基本类型和正则
        ['NumbericLiteral'],
        ['StringLiteral'],
        ['BooleanLiteral'],
        ['NullLiteral'],
        ['RegularExpression'],
        ['ObjectLiteral'],
        ['ArrayLiteral']
    ],
}

let hash = {}

// 求 closure，得到每个状态允许的 symbol
function closure(state) {
    hash[JSON.stringify(state)] = state
    let queue = []
    for (let symbol in state) {
        if (symbol.match(/\$/)) {
            return
        }
        queue.push(symbol)
    }
    while(queue.length) {
        let symbol = queue.shift()
        // console.log(symbol)
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                !state[rule[0]] && queue.push(rule[0])
                let current = state
                for (let part of rule) {
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part]
                }
                current.$reduceType = symbol
                current.$reduceLength = rule.length
            }
        }
    }
    // 递归下层
    for (let symbol in state) {
        if (symbol.match(/\$/)) {
            return
        }
        if (hash[JSON.stringify(state[symbol])]) {
            state[symbol] = hash[JSON.stringify(state[symbol])]
        } else {
            closure(state[symbol])
        }
    }
}

let end = {
    $isEnd: true
}

let start = {
    'Program': end
}

closure(start)

// 版本一
// function parse(source) {
//     let state = start

//     for (let symbol/** terminal symbol */ of scan(source)) {
//         if (symbol.type in state) {
//             console.log(state)
//             state = state[symbol.type]
//         } else {
//             // 当规则已经到末尾时，合并 symbol 为 non-terminal symbol
//             // 通过规则进行合并
//             debugger
//         }
//         console.log(symbol)
//     }
// }

// 版本二
function parse(source) {
    let stack = [start]
    let symbolStack = []

    // 合成 non-terminal symbol
    function reduce() {
        let state = stack[stack.length - 1]

        if (state.$reduceType) {
            // 存储子级
            let children = []
            for (let i = 0; i < state.$reduceLength; i++) {
                stack.pop()
                children.push(symbolStack.pop())
            }

            // 返回 non-terminal symbol
            return {
                type: state.$reduceType,
                children: children.reverse()
            }
        } else {
            throw new Error('unexpected token')
        }
    }

    // 前进
    function shift(symbol) {
        let state = stack[stack.length - 1]

        if (symbol.type in state) {
            stack.push(state[symbol.type])
            symbolStack.push(symbol)
        } else {
            // 处理到规则末尾，进行 reduce
            shift(reduce())
            shift(symbol)
        }
    }

    for (let symbol/** terminal symbol */ of scan(source)) {
        // 逐个处理 symbol
        shift(symbol)
    }

    return reduce()
}

let evaluator = {
    // 区分类型处理
    Program(node) {
        return evaluate(node.children[0])
    },
    StatementList(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0])
        } else {
            evaluate(node.children[0])
            return evaluate(node.children[1])
        }
    },
    Statement(node) {
        return evaluate(node.children[0])
    },
    ExpressionStatement(node) {
        return evaluate(node.children[0])
    },
    Expression(node) {
        return evaluate(node.children[0])
    },
    AdditiveExpression(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0])
        } else if (node.children[1] === '+') {
            return evaluate(node.children[0])
        } else if (node.children[1] === '-') {
            return evaluate(node.children[0])
        }
    },
    MultiplicativeExpression(node) {
        return evaluate(node.children[0])
    },
    PrimaryExpression(node) {
        return evaluate(node.children[0])
    },
    Literal(node) {
        return evaluate(node.children[0])
    },
    VariableDeclaration(node) {
        let name = node.children[1].name;
        console.log('Declaration', name)
    },
    NumbericLiteral(node) {
        console.log(node)
        // 处理数字
        // return Number(node.value)
        let str = node.value
        let len = str.length
        let value = 0
        let radix = 10

        // 支持二进制、八进制、十六进制
        if (str.match(/^0b/)) {
            radix = 2
            len -= 2
        } else if (str.match(/^0o/)) {
            radix = 8
            len -= 2
        } else if (str.match(/^0x/)) {
            radix = 16
            len -= 2
        }

        while(len) {
            let c = str.charCodeAt(str.length - len)
            if (c >= 'a'.charCodeAt(0)) {
                c = c - 'a'.charCodeAt(0) + 10
            } else if (c >= 'A'.charCodeAt(0)) {
                c = c - 'A'.charCodeAt(0) + 10
            } else if (c >= '0'.charCodeAt(0)) {
                c = c - '0'.charCodeAt(0)
            }
            value = value * radix + c
            len--
        }
        console.log(value)

    },
    StringLiteral(node) {
        console.log(node)
        let result = []
        // 获取到字符串的值，处理转义、码点等情况
        for (let i = 1; i < node.value.length - 1; i++) {
            // console.log(node.value[i])
            if (node.value[i] === '\\') {
                ++i
                let c = node.value[i]
                // 处理转义字符，码点查标准。未处理非基本平面的字符
                let map = {
                    '\'': '\'',
                    '\"': '\"',
                    '\\': '\\',
                    '0': String.fromCharCode(0x0000),
                    'b': String.fromCharCode(0x0008),
                    'f': String.fromCharCode(0x000C),
                    'n': String.fromCharCode(0x000A),
                    'r': String.fromCharCode(0x000D),
                    't': String.fromCharCode(0x0009),
                    'v': String.fromCharCode(0x000B),
                }
                if (c in map) {
                    result.push(map[c])
                } else {
                    result.push(c)
                }
            } else {
                result.push(node.value[i])
            }
        }
        console.log(result)
        return result.join('')
    },
    EOF() {
        return null
    }
}

function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node)
    }
}


// =======================================

// let source = `
//     'ab\\bc';
// `

// let tree = parse(source)

// // 执行语法树
// evaluate(tree)

window.js = {
    evaluate, parse
}