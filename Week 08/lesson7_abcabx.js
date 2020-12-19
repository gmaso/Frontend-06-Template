// 处理 abcabx 状态
function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  } else {
    return start;
  }
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  } else {
    // reConsume：start 接收 c 参数，重新开始匹配，否则会丢失字符匹配
    return start(c);
  }
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === 'a') {
    return foundA2;
  } else {
    return start(c);
  }
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  } else {
    return start(c);
  }
}

function foundB2(c) {
  if (c === 'x') {
    return end;
  } else {
    return foundB(c);
  }
}

function end(c) {
  return end;
}

console.log(match('abcaabcabx'));