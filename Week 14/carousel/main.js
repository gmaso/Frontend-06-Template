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

    let position = 0;
    this.root.addEventListener('mousedown', event => {
      let children = this.root.children;
      let startX = event.clientX;

      let move = event => {
        let x = event.clientX - startX;

        let current = position - ((x - x % 500) / 500);

        for (let offset of [-1, 0, 1]) {
          let pos = ((current + offset) + children.length) % children.length;
          let child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
        }
      }

      let up = event => {
        // 移动到最近一张
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);
        for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = ((position + offset) + children.length) % children.length;
          let child = children[pos];
          child.style.transition = '';
          child.style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);


    });
    
    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;
    //   let current = children[currentIndex];
    //   let next = children[nextIndex];

    //   next.style.transition = 'none';
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = '';
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`;
    //     currentIndex = nextIndex;
    //   }, 16);
      
    // }, 3000);

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