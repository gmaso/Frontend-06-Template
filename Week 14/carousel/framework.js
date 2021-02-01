export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }

  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    console.log(child)
    child.mountTo(element);
  }
  return element;
}


export class Component {
  constructor() {
    this.root = this.render();
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.root.appendChild(child);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }

}

class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }
  render() {
    return document.createElement('div');
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
  render() {
    return document.createElement('div');
  }
}