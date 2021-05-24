import { Evaluator } from './evaluator.js'
import { parse } from './SyntaxParser.js'

document.getElementById('run').addEventListener('click', event => {
    // 解析
    let tree = parse(document.getElementById('source').value)
    console.log(tree)
    // 执行
    let r = new Evaluator().evaluate(tree)
    console.log(r)
})