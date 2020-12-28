const parser = require('../http/parser');

describe('测试打散函数 toSingles：', () => {
  test(`"div" to singles to "['div']"`, () => {
    expect(parser.toSingles('div')).toEqual(['div']);
  });
  test(`"div.class" to singles to "['.class', 'div']"`, () => {
    expect(parser.toSingles('div .class')).toEqual(['.class', 'div']);
  });
  test(`"#id.class" to singles to "['#id', '.class']"`, () => {
    expect(parser.toSingles('#id.class')).toEqual(['#id', '.class']);
  });
  test(`"[attr*=value]" to singles to "['[attr*=value]']"`, () => {
    expect(parser.toSingles('[attr*=value]')).toEqual(['[attr*=value]']);
  });
  test(`"div#id.class[attr*=value]" to singles to "['#id', '.class', '[attr*=value]', 'div']"`, () => {
    expect(parser.toSingles('div#id.class[attr*=value]')).toEqual(['#id', '.class', '[attr*=value]', 'div']);
  });
});


describe('测试匹配函数 match：', () => {
  let element = JSON.parse(
`{
  "type": "element",
  "children": [],
  "attributes": [
      {
          "name": "id",
          "value": "myid"
      },
      {
          "name": "class",
          "value": "myclass mapid"
      },
      {
          "name": "isSelfColsing",
          "value": true
      }
  ],
  "tagName": "img"
}`
  );

  test(`<img id="myid" class="myclass mapid" /> does't match "div"`, () => {
    expect(parser.match(element, 'div')).toBe(false);
  });
  test(`<img id="myid" class="myclass mapid" /> match "#myid"`, () => {
    expect(parser.match(element, '#myid')).toBe(true);
  });
  test(`<img id="myid" class="myclass mapid" /> match ".myclass"`, () => {
    expect(parser.match(element, '.myclass')).toBe(true);
  });
  test(`<img id="myid" class="myclass mapid" /> match "img.myclass[class$=pid]"`, () => {
    expect(parser.match(element, 'img.myclass[class$=pid]')).toBe(true);
  });
  test(`<img id="myid" class="myclass mapid" /> does't match "img#myid[class*=spid]"`, () => {
    expect(parser.match(element, 'img#myid[class*=spid]')).toBe(false);
  });
});


describe('测试计算特异性函数 calcSpecificity：', () => {
  test(`specificity of "div" is "[0, 0, 0, 1]"`, () => {
    expect(parser.calcSpecificity('div')).toEqual([0, 0, 0, 1]);
  });
  test(`specificity of "div.class" is "[0, 0, 1, 1]"`, () => {
    expect(parser.calcSpecificity('div .class')).toEqual([0, 0, 1, 1]);
  });
  test(`specificity of "#id.class" is "[0, 1, 1, 0]"`, () => {
    expect(parser.calcSpecificity('#id.class')).toEqual([0, 1, 1, 0]);
  });
  test(`specificity of "[attr*=value]" is "[0, 0, 1, 0]"`, () => {
    expect(parser.calcSpecificity('[attr*=value]')).toEqual([0, 0, 1, 0]);
  });
  test(`specificity of "div#id.class[attr*=value]" is "[0, 1, 2, 1]"`, () => {
    expect(parser.calcSpecificity('div#id.class[attr*=value]')).toEqual([0, 1, 2, 1]);
  });
  test(`specificity of "body #div .class div#id.class[attr*=value]" is "[0, 2, 3, 2]"`, () => {
    expect(parser.calcSpecificity('body #div .class div#id.class[attr*=value]')).toEqual([0, 2, 3, 2]);
  });
  test(`specificity of "body #div .class #id.class[attr*=value]" is "[0, 2, 3, 1]"`, () => {
    expect(parser.calcSpecificity('body #div .class #id.class[attr*=value]')).toEqual([0, 2, 3, 1]);
  });
});