/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./animation-demo.js":
/*!***************************!*\
  !*** ./animation-demo.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ \"./animation.js\");\n/* harmony import */ var _case_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./case.js */ \"./case.js\");\n\n\nvar card = document.querySelector('#card');\nvar tl = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Timeline();\nwindow.tl = tl;\ntl.start();\ndocument.querySelector('#pause').addEventListener('click', function () {\n  tl.pause();\n});\ndocument.querySelector('#resume').addEventListener('click', function () {\n  tl.resume();\n});\nvar am = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation(card.style, 'transform', 0, 500, 2000, 0, _case_js__WEBPACK_IMPORTED_MODULE_1__.ease, function (v) {\n  return \"translateX(\".concat(v, \"px)\");\n});\nwindow.am = am; // 动态添加 amination\n\ntl.add(am);\ndocument.querySelector('#card2').style.transition = 'ease 2s';\ndocument.querySelector('#card2').style.transform = 'translateX(500px)';\n\n//# sourceURL=webpack://jsx/./animation-demo.js?");

/***/ }),

/***/ "./animation.js":
/*!**********************!*\
  !*** ./animation.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Timeline\": () => (/* binding */ Timeline),\n/* harmony export */   \"Animation\": () => (/* binding */ Animation)\n/* harmony export */ });\n/* harmony import */ var _case_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./case.js */ \"./case.js\");\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\nvar TICK = Symbol('tick');\nvar TICK_HANDLER = Symbol('tick-handler');\nvar ANIMATIONS = Symbol('animations');\nvar START_TIMES = Symbol('start-times');\nvar PAUSE_START = Symbol('pause-start');\nvar PAUSE_TIME = Symbol('pause-time'); // 动态调用属性动画，得到帧\n\nvar Timeline = /*#__PURE__*/function () {\n  function Timeline() {\n    _classCallCheck(this, Timeline);\n\n    this.state = 'inited';\n    this[ANIMATIONS] = new Set();\n    this[START_TIMES] = new Map();\n  } // 开始播放\n\n\n  _createClass(Timeline, [{\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      if (this.state !== 'inited') {\n        return;\n      }\n\n      this.state = 'started';\n      var startTime = Date.now();\n      this[PAUSE_TIME] = 0; // 使用 Symbol 保存属性，避免外部访问到此方法\n\n      this[TICK] = function () {\n        // console.log('tick');\n        var now = Date.now();\n\n        var _iterator = _createForOfIteratorHelper(_this[ANIMATIONS]),\n            _step;\n\n        try {\n          for (_iterator.s(); !(_step = _iterator.n()).done;) {\n            var animation = _step.value;\n            var t = void 0;\n\n            if (_this[START_TIMES].get(animation) < startTime) {\n              t = now - startTime - _this[PAUSE_TIME] - animation.delay;\n            } else {\n              t = now - _this[START_TIMES].get(animation) - _this[PAUSE_TIME] - animation.delay;\n            }\n\n            if (animation.duration < t) {\n              _this[ANIMATIONS][\"delete\"](animation); // 避免超出范围\n\n\n              t = animation.duration;\n            }\n\n            if (t > 0) {\n              animation.receive(t);\n            }\n          }\n        } catch (err) {\n          _iterator.e(err);\n        } finally {\n          _iterator.f();\n        }\n\n        _this[TICK_HANDLER] = requestAnimationFrame(_this[TICK]);\n      };\n\n      this[TICK]();\n    } // 暂停\n\n  }, {\n    key: \"pause\",\n    value: function pause() {\n      if (this.state === 'started') {\n        this.state = 'paused';\n        this[PAUSE_START] = Date.now();\n        cancelAnimationFrame(this[TICK_HANDLER]);\n      }\n    } // 重启\n\n  }, {\n    key: \"resume\",\n    value: function resume() {\n      if (this.state === 'paused') {\n        this.state = 'started';\n        this[PAUSE_TIME] += this[PAUSE_START] ? Date.now() - this[PAUSE_START] : 0;\n        this[PAUSE_START] = 0;\n        this[TICK]();\n      }\n    } // 倍数\n    // set rate() {\n    // }\n    // get rate() {\n    // }\n\n  }, {\n    key: \"reset\",\n    value: function reset() {\n      this.pause();\n      this.state = 'inited';\n      this[ANIMATIONS] = new Set();\n      this[START_TIMES] = new Map();\n      this[PAUSE_START] = 0;\n      this[PAUSE_TIME] = 0;\n      this[TICK_HANDLER] = null;\n    }\n  }, {\n    key: \"add\",\n    value: function add(animation, startTime) {\n      if (arguments.length < 2) {\n        startTime = Date.now();\n      }\n\n      this[ANIMATIONS].add(animation);\n      this[START_TIMES].set(animation, startTime);\n    }\n  }, {\n    key: \"remove\",\n    value: function remove() {}\n  }]);\n\n  return Timeline;\n}(); // 传入时间点，返回对应属性值\n\nvar Animation = /*#__PURE__*/function () {\n  // 暂不考虑数值单位问题\n  function Animation(object, property, startValue, endValue, duration, delay, timingFunction, template) {\n    _classCallCheck(this, Animation);\n\n    this.object = object;\n    this.property = property;\n    this.startValue = startValue;\n    this.endValue = endValue;\n    this.duration = duration;\n    this.delay = delay;\n    this.range = this.endValue - this.startValue;\n\n    this.timingFunction = timingFunction || function (v) {\n      return v;\n    };\n\n    this.template = template || function (v) {\n      return v;\n    };\n  }\n\n  _createClass(Animation, [{\n    key: \"receive\",\n    value: function receive(time) {\n      var progress = this.timingFunction(time / this.duration);\n      this.object[this.property] = this.template(this.startValue + this.range * progress);\n      console.log(time, this.object[this.property]);\n    }\n  }]);\n\n  return Animation;\n}();\n\n//# sourceURL=webpack://jsx/./animation.js?");

