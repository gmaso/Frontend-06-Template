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

// 把形如 div#id.class[attr*=value] 的单个复杂选择器拆分为数组
function toSingles(selector) {
  let singles = [];
  singles.push(...(selector.match(/(#[a-z]+)/ig) || [])); // id选择器
  singles.push(...(selector.match(/(\.[a-z]+)/ig) || [])); // 类选择器
  singles.push(...(selector.match(/\[([a-z]+)([\^*$])?=['"]?([a-z0-9_-]+)['"]?]/ig) || [])); // 属性选择器
  singles.push(...(selector.match(/^([a-z]+)/ig) || [])); // 类型选择器
  return singles;
}

function match(element, selector) {
  // 假设 selector 是简单选择器。如果考虑复杂选择器，需要用正则进行拆分，然后进行关系处理
  if (!selector || !element.attributes) {
    return false;
  }
  // 连续的复合选择器拆分，比如 div#id.class[attr*=value]
  let singles = toSingles(selector);
  // 判断是否满足选择器的每一部分
  return singles.every((single) => matchSingle(element, single));

  // 匹配元素与单个选择器
  function matchSingle(element, selector) {
    if (selector.charAt(0) === '#') {
      let id = element.attributes.filter((attr) => attr.name === 'id')[0];
      if (id && id.value === selector.replace('#', '')) {
        return true;
      }
    } else if (selector.charAt(0) === '.') {
      let className = element.attributes.filter((attr) => attr.name === 'class')[0];
      if (className && className.value.split(' ').some((cname) => cname === selector.replace('.', ''))) {
        return true;
      }
    } else if (selector.charAt(0) === '[') { // 属性选择器
      let reg = /^\[([a-z]+)([\^*$])?=['"]?([a-z0-9_-]+)['"]?]$/i; // 只处理开始、包含、结束三种
      if (!reg.test(selector)) {
        return false;
      }
      let m = selector.match(reg);
      let attr = m[1];
      let type = m[2] || '';
      let value = m[3];
      let item = element.attributes.filter((item) => item.name === attr)[0];
      if (item) {
        if (type === '^' && attr === 'class' && item.value.split(' ').some((cname) => cname.indexOf(value) === 0)) { // 特殊处理 class 的匹配，可以空格分隔
          return true;
        } else if (type === '^' && item.value.indexOf(value) === 0) {
          return true;
        } else if (type === '*' && item.value.indexOf(value) > -1) {
          return true;
        } else if (type === '$' && attr === 'class' && item.value.split(' ').some((cname) => cname.indexOf(value) === cname.length - value.length)) { // 特殊处理 class 的匹配，可以空格分隔
          return true;
        } else if (type === '$' && item.value.indexOf(value) === item.value.length - value.length) {
          return true;
        } else if (item.value === value) {
          return true;
        }
      }
    } else if (element.tagName === selector) {
      return true;
    }
    return false;
  }
}

// 缓存特异性的值
const specificityMap = new Map();
function calcSpecificity(selector) {
  if (specificityMap.has(selector)) {
    return specificityMap.get(selector);
  }

  // 使用四元组 [0, 0, 0, 0] 分别表示 inline、id 数量、class 数量、tagName 数量
  let selectorParts = selector.split(' ');

  let singles = [];
  for ( let s of selectorParts) {
    singles.push(...toSingles(s));
  }

  let spec = new Array(4).fill(0); // inline 位置为 0
  spec[1] += singles.filter(str => /^#[a-z]/i.test(str)).length; // id 选择器
  spec[2] += singles.filter(str => /^\.[a-z]/i.test(str)).length; // 类选择器
  spec[2] += singles.filter(str => /^\[[a-z]/i.test(str)).length; // 属性选择器
  spec[3] += singles.filter(str => /^[a-z]/i.test(str)).length; // 标签选择器

  specificityMap.set(selector, spec);
  return spec;
}

// 判断特异性A是否大于等于特异性B
function compareSpecificity(specA, specB) {
  let i = 0;
  while (i < 4) {
    if (specA[i] < specB[i]) {
      return false;
    }
    i++;
  }
  return true;
}

function computeCSS(element) {
  // 获取父元素序列，使用 slice 断开与 stack 的联系，reverse 是因为 CSS 匹配是从当前元素往上匹配
  let elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of CSSRules) {
    // 取出选择器，暂不考虑逗号分隔的选择器（只取 0）和复合选择器
    let selectorParts = rule.selectors[0].split(' ').reverse();
    
    let specificity = calcSpecificity(rule.selectors[0]);

    // 如果当前元素和最后一个选择器不匹配
    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    // 双循环选择器和元素
    let j = 1;
    if (selectorParts.length > 1) {
      for (let i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++;
        }
      }
    }
    // 检查选择器是否都匹配到
    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      rule.declarations.map((item) => {
        if (!element.computedStyle[item.property]) {
          // 使用对象存储属性，方便保存非 value 的其它参数，如优先级
          element.computedStyle[item.property] = {};
          element.computedStyle[item.property].specificity = [0, 0, 0, 0];
        }
        if (compareSpecificity(specificity, element.computedStyle[item.property].specificity)) {
          element.computedStyle[item.property].value = item.value;
          element.computedStyle[item.property].specificity = specificity;
        }
      });
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
      if (p && p !== 'type' && p !== 'tagName') {
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
  return stack[0];
}

// 导出函数，用于单元测试
module.exports.toSingles = toSingles;
module.exports.match = match;
module.exports.calcSpecificity = calcSpecificity;