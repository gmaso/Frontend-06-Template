let element = document.documentElement;


let contexts = new Map();
let isListeningMouse = false;

element.addEventListener('mousedown', event => {
  console.log(event.button);
  let context = Object.create(null);
  contexts.set('mouse' + (1 << event.button), context);

  start(event, context);

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
        move(event, contexts.get('mouse' + key));
      }
      button = button << 1;
    }
  };

  let mouseup = event => {
    end(event, contexts.get('mouse' + (1 << event.button)));
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
    start(touch, context);
  }
});
element.addEventListener('touchmove', event => {
  for (let touch of event.changedTouches) {
    move(touch, contexts.get(touch.identifier));
  }
});
element.addEventListener('touchend', event => {
  for (let touch of event.changedTouches) {
    end(touch, contexts.get(touch.identifier));
    contexts.delete(touch.identifier);
  }
});
element.addEventListener('touchcancel', event => {
  for (let touch of event.changedTouches) {
    cancel(touch, contexts.get(touch.identifier));
    contexts.delete(touch.identifier);
  }
});

let start = (point, context) => {
  // console.log('start', point.clientX, point.clientY);
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
    console.log('press');
  }, 500);
};
let move = (point, context) => {
  // console.log('move', point.clientX, point.clientY);
  let dx = point.clientX - context.startX;
  let dy = point.clientY - context.startY;
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false;
    context.isPan = true;
    context.isPress = false;
    console.log('panstart');
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('pan', dx, dy);
    console.log('pan');
  }
  // 保留 500ms 内的点
  context.points = context.points.filter(point => Date.now() - point.t < 500);
  context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    });
};
let end = (point, context) => {
  if (context.isTap) {
    console.log('tap');
    dispatch('tap', {});
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('panend');
  }
  if (context.isPress) {
    console.log('pressend');
  }
  console.log('end', point.clientX, point.clientY);

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
    console.log('flick');
    contenxt.isFlick = true;
  } else {
    context.isFlick = false;
  }
};
let cancel = (point, context) => {
  clearTimeout(context.handler);
  console.log('cancel', point.clientX, point.clientY);
};

function dispatch(type, properties) {
  let event = new Event(type);
  for (let key in properties) {
    event[key] = properties[key];
  }
  element.dispatchEvent(event);
}