function createInput() {
  const state = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const KEY_BINDINGS = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    KeyW: "up",
    KeyS: "down",
    KeyA: "left",
    KeyD: "right",
  };

  function setDirection(code, pressed) {
    const direction = KEY_BINDINGS[code];
    if (!direction) {
      return false;
    }

    state[direction] = pressed;
    return true;
  }

  function onKeyDown(event) {
    if (setDirection(event.code, true)) {
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    if (setDirection(event.code, false)) {
      event.preventDefault();
    }
  }

  function init() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

  return {
    init,
    isPressed(direction) {
      return state[direction] ?? false;
    },
    getState() {
      return { ...state };
    },
  };
}

const input = createInput();
