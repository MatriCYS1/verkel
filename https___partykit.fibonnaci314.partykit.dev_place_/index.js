let map = " ".repeat(1024);
let cooldown = Date.now();
let socket;
function connect() {
  const url = location.protocol === "http:" ? "http://localhost:1999" : "https://partykit.fibonnaci314.partykit.dev";
  socket = new WebSocket(url + "/parties/place/my-new-room");
  socket.addEventListener("close", connect);
  socket.addEventListener("message", (ev) => {
    const packet = JSON.parse(ev.data);
    if (packet.type === "map") map = packet.map;
    if (packet.type === "cd") cooldown = Date.now() + packet.cd;
  });
}
connect();

let selectionIndex = 0;

const wallColors = [14, 2, 1, 19, 11, 10, 7, 6, 14, 1, 5, 5, 5, 5, 0, 2, 2, 6, 6];
const letters = "abcdefghijklmnopqrs".split("");

const colors = ['#3ca4cb', '#8abc3f', '#e03e41', '#cc669c', '#fdf380', '#726f6f', '#e8ebf7', '#efc74b', '#e7896d', '#8d6adf', '#7adbba', '#ef99c3', '#b9e87e', '#7ad3db', '#a4a4ad', '#484848', '#a7a7af', '#ffffff', '#dbdbdb', '#000000'];

function cdarken(hex = ctx.fillStyle) {
  const red = Math.round(48 * 0.6 + 0.4 * parseInt(hex.slice(1, 3), 16));
  const green = Math.round(48 * 0.6 + 0.4 * parseInt(hex.slice(3, 5), 16));
  const blue = Math.round(48 * 0.6 + 0.4 * parseInt(hex.slice(5, 7), 16));
  return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
function renderBackground() {
  ctx.fillStyle = "#dbdbdb";
  ctx.fillRect(0, 0, 2048, 2048);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0000000d";
  ctx.beginPath();
  for (let i = 0; i <= 2048; i += 32) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 2048);
    ctx.moveTo(2048, i);
    ctx.lineTo(0, i);
  }
  ctx.stroke();
}

