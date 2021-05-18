/**
 * 02、parse 得到语法树
 */

import { scan } from './LexParser.js'

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
        ['AssignmentExpression'],
    ],
    AssignmentExpression: [
        ['LeftHandSideExpression', '=', 'LogicalORExpression'],
        ['LogicalORExpression'],
    ],
    LogicalORExpression: [
        ['LogicalANDExpression'],
        ['LogicalORExpression', '||', 'LogicalANDExpression']
    ],
    LogicalANDExpression: [
        ['AdditiveExpression'],
        ['LogicalANDExpression', '&&', 'AdditiveExpression']
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
        ['LeftHandSideExpression'],
        ['MultiplicativeExpression', '*', 'LeftHandSideExpression'],
        ['MultiplicativeExpression', '/', 'LeftHandSideExpression']
    ],
    LeftHandSideExpression: [
        ['CallExpression'],
        ['NewExpression']
    ],
    CallExpression: [
        ['MemberExpression', 'Arguments'],
        ['CallExpression', 'Arguments'],
    ],
    // new 优先级高于调用
    NewExpression: [
        ['MemberExpression'],
        ['new', 'NewExpression'],
    ],
    MemberExpression: [
        ['PrimaryExpression'],
        ['PrimaryExpression', '.', 'Identifier'],
        ['PrimaryExpression', '[', 'Expressioin', ']'],
    ],
    PrimaryExpression: [
        ['(', 'Expression', ')'],
        ['Literal'],
        ['Identifier']
    ],
    Literal: [ // 语法定义的四种字面量基本类型和正则
        ['ObjectLiteral'],
        ['NumbericLiteral'],
        ['StringLiteral'],
        ['BooleanLiteral'],
        ['NullLiteral'],
        ['RegularExpression'],
        ['ArrayLiteral']
    ],
    ObjectLiteral: [
        ['{', '}'], // 需要处理和空语句块的区分
        ['{', 'PropertyList','}']
    ],
    PropertyList: [
        ['Property'],
        ['PropertyList', ',', 'Property']
    ],
    Property: [
        ['StringLiteral', ':', 'AdditiveExpression'], // value 不允许出现 逗号
        ['Identifier', ':', 'AdditiveExpression']
    ]
}

let hash = {}

// 求 closure，得到每个状态允许的 symbol
function closure(state) {
    hash[JSON.stringify(state)] = state
    let queue = []
    for (let symbol in state) {
        if (symbol.match(/\$/)) {
            continue
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

export function parse(source) {
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
