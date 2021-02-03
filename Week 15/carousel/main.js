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

let am = new Animation({a: 5}, 'a', 5, 100, 1000);

let tl = new Timeline();

tl.add(am);
tl.start();