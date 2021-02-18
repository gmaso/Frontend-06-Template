export let linear = v => v;

export let cubicBezier = (x1, y1, x2, y2, precision) => {
  precision = precision || 0.00001;

  var pow = Math.pow,
    abs = Math.abs;

  /**
   * @function yFn 三次贝塞尔曲线 y 坐标的函数。
   * @param {number} t 贝塞尔曲线的绘制比例，t ∈ [0, 1]。
   * @return {number} 贝塞尔曲线上 t 对应的点的 y 坐标。
   */
  function yFn(t) {
    // 3 * (1 - t) ^ 2 * t * y1 + 3 * (1 - t) * t ^ 2 * y2 + t ^ 3
    // 3 * pow(1 - t, 2) * t * y1 + 3 * (1 - t) * pow(t, 2) * y2 + pow(t, 3);
    return (3 * y1 - 3 * y2 + 1) * pow(t, 3) + (3 * y2 - 6 * y1) * pow(t, 2) + 3 * y1 * t;
  }

  /**
   * @function xFn 三次贝塞尔曲线 x 坐标的函数。
   * @param {number} t 贝塞尔曲线的绘制比例，t ∈ [0, 1]。
   * @return {number} 贝塞尔曲线上 t 对应的点的 x 坐标。
   */
  function xFn(t) {
    // 3 * (1 - t) ^ 2 * t * x1 + 3 * (1 - t) * t ^ 2 * x2 + t ^ 3
    // 3 * pow(1 - t, 2) * t * x1 + 3 * (1 - t) * pow(t, 2) * x2 + pow(t, 3);
    return (3 * x1 - 3 * x2 + 1) * pow(t, 3) + (3 * x2 - 6 * x1) * pow(t, 2) + 3 * x1 * t;
  }

  /**
   * @function resolveT 根据给定的横坐标 x，求相应的三次贝塞尔曲线的绘制比例 t（近似解）。
   * @param {number} x 横坐标，x ∈ [0, 1]。
   * @return {number} 贝塞尔曲线的绘制比例 t。
   */
  function resolveT(x) {
    var left = 0,
      right = 1,
      t,
      approximateX;
    // 夹逼法求t的近似解
    while (left < right) {
      t = (left + right) / 2;
      approximateX = xFn(t);
      if (abs(x - approximateX) < precision) {
        return t;
      } else if (x < approximateX) {
        right = t;
      } else {
        left = t;
      }
    }

    return t;
  }

  /**
   * 三次贝塞尔曲线的函数，可根据给定的横坐标 x 求对应的纵坐标 y。
   */
  return function (x) {
    if (x <= 0) {
      return 0;
    }

    if (x >= 1) {
      return 1;
    }

    return yFn(resolveT(x));
  };
}

export let ease = cubicBezier(0.25, 0.1, 0.25, 1);

export let easeIn = cubicBezier(0.42, 0, 1, 1);

export let easeOut = cubicBezier(0, 0, 0.58, 1);

export let easeInOut = cubicBezier(0.42, 0, 0.58, 1);