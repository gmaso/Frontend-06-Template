import {Component, createElement} from './framework.js';

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    for (let src of this.attributes.src) {
      let img = document.createElement('img');
      img.src = src;
      this.root.appendChild(img);
    }
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let d = [
  'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg'
];

let a = <Carousel src={d}>
    </Carousel>

// document.body.appendChild(a);

a.mountTo(document.body);