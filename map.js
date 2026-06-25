const TILE = {
  FLOOR: 0,
  WALL: 1,
};

const MAP = {
  cols: 20,
  rows: 15,
  tileSize: 32,
  floorColor: "#3a5f4b",
  wallColor: "#6b5344",
};

function buildMapData() {
  const data = Array.from({ length: MAP.rows }, () =>
    Array(MAP.cols).fill(TILE.FLOOR)
  );

  for (let y = 0; y < MAP.rows; y++) {
    for (let x = 0; x < MAP.cols; x++) {
      if (x === 0 || x === MAP.cols - 1 || y === 0 || y === MAP.rows - 1) {
        data[y][x] = TILE.WALL;
      }
    }
  }

  for (let x = 5; x <= 9; x++) {
    data[5][x] = TILE.WALL;
  }

  for (let y = 4; y <= 8; y++) {
    data[y][14] = TILE.WALL;
  }

  for (let y = 10; y <= 11; y++) {
    for (let x = 8; x <= 9; x++) {
      data[y][x] = TILE.WALL;
    }
  }

  for (let x = 15; x <= 18; x++) {
    data[11][x] = TILE.WALL;
  }

  return data;
}

const mapData = buildMapData();

function getTileColor(tile) {
  return tile === TILE.WALL ? MAP.wallColor : MAP.floorColor;
}

function getTileAt(col, row) {
  if (col < 0 || col >= MAP.cols || row < 0 || row >= MAP.rows) {
    return TILE.WALL;
  }

  return mapData[row][col];
}

function isWallTile(col, row) {
  return getTileAt(col, row) === TILE.WALL;
}

function worldToTile(pixel) {
  return Math.floor(pixel / MAP.tileSize);
}

function drawMap(ctx) {
  for (let row = 0; row < MAP.rows; row++) {
    for (let col = 0; col < MAP.cols; col++) {
      const tile = mapData[row][col];
      ctx.fillStyle = getTileColor(tile);
      ctx.fillRect(
        col * MAP.tileSize,
        row * MAP.tileSize,
        MAP.tileSize,
        MAP.tileSize
      );
    }
  }
}
