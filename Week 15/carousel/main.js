import {createElement} from './framework.js';
import {Carousel} from './carousel.js';
import {Animation, Timeline} from './animation.js';

let d = [
  'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg'
];

let a = <Carousel src={d}>
    </Carousel>

// document.body.appendChild(a);

a.mountTo(document.body);


let tl = new Timeline();
window.tl = tl;
tl.start();

let am = new Animation({a: 5}, 'a', 5, 1000, 5000, 0, v => v);
window.am = am;

// 动态添加 amination
tl.add(am);