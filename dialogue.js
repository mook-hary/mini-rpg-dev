const DIALOGUES = {
  npc1: "こんにちは！",
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
