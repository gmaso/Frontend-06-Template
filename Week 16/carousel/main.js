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