function renderWall(entity) {
  // ripped from passjs
  const cx = entity.x;
  const cy = entity.y;
  const wallSize = entity.size;
  if (entity.kind === "filter" || entity.kind === "base" || entity.kind === "spawn") {
    ctx.globalAlpha = 0.25;
  }
  if (entity.kind === "fake") {
    ctx.globalAlpha = 0.95;
  }
  if (entity.kind === "portal") {
    ctx.globalAlpha = 0.8;
  }
  const sizeMult = 1;
  ctx.fillRect(cx - wallSize / 2, cy - wallSize / 2, wallSize * sizeMult, wallSize * sizeMult);
  ctx.strokeRect(cx - wallSize / 2, cy - wallSize / 2, wallSize * sizeMult, wallSize * sizeMult);
  if (entity.kind === "paint" || entity.kind === "filter") {
    ctx.beginPath();
    ctx.moveTo(cx, cy - wallSize * sizeMult / 2);
    ctx.lineTo(cx - wallSize * sizeMult / 2, cy);
    ctx.lineTo(cx, cy + wallSize * sizeMult / 2);
    ctx.lineTo(cx + wallSize * sizeMult / 2, cy);
    ctx.lineTo(cx, cy - wallSize * sizeMult / 2);
    ctx.fill();
    ctx.stroke();
  }
  if (entity.kind === "portal") {
    ctx.fillRect(cx - wallSize * sizeMult * 0.375, cy - wallSize * sizeMult * 0.375, wallSize * sizeMult * 0.75, wallSize * sizeMult * 0.75);
    ctx.strokeRect(cx - wallSize * sizeMult * 0.375, cy - wallSize * sizeMult * 0.375, wallSize * sizeMult * 0.75, wallSize * sizeMult * 0.75);
    ctx.fillStyle = colors[19];
    ctx.strokeStyle = cdarken();
    ctx.fillRect(cx - wallSize * sizeMult / 4, cy - wallSize * sizeMult / 4, wallSize * sizeMult / 2, wallSize * sizeMult / 2);
    ctx.strokeRect(cx - wallSize * sizeMult / 4, cy - wallSize * sizeMult / 4, wallSize * sizeMult / 2, wallSize * sizeMult / 2);
  }
  if (entity.kind === "team") {
    ctx.fillRect(cx - wallSize * sizeMult / 4, cy - wallSize * sizeMult / 4, wallSize * sizeMult / 2, wallSize * sizeMult / 2);
    ctx.strokeRect(cx - wallSize * sizeMult / 4, cy - wallSize * sizeMult / 4, wallSize * sizeMult / 2, wallSize * sizeMult / 2);
  }
  if (entity.kind === "spawn") {
    ctx.fillStyle = colors[17];
    ctx.strokeStyle = cdarken();
    ctx.fillRect(cx - sizeMult * wallSize / 3, cy - sizeMult * wallSize / 3, sizeMult * wallSize * 2/3, sizeMult * wallSize * 2/3);
    ctx.strokeRect(cx - sizeMult * wallSize / 3, cy - sizeMult * wallSize / 3, sizeMult * wallSize * 2/3, sizeMult * wallSize * 2/3);
  }
  if (entity.kind === "up") {
    ctx.fillStyle = colors[16];
    ctx.strokeStyle = cdarken();
    ctx.beginPath();
    ctx.moveTo(cx, cy - wallSize * sizeMult / 3);
    ctx.lineTo(cx - wallSize * sizeMult / 3, cy + wallSize * sizeMult / 4);
    ctx.lineTo(cx + wallSize * sizeMult / 3, cy + wallSize * sizeMult / 4);
    ctx.lineTo(cx, cy - wallSize * sizeMult / 3);
    ctx.fill(); ctx.stroke();
  }
  if (entity.kind === "down") {
    ctx.fillStyle = colors[16];
    ctx.strokeStyle = cdarken();
    ctx.beginPath();
    ctx.moveTo(cx, cy + wallSize * sizeMult / 3);
    ctx.lineTo(cx - wallSize * sizeMult / 3, cy - wallSize * sizeMult / 4);
    ctx.lineTo(cx + wallSize * sizeMult / 3, cy - wallSize * sizeMult / 4);
    ctx.lineTo(cx, cy + wallSize * sizeMult / 3);
    ctx.fill(); ctx.stroke();
  }
  if (entity.kind === "right") {
    ctx.fillStyle = colors[16];
    ctx.strokeStyle = cdarken();
    ctx.beginPath();
    ctx.moveTo(cx + wallSize * sizeMult / 3, cy);
    ctx.lineTo(cx - wallSize * sizeMult / 4, cy - wallSize * sizeMult / 3);
    ctx.lineTo(cx - wallSize * sizeMult / 4, cy + wallSize * sizeMult / 3);
    ctx.lineTo(cx + wallSize * sizeMult / 3, cy);
    ctx.fill(); ctx.stroke();
  }
  if (entity.kind === "left") {
    ctx.fillStyle = colors[16];
    ctx.strokeStyle = cdarken();
    ctx.beginPath();
    ctx.moveTo(cx - wallSize * sizeMult / 3, cy);
    ctx.lineTo(cx + wallSize * sizeMult / 4, cy - wallSize * sizeMult / 3);
    ctx.lineTo(cx + wallSize * sizeMult / 4, cy + wallSize * sizeMult / 3);
    ctx.lineTo(cx - wallSize * sizeMult / 3, cy);
    ctx.fill(); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function renderMap() {
  for (let x = 0; x < 32; x ++) {
    for (let y = 0; y < 32; y ++) {
      const index = x + y * 32;
      const wall = map[index];
      if (wall === " ") continue;
      const idx = letters.indexOf(wall);
      const color = wallColors[idx];
      ctx.fillStyle = colors[color];
      ctx.strokeStyle = cdarken();
      ctx.lineWidth = 3;
      const mappedType = ['default', 'damage', 'heal', 'bounce', 'grow', 'shrink', 'optical', 'sticky', 'fake', 'spawn', 'up', 'down', 'left', 'right', 'portal', 'base', 'team', 'paint', 'filter'][idx];
      renderWall({ x: x * 64 + 32, y: y * 64 + 32, size: 60, kind: mappedType });
    }
  }

  const color = wallColors[selectionIndex];
  ctx.fillStyle = colors[color];
  ctx.strokeStyle = cdarken();
  ctx.lineWidth = 3;
  const mappedType = ['default', 'damage', 'heal', 'bounce', 'grow', 'shrink', 'optical', 'sticky', 'fake', 'spawn', 'up', 'down', 'left', 'right', 'portal', 'base', 'team', 'paint', 'filter'][selectionIndex];
  renderWall({ x: mx * 64 + 32, y: my * 64 + 32, size: 56 + Math.sin(Date.now() / 500) * 8, kind: mappedType });
  ctx.globalAlpha = 1;
}

function frame() {
  requestAnimationFrame(frame);
  renderBackground();
  renderMap();

  canvas.oncontextmenu = e => e.preventDefault();
  const cooldownText = cooldown < Date.now() ? "You may place or remove a wall now." : "You may place or remove a wall in " + ((cooldown - Date.now()) / 1000).toFixed(0) + " seconds.";
  document.querySelector("#cooldown").innerText = cooldownText;
}
requestAnimationFrame(frame);

let mx = 0;
let my = 0;
addEventListener("keydown", (ev) => {
  if (ev.key === "z") selectionIndex ++;
  selectionIndex %= 19;
});
canvas.addEventListener("mousemove", (ev) => {
  mx = Math.floor(32 * ev.offsetX / canvas.clientWidth);
  my = Math.floor(32 * ev.offsetY / canvas.clientHeight);
});
canvas.addEventListener("mousedown", (ev) => {
  socket.send(JSON.stringify({ index: mx + my * 32, type: ev.button === 2 ? 19 : selectionIndex }))
});