/***/ }),

/***/ "./case.js":
/*!*****************!*\
  !*** ./case.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"linear\": () => (/* binding */ linear),\n/* harmony export */   \"cubicBezier\": () => (/* binding */ cubicBezier),\n/* harmony export */   \"ease\": () => (/* binding */ ease),\n/* harmony export */   \"easeIn\": () => (/* binding */ easeIn),\n/* harmony export */   \"easeOut\": () => (/* binding */ easeOut),\n/* harmony export */   \"easeInOut\": () => (/* binding */ easeInOut)\n/* harmony export */ });\nvar linear = function linear(v) {\n  return v;\n};\nvar cubicBezier = function cubicBezier(x1, y1, x2, y2, precision) {\n  precision = precision || 0.00001;\n  var pow = Math.pow,\n      abs = Math.abs;\n  /**\n   * @function yFn 三次贝塞尔曲线 y 坐标的函数。\n   * @param {number} t 贝塞尔曲线的绘制比例，t ∈ [0, 1]。\n   * @return {number} 贝塞尔曲线上 t 对应的点的 y 坐标。\n   */\n\n  function yFn(t) {\n    // 3 * (1 - t) ^ 2 * t * y1 + 3 * (1 - t) * t ^ 2 * y2 + t ^ 3\n    // 3 * pow(1 - t, 2) * t * y1 + 3 * (1 - t) * pow(t, 2) * y2 + pow(t, 3);\n    return (3 * y1 - 3 * y2 + 1) * pow(t, 3) + (3 * y2 - 6 * y1) * pow(t, 2) + 3 * y1 * t;\n  }\n  /**\n   * @function xFn 三次贝塞尔曲线 x 坐标的函数。\n   * @param {number} t 贝塞尔曲线的绘制比例，t ∈ [0, 1]。\n   * @return {number} 贝塞尔曲线上 t 对应的点的 x 坐标。\n   */\n\n\n  function xFn(t) {\n    // 3 * (1 - t) ^ 2 * t * x1 + 3 * (1 - t) * t ^ 2 * x2 + t ^ 3\n    // 3 * pow(1 - t, 2) * t * x1 + 3 * (1 - t) * pow(t, 2) * x2 + pow(t, 3);\n    return (3 * x1 - 3 * x2 + 1) * pow(t, 3) + (3 * x2 - 6 * x1) * pow(t, 2) + 3 * x1 * t;\n  }\n  /**\n   * @function resolveT 根据给定的横坐标 x，求相应的三次贝塞尔曲线的绘制比例 t（近似解）。\n   * @param {number} x 横坐标，x ∈ [0, 1]。\n   * @return {number} 贝塞尔曲线的绘制比例 t。\n   */\n\n\n  function resolveT(x) {\n    var left = 0,\n        right = 1,\n        t,\n        approximateX; // 夹逼法求t的近似解\n\n    while (left < right) {\n      t = (left + right) / 2;\n      approximateX = xFn(t);\n\n      if (abs(x - approximateX) < precision) {\n        return t;\n      } else if (x < approximateX) {\n        right = t;\n      } else {\n        left = t;\n      }\n    }\n\n    return t;\n  }\n  /**\n   * 三次贝塞尔曲线的函数，可根据给定的横坐标 x 求对应的纵坐标 y。\n   */\n\n\n  return function (x) {\n    if (x <= 0) {\n      return 0;\n    }\n\n    if (x >= 1) {\n      return 1;\n    }\n\n    return yFn(resolveT(x));\n  };\n};\nvar ease = cubicBezier(0.25, 0.1, 0.25, 1);\nvar easeIn = cubicBezier(0.42, 0, 1, 1);\nvar easeOut = cubicBezier(0, 0, 0.58, 1);\nvar easeInOut = cubicBezier(0.42, 0, 0.58, 1);\n\n//# sourceURL=webpack://jsx/./case.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./animation-demo.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;