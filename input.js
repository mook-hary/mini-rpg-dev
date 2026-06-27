function createInput() {
  const state = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  let actionPressed = false;
  let savePressed = false;
  let loadPressed = false;

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
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      actionPressed = true;
      return;
    }

    if (event.code === "F6") {
      event.preventDefault();
      savePressed = true;
      return;
    }

    if (event.code === "F9") {
      event.preventDefault();
      loadPressed = true;
      return;
    }

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
    consumeAction() {
      const pressed = actionPressed;
      actionPressed = false;
      return pressed;
    },
    consumeSave() {
      const pressed = savePressed;
      savePressed = false;
      return pressed;
    },
    consumeLoad() {
      const pressed = loadPressed;
      loadPressed = false;
      return pressed;
    },
  };
}

const input = createInput();
