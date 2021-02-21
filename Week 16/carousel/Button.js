import {Component, createElement, ATTRIBUTE, STATE} from './framework.js';
import {enableGesture} from './gesture.js';

// 往外部 export
export {ATTRIBUTE, STATE} from './framework.js';

export class Button extends Component {
  constructor() {
    super();
  }
  render() {
    // this.root = document.createElement('div');
    this.childrenContainer = <span />;
    this.root = (<div>{this.childrenContainer}</div>).render();

    return this.root;
  }
  
  appendChild(child) {
    if (!this.childrenContainer) {
      this.render();
    }
    this.childrenContainer.appendChild(child);
  }
}