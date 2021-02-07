class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let key in properties) {
      event[key] = properties[key];
    }
    this.element.dispatchEvent(event);
  }
}


export class Listener {
  constructor(element, recognizer) {
    let contexts = new Map();
    let isListeningMouse = false;
    
    element.addEventListener('mousedown', event => {
      // console.log(event.button);
      let context = Object.create(null);
      contexts.set('mouse' + (1 << event.button), context);
    
      recognizer.start(event, context);
    
      let mousemove = event => {
        let button = 1;
        while (button <= event.buttons) {
          if (button & event.buttons) {
            // 调整右键和中键顺序
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            recognizer.move(event, contexts.get('mouse' + key));
          }
          button = button << 1;
        }
      };
    
      let mouseup = event => {
        recognizer.end(event, contexts.get('mouse' + (1 << event.button)));
        contexts.delete('mouse' + (1 << event.button));
        // 当没有其它按键按下时，才取消监听。
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      };
    
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });
    
    element.addEventListener('touchstart', event => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    element.addEventListener('touchmove', event => {
      for (let touch of event.changedTouches) {
        recognizer.move(touch, contexts.get(touch.identifier));
      }
    });
    element.addEventListener('touchend', event => {
      for (let touch of event.changedTouches) {
        recognizer.end(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
    element.addEventListener('touchcancel', event => {
      for (let touch of event.changedTouches) {
        recognizer.cancel(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start (point, context) {
    // // console.log('start', point.clientX, point.clientY);
    context.startX = point.clientX, context.startY = point.clientY;
    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }
    ];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
  
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      // console.log('press');
      this.dispatcher.dispatch('press', {});
    }, 500);
  };
  move (point, context) {
    // // console.log('move', point.clientX, point.clientY);
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    context.idVertical = Math.abs(dx) < Math.abs(dy);
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      // console.log('panstart');
      this.dispatcher.dispatch('panstart', { 
        startX: context.startX, 
        startY: context.startY, 
        clientX: point.clientX, 
        clientY: point.clientY, 
        idVertical: context.idVertical
      });
      clearTimeout(context.handler);
    }
    if (context.isPan) {
      // console.log('pan', dx, dy);
      this.dispatcher.dispatch('pan', { 
        startX: context.startX, 
        startY: context.startY, 
        clientX: point.clientX, 
        clientY: point.clientY, 
        idVertical: context.idVertical
      });
      // console.log('pan');
    }
    // 保留 500ms 内的点
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      });
  };
  end (point, context) {
    if (context.isTap) {
      // console.log('tap');
      this.dispatcher.dispatch('tap', {});
      clearTimeout(context.handler);
    }
    if (context.isPress) {
      // console.log('pressend');
      this.dispatcher.dispatch('pressend', {});
    }
    // console.log('end', point.clientX, point.clientY);
  
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let d, v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
      v = d / (Date.now() - context.points[0].t);
    }
    // 速度大于 1.5px/ms，就可以认为是比较快地划过了
    if (v > 1.5) {
      // console.log('flick');
      this.dispatcher.dispatch('flick', { 
        startX: context.startX, 
        startY: context.startY, 
        clientX: point.clientX, 
        clientY: point.clientY, 
        idVertical: context.idVertical,
        velocity: v
      });
      contenxt.isFlick = true;
    } else {
      context.isFlick = false;
    }
    if (context.isPan) {
      // console.log('panend');
      this.dispatcher.dispatch('pan', { 
        startX: context.startX, 
        startY: context.startY, 
        clientX: point.clientX, 
        clientY: point.clientY, 
        idVertical: context.idVertical,
        flick: context.isFlick
      });
    }
  };
  cancel (point, context) {
    clearTimeout(context.handler);
    // console.log('cancel', point.clientX, point.clientY);
  };
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}