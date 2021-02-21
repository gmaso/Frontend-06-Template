import {createElement} from './framework.js';
import {Carousel} from './Carousel.js';
import {Button} from './Button.js';
import {List} from './List.js';
import {Animation, Timeline} from './animation.js';

let d = [
  'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg'
];

// let a = <Carousel src={d} 
//   onChange={event => console.log(event.detail.position)}
//   onClick={event => console.log(event.detail.data)}
// >
//     </Carousel>

// document.body.appendChild(a);

// a.mountTo(document.body);

// let b = <Button>content</Button>

// b.mountTo(document.body);


let c = <List data={d}>
  {
    (record) => <div>
      <img src={record} />
      <a href={record}>{record}</a>
    </div>
  }
</List>

c.mountTo(document.body);