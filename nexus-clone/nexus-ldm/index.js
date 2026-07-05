// 37x37 Map alignment matrix
const map = [
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
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

// Track timestamps of messages sent locally by this client for rate-limiting
const localChatHistory = [];

// Chat Listener Event with Rate Limiting & Character Bounds Controls
document.addEventListener("keydown", (ev) => {
  if (ev.key !== "Enter" || !input) return;
  if (input.hidden) {
    input.hidden = false;
    input.focus();
  } else {
    let messageText = input.value.trim();
    
    if (messageText !== "") {
      const now = Date.now();
      
      // Filter out log records older than 5 seconds (5000ms)
      while (localChatHistory.length > 0 && now - localChatHistory[0] > 5000) {
        localChatHistory.shift();
      }
      
      // Strict Anti-Spam Check: Max 10 messages per 5s window
      if (localChatHistory.length >= 10) {
        console.warn("Chat rate limit exceeded! Max 10 messages every 5 seconds.");
      } else {
        // Enforce strict 100 character length payload restriction
        if (messageText.length > 100) {
          messageText = messageText.slice(0, 100);
        }
        
        if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "chat", msg: messageText }));
          localChatHistory.push(now); // Store tracking node
        }
      }
    }
    
    input.hidden = true;
    input.value = "";
  }
});

// Alt Key Listener Event - Updates profile nickname options
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Alt" && document.activeElement !== input) {
    ev.preventDefault(); // Blocks default browser menu system activations
    
    const NAME_LIMIT = 16;
    let newName = prompt(`Enter your new nickname (Max ${NAME_LIMIT} characters):`, player.name);
    
    if (newName !== null) {
      newName = newName.trim();
      
      if (newName.length > NAME_LIMIT) {
        alert(`Name too long! It has been shortened to ${NAME_LIMIT} characters.`);
        newName = newName.slice(0, NAME_LIMIT);
      }
      
      if (newName === "") newName = "unknown";

      player.name = newName;
      localStorage.setItem("x-arrasVerifyName", newName);
      
      if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "name", name: newName }));
      }
      console.log(`Name set to: ${newName}`);
    }
  }
});

let datapoints = null;
let mostRecent = null;
let currentPortal = null;
let teleportTime = null;
let teleported = false;
let portals = [];
let spawnTime = Date.now();
let otherPlayers = [];
let otherChat = {};

// Performance Tracking Variables
let lastFrameTime = performance.now();
let fps = 0;
let frameTimeMs = 0;
let framesThisPeriod = 0;
let lastFpsUpdate = performance.now();

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

// Fixed spacing indentation bug within parameters below
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

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "update", x: player.x, y: player.y, a: player.angle }))
  }
}

