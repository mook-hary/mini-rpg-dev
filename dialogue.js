const DIALOGUES = {
  npc1: "こんにちは！",
  npc2: "ようこそ！",
};

const dialogue = {
  isOpen: false,
  currentNpc: null,
};

function getDialogueMessage(npc) {
  return DIALOGUES[npc.id] ?? "...";
}

function isDialogueOpen() {
  return dialogue.isOpen;
}

function openDialogue(npc) {
  const box = document.getElementById("dialogue-box");
  const message = document.getElementById("dialogue-message");

  if (!box || !message) {
    console.error("dialogue-box or dialogue-message not found");
    return;
  }

  dialogue.isOpen = true;
  dialogue.currentNpc = npc;
  message.textContent = getDialogueMessage(npc);
  box.hidden = false;
}

function closeDialogue() {
  const box = document.getElementById("dialogue-box");

  if (!box) {
    dialogue.isOpen = false;
    dialogue.currentNpc = null;
    return;
  }

  dialogue.isOpen = false;
  dialogue.currentNpc = null;
  box.hidden = true;
}

let messageTimer = null;

// アイテム取得など、移動を止めない一時メッセージ
function showTransientMessage(text, durationMs = 2000) {
  const box = document.getElementById("dialogue-box");
  const message = document.getElementById("dialogue-message");

  if (!box || !message) {
    return;
  }

  message.textContent = text;
  box.hidden = false;

  if (messageTimer) {
    clearTimeout(messageTimer);
  }

  messageTimer = setTimeout(() => {
    if (!isDialogueOpen()) {
      box.hidden = true;
    }

    messageTimer = null;
  }, durationMs);
}
