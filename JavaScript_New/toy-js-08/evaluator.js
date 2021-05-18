import { ExecutionContext, Realm, Reference } from './runtime.js'

// Evaluator 通常就是 js 的一个实例
export class Evaluator {
    constructor() {
        this.realm = new Realm()
        this.globalObject = {}
        this.ecs = [new ExecutionContext(this.realm, this.globalObject)]
    }
    evaluate(node) {
        if (this[node.type]) {
            return this[node.type](node)
        }
    }
    Program(node) {
        return this.evaluate(node.children[0])
    }
    StatementList(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        } else {
            this.evaluate(node.children[0])
            return this.evaluate(node.children[1])
        }
    }
    Statement(node) {
        return this.evaluate(node.children[0])
    }
    ExpressionStatement(node) {
        return this.evaluate(node.children[0])
    }
    Expression(node) {
        return this.evaluate(node.children[0])
    }
    AssignmentExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        let left = this.evaluate(node.children[0])
        let right = this.evaluate(node.children[2])
        left.set(right)
    }
    AdditiveExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        } else if (node.children[1] === '+') {
            return this.evaluate(node.children[0])
        } else if (node.children[1] === '-') {
            return this.evaluate(node.children[0])
        }
    }
    MultiplicativeExpression(node) {
        return this.evaluate(node.children[0])
    }
    PrimaryExpression(node) {
        return this.evaluate(node.children[0])
    }
    Literal(node) {
        return this.evaluate(node.children[0])
    }
    VariableDeclaration(node) {
        let name = node.children[1].name;
        let runningEc = this.ecs[this.ecs.length - 1]
        return new Reference(runningEc.variableEnvironment, name)
    }
    NumbericLiteral(node) {
        // console.log(node)
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
        // console.log(value)
        return value

    }
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
    }
    ObjectLiteral(node) {
        if (node.children.length === 2) {
            return {}
        }
        if (node.children.length === 3) {
            let object = new Map()
            // object.prototype = 
            this.PropertyList(node.children[1], object)
            return object
        }
    }
    PropertyList(node, object) {
        if (node.children.length === 1) {
            this.Property(node.children[0], object)
        } else {
            this.PropertyList(node.children[0], object)
            this.Property(node.children[2], object)
        }
    }
    Property(node, object) {
        let name
        if (node.children[0].type === 'Identifier') {
            name = node.children[0].name;
        } else if (node.children[0].type === 'StringLiteral') {
            name = this.evaluate(node.children[0])
        }
        // 存入描述符
        object.set(name, {
            value: this.evaluate(node.children[2]),
            writable: true,
            enumerable: true,
            configurable: true
        })
    }
    Identifier(node) {
        // 变量存在 EC 中
        let runningEc = this.ecs[this.ecs.length - 1]
        return new Reference(runningEc.lexicalEnvironment, node.name)
    }
    EOF() {
        return null
    }
}
