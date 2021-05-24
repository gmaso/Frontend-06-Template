
export class Realm {
    constructor() {
        this.global = new Map()
        this.Object = new Map()
        this.Object.call = function () {

        }
        this.Object_prototype = new Map()
    }
}

export class EnvironmentRecord {
    constructor() {
        this.thisValue = null
        this.variable = new Map()
        this.outer = null
    }
}

// 完成记录
export class CompletionRecord {
    constructor(type, value, target) {
        this.type = type || 'normal'
        this.value = value || new JSUndefined()
        this.target = target || null
    }
}

export class ExecutionContext {
    // LexicalEnvironment: { a: 1}
    constructor(realm, lexicalEnvironment, variableEnvironment) {
        variableEnvironment = variableEnvironment || lexicalEnvironment
        this.lexicalEnvironment = lexicalEnvironment // let/const
        this.variableEnvironment = variableEnvironment // let/const // var
        this.realm = realm
    }
}
// 变量保存
export class Reference {
    constructor(object, property) {
        this.object = object
        this.property = property
    }
    set(value) {
        this.object[this.property] = value
    }
    get() {
        return this.object[this.property]
    }
}

// 类型 number string boolean object null undefined symbol

export class JSValue {
    get type() {
        if (this.contructor === JSNumber) {
            return 'number'
        }
        if (this.contructor === JSString) {
            return 'string'
        }
        if (this.contructor === JSBoolean) {
            return 'boolean'
        }
        if (this.contructor === JSObject) {
            return 'object'
        }
        if (this.contructor === JSNull) {
            return 'null'
        }
        if (this.contructor === JSSymbol) {
            return 'symbol'
        }
        return 'undefined'
    }
}

export class JSNumber extends JSValue {
    constructor(value) {
        super()
        // 实际应该用 IEEE754 标准存储到 64 位中，为简化使用了 Float64Array
        this.memory = new ArrayBuffer(8)
        if (arguments.length) {
            new Float64Array(this.memory)[0] = value
        } else {
            new Float64Array(this.memory)[0] = 0
        }
    }
    get value() {
        return new Float64Array(this.memory)[0]
    }
    // 类型转换
    toString(){
        // TODO
    }
    toNumber(){
        return this
    }
    toBoolean(){
        return new Float64Array(this.memory)[0] === 0 ? new JSBoolean(false) : new JSBoolean(true)
    }
    toObject(){
        // boxing TODO
    }
}

export class JSString extends JSValue {
    // 为简化，先给 1024 长度，实际应该是变长的，处理比较复杂
    constructor(characters) {
        super()
        // 用 UTF-16 存储
        // this.memory = new ArrayBuffer(characters.length * 2)
        this.characters = characters
    }
    toString(){
        return this
    }
    toNumber(){
        // TODO
    }
    toBoolean(){
        return new Float64Array(this.memory)[0] === 0 ? new JSBoolean(false) : new JSBoolean(true)
    }
}

export class JSBoolean extends JSValue {
    constructor(value) {
        super()
        this.value = value || false
    }
    toString(){
        return this.value ? new JSString(['t', 'r', 'u', 'e']) : new JSString(['f', 'a', 'l', 's', 'e'])
    }
    toNumber(){
        return this.value ? new JSNumber(1) : new JSNumber(0)
    }
    toBoolean(){
        return this
    }
}

export class JSObject extends JSValue {
    // 用 map 保存
    constructor(proto) {
        super()
        this.properties = new Map()
        this.prototype = proto || null
    }
    setPrototype(proto) {
        this.prototype = proto
    }
    getPrototype(proto) {
        this.prototype
    }
    setProperty(name, attribute) {
        this.properties.set(name, attribute)
    }
    getProperty(name) {
        // 和原型有关

    }
}

export class JSNull extends JSValue {
    toString(){
        return new JSString(['n', 'u', 'l', 'l'])
    }
    toNumber(){
        return new JSNumber(0)
    }
    toBoolean(){
        return new JSBoolean(false)
    }
}

export class JSUndefined extends JSValue {
    toString(){
        return new JSString(['u', 'n', 'd', 'e', 'f', 'i', 'n', 'e', 'd'])
    }
    toNumber(){
        return new JSNumber(NaN)
    }
    toBoolean(){
        return new JSBoolean(false)
    }
}

export class JSSymbol extends JSValue {
    constructor(name) {
        this.name = name || ''
    }
}