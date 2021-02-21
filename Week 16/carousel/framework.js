export function createElement(type, attributes, ...children) {
  let element;
  console.log(type)
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }

  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  let processChildren = (children) => {
    for (let child of children) {
      if ((typeof child === 'object') && (child instanceof Array)) {
        processChildren(child);
        continue;
      }
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      console.log(child)
      // element.appendChild(child);
      child.mountTo(element);
    }
  }
  processChildren(children);
  
  return element;
}

// 全局唯一的访问 state 的方法
export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
  constructor() {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  render() {
    return this.root;
  }

  appendChild(child) {
    if (!this.root) {
      this.render();
    }
    this.root.appendChild(child);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }));
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
}