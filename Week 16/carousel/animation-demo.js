import {Animation, Timeline} from './animation.js';
import {linear, ease} from './case.js';

let card = document.querySelector('#card');

let tl = new Timeline();
window.tl = tl;
tl.start();

document.querySelector('#pause').addEventListener('click', () => {
  tl.pause();
});

document.querySelector('#resume').addEventListener('click', () => {
  tl.resume();
});

let am = new Animation(card.style, 'transform', 0, 500, 2000, 0, ease, v => `translateX(${v}px)`);
window.am = am;

// 动态添加 amination
tl.add(am);

document.querySelector('#card2').style.transition = 'ease 2s';
document.querySelector('#card2').style.transform = 'translateX(500px)';