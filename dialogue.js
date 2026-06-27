const DIALOGUES = {
  npc1: {
    messages: ["こんにちは！", "今日は海風が気持ちいいね。", "また話そう。"],
  },
  npc2: {
    messages: ["ようこそ！", "この村は小さいけど、のんびりしていいところだよ。"],
  },
  dog: {
    messages: ["🐶 わん！"],
  },
};

const dialogue = {
  isOpen: false,
  currentNpc: null,
  messages: [],
  messageIndex: 0,
};

function getNpcMessages(npc) {
  const data = DIALOGUES[npc.id];

  if (!data) {
    return ["..."];
  }

  if (Array.isArray(data.messages)) {
    return data.messages;
  }

  return ["..."];
}

function isDialogueOpen() {
  return dialogue.isOpen;
}

function isInteractionBlocking() {
  return dialogue.isOpen;
}

function showCurrentMessage() {
  const box = document.getElementById("dialogue-box");
  const message = document.getElementById("dialogue-message");

  if (!box || !message) {
    return;
  }

  message.textContent = dialogue.messages[dialogue.messageIndex] ?? "";
  box.hidden = false;
}

function openMessageSession(messages) {
  const box = document.getElementById("dialogue-box");

  if (!box) {
    console.error("dialogue-box not found");
    return;
  }

  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  dialogue.isOpen = true;
  dialogue.messages = messages;
  dialogue.messageIndex = 0;
  showCurrentMessage();
}

function openInteractMessage(text) {
  dialogue.currentNpc = null;
  openMessageSession([text]);
}

function openDialogue(npc) {
  dialogue.currentNpc = npc;
  openMessageSession(getNpcMessages(npc));
}

function advanceMessage() {
  if (!dialogue.isOpen) {
    return;
  }

  const nextIndex = dialogue.messageIndex + 1;

  if (nextIndex < dialogue.messages.length) {
    dialogue.messageIndex = nextIndex;
    showCurrentMessage();
    return;
  }

  closeDialogue();
}

function closeDialogue() {
  const box = document.getElementById("dialogue-box");

  dialogue.isOpen = false;
  dialogue.currentNpc = null;
  dialogue.messages = [];
  dialogue.messageIndex = 0;

  if (box) {
    box.hidden = true;
  }
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
