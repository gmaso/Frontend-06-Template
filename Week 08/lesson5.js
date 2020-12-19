function findString(s) {
  let state = '';
  for (let c of s) {
    if (c === 'a') {
      state = 'a';
    } else if (state === 'a' && c === 'b') {
      state = 'b';
    } else if (state === 'b' && c === 'c') {
      state = 'c';
    } else if (state === 'c' && c === 'd') {
      state = 'd';
    } else if (state === 'd' && c === 'e') {
      state = 'e';
    } else if (state === 'e' && c === 'f') {
      return true;
    } else if (state) {
      state = '';
    }
  }
  return false;
}
console.log(findString('abddcs'));
console.log(findString('abcabcdefdabcs'));