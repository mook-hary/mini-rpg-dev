const INTERACTABLE = {
  SIGN: "sign",
  ROCK: "rock",
  CHEST: "chest",
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
  chest: {
    width: 28,
    height: 24,
    color: "#ca8a04",
    openedColor: "#854d0e",
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
  {
    id: "chest1",
    type: INTERACTABLE.CHEST,
    mapId: "map1",
    col: 24,
    row: 14,
    solid: true,
    opened: false,
    spritePath: "sprites/object/chest.png",
    itemId: "potion",
    itemName: "Potion",
    lootMessage: "ポーションを手に入れた！",
    emptyMessage: "空っぽだ。",
  },
];

preloadSprites(
  interactables.map((object) => object.spritePath).filter(Boolean)
);

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

function handleChest(chest) {
  if (chest.opened) {
    openInteractMessage(chest.emptyMessage);
    return;
  }

  chest.opened = true;

  // 将来: itemId があれば addItem(chest.itemId, chest.itemName) など

  openInteractMessage(chest.lootMessage);
}

function handleInteractable(object) {
  switch (object.type) {
    case INTERACTABLE.SIGN:
    case INTERACTABLE.ROCK:
      if (object.message) {
        openInteractMessage(object.message);
      }
      break;
    case INTERACTABLE.CHEST:
      handleChest(object);
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

function getInteractableDrawColor(object, style) {
  if (object.type === INTERACTABLE.CHEST && object.opened && style.openedColor) {
    return style.openedColor;
  }

  return style.color;
}

function drawInteractables(ctx) {
  for (const object of getInteractablesForCurrentMap()) {
    const style = INTERACTABLE_STYLE[object.type];

    if (!style) {
      continue;
    }

    const x = object.col * MAP.tileSize + (MAP.tileSize - style.width) / 2;
    const y = object.row * MAP.tileSize + (MAP.tileSize - style.height) / 2;

    drawSpriteOrRect(ctx, {
      x,
      y,
      width: style.width,
      height: style.height,
      spritePath: object.spritePath,
      color: getInteractableDrawColor(object, style),
    });
  }
}

function getInteractablesSaveState() {
  return interactables
    .filter((object) => object.type === INTERACTABLE.CHEST)
    .map(({ id, mapId, opened }) => ({
      id,
      mapId,
      opened,
    }));
}

function applyInteractablesSaveState(savedInteractables) {
  if (!Array.isArray(savedInteractables)) {
    return;
  }

  for (const saved of savedInteractables) {
    const object = interactables.find(
      (entry) => entry.id === saved.id && entry.mapId === saved.mapId
    );

    if (object && object.type === INTERACTABLE.CHEST) {
      object.opened = saved.opened;
    }
  }
}
