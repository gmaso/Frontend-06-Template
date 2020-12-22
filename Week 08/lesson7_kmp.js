// 根据 pattern，动态生成匹配的状态机
function match(string, pattern) {
  let funs = [];
  for (let i = 0; i < pattern.length; i++) {
    funs[i] = function (c) {
      if (c === pattern[i]) {
        return funs[i+1];
      } else if (pattern.lastIndexOf(pattern[i-1], i - 2) > -1) {
        // 匹配上一个相同字符的后一位，reConsume
        return funs[pattern.lastIndexOf(pattern[i-1], i - 2) + 1](c);
      } else {
        return funs[0];
      }
    }
  }
  funs[pattern.length] = function (c) {
    return funs[pattern.length];
  }

  let state = funs[0];
  for (let c of string) {
    state = state(c);
  }
  return state === funs[pattern.length];
}

console.log(match('abababcabcabxx', 'abcabcabx'));
console.log(match('abababcabcabxx', 'abcabx'));