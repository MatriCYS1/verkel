// 37x37
const map = [
  ".....................................",
  ".1111111.....1111111.................",
  ".1.....1.....1.....1.................",
  ".1.ccc.1.....1.eee.1.111111111111111.",
  ".1.ccc.1.....1.eee.1.1.............1.",
  ".1.ccc.1.....1.eee.1.1.!.........!.1.",
  ".1.....1.....1.....1.1..!.......!..1.",
  ".111.111.....111.111.1...!.....!...1.",
  "...1.1.........1.1...1....!...!....1.",
  ".111.111.....111.111.1.....!.!.....1.",
  ".1.....1.....1.....1.1......!......1.",
  ".1.bbb.1111111.bbb.111.....!.!.....1.",
  ".1.bbb..././...bbb...!....!...!....1.",
  ".1.bbb.1111111.bbb.111...!.....!...1.",
  ".1.....1.....1.....1.1..!.......!..1.",
  ".111.111.....111.111.1.!.........!.1.",
  "...1.1.........1.1...1.............1.",
  "...1/1.........1/1...111111111111111.",
  "...1.1.........1.1...................",
  "...1/1.........1/1...................",
  "...1.1.........1.1...................",
  ".111.111.....111.111.....1111111.....",
  ".1.....1.....1.....1.....1.....1.....",
  ".1.bbb.1111111.bbb.1111111.bbb.1.....",
  ".1.bbb..././...bbb..././...bbb.1.....",
  ".1.bbb.1111111.bbb.1111111.bbb.1.....",
  ".1.....1.....1.....1.....1.....1.....",
  ".111.111.....111.111.....111.111.....",
  "...1.1.........1.1.........1.1.......",
  ".111.111.....111.111.....111.111.....",
  ".1.....1.....1.....1.....1.....1.....",
  ".1.www.1.....1.ooo.1.....1.aaa.1.....",
  ".1.www.1.....1.ooo.1.....1.aaa.1.....",
  ".1.www.1.....1.ooo.1.....1.aaa.1.....",
  ".1.....1.....1.....1.....1.....1.....",
  ".1111111.....1111111.....1111111.....",
  "....................................."
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const input = document.querySelector("input");

const player = { x: -12, y: 0, angle: 0, vx: 0, vy: 0, name: localStorage.getItem("x-arrasVerifyName") ?? "unknown" };
const camera = { x: 0, y: 0, width: 48 };

const keys = {};
document.addEventListener("keydown", (ev) => keys[ev.key.toLowerCase()] = true);
document.addEventListener("keyup", (ev) => keys[ev.key.toLowerCase()] = false);
document.addEventListener("mousemove", (ev) => {
  player.angle = Math.atan2(ev.clientY - innerHeight / 2, ev.clientX - innerWidth / 2);
});

document.addEventListener("keydown", (ev) => {
  if (ev.key !== "Enter") return;
  if (input.hidden) {
    input.hidden = false;
    input.focus();
  } else {
    socket.send(JSON.stringify({ type: "chat", msg: input.value }));
    input.hidden = true;
    input.value = "";
  }
})

let datapoints = null;
let mostRecent = null;

let currentPortal = null;
let teleportTime = null;

let teleported = false;

let portals = [];

let spawnTime = Date.now();

let otherPlayers = [];
let otherChat = {};

let arrasCorruptReplacements = [
  ["", 0],
  ["", 4],
  ["", 8],
  ["", 12],
  ["", 16],
  ["", 20],
  ["", 24],
  ["", 28]
];

let socket;
function connect() {
  const root = location.hostname === "localhost" ? "ws://localhost:1999" : "wss://partykit.fibonnaci314.partykit.dev";
  socket = new WebSocket(root + "/parties/nexus/my-new-room");
  socket.addEventListener("message", message);
  socket.addEventListener("close", connect);
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "name", name: localStorage.getItem("x-arrasVerifyName") ?? "unknown" }))
  });
}
function message(ev) {
  const content = JSON.parse(ev.data);
  if (content.type === "players") {
    player.id = content.ignore;
    delete content.players[content.ignore];
    otherPlayers = Object.values(content.players);
  }
  if (content.type === "portals") {
    const lastPortals = portals.slice();
    portals = content.portals;
    lastPortals.forEach((portal) => {
      const found = portals.find((p) => p.server === portal.server);
      if (!found) return;
      found.visualSizeMult = portal.visualSizeMult ?? 1;
    });
  }
  if (content.type === "chat") {
    otherChat[content.id] ??= [];
    otherChat[content.id].unshift({ timestamp: Date.now(), message: content.message });
  }
}
connect();

