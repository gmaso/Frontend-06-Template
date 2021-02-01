import {Component, createElement} from './framework.js';

class Carousel extends Component {
  constructor() {
    super();
  }
  render() {
    return document.createElement('div');
  }
}

let a = <Carousel id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
    </Carousel>

// document.body.appendChild(a);

a.mountTo(document.body);