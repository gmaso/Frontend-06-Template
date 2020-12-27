const css = require('css');

const EOF = Symbol('EOF'); // 唯一代表结束


// 
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{type: 'document', children: []}];

let CSSRules = [];
function addCSSRules(text) {
  let ast = css.parse(text);
  CSSRules.push(...ast.stylesheet.rules);
}

function match(element, selector) {

}

function computeCSS(element) {
  // 获取父元素序列，使用 slice 断开与 stack 的联系，reverse 是因为 CSS 匹配是从当前元素往上匹配
  let elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    // 取出选择器，暂不考虑逗号分隔的选择器（只取 0）和复合选择器
    let selectorParts = rule.selectors[0].split(' ').reverse();

    // 如果当前元素和最后一个选择器不匹配
    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    // 双循环选择器和元素
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    // 检查选择器是否都匹配到
    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      console.log('Element', element, 'matched rule', rule);
    }
  }
}


function emit(token) {
  // 取栈顶元素。栈顶始终保存当前正在处理的元素
  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    // 创建元素后，立即进行 CSS 计算
    computeCSS(element);

    top.children.push(element);
    // element.parent = top;

    // 对自封闭标签，已经处理完毕， 不用入栈
    if (!token.isSelfColsing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end does\'t match!');
    } else {
      // 遇到 style 结束标签时，添加 CSS 规则
      // link 标签暂不处理
      if (top.tagName === 'style') {
        addCSSRules(currentTextNode.content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (!currentTextNode) {
      currentTextNode = {
        type: 'text',
        content: ''
      };
      top.children.push(currentTextNode);
      // currentTextNode.parent = top;
    }
    currentTextNode.content += token.content;
  }
  
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return ;
  } else {
    emit({
      type: 'text',
      content: c
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c); // reConsume
  } else {
    return ;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c); // reConsume
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {

  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentAttribute = {
      name: '',
      value: ''
    };
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentAttribute = {
      name: '',
      value: ''
    };
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>' || c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return tagName(c);
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentAttribute.name += c;
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    };
    return beforeAttributeName;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentAttribute.value += c;
    return beforeAttributeValue;
  } else {
    return beforeAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfColsing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {

  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack[0])
}