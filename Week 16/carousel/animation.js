import {linear} from './case.js';

const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIMES = Symbol('start-times');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

// 动态调用属性动画，得到帧
export class Timeline {
  constructor () {
    this.state = 'inited';
    this[ANIMATIONS] = new Set();
    this[START_TIMES] = new Map();
  }

  // 开始播放
  start () {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'started';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    // 使用 Symbol 保存属性，避免外部访问到此方法
    this[TICK] = () => {
      // console.log('tick');
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIMES].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        } else {
          t = now - this[START_TIMES].get(animation) - this[PAUSE_TIME] - animation.delay;
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          // 避免超出范围
          t = animation.duration;
        }
        if (t > 0) {
          animation.receive(t)
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  // 暂停
  pause () {
    if (this.state === 'started') {
      this.state = 'paused';
      this[PAUSE_START] = Date.now();
      cancelAnimationFrame(this[TICK_HANDLER]);
    }
  }

  // 重启
  resume () {
    if (this.state === 'paused') {
      this.state = 'started';
      this[PAUSE_TIME] += this[PAUSE_START] ? Date.now() - this[PAUSE_START] : 0;
      this[PAUSE_START] = 0;
      this[TICK]();
    }
  }

  // 倍数
  // set rate() {

  // }
  // get rate() {

  // }

  reset () {
    this.pause();
    this.state = 'inited';
    this[ANIMATIONS] = new Set();
    this[START_TIMES] = new Map();
    this[PAUSE_START] = 0;
    this[PAUSE_TIME] = 0;
    this[TICK_HANDLER] = null;
  }

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIMES].set(animation, startTime);
  }
  remove() {

  }
}

// 传入时间点，返回对应属性值
export class Animation {
  // 暂不考虑数值单位问题
  constructor (object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.range = this.endValue - this.startValue;
    this.timingFunction = timingFunction || (v => v);
    this.template = template || (v => v);
  }
  receive (time) {
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(this.startValue + this.range * progress);
    // console.log(time, this.duration, progress, this.range, this.object[this.property]);
  }
}