const DOOR = {
  size: 32,
  color: "#9333ea",
};

const doors = [
  {
    id: "door1",
    col: 20,
    row: 13,
    opened: false,
  },
];

function getDoorPosition(door) {
  return tileToWorldPosition(door.col, door.row, DOOR.size);
}

function getDoorAtTile(col, row) {
  for (const door of doors) {
    if (door.col === col && door.row === row) {
      return door;
    }
  }

  return null;
}

function isClosedDoorAt(col, row) {
  const door = getDoorAtTile(col, row);
  return door !== null && !door.opened;
}

function isDoorBlockedRect(x, y, width, height) {
  for (const door of doors) {
    if (door.opened) {
      continue;
    }

    const { x: doorX, y: doorY } = getDoorPosition(door);

    if (isRectOverlap(x, y, width, height, doorX, doorY, DOOR.size, DOOR.size)) {
      return true;
    }
  }

  return false;
}

function openDoor(door) {
  door.opened = true;
}

function tryInteractDoor(door) {
  if (door.opened) {
    return;
  }

  if (hasItem("key")) {
    openDoor(door);
    showTransientMessage("鍵を使って扉を開けた！");
    return;
  }

  showTransientMessage("鍵がかかっている。");
}

function drawDoors(ctx) {
  for (const door of doors) {
    if (door.opened) {
      continue;
    }

    const { x, y } = getDoorPosition(door);

    ctx.fillStyle = DOOR.color;
    ctx.fillRect(x, y, DOOR.size, DOOR.size);
  }
}
