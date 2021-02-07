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
      element.removeEventListener('mousemove', mousemove);
      element.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    element.addEventListener('mousemove', mousemove);
    element.addEventListener('mouseup', mouseup);
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
  startX = point.clientX, startY = point.clientY;
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
  let dx = point.clientX - startX;
  let dy = point.clientY - startY;
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
};
let end = (point, context) => {
  if (context.isTap) {
    console.log('tap');
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('panend');
  }
  if (context.isPress) {
    console.log('pressend');
  }
  console.log('end', point.clientX, point.clientY);
};
let cancel = (point, context) => {
  clearTimeout(context.handler);
  console.log('cancel', point.clientX, point.clientY);
};