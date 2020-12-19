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
  if (c === 'd') {
    return foundD;
  } else {
    return start(c);
  }
}

function foundD(c) {
  if (c === 'e') {
    return foundE;
  } else {
    return start(c);
  }
}

function foundE(c) {
  if (c === 'f') {
    return end;
  } else {
    return start(c);
  }
}

// trap 陷阱，保存状态
function end(c) {
  return end;
}

console.log(match('abcd'));
console.log(match('abcabcdefdabcs'));