function localize(coord) {
  const dx = coord.x - camera.x;
  const dy = coord.y - camera.y;
  return {
    x: canvas.width / 2 + dx * canvas.width / camera.width,
    y: canvas.height / 2 + dy * canvas.width / camera.width,
  };
}
function resize(length) {
  return length * canvas.width / camera.width;
}

function updateCanvas() {
  const dpr = (window.devicePixelRatio ?? 1);
  canvas.width = dpr * innerWidth;
  canvas.height = dpr * innerHeight;
  canvas.style = `
  
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  background: #dbdbdb;

  `;
}

function tickPort() {
  portals.forEach((port) => {
    port.visualSizeMult ??= 0;
    port.visualSizeMult *= 0.91;
    port.visualSizeMult += 0.09;
    if (port === currentPortal) port.visualSizeMult += 0.07;
  })
}

function tickPlayer() {
  if (document.activeElement !== input) player.vx += (!!(keys.arrowright || keys.d) - !!(keys.arrowleft || keys.a)) * 0.02 * (keys.shift ? 5 : 1);
  if (document.activeElement !== input) player.vy += (!!(keys.arrowdown || keys.s) - !!(keys.arrowup || keys.w)) * 0.02 * (keys.shift ? 5 : 1);
  player.vx *= keys.control ? 1 : 0.86;
  player.vy *= keys.control ? 1 : 0.86;
  player.x += player.vx;
  player.y += player.vy;
  if (player.x < -111) player.x += 222;
  if (player.y < -111) player.y += 222;
  if (player.x > 111) player.x -= 222;
  if (player.y > 111) player.y -= 222;
  camera.width = 72;
  currentPortal = null;
  portals.forEach((portal) => {
    if (Math.sqrt((portal.x - player.x) ** 2 + (portal.y - player.y) ** 2) < portal.visualSizeMult + 0.4) {
      currentPortal = portal;
    }
  });
  if (!currentPortal) teleportTime = null;
  else teleportTime ??= Date.now() + 1e4;
  arrasCorruptReplacements.forEach((char) => {
    if (Math.random() < 1 / 1000) (char[0] = "qwertyuiopasdfghjklxcvbnm"[Math.floor(Math.random() * 26)]) && (char[1] = 10);
    else char[1] --;
  });
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "update", x: player.x, y: player.y, a: player.angle }))
  }
  if (teleportTime < Date.now() && teleportTime && !teleported) {
    location.href = "https://arras.io/#" + currentPortal.server;
    teleported = true;
  }
}

function collide() {
  try {
    const cellX = Math.floor((player.x + 111) / 6);
    const cellY = Math.floor((player.y + 111) / 6);
    for (let dx = -1; dx < 2; dx ++) {
      for (let dy = -1; dy < 2; dy ++) {
        const cell = map[cellY + dy][cellX + dx];
        if (cell === "1") {
          const rx = (6 * (cellX + dx) - 108);
          const ry = (6 * (cellY + dy) - 108);
          const deltx = rx - player.x;
          const delty = ry - player.y;
          if (Math.abs(deltx) > 3.8 || Math.abs(delty) > 3.8) continue;
          if (Math.abs(deltx) > Math.abs(delty)) {
            player.vx *= -0.5;
            if (deltx < 0) {
              player.x = rx + 3.800001;
            } else {
              player.x = rx - 3.800001;
            }
          } else {
            player.vy *= -0.5;
            if (delty < 0) {
              player.y = ry + 3.800001;
            } else {
              player.y = ry - 3.800001;
            }
          }
        }
      }
    }
  } catch(e) {}
  camera.x = player.x;
  camera.y = player.y;
}
function tick() {
  tickPort();
  tickPlayer();
  collide();
}

