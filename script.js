const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const PLAYER = {
  size: 32,
  color: "#3b82f6",
};

function getPlayerPosition() {
  return {
    x: (canvas.width - PLAYER.size) / 2,
    y: (canvas.height - PLAYER.size) / 2,
  };
}

function drawPlayer() {
  const { x, y } = getPlayerPosition();

  ctx.fillStyle = PLAYER.color;
  ctx.fillRect(x, y, PLAYER.size, PLAYER.size);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
}

input.init();
render();
