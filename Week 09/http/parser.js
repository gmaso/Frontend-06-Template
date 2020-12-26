const EOF = Symbol('EOF'); // 唯一代表结束

function emit(token) {
  console.log(token);
}

// 
let currentToken = null;
let currentAttribute = null;

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
}