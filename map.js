const TILE = {
  FLOOR: 0,
  WALL: 1,
  START: 2,
};

const TILE_SIZE = 32;

const MAP = {
  tileSize: TILE_SIZE,
  floorColor: "#3a5f4b",
  wallColor: "#6b5344",
};

let currentMapId = "map1";

const MAPS = {
  map1: {
    id: "map1",
    cols: 40,
    rows: 30,
    data: null,
  },
  map2: {
    id: "map2",
    cols: 12,
    rows: 10,
    data: null,
  },
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

function buildMap1Data() {
  const cols = MAPS.map1.cols;
  const rows = MAPS.map1.rows;
  const data = Array.from({ length: rows }, () =>
    Array(cols).fill(TILE.FLOOR)
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
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

function buildMap2Data() {
  const cols = MAPS.map2.cols;
  const rows = MAPS.map2.rows;
  const data = Array.from({ length: rows }, () =>
    Array(cols).fill(TILE.FLOOR)
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
        data[y][x] = TILE.WALL;
      }
    }
  }

  fillWallRect(data, 5, 3, 2, 2);
  fillHorizontalWall(data, 2, 6, 8);

  data[8][1] = TILE.START;

  return data;
}

function initMaps() {
  MAPS.map1.data = buildMap1Data();
  MAPS.map2.data = buildMap2Data();
}

function getCurrentMapId() {
  return currentMapId;
}

function getCurrentMap() {
  return MAPS[currentMapId];
}

function getMapById(mapId) {
  return MAPS[mapId];
}

function switchMap(mapId) {
  if (!MAPS[mapId]) {
    throw new Error(`Map not found: ${mapId}`);
  }

  currentMapId = mapId;
}

function getTileColor(tile) {
  if (tile === TILE.WALL) {
    return MAP.wallColor;
  }

  return MAP.floorColor;
}

function findStartTileInMap(mapId) {
  const map = getMapById(mapId);

  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.cols; col++) {
      if (map.data[row][col] === TILE.START) {
        return { col, row };
      }
    }
  }

  return null;
}

function findStartTile() {
  return findStartTileInMap(currentMapId);
}

function getMapSpawnPosition(mapId, col, row, playerSize) {
  return {
    x: col * TILE_SIZE + (TILE_SIZE - playerSize) / 2,
    y: row * TILE_SIZE + (TILE_SIZE - playerSize) / 2,
  };
}

function getPlayerStartPosition(playerSize) {
  const startTile = findStartTile();

  if (!startTile) {
    throw new Error("Start tile not found in map data");
  }

  return getMapSpawnPosition(currentMapId, startTile.col, startTile.row, playerSize);
}

function getTileAt(col, row) {
  const map = getCurrentMap();

  if (col < 0 || col >= map.cols || row < 0 || row >= map.rows) {
    return TILE.WALL;
  }

  return map.data[row][col];
}

function isWallTile(col, row) {
  return getTileAt(col, row) === TILE.WALL;
}

function worldToTile(pixel) {
  return Math.floor(pixel / TILE_SIZE);
}

function getMapPixelWidth() {
  return getCurrentMap().cols * TILE_SIZE;
}

function getMapPixelHeight() {
  return getCurrentMap().rows * TILE_SIZE;
}

function drawMap(ctx) {
  const map = getCurrentMap();

  for (let row = 0; row < map.rows; row++) {
    for (let col = 0; col < map.cols; col++) {
      const tile = map.data[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      drawTile(ctx, tile, x, y);
    }
  }
}

initMaps();