function collide() {
  try {
    const cellX = Math.floor((player.x + 111) / 6);
    const cellY = Math.floor((player.y + 111) / 6);
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        const cell = map[cellY + dy][cellX + dx];
        if (cell === "1") {
          const rx = (6 * (cellX + dx) - 108);
          const ry = (6 * (cellY + dy) - 108);
          const deltx = rx - player.x;
          const delty = ry - player.y;
          if (Math.abs(deltx) > 3.8 || Math.abs(delty) > 3.8) continue;
          if (Math.abs(deltx) > Math.abs(delty)) {
            player.vx *= -1; // 🌟 Speed divided by 1 (retains 100% bounce speed)
            if (deltx < 0) {
              player.x = rx + 3.800001;
            } else {
              player.x = rx - 3.800001;
            }
          } else {
            player.vy *= -1; // 🌟 Speed divided by 1 (retains 100% bounce speed)
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
  for (let x = 0; x < 37; x++) {
    for (let y = 0; y < 37; y++) {
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
  }
  ctx.globalAlpha = 1;
}

function renderPlayer(p) {
  const safeName = String(p.name ?? "unknown");
  
  let colorId;
  if (safeName === "Testing") {
    colorId = 5;
  } else if (safeName === "desmos") {
    colorId = 6;
  } else if (safeName === "h#shtag") {
    colorId = 7;
  } else if (safeName === "MatriCYS-1 [-1]") {
    colorId = 8;
  } else if (safeName === "of tale") {
    colorId = 9;
  } else if (safeName === "Gem Knight 💎") {
    colorId = 10;
  } else {
    colorId = safeName.split("").reduce((acc, cur) => acc + cur.codePointAt(0), 0) % 5;
  }
  
  const colors = [
    ["#3ca4cb", "#446d7d"],
    ["#8abc3f", "#637745"],
    ["#e03e41", "#854446"],
    ["#cc669c", "#7d546a"],
    ["#fdf380", "#918d5f"],
    ["#b9e87e", "#76885e"],
    ["#F199C3", "#a66183"],
    ["#000000", "#111111"],
    ["#00EDFF", "#999999"],
    ["#999999", "#808080"],
    ["#7adbba", "#5c8375"]
  ][colorId];
  
  const playerCoord = localize(p);
  const baseSize = resize(0.8);
  const forwardX = Math.cos(p.angle);
  const forwardY = Math.sin(p.angle);
  const sideX = Math.sin(p.angle);
  const sideY = -Math.cos(p.angle);
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

function renderPlayerUI(p) {
  const safeName = String(p.name ?? "unknown");

  let colorId;
  if (safeName === "Testing") {
    colorId = 5;
  } else if (safeName === "desmos") {
    colorId = 6;
  } else if (safeName === "h#shtag") {
    colorId = 7;
  } else if (safeName === "MatriCYS-1 [-1]") {
    colorId = 8;
  } else if (safeName === "of tale") {
    colorId = 9;
  } else if (safeName === "Gem Knight 💎") {
    colorId = 10;
  } else {
    colorId = safeName.split("").reduce((acc, cur) => acc + cur.codePointAt(0), 0) % 5;
  }

  const colors = [
    ["#3ca4cb", "#446d7d"],
    ["#8abc3f", "#637745"],
    ["#e03e41", "#854446"],
    ["#cc669c", "#7d546a"],
    ["#fdf380", "#918d5f"],
    ["#b9e87e", "#76885e"],
    ["#F199C3", "#a66183"],
    ["#000000", "#111111"],
    ["#00EDFF", "#999999"],
    ["#999999", "#808080"],
    ["#7adbba", "#5c8375"]
  ][colorId];

  const coord = localize(p);
  const baseSize = resize(1.3);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#484848";
  ctx.lineWidth = resize(0.12);
  ctx.font = "600 " + resize(0.6) + "px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(safeName, coord.x, coord.y - baseSize);
  ctx.fillText(safeName, coord.x, coord.y - baseSize);
  
  const chat = otherChat[p.id];
  if (!chat?.length) return;
  otherChat[p.id] = otherChat[p.id].filter((t) => Date.now() - t.timestamp < 10000);
  const lastMessage = chat[0].timestamp;
  const offset = Math.min(1, (Date.now() - lastMessage) / 200);
  chat.forEach((message, index) => {
    ctx.globalAlpha = Math.max(0, Math.min(index ? 1 : offset, 1, 50 - (Date.now() - message.timestamp) / 200));
    const y = coord.y - baseSize - resize(0.85 + 0.9 * Math.max(0, index - 1 + offset));
    
    const renderedMsg = String(message.message);
    const width = ctx.measureText(renderedMsg).width;
    
    ctx.strokeStyle = colors[0] + "80";
    ctx.lineWidth = resize(0.7);
    ctx.beginPath();
    ctx.moveTo(coord.x - width / 2, y);
    ctx.lineTo(coord.x + width / 2, y);
    ctx.stroke();
    ctx.strokeStyle = "#484848";
    ctx.lineWidth = resize(0.12);
    ctx.strokeText(renderedMsg, coord.x, y);
    ctx.fillText(renderedMsg, coord.x, y);
  });
  ctx.globalAlpha = 1;
}

function renderUI() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#484848";
  ctx.lineWidth = 5;
  ctx.font = "600 22px 'Segoe UI', Arial, sans-serif";
        
  ctx.globalAlpha = Math.max(0, Math.min(1, 2 - (Date.now() - spawnTime) / 4000));
  ctx.strokeText("Arrow keys or WASD to move.", canvas.width / 2, canvas.height * 0.6);
  ctx.fillText("Arrow keys or WASD to move.", canvas.width / 2, canvas.height * 0.6);
  ctx.strokeText("Shift or Ctrl to fast travel. Alt to change name.", canvas.width / 2, canvas.height * 0.6 + 25);
  ctx.fillText("Shift or Ctrl to fast travel. Alt to change name.", canvas.width / 2, canvas.height * 0.6 + 25);
  ctx.globalAlpha = 1;
        
  // Performance Indicators Stack
  ctx.lineWidth = 3;
  ctx.font = "600 14px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "right";

  // 1. Speed (gu/s)
  ctx.strokeText("Speed: " + (60 * Math.sqrt(player.vx ** 2 + player.vy ** 2)).toFixed(2) + " gu/s", canvas.width - 4, canvas.height - 390);
  ctx.fillText("Speed: " + (60 * Math.sqrt(player.vx ** 2 + player.vy ** 2)).toFixed(2) + " gu/s", canvas.width - 4, canvas.height - 390);

  // 2. FPS
  ctx.strokeText(fps + " fps", canvas.width - 4, canvas.height - 406);
  ctx.fillText(fps + " fps", canvas.width - 4, canvas.height - 406);

  // 3. MS Frame Time
  ctx.strokeText(frameTimeMs.toFixed(1) + " ms", canvas.width - 4, canvas.height - 422);
  ctx.fillText(frameTimeMs.toFixed(1) + " ms", canvas.width - 4, canvas.height - 422);

  ctx.strokeStyle = "#484848";
  ctx.fillStyle = "#dbdbdb90";
  ctx.lineWidth = 4;
  ctx.strokeRect(canvas.width - 378, canvas.height - 378, 370, 370);
  ctx.fillRect(canvas.width - 378, canvas.height - 378, 370, 370);
        
  for (let x = 0; x < 37; x++) {
    for (let y = 0; y < 37; y++) {
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
  for (let x = 0; x < 37; x++) {
    for (let y = 0; y < 37; y++) {
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

function frame() {
  const now = performance.now();
  frameTimeMs = now - lastFrameTime;
  lastFrameTime = now;

  framesThisPeriod++;
  if (now - lastFpsUpdate >= 500) { 
    fps = Math.round((framesThisPeriod * 1000) / (now - lastFpsUpdate));
    framesThisPeriod = 0;
    lastFpsUpdate = now;
  }

  updateCanvas();

  renderBackground();
  renderPlayer(player);
  otherPlayers.forEach(renderPlayer);
  renderWalls();
  renderPlayerUI(player);
  otherPlayers.forEach(renderPlayerUI);
  renderUI();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
setInterval(tick, 1000 / 60);
