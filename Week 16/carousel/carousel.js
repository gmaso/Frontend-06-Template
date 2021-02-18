import {Component} from './framework.js';
import {enableGesture} from './gesture.js';
import {Animation,Timeline} from './animation.js';
import {ease} from './case.js';

export class Carousel extends Component {
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

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;
    let position = 0;
    let handler = null;
    let t = 0;
    let ax = 0;

    this.root.addEventListener('start', event => {
      timeline.pause();
      clearInterval(handler);
      console.log('start')
      let progress = (Date.now() - t) / 1500;
      ax = ease(progress) * 500 - 500;
    });

    this.root.addEventListener('pan', event => {
      let x = event.clientX - event.startX - ax;
      let current = position - ((x - x % 500) / 500);

      for (let offset of [-1, 0, 1]) {
        let pos = ((current + offset) % children.length + children.length) % children.length;
        let child = children[pos];
        child.style.transition = 'none';
        child.style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
      }
    });
    this.root.addEventListener('end', event => {
      console.log('end')
      timeline.reset();
      timeline.start();
      handler = setInterval(auto, 3000);

      let x = event.clientX - event.startX - ax;
      let current = position - ((x - x % 500) / 500);
      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        console.log(event.velocity)
        if (direction > 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = ((current + offset) % children.length + children.length) % children.length;
        let child = children[pos];
        child.style.transition = 'none';
        timeline.add(new Animation(child.style, 'transform',
          - pos * 500 + offset * 500 + x % 500,
          - pos * 500 + offset * 500 + direction * 500,
          1500, 0, ease, v => `translateX(${v}px)`));
      }

      position = position - ((x - x % 500) / 500) - direction;
      position = (position % children.length + children.length) % children.length;
    });

    let auto = () => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;
      let current = children[position];
      let next = children[nextIndex];

      t = Date.now();

      // 添加 amination
      timeline.add(new Animation(current.style, 'transform', -position * 500, -500 - position * 500, 1500, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, 'transform', 500 - nextIndex * 500,- nextIndex * 500, 1500, 0, ease, v => `translateX(${v}px)`));

      position = nextIndex;
    }

    handler = setInterval(auto, 3000);
    
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}