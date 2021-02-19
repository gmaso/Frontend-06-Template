import {Component, ATTRIBUTE, STATE} from './framework.js';
import {enableGesture} from './gesture.js';
import {Animation,Timeline} from './animation.js';
import {ease} from './case.js';

// 往外部 export
export {ATTRIBUTE, STATE} from './framework.js';

export class Carousel extends Component {
  constructor() {
    super();
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let src of this[ATTRIBUTE].src) {
      let img = document.createElement('div');
      img.style.backgroundImage = `url(${src})`;
      img.style.backgroundSize = 'contain';
      this.root.appendChild(img);
    }

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;
    this[STATE].position = 0;
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

    this.root.addEventListener('tap', event => {
      this.triggerEvent('click', 
      { 
        position: this[STATE].position,
        data: this[ATTRIBUTE].src[this[STATE].position],
      });
    });

    this.root.addEventListener('pan', event => {
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - ((x - x % 500) / 500);

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
      let current = this[STATE].position - ((x - x % 500) / 500);
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

      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
      this.triggerEvent('change', { position: this[STATE].position });
    });

    let auto = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;
      let current = children[this[STATE].position];
      let next = children[nextIndex];

      t = Date.now();

      // 添加 amination
      timeline.add(new Animation(current.style, 'transform', -this[STATE].position * 500, -500 - this[STATE].position * 500, 1500, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, 'transform', 500 - nextIndex * 500,- nextIndex * 500, 1500, 0, ease, v => `translateX(${v}px)`));

      this[STATE].position = nextIndex;
      this.triggerEvent('change', { position: this[STATE].position });
    }

    handler = setInterval(auto, 3000);
    
    return this.root;
  }
}