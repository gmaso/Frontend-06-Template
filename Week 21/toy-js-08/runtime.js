
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
