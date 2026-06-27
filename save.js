const SAVE_KEY = "mini-rpg-dev-save";
const SAVE_VERSION = 1;

function createSaveData(player) {
  return {
    version: SAVE_VERSION,
    mapId: getCurrentMapId(),
    player: {
      x: player.x,
      y: player.y,
      direction: player.direction,
    },
    inventory: getInventorySaveState(),
    items: getItemsSaveState(),
    doors: getDoorsSaveState(),
    interactables: getInteractablesSaveState(),
  };
}

function saveGame(player) {
  const data = createSaveData(player);
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  showTransientMessage("セーブしました");
}

function loadGame(player) {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    showTransientMessage("セーブデータがありません");
    return false;
  }

  const data = JSON.parse(raw);

  switchMap(data.mapId);
  player.x = data.player.x;
  player.y = data.player.y;
  player.direction = data.player.direction;
  player.isMoving = false;
  player.animationFrame = 0;

  applyInventorySaveState(data.inventory);
  applyItemsSaveState(data.items);
  applyDoorsSaveState(data.doors);
  applyInteractablesSaveState(data.interactables);

  if (typeof closeDialogue === "function") {
    closeDialogue();
  }

  showTransientMessage("ロードしました");
  return true;
}

function handleSaveLoadInput(player) {
  if (input.consumeSave()) {
    saveGame(player);
  }

  if (input.consumeLoad()) {
    loadGame(player);
  }
}
