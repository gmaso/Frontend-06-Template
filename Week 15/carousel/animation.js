const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');

// 动态调用属性动画，得到帧
export class Timeline {
  constructor () {
    this[ANIMATIONS] = new Set();
  }

  // 开始播放
  start () {
    let startTime = Date.now();
    // 使用 Symbol 保存属性，避免外部访问到此方法
    this[TICK] = () => {
      let t = Date.now() - startTime;
      for (let animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          // 避免超出范围
          t0 = animation.duration;
        }
        animation.receive(t0)
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

  add(animation) {
    this[ANIMATIONS].add(animation);
  }
  remove() {

  }
}

// 传入时间点，返回对应属性值
export class Animation {
  // 暂不考虑数值单位问题
  constructor (object, property, startValue, endValue, duration, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.range = this.endValue - this.startValue;
    this.timingFunction = timingFunction;
  }
  receive (time) {
    this.object[this.property] = this.startValue + this.range * time / this.duration;
    // console.log(time, this.object[this.property]);
  }
}