const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

const startPosition = getPlayerStartPosition(PLAYER.size);

const player = {
  x: startPosition.x,
  y: startPosition.y,
  direction: DIRECTION.DOWN,
  isMoving: false,
  animationFrame: 0,
};

function getDirectionFromInput(dx, dy) {
  if (dx === 0 && dy === 0) {
    return null;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx < 0 ? DIRECTION.LEFT : DIRECTION.RIGHT;
  }

  return dy < 0 ? DIRECTION.UP : DIRECTION.DOWN;
}

function updateDirection(dx, dy) {
  const nextDirection = getDirectionFromInput(dx, dy);
  if (!nextDirection) {
    return;
  }

  if (player.direction !== nextDirection) {
    player.direction = nextDirection;
    console.log("direction:", player.direction);
  }
}

function tryMove(dx, dy) {
  const nextX = player.x + dx;
  if (canMoveTo(nextX, player.y, PLAYER.size, PLAYER.size)) {
    player.x = nextX;
  }

  const nextY = player.y + dy;
  if (canMoveTo(player.x, nextY, PLAYER.size, PLAYER.size)) {
    player.y = nextY;
  }
}

function update() {
  handleActionInput();

  if (typeof isDialogueOpen === "function" && isDialogueOpen()) {
    resetPlayerAnimation(player);
    return;
  }

  let dx = 0;
  let dy = 0;

  if (input.isPressed("left")) dx -= PLAYER.speed;
  if (input.isPressed("right")) dx += PLAYER.speed;
  if (input.isPressed("up")) dy -= PLAYER.speed;
  if (input.isPressed("down")) dy += PLAYER.speed;

  updateDirection(dx, dy);
  tryMove(dx, dy);
  updatePlayerAnimation(player, dx, dy);
  checkItemCollection(player, PLAYER.size);
}

function handleActionInput() {
  if (typeof input.consumeAction !== "function") {
    return;
  }

  if (!input.consumeAction()) {
    return;
  }

  if (typeof handleFrontInteraction !== "function") {
    return;
  }

  handleFrontInteraction(player, PLAYER.size);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyCamera(ctx);
  drawMap(ctx);
  drawDoors(ctx);
  drawItems(ctx);
  drawNpcs(ctx);
  drawPlayer(ctx, player);
  resetCamera(ctx);
  drawInventory(ctx);
}

function gameLoop() {
  try {
    update();
  } catch (error) {
    console.error("update error:", error);
  }

  updateCamera(canvas.width, canvas.height, player, PLAYER.size);
  render();
  requestAnimationFrame(gameLoop);
}

input.init();
updateCamera(canvas.width, canvas.height, player, PLAYER.size);
gameLoop();
