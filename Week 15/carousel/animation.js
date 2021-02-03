const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIMES = Symbol('start-times');

// 动态调用属性动画，得到帧
export class Timeline {
  constructor () {
    this[ANIMATIONS] = new Set();
    this[START_TIMES] = new Map();
  }

  // 开始播放
  start () {
    let startTime = Date.now();
    // 使用 Symbol 保存属性，避免外部访问到此方法
    this[TICK] = () => {
      // console.log('tick');
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIMES].get(animation) < startTime) {
          t = now - startTime;
        } else {
          t = now - this[START_TIMES].get(animation);
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          // 避免超出范围
          t = animation.duration;
        }
        animation.receive(t)
      }
      requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  // 暂停
  pause () {

  }

  // 恢复
  resume () {

  }

  // 倍数
  // set rate() {

  // }
  // get rate() {

  // }

  reset () {

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
  constructor (object, property, startValue, endValue, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.range = this.endValue - this.startValue;
    this.timingFunction = timingFunction;
  }
  receive (time) {
    this.object[this.property] = this.startValue + this.range * time / this.duration;
    console.log(time, this.object[this.property]);
  }
}