function renderBackground() {
  ctx.lineWidth = resize(0.03);
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#000000";
  const tl = localize({ x: -111, y: -111 });
  const br = localize({ x: 111, y: 111 });
  for (let i = -111; i <= 111; i += 1) {
    const x = localize({ x: i }).x;
    ctx.beginPath();
    ctx.moveTo(x, tl.y);
    ctx.lineTo(x, br.y);
    ctx.stroke();
  }
  for (let i = -111; i <= 111; i += 1) {
    const y = localize({ y: i }).y;
    ctx.beginPath();
    ctx.moveTo(tl.x, y);
    ctx.lineTo(br.x, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.3;
  const size = resize(6);
  for (let x = 0; x < 37; x ++)
  for (let y = 0; y < 37; y ++) {
    const tile = map[y][x];
    if (["b", "/", "!"].includes(tile)) {
      if (tile === "b") ctx.fillStyle = "#3ca4cb";
      if (tile === "!") ctx.fillStyle = "#e03e41";
      if (tile === "/") ctx.fillStyle = "#000000";
      const pos = localize({
        x: (x - 18.5) * 6,
        y: (y - 18.5) * 6
      });
      if (pos.x < -size || pos.y < -size || pos.x > canvas.width || pos.y > canvas.height) continue;
      ctx.fillRect(pos.x, pos.y, size, size);
    }
  }
  ctx.globalAlpha = 1;
}
function renderPlayer(player) {
  const colorId = player.name === "Testing" ? 5 : player.name.split("").reduce((acc, cur) => acc + cur.codePointAt(0), 0) % 5;
  const colors = [
    ["#3ca4cb", "#446d7d"],
    ["#8abc3f", "#637745"],
    ["#e03e41", "#854446"],
    ["#cc669c", "#7d546a"],
    ["#fdf380", "#918d5f"],
    ["#b9e87e", "#76885e"]
  ][colorId];
  const playerCoord = localize(player);
  const baseSize = resize(0.8);
  const forwardX = Math.cos(player.angle);
  const forwardY = Math.sin(player.angle);
  const sideX = Math.sin(player.angle);
  const sideY = -Math.cos(player.angle);
  ctx.lineWidth = resize(0.2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.fillStyle = "#a4a4ad";
  ctx.strokeStyle = "#6d6d71";
  ctx.beginPath();
  ctx.moveTo(playerCoord.x + sideX * baseSize * 0.5, playerCoord.y + sideY * baseSize * 0.5);
  ctx.lineTo(playerCoord.x - sideX * baseSize * 0.5, playerCoord.y - sideY * baseSize * 0.5);
  ctx.lineTo(playerCoord.x - sideX * baseSize * 0.5 + forwardX * baseSize * 2, playerCoord.y - sideY * baseSize * 0.5 + forwardY * baseSize * 2);
  ctx.lineTo(playerCoord.x + sideX * baseSize * 0.5 + forwardX * baseSize * 2, playerCoord.y + sideY * baseSize * 0.5 + forwardY * baseSize * 2);
  ctx.lineTo(playerCoord.x + sideX * baseSize * 0.5, playerCoord.y + sideY * baseSize * 0.5);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.beginPath();
  ctx.arc(playerCoord.x, playerCoord.y, baseSize, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
}
function renderPortal(portal) {
  const coord = localize(portal);
  const baseSize = resize(portal.visualSizeMult);
  const time = Date.now() + 1000 * portal.id;
  [
    ctx.fillStyle,
    ctx.strokeStyle
  ] = {
    w: ["#3ca4cb", "#446d7d"],
    c: ["#8abc3f", "#637745"],
    e: ["#e03e41", "#854446"],
    a: ["#cc669c", "#7d546a"],
    o: ["#fdf380", "#918d5f"]
  }[portal.server[0]];
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(coord.x, coord.y, baseSize * (1.05 + (Math.cos(time / 280) + 1) * 0.1), 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(coord.x, coord.y, baseSize * (1.08 + (Math.cos(time / 400) + 1) * 0.14), 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(coord.x, coord.y, baseSize * (1.11 + (Math.cos(time / 515) + 1) * 0.18), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(coord.x, coord.y, baseSize, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
}
function renderPortalUI(portal) {
  const coord = localize(portal);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#484848";
  ctx.lineWidth = resize(0.12);
  ctx.font = "600 " + resize(0.6) + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText("#" + portal.server, coord.x, coord.y - resize(portal.visualSizeMult + 0.8));
  ctx.fillText("#" + portal.server, coord.x, coord.y - resize(portal.visualSizeMult + 0.8));
  if (portal === currentPortal) {
    ctx.strokeText("Teleporting in " + Math.ceil((teleportTime - Date.now()) / 1000) + " sec", coord.x, coord.y + resize(portal.visualSizeMult + 0.5));
    ctx.fillText("Teleporting in " + Math.ceil((teleportTime - Date.now()) / 1000) + " sec", coord.x, coord.y + resize(portal.visualSizeMult + 0.5));
  }
  ctx.font = "600 " + resize(0.4) + "px 'Segoe UI', Arial, sans-serif";
  ctx.strokeText((mostRecent?.servers?.[portal.server]?.clients ?? 0) + " players", coord.x, coord.y - resize(portal.visualSizeMult + 0.35));
  ctx.fillText((mostRecent?.servers?.[portal.server]?.clients ?? 0) + " players", coord.x, coord.y - resize(portal.visualSizeMult + 0.35));
}
function renderPlayerUI(player) {
  const colorId = player.name === "Testing" ? 5 : player.name.split("").reduce((acc, cur) => acc + cur.codePointAt(0), 0) % 5;
  const colors = [
    ["#3ca4cb", "#446d7d"],
    ["#8abc3f", "#637745"],
    ["#e03e41", "#854446"],
    ["#cc669c", "#7d546a"],
    ["#fdf380", "#918d5f"],
    ["#b9e87e", "#76885e"]
  ][colorId];
  const coord = localize(player);
  const baseSize = resize(1.3);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#484848";
  ctx.lineWidth = resize(0.12);
  ctx.font = "600 " + resize(0.6) + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(player.name, coord.x, coord.y - baseSize);
  ctx.fillText(player.name, coord.x, coord.y - baseSize);
  const chat = otherChat[player.id];
  if (!chat?.length) return;
  otherChat[player.id] = otherChat[player.id].filter((t) => Date.now() - t.timestamp < 10000);
  const lastMessage = chat[0].timestamp;
  const offset = Math.min(1, (Date.now() - lastMessage) / 200);
  chat.forEach((message, index) => {
    ctx.globalAlpha = Math.max(0, Math.min(index ? 1 : offset, 1, 50 - (Date.now() - message.timestamp) / 200));
    const y = coord.y - baseSize - resize(0.85 + 0.9 * Math.max(0, index - 1 + offset));
    const width = ctx.measureText(message.message).width;
    ctx.strokeStyle = colors[0] + "80";
    ctx.lineWidth = resize(0.7);
    ctx.beginPath();
    ctx.moveTo(coord.x - width / 2, y);
    ctx.lineTo(coord.x + width / 2, y);
    ctx.stroke();
    ctx.strokeStyle = "#484848";
    ctx.lineWidth = resize(0.12);
    ctx.strokeText(message.message, coord.x, y);
    ctx.fillText(message.message, coord.x, y);
  });
  ctx.globalAlpha = 1;
}
function renderUI() {
  const regionText = 
    player.y < 0 ?
      player.x < -48 ? "cUS Central" :
      "eEurope" : 
      player.x < -48 ? "wUS West" :
      player.x < 24 ? "oOceania" :
      "aAsia";
  const playersHere = Object.values(mostRecent?.servers ?? {}).filter((s) => s.name[0] === regionText[0]).reduce((acc, cur) => acc + cur.clients, 0);
  const players = Object.values(mostRecent?.servers ?? {}).reduce((acc, cur) => acc + cur.clients, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#484848";
  ctx.lineWidth = 5;
  ctx.font = "600 22px 'Segoe UI', Arial, sans-serif";
  ctx.strokeText("You are in", canvas.width / 2, 14);
  ctx.fillText("You are in", canvas.width / 2, 14);
  ctx.strokeText(playersHere.toLocaleString() + " players here", canvas.width / 2, 80);
  ctx.fillText(playersHere.toLocaleString() + " players here", canvas.width / 2, 80);
  ctx.globalAlpha = Math.max(0, Math.min(1, 2 - (Date.now() - spawnTime) / 4000));
  ctx.strokeText("Arrow keys or WASD to move.", canvas.width / 2, canvas.height * 0.6);
  ctx.fillText("Arrow keys or WASD to move.", canvas.width / 2, canvas.height * 0.6);
  ctx.strokeText("Shift or Ctrl to fast travel.", canvas.width / 2, canvas.height * 0.6 + 25);
  ctx.fillText("Shift or Ctrl to fast travel.", canvas.width / 2, canvas.height * 0.6 + 25);
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  ctx.font = "600 14px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.strokeText(players.toLocaleString() + " players", canvas.width - 4, canvas.height - 406);
  ctx.fillText(players.toLocaleString() + " players", canvas.width - 4, canvas.height - 406);
  ctx.strokeText("Speed: " + (60 * Math.sqrt(player.vx ** 2 + player.vy ** 2)).toFixed(2) + " gu/s", canvas.width - 4, canvas.height - 390);
  ctx.fillText("Speed: " + (60 * Math.sqrt(player.vx ** 2 + player.vy ** 2)).toFixed(2) + " gu/s", canvas.width - 4, canvas.height - 390);
  ctx.lineWidth = 5.5;
  ctx.font = "600 24px 'Segoe UI', Arial, sans-serif";
  ctx.strokeText(arrasCorruptReplacements.map((char, i) => char[1] <= 0 ? "arras.io"[i] : char[0]).join(""), canvas.width - 4, canvas.height - 427);
  ctx.fillText(arrasCorruptReplacements.map((char, i) => char[1] <= 0 ? "arras.io"[i] : char[0]).join(""), canvas.width - 4, canvas.height - 427);
  ctx.lineWidth = 8;
  ctx.font = "600 36px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = {
    w: ["#3ca4cb", "#446d7d"],
    c: ["#8abc3f", "#637745"],
    e: ["#e03e41", "#854446"],
    a: ["#cc669c", "#7d546a"],
    o: ["#fdf380", "#918d5f"]
  }[regionText[0]][0];
  ctx.strokeText(regionText.slice(1), canvas.width / 2, 47);
  ctx.fillText(regionText.slice(1), canvas.width / 2, 47);
  ctx.strokeStyle = "#484848";
  ctx.fillStyle = "#dbdbdb90";
  ctx.lineWidth = 4;
  ctx.strokeRect(canvas.width - 378, canvas.height - 378, 370, 370);
  ctx.fillRect(canvas.width - 378, canvas.height - 378, 370, 370);
  for (let x = 0; x < 37; x ++) {
    for (let y = 0; y < 37; y ++) {
      const tile = map[y][x];
      if (tile === "1") {
        ctx.fillStyle = "#a4a4ad";
        ctx.globalAlpha = 1;
        ctx.fillRect(canvas.width - 378 + 10 * x, canvas.height - 378 + 10 * y, 10, 10);
      }
      if (["b", "!", "/"].includes(tile)) {
        ctx.globalAlpha = 0.4;
        if (tile === "b") ctx.fillStyle = "#3ca4cb";
        if (tile === "!") ctx.fillStyle = "#e03e41";
        if (tile === "/") ctx.fillStyle = "#000000";
        ctx.fillRect(canvas.width - 378 + 10 * x, canvas.height - 378 + 10 * y, 10, 10);
      }
    }
  }
  [player, ...otherPlayers].forEach((thisPlayer) => {
    const playerTX = ((thisPlayer.x + 111) / 6);
    const playerTY = ((thisPlayer.y + 111) / 6);
    ctx.globalAlpha = 1;
    ctx.fillStyle = player === thisPlayer ? "#000000" : "#3ca4cb";
    ctx.beginPath();
    ctx.arc(canvas.width - 378 + 10 * playerTX, canvas.height - 378 + 10 * playerTY, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
function renderWalls() {
  ctx.fillStyle = "#a4a4ad";
  ctx.strokeStyle = "#6d6d71";
  ctx.lineWidth = resize(0.2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const size = resize(6);
  for (let x = 0; x < 37; x ++) {
    for (let y = 0; y < 37; y ++) {
      const tile = map[y][x];
      if (tile === "1") {
        const pos = localize({
          x: (x - 18.5) * 6,
          y: (y - 18.5) * 6
        });
        if (pos.x < -size || pos.y < -size || pos.x > canvas.width || pos.y > canvas.height) continue;
        ctx.strokeRect(pos.x, pos.y, size, size);
        ctx.fillRect(pos.x, pos.y, size, size);
      }
    }
  }
}
function renderRing() {
  const baseRingSize = teleportTime ? ((teleportTime - Date.now()) / 1250) : 1;
  const ringSize = baseRingSize ** 4;
  ctx.fillStyle = "#000000";
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.sqrt(canvas.width ** 2 + canvas.height ** 2) * ringSize, 0, Math.PI * 2);
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.clip("evenodd");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function frame() {
  updateCanvas();

  if (teleported) return ctx.fillStyle = "#000000" && ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderBackground();
  portals.forEach(renderPortal);
  renderPlayer(player);
  otherPlayers.forEach(renderPlayer);
  renderWalls();
  portals.forEach(renderPortalUI);
  renderPlayerUI(player);
  otherPlayers.forEach(renderPlayerUI);
  renderUI();
  renderRing();

  requestAnimationFrame(frame);
}

async function downloadData() {
  const response = await fetch("https://t4mebdah2ksfasgi-c.uvwx.xyz:8443/2222/status");
  const json = await response.json();
  for (let key in json.status) {
    if (!json.status[key].clients) {
      delete json.status[key];
    }
  }
  mostRecent = { servers: json.status };
}

setInterval(downloadData, 15000);
downloadData();

requestAnimationFrame(frame);
setInterval(tick, 1000 / 60);

setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "portals" }));
  }
}, 2500);
