const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const PLAYER = {
  size: 32,
  speed: 4,
  color: "#3b82f6",
};

const player = {
  x: (canvas.width - PLAYER.size) / 2,
  y: (canvas.height - PLAYER.size) / 2,
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
  drawMap(ctx);
  drawPlayer();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

input.init();
gameLoop();
