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
    this.root.classList.add('carousel');
    for (let src of this.attributes.src) {
      let img = document.createElement('div');
      img.style.backgroundImage = `url(${src})`;
      img.style.backgroundSize = 'contain';
      this.root.appendChild(img);
    }
    
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;
      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        next.style.transition = '';
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${- nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 16);
      
    }, 3000);

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