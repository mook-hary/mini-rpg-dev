const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const PLAYER = {
  size: 32,
  speed: 4,
  color: "#3b82f6",
};

const startPosition = getPlayerStartPosition(PLAYER.size);

const player = {
  x: startPosition.x,
  y: startPosition.y,
};

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
  let dx = 0;
  let dy = 0;

  if (input.isPressed("left")) dx -= PLAYER.speed;
  if (input.isPressed("right")) dx += PLAYER.speed;
  if (input.isPressed("up")) dy -= PLAYER.speed;
  if (input.isPressed("down")) dy += PLAYER.speed;

  tryMove(dx, dy);
}

function drawPlayer() {
  ctx.fillStyle = PLAYER.color;
  ctx.fillRect(player.x, player.y, PLAYER.size, PLAYER.size);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyCamera(ctx);
  drawMap(ctx);
  drawPlayer();
  resetCamera(ctx);
}

function gameLoop() {
  update();
  updateCamera(canvas.width, canvas.height, player, PLAYER.size);
  render();
  requestAnimationFrame(gameLoop);
}

input.init();
updateCamera(canvas.width, canvas.height, player, PLAYER.size);
gameLoop();
