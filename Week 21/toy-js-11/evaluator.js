import { 
    ExecutionContext, Realm, Reference,
    JSNumber, JSString, JSBoolean, JSObject, JSNull, JSUndefined, JSSymbol, 
    CompletionRecord, EnvironmentRecord, ObjectEnvironmentRecord
} from './runtime.js'

// Evaluator 通常就是 js 的一个实例
export class Evaluator {
    constructor() {
        this.realm = new Realm()
        this.globalObject = new JSObject()
        this.globalObject.set('log', new JSObject)
        this.globalObject.get('log').call = args => {
            console.log(args)
        }
        this.ecs = [new ExecutionContext(
                this.realm,
                new ObjectEnvironmentRecord(this.globalObject),
                new ObjectEnvironmentRecord(this.globalObject)
            )]
    }
    evaluateModule(node) {
        let globalEc = this.ecs[0]
        let newEc = new ExecutionContext(
            this.realm,
            new ObjectEnvironmentRecord(globalEc.lexicalEnvironment),
            new ObjectEnvironmentRecord(globalEc.lexicalEnvironment)
        )
        this.ecs.push(newEc)
        let result = this.evaluate(node)
        this.ecs.pop()
        return result
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
            let record = this.evaluate(node.children[0])
            if (record.type === 'normal') {
                return this.evaluate(node.children[1])
            } else {
                return record;
            }
        }
    }
    Statement(node) {
        return this.evaluate(node.children[0])
    }
    BreakStatement(node) {
        return new CompletionRecord('break')
    }
    ContinueStatement(node) {
        return new CompletionRecord('continue')
    }
    Block(node) {
        if (node.children.length === 2) {
            return
        }
        let runningEc = this.ecs[this.ecs.length - 1]
        this.ecs.push(new ExecutionContext(
            this.realm,
            new EnvironmentRecord(runningEc.lexicalEnvironment), // let/const 声明
            runningEc.variableEnvironment /* 涉及到 var 声明的处理 */
        ))
        let result = this.evaluate(node.children[1])
        this.ecs.pop()
        return result
    }
    IfStatement(node) {
        let condition = this.evaluate(node.children[2])
        // 对 condition 进行解应用
        if (condition instanceof Reference) {
            condition = condition.get()
        }
        if (condition.toBoolean().value) {
            return this.evaluate(node.children[4])
        }
    }
    WhileStatement(node) {
        while (true) {
            let condition = this.evaluate(node.children[2])
            // 对 condition 进行解应用
            if (condition instanceof Reference) {
                condition = condition.get()
            }
            if (condition.toBoolean().value) {
                console.log('while')
                let record = this.evaluate(node.children[4])
                if (record.type === 'continue') {
                    continue;
                } else if (record.type === 'break') {
                    // break 状态被消费后，置为 normal 状态
                    return new CompletionRecord('normal')
                }
            } else {
                return new CompletionRecord('normal')
            }
        }
    }
    ExpressionStatement(node) {
        let res = this.evaluate(node.children[0])
        if (res instanceof Reference) {
            res = res.get()
        }
        return new CompletionRecord('normal', res)
    }
    Expression(node) {
        return this.evaluate(node.children[0])
    }
    BooleanLiteral(node) {
        return node.value === 'true' ? new JSBoolean(true) : new JSBoolean(false)
    }
    Null() {
        return new JSNull()
    }
    AssignmentExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        let left = this.evaluate(node.children[0])
        let right = this.evaluate(node.children[2])
        left.set(right)
    }
    LogicalORExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        // 短路逻辑
        let left = this.evaluate(node.children[0])
        if (left) {
            return left
        }
        let right = this.evaluate(node.children[2])
        return right
    }
    LogicalANDExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        // 短路逻辑
        let left = this.evaluate(node.children[0])
        if (!left) {
            return left
        }
        let right = this.evaluate(node.children[2])
        return right
    }
    AdditiveExpression(node) {
        if (node.children.length === 1) {
            let left = this.evaluate(node.children[0])
            if (left instanceof Reference) {
                left = left.get()
            }
            return left
        } else {
            let left = this.evaluate(node.children[0])
            let right = this.evaluate(node.children[2])
            if (left instanceof Reference) {
                left = left.get()
            }
            if (right instanceof Reference) {
                right = right.get()
            }
            if (node.children[1].type === '+') {
                // if ()
                return new JSNumber(left.value + right.value)
            } else if (node.children[1].type === '-') {
                return new JSNumber(left.value - right.value)
            }
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
        runningEc.lexicalEnvironment.add(name, new JSUndefined)
        return new CompletionRecord('normal', new JSUndefined)
    }
    FunctionDeclaration(node) {
        // debugger
        let name = node.children[1].name
        let code = node.children[node.children.length - 2]
        // 新建函数
        let func = new JSObject()
        func.call = args => {
            // 需要处理作用域等复杂问题
            // 处理上下文
            let newEc = new ExecutionContext(
                this.realm,
                new EnvironmentRecord(func.enviroment),
                new EnvironmentRecord(func.enviroment)
            )
            this.ecs.push(newEc)
            let result = this.evaluate(code)
            this.ecs.pop()
            return result
        }
        // 保存函数到词法作用域
        let runningEc = this.ecs[this.ecs.length - 1]
        func.enviroment = runningEc.lexicalEnvironment
        runningEc.lexicalEnvironment.add(name)
        runningEc.lexicalEnvironment.set(name, func)
        return new CompletionRecord('normal')
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
        return new JSNumber(value)
    }
    StringLiteral(node) {
        // console.log(node)
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
        // console.log(result)
        return new JSString(result)
    }
    ObjectLiteral(node) {
        if (node.children.length === 2) {
            return {}
        }
        if (node.children.length === 3) {
            let object = new JSObject()
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
    LeftHandSideExpression(node) {
        return this.evaluate(node.children[0])
    }
    CallExpression(node) {
        if (node.children.length === 1) {
            this.Property(node.children[0], object)
        }
        if (node.children.length === 2) {
            let func = this.evaluate(node.children[0])
            let args = this.evaluate(node.children[1])
            if (func instanceof Reference) {
                func = func.get()
            }
            return func.call(args)
        }
    }
    Arguments(node) {
        if (node.children.length === 2) {
            return []
        }
        return this.evaluate(node.children[1])
    }
    ArgumentList(node) {
        if (node.children.length === 1) {
            let result = this.evaluate(node.children[0])
            if (result instanceof Reference) {
                result = result.get()
            }
            return [result]
        } else {
            let result = this.evaluate(node.children[2])
            if (result instanceof Reference) {
                result = result.get()
            }
            return this.evaluate(node.children[0]).concat(result)
        }
    }
    NewExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        if (node.children.length === 2) {
            let cls = this.evaluate(node.children[1])
            return cls.construct()
            // let object = this.realm.Object.construct()
            // let cls = this.evaluate(node.children[1])
            // let result = cls.call(object)
            // if (typeof result === 'object') {
            //     return result
            // } else {
            //     return object
            // }
        }
    }
    MemberExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0])
        }
        if (node.children.length === 3) {
            let obj = this.evaluate(node.children[0]).get()
            let prop = obj.get(node.children[2].name)
            if ('value' in prop) {
                return prop.value
            }
            if ('get' in prop) {
                return prop.get.call(obj)
            }
            return prop
        }
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
