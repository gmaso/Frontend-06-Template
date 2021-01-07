// 把形如 div#id.class[attr*=value] 的单个复杂选择器拆分为数组
function toSingles(selector) {
  let singles = [];
  singles.push(...(selector.match(/(#[a-z0-9-]+)/ig) || [])); // id选择器
  singles.push(...(selector.match(/(\.[a-z0-9-]+)/ig) || [])); // 类选择器
  singles.push(...(selector.match(/\[([a-z0-9-]+)([\^*$])?=['"]?([a-z0-9_-]+)['"]?]/ig) || [])); // 属性选择器
  singles.push(...(selector.match(/^([a-z0-9-]+)/ig) || [])); // 类型选择器
  return singles;
}

// 匹配复合选择器与单个元素
function matchComposite(element, selector) {
  // 假设 selector 是复合选择器
  if (!selector || !element.attributes) {
    return false;
  }
  // 连续的复合选择器拆分，比如 div#id.class[attr*=value]
  let singles = toSingles(selector);
  // 判断是否满足选择器的每一部分
  return singles.every((single) => matchSingle(element, single));

  // 匹配元素与单个选择器
  function matchSingle(element, selector) {
    let attributes = [...element.attributes];
    if (selector.charAt(0) === '#') {
      let id = attributes.filter((attr) => attr.name === 'id')[0];
      if (id && id.value === selector.replace('#', '')) {
        return true;
      }
    } else if (selector.charAt(0) === '.') {
      let className = attributes.filter((attr) => attr.name === 'class')[0];
      if (className && className.value.split(' ').some((cname) => cname === selector.replace('.', ''))) {
        return true;
      }
    } else if (selector.charAt(0) === '[') { // 属性选择器
      let reg = /^\[([a-z0-9-]+)([\^*$])?=['"]?([a-z0-9_-]+)['"]?]$/i; // 只处理开始、包含、结束三种
      if (!reg.test(selector)) {
        return false;
      }
      let m = selector.match(reg);
      let attr = m[1];
      let type = m[2] || '';
      let value = m[3];
      let item = attributes.filter((item) => item.name === attr)[0];
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
    } else if (element.tagName.toLowerCase() === selector) {
      return true;
    }
    return false;
  }
}

// 匹配复杂选择器
function match(selector, element) {
  if (!element) {
    return false;
  }

  // 取出选择器，暂不考虑逗号分隔的选择器（只取 0）和复合选择器
  let selectorParts = selector.split(' ').reverse();
  
  // 如果当前元素和最后一个选择器不匹配
  if (!matchComposite(element, selectorParts[0])) {
    return false;
  }

  // 循环选择器和元素
  let j = 1;
  if (selectorParts.length > 1) {
    while(element.parentNode) {
      element = element.parentNode;
      if (matchComposite(element, selectorParts[j])) {
        j++;
      }
      // 检查选择器是否都匹配到
      if (j >= selectorParts.length) {
        return true;
      }
    }
  }
  // 检查选择器是否都匹配到
  if (j >= selectorParts.length) {
    return true;
  }

  return false;
}
