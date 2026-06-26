const DIRECTION_OFFSET = {
  up: { col: 0, row: -1 },
  down: { col: 0, row: 1 },
  left: { col: -1, row: 0 },
  right: { col: 1, row: 0 },
};

function getPlayerTile(player, playerSize) {
  return {
    col: worldToTile(player.x + playerSize / 2),
    row: worldToTile(player.y + playerSize / 2),
  };
}

function getFrontTile(player, playerSize) {
  const playerTile = getPlayerTile(player, playerSize);
  const offset = DIRECTION_OFFSET[player.direction];

  if (!offset) {
    return playerTile;
  }

  return {
    col: playerTile.col + offset.col,
    row: playerTile.row + offset.row,
  };
}

function getNpcAtFront(player, playerSize) {
  const frontTile = getFrontTile(player, playerSize);
  return getNpcAtTile(frontTile.col, frontTile.row);
}

function handleFrontInteraction(player, playerSize) {
  if (isDialogueOpen()) {
    closeDialogue();
    return;
  }

  const npc = getNpcAtFront(player, playerSize);
  if (npc) {
    openDialogue(npc);
  }
}
