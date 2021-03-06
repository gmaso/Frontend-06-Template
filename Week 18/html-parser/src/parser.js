const EOF = Symbol('EOF'); // 唯一代表结束

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack;


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
      if (p && p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

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
    return data;
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
  } else if (c.match(/^[a-zA-Z-:]$/)) { // 属性名可以包含 - 和 :
    currentAttribute.name += c;
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    };
    return beforeAttributeName;
  } else if (c === '"') {
    return doubleQuatedAttributeName;
  } else if (c === '\'') {
    return singleQuatedAttributeName;
  } else if (c === '>' || c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return tagName(c);
  } else if (c.match(/^[a-zA-Z0-9]$/)) {
    currentAttribute.value += c;
    return beforeAttributeValue;
  } else {
    return beforeAttributeValue;
  }
}

function doubleQuatedAttributeName(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeValue;
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuatedAttributeName;
  }
}

function singleQuatedAttributeName(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeValue;
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return singleQuatedAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfColsing = true;
    emit(currentToken);
    return data;
  } else {

  }
}

module.exports.parseHTML = function parseHTML(html) {
  currentToken = null;
  currentAttribute = null;
  currentTextNode = null;
  stack = [{type: 'document', children: []}];
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}