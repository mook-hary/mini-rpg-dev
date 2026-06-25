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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function update() {
  let dx = 0;
  let dy = 0;

  if (input.isPressed("left")) dx -= PLAYER.speed;
  if (input.isPressed("right")) dx += PLAYER.speed;
  if (input.isPressed("up")) dy -= PLAYER.speed;
  if (input.isPressed("down")) dy += PLAYER.speed;

  player.x = clamp(player.x + dx, 0, canvas.width - PLAYER.size);
  player.y = clamp(player.y + dy, 0, canvas.height - PLAYER.size);
}

function drawPlayer() {
  ctx.fillStyle = PLAYER.color;
  ctx.fillRect(player.x, player.y, PLAYER.size, PLAYER.size);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

input.init();
gameLoop();
