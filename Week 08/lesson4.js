function findAB(s) {
  let stateA = false;
  for (let c of s) {
    if (c === 'a') {
      stateA = true;
    } else if (stateA && c === 'b') {
      return true;
    } else if (stateA) {
      stateA = false;
    }
  }
  return false;
}
console.log(findAB('abdcs'));
console.log(findAB('bdadabcs'));