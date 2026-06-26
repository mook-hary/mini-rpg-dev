function getTilesInRect(x, y, width, height) {
  return {
    startCol: worldToTile(x),
    startRow: worldToTile(y),
    endCol: worldToTile(x + width - 0.001),
    endRow: worldToTile(y + height - 0.001),
  };
}

function isBlockedRect(x, y, width, height) {
  const { startCol, startRow, endCol, endRow } = getTilesInRect(
    x,
    y,
    width,
    height
  );

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      if (isWallTile(col, row)) {
        return true;
      }
    }
  }

  return false;
}

function canMoveTo(x, y, width, height) {
  return (
    !isBlockedRect(x, y, width, height) &&
    !isNpcBlockedRect(x, y, width, height) &&
    !isDoorBlockedRect(x, y, width, height)
  );
}
