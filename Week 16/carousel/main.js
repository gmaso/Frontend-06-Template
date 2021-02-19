import {createElement} from './framework.js';
import {Carousel} from './carousel.js';
import {Animation, Timeline} from './animation.js';

let d = [
  'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg'
];

let a = <Carousel src={d} 
  onChange={event => console.log(event.detail.position)}
  onClick={event => console.log(event.detail.data)}
>
    </Carousel>

// document.body.appendChild(a);

a.mountTo(document.body);