const TILE = {
  FLOOR: 0,
  WALL: 1,
  START: 2,
};

const MAP = {
  cols: 40,
  rows: 30,
  tileSize: 32,
  floorColor: "#3a5f4b",
  wallColor: "#6b5344",
};

function fillHorizontalWall(data, startCol, row, length) {
  for (let col = startCol; col < startCol + length; col++) {
    data[row][col] = TILE.WALL;
  }
}

function fillVerticalWall(data, col, startRow, length) {
  for (let row = startRow; row < startRow + length; row++) {
    data[row][col] = TILE.WALL;
  }
}

function fillWallRect(data, startCol, startRow, width, height) {
  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      data[row][col] = TILE.WALL;
    }
  }
}

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

  fillHorizontalWall(data, 6, 8, 10);
  fillHorizontalWall(data, 24, 8, 10);

  fillHorizontalWall(data, 4, 22, 12);
  fillHorizontalWall(data, 24, 22, 12);

  fillVerticalWall(data, 10, 4, 8);
  fillVerticalWall(data, 30, 4, 8);
  fillVerticalWall(data, 10, 20, 8);
  fillVerticalWall(data, 30, 18, 8);

  fillHorizontalWall(data, 5, 15, 13);
  fillHorizontalWall(data, 23, 15, 12);

  fillVerticalWall(data, 20, 5, 8);
  fillVerticalWall(data, 20, 18, 8);

  fillWallRect(data, 5, 5, 3, 3);
  fillWallRect(data, 32, 5, 3, 3);
  fillWallRect(data, 5, 24, 3, 3);
  fillWallRect(data, 32, 24, 3, 3);
  fillWallRect(data, 14, 12, 2, 2);
  fillWallRect(data, 25, 12, 2, 2);
  fillWallRect(data, 14, 18, 2, 2);
  fillWallRect(data, 25, 18, 2, 2);

  data[15][20] = TILE.START;

  return data;
}

const mapData = buildMapData();

function getTileColor(tile) {
  if (tile === TILE.WALL) {
    return MAP.wallColor;
  }

  return MAP.floorColor;
}

function findStartTile() {
  for (let row = 0; row < MAP.rows; row++) {
    for (let col = 0; col < MAP.cols; col++) {
      if (mapData[row][col] === TILE.START) {
        return { col, row };
      }
    }
  }

  return null;
}

function getPlayerStartPosition(playerSize) {
  const startTile = findStartTile();
  if (!startTile) {
    throw new Error("Start tile not found in map data");
  }

  return {
    x: startTile.col * MAP.tileSize + (MAP.tileSize - playerSize) / 2,
    y: startTile.row * MAP.tileSize + (MAP.tileSize - playerSize) / 2,
  };
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

function getMapPixelWidth() {
  return MAP.cols * MAP.tileSize;
}

function getMapPixelHeight() {
  return MAP.rows * MAP.tileSize;
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
