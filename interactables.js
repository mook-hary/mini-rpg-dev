const INTERACTABLE = {
  SIGN: "sign",
  ROCK: "rock",
};

const INTERACTABLE_STYLE = {
  sign: {
    width: 24,
    height: 16,
    color: "#b45309",
  },
  rock: {
    width: 28,
    height: 24,
    color: "#78716c",
  },
};

const interactables = [
  {
    id: "sign1",
    type: INTERACTABLE.SIGN,
    mapId: "map1",
    col: 14,
    row: 16,
    solid: true,
    message: "小さな看板がある。\n「この先、森へ続く。」",
  },
  {
    id: "rock1",
    type: INTERACTABLE.ROCK,
    mapId: "map1",
    col: 19,
    row: 16,
    solid: true,
    message: "大きな岩が転がっている。",
  },
];

function getInteractablesForCurrentMap() {
  return interactables.filter(
    (object) => object.mapId === getCurrentMapId()
  );
}

function getInteractableAtTile(col, row) {
  for (const object of getInteractablesForCurrentMap()) {
    if (object.col === col && object.row === row) {
      return object;
    }
  }

  return null;
}

function getInteractableAtFront(player, playerSize) {
  const frontTile = getFrontTile(player, playerSize);
  return getInteractableAtTile(frontTile.col, frontTile.row);
}

function handleInteractable(object) {
  if (!object.message) {
    return;
  }

  switch (object.type) {
    case INTERACTABLE.SIGN:
    case INTERACTABLE.ROCK:
      openInteractMessage(object.message);
      break;
    default:
      break;
  }
}

function getSolidInteractablesForCurrentMap() {
  return getInteractablesForCurrentMap().filter((object) => object.solid);
}

function isInteractableBlockedRect(x, y, width, height) {
  for (const object of getSolidInteractablesForCurrentMap()) {
    const tileX = object.col * MAP.tileSize;
    const tileY = object.row * MAP.tileSize;

    if (
      isRectOverlap(
        x,
        y,
        width,
        height,
        tileX,
        tileY,
        MAP.tileSize,
        MAP.tileSize
      )
    ) {
      return true;
    }
  }

  return false;
}

function drawInteractables(ctx) {
  for (const object of getInteractablesForCurrentMap()) {
    const style = INTERACTABLE_STYLE[object.type];

    if (!style) {
      continue;
    }

    const x = object.col * MAP.tileSize + (MAP.tileSize - style.width) / 2;
    const y = object.row * MAP.tileSize + (MAP.tileSize - style.height) / 2;

    ctx.fillStyle = style.color;
    ctx.fillRect(x, y, style.width, style.height);
  }
}
