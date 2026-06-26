const inventory = {};

function addItem(id, name) {
  if (!inventory[id]) {
    inventory[id] = { id, name, count: 0 };
  }

  inventory[id].count++;
}

function getInventoryEntries() {
  return Object.values(inventory);
}

function hasItem(id) {
  return getItemCount(id) > 0;
}

function getItemCount(id) {
  return inventory[id]?.count ?? 0;
}

function getInventoryLines() {
  const lines = ["INVENTORY"];
  const entries = getInventoryEntries();

  if (entries.length === 0) {
    lines.push("(empty)");
    return lines;
  }

  for (const entry of entries) {
    lines.push(`${entry.name} ×${entry.count}`);
  }

  return lines;
}

function drawInventory(ctx) {
  const canvas = ctx.canvas;
  const padding = 10;
  const margin = 10;
  const lineHeight = 18;
  const fontSize = 14;

  ctx.save();
  ctx.font = `${fontSize}px system-ui, sans-serif`;

  const lines = getInventoryLines();
  const textWidths = lines.map((line) => ctx.measureText(line).width);
  const boxWidth = Math.max(...textWidths) + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;
  const boxX = canvas.width - boxWidth - margin;
  const boxY = margin;

  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";

  lines.forEach((line, index) => {
    ctx.fillText(line, boxX + padding, boxY + padding + index * lineHeight);
  });

  ctx.restore();
}
