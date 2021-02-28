var assert = require('assert');
import {parseHTML} from '../src/parser.js';

describe('parse html:', function () {
  it('<a></a>', function () {
    let tree = parseHTML('<a></a>');
    console.log(tree);
    assert.equal(tree.children[0].tagName, 'a');
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href ></a>', function () {
    let tree = parseHTML('<a href ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href id></a>', function () {
    let tree = parseHTML('<a href id></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href="abc" id></a>', function () {
    let tree = parseHTML('<a href="abc" id></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href=abc id></a>', function () {
    let tree = parseHTML('<a href=abc id></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href='abc'></a>", function () {
    let tree = parseHTML("<a href='abc'></a>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<img/>', function () {
    let tree = parseHTML('<img/>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  
  it('<a href=abc id>abc</a>', function () {
    let tree = parseHTML('<a href=abc id>abc</a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 1);
  });
});
