import {Component, createElement, ATTRIBUTE, STATE} from './framework.js';
import {enableGesture} from './gesture.js';

// 往外部 export
export {ATTRIBUTE, STATE} from './framework.js';

export class List extends Component {
  constructor() {
    super();
  }
  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }
  
  appendChild(child) {
    this.template = (child);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }
}