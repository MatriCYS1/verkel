// -mime-type 15 text/javascript
!function(){

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const player = { x: 0, y: 25, vx: 0, vy: 0, wallJumpTick: 0, ground: false, fallDist: 0, name: location.hash.slice(1), timer: 0, lbIndex: 0, modifier: "none" };
const playerSize = 5;
const playerColor = "#ff00ff";
const playerFrictionX = 0.8;
const playerFrictionY = 0.99;
const playerFrictionXIce = 0.99;
const playerAcceleration = 0.3;
const playerAccelerationIce = 0.04;
const playerJumpAcceleration = 2.5;
const playerPlatformBounceAcceleration = 6;
const playerDeathThreshold = -120;
const playerBounceThreshold = 30;
const playerBounceColor = "#8000ff";
const playerModifiedColors = { ice: "#0000ff", dark: "#800080", cheat: "#ff000040" };

const camera = { x: 0, y: 0, width: 125, goalWidth: 125 };
const cameraInterpolationSharpness = 9;
let cameraRestWidth = 170;
let cameraDampWidth = 280;
let cameraMovementWidth = 20;

const basePlatforms = [
  { x: 0, y: 0, width: 40, height: 5 },
  { x: 0, y: 25, width: 40, height: 5, hide: true, text: "Press Q to warp between checkpoints" },
  { x: 0, y: 22.5, width: 40, height: 5, hide: true, text: "Press Ctrl+M to load a mapcode" },
  { x: -40, y: -20, width: 20, height: 5, text: "Modifiers" },
  { x: -20, y: -40, width: 20, height: 5 },
  { x: 0, y: -60, width: 20, height: 5, text: "No Modifier", onTouch: () => player.modifier === "cheat" || (player.modifier = "none", checkpoints.forEach((cp) => cp.unlocked = false)) },
  { x: 20, y: -40, width: 20, height: 5 },
  { x: 40, y: -60, width: 20, height: 5, text: "Ice Mode", onTouch: () => player.modifier === "cheat" || (player.modifier = "ice", checkpoints.forEach((cp) => cp.unlocked = false)) },
  { x: 60, y: -40, width: 20, height: 5 },
  { x: 80, y: -60, width: 20, height: 5, text: "Dark Mode", onTouch: () => player.modifier === "cheat" || (player.modifier = "dark", checkpoints.forEach((cp) => cp.unlocked = false)) },
  { x: 100, y: -40, width: 20, height: 5 },
  { x: 45, y: 20, width: 40, height: 5 },
  { x: 105, y: 40, width: 40, height: 5 },
  { x: 170, y: 60, width: 40, height: 5 },
  { x: 50, y: 75, width: 40, height: 5 },
  { x: -60, y: 70, width: 20, height: 5 },
  { x: -90, y: 90, width: 5, height: 5 },
  { x: -130, y: 110, width: 5, height: 5 },
  { x: -170, y: 130, width: 5, height: 5 },
  { x: -90, y: 145, width: 35, height: 5, noIce: true },
  { x: -220, y: 155, width: 25, height: 5 },
  { x: -160, y: 175, width: 20, height: 5 },
  { x: -120, y: 195, width: 15, height: 5 },
  { x: -80, y: 215, width: 10, height: 5 },
  { x: -25, y: 215, width: 5, height: 5 },
  { x: 30, y: 215, width: 5, height: 5 },
  { x: 85, y: 235, width: 60, height: 5 },
  { x: 85, y: 255, width: 60, height: 5 },
  { x: 85, y: 276, width: 60, height: 5 },
  { x: 85, y: 298, width: 60, height: 5 },
  { x: 85, y: 321, width: 60, height: 5 },
  { x: 85, y: 345, width: 60, height: 5 },
  { x: 85, y: 370, width: 60, height: 5 },
  { x: 180, y: 370, width: 60, height: 5 },
  { x: -37.5, y: 385, width: 5, height: 90 },
  { x: -35, y: 340, width: 10, height: 5 },
  { x: -15, y: 340, width: 10, height: 5 },
  { x: -85, y: 305, width: 25, height: 5 },
  { x: -85, y: 330, width: 25, height: 5 },
  { x: -85, y: 355, width: 25, height: 5 },
  { x: -42.5, y: 375, width: 5, height: 5 },
  { x: -42.5, y: 400, width: 5, height: 5 },
  { x: -42.5, y: 425, width: 5, height: 5 },
  { x: -42.5, y: 445, width: 5, height: 5 },
  { x: -42.5, y: 471, width: 5, height: 5 },
  { x: -42.5, y: 497, width: 5, height: 5 },
  { x: 10, y: 520, width: 30, height: 5 },
  { x: 35, y: 540, width: 5, height: 5 },
  { x: 45, y: 562, width: 5, height: 5 },
  { x: 85, y: 584, width: 5, height: 5 },
  { x: 65, y: 606, width: 5, height: 5 },
  { x: 105, y: 628, width: 5, height: 5 },
  { x: 145, y: 650, width: 5, height: 5 },
  { x: 115, y: 672, width: 5, height: 5 },
  { x: 75, y: 694, width: 5, height: 5 },
  { x: 95, y: 716, width: 5, height: 5 },
  { x: 135, y: 738, width: 5, height: 5 },
  { x: 175, y: 760, width: 5, height: 5 },
  { x: 240, y: 780, width: 50, height: 5 },
  { x: 290, y: 780, width: 50, height: 5, convey: +1 },
  { x: 375, y: 800, width: 50, height: 5, convey: +1 },
  { x: 290, y: 820, width: 50, height: 5, convey: +1 },
  { x: 370, y: 840, width: 40, height: 5, convey: +1.2 },
  { x: 295, y: 860, width: 40, height: 5, convey: +1.2 },
  { x: 365, y: 880, width: 30, height: 5, convey: +1.5, noIce: true },
  { x: 300, y: 900, width: 30, height: 5, convey: +1.5, noIce: true },
  { x: 360, y: 920, width: 20, height: 5, convey: +1.75, noIce: true },
  { x: 305, y: 940, width: 20, height: 5, convey: +1.75, noIce: true },
  { x: 355, y: 960, width: 10, height: 5, convey: +2.0, noIce: true },
  { x: 310, y: 980, width: 10, height: 5, convey: +2.0, noIce: true },
  { x: 355, y: 1000, width: 10, height: 5 },
  { x: 355, y: 1020, width: 10, height: 5 },
  { x: 390, y: 1040, width: 5, height: 5 },
  { x: 430, y: 1060, width: 5, height: 5 },
  { x: 400, y: 1080, width: 5, height: 5 },
  { x: 360, y: 1100, width: 5, height: 5 },
  { x: 380, y: 1120, width: 5, height: 5 },
  { x: 350, y: 1140, width: 5, height: 5 },
  { x: 390, y: 1160, width: 5, height: 5 },
  { x: 420, y: 1180, width: 5, height: 5 },
  { x: 460, y: 1200, width: 5, height: 5 },
  { x: 440, y: 1220, width: 5, height: 5 },
  { x: 480, y: 1240, width: 5, height: 5, convey: -0.2 },
  { x: 450, y: 1260, width: 5, height: 5, convey: -0.3 },
  { x: 410, y: 1280, width: 5, height: 5, convey: -0.4 },
  { x: 370, y: 1300, width: 5, height: 5, convey: -0.5 },
  { x: 390, y: 1320, width: 5, height: 5, convey: -0.6 },
  { x: 380, y: 1340, width: 5, height: 5, convey: -0.7 },
  { x: 420, y: 1360, width: 5, height: 5, convey: -0.8 },
  { x: 460, y: 1380, width: 5, height: 5, convey: -1.2 },
  { x: 430, y: 1400, width: 5, height: 5, convey: -1.6 },
  { x: 470, y: 1420, width: 5, height: 5, convey: -2.0 },
  { x: 410, y: 1440, width: 50, height: 5 },
  { x: 380, y: 1460, width: 20, height: 5, ice: true },
  { x: 340, y: 1480, width: 20, height: 5, ice: true },
  { x: 300, y: 1500, width: 20, height: 5, ice: true },
  { x: 245, y: 1520, width: 30, height: 5, ice: true },
  { x: 340, y: 1540, width: 100, height: 5, ice: true },
  { x: 500, y: 1550, width: 60, height: 5 },
  { x: 480, y: 1570, width: 5, height: 5 },
  { x: 450, y: 1590, width: 5, height: 5 },
  { x: 420, y: 1610, width: 5, height: 5 },
  { x: 380, y: 1630, width: 5, height: 5 },
  { x: 340, y: 1650, width: 5, height: 5 },
  { x: 300, y: 1670, width: 5, height: 5 },
  { x: 260, y: 1690, width: 5, height: 5 },
  { x: 220, y: 1710, width: 5, height: 5 },
  { x: 160, y: 1710, width: 50, height: 5 },
  { x: 30, y: 1730, width: 150, height: 5, ice: true, convey: -12.0 },
  { x: -70, y: 1730, width: 50, height: 5, noIce: true },
  { x: 30, y: 1750, width: 150, height: 5, ice: true, convey: +16.0 },
  { x: 320, y: 1765, width: 50, height: 5 },
  { x: 350, y: 1765, width: 20, height: 40 },
  { x: 300, y: 1800, width: 20, height: 5, bounce: true },
  { x: 330, y: 1910, width: 20, height: 5, bounce: true },
  { x: 280, y: 2020, width: 20, height: 5, bounce: true },
  { x: 230, y: 2130, width: 20, height: 5, bounce: true },
  { x: 260, y: 2240, width: 20, height: 5, bounce: true },
  { x: 200, y: 2350, width: 20, height: 5, bounce: true },
  { x: 150, y: 2460, width: 20, height: 5, bounce: true },
  { x: 100, y: 2570, width: 60, height: 5 },
  { x: 25, y: 2575, width: 40, height: 5 },
  { x: 0, y: 2590, width: 20, height: 5, oneway: true },
  { x: 0, y: 2610, width: 20, height: 5, oneway: true },
  { x: 0, y: 2630, width: 20, height: 5 },
  { x: 0, y: 2650, width: 40, height: 5, oneway: true },
  { x: 100, y: 2650, width: 200, height: 5, oneway: true },
  { x: 100, y: 2700, width: 200, height: 5, oneway: true },
  { x: 100, y: 2750, width: 200, height: 5 },
  { x: 200, y: 2725, width: 5, height: 50 },
  { x: 70, y: 2655, width: 40, height: 5, bounce: true },
  { x: 125, y: 2655, width: 40, height: 5, bounce: true },
  { x: 230, y: 2660, width: 10, height: 5, bounce: true },
  { x: 170, y: 2820, width: 10, height: 5, bounce: true },
  { x: 190, y: 2940, width: 10, height: 5, bounce: true },
  { x: 150, y: 3060, width: 10, height: 5, bounce: true },
  { x: 170, y: 3180, width: 10, height: 5, bounce: true },
  { x: 210, y: 3300, width: 10, height: 5, bounce: true },
  { x: 170, y: 3420, width: 10, height: 5, bounce: true },
  { x: 130, y: 3540, width: 10, height: 5, bounce: true },
  { x: 150, y: 3660, width: 10, height: 5, bounce: true },
  { x: 190, y: 3780, width: 10, height: 5, bounce: true },
  { x: 170, y: 3900, width: 10, height: 5, bounce: true },
  { x: 150, y: 4020, width: 10, height: 5, bounce: true },
  { x: 110, y: 4140, width: 20, height: 5 },
  { x: 70, y: 4175, width: 5, height: 25, walljump: true },
  { x: 110, y: 4180, width: 20, height: 5 },
  { x: 160, y: 4250, width: 5, height: 130, walljump: true },
  { x: 110, y: 4320, width: 20, height: 5 },
  { x: 200, y: 4200, width: 30, height: 5 },
  { x: 275, y: 4220, width: 200, height: 5 },
  { x: 275, y: 4225, width: 200, height: 5, spike: true },
  { x: 250, y: 4160, width: 5, height: 5 },
  { x: 300, y: 4175, width: 5, height: 45, walljump: true },
  { x: 360, y: 4175, width: 25, height: 5 },
  { x: 410, y: 4195, width: 5, height: 5 },
  { x: 450, y: 4215, width: 5, height: 5 },
  { x: 490, y: 4235, width: 5, height: 5 },
  { x: 460, y: 4255, width: 5, height: 5 },
  { x: 420, y: 4275, width: 5, height: 5 },
  { x: 440, y: 4295, width: 5, height: 5 },
  { x: 480, y: 4315, width: 5, height: 5 },
  { x: 520, y: 4330, width: 20, height: 5 },
  { x: 570, y: 4350, width: 40, height: 5 },
  { x: 570, y: 4375, width: 40, height: 5 },
  { x: 560, y: 4380, width: 20, height: 5, spike: true },
  { x: 590, y: 4400, width: 80, height: 5 },
  { x: 590, y: 4425, width: 5, height: 5 },
  { x: 590, y: 4430, width: 5, height: 5, spike: true },
  { x: 620, y: 4440, width: 5, height: 5 },
  { x: 620, y: 4445, width: 5, height: 5, spike: true },
  { x: 575, y: 4450, width: 5, height: 5 },
  { x: 575, y: 4455, width: 5, height: 5, spike: true },
  { x: 610, y: 4475, width: 5, height: 5 },
  { x: 610, y: 4480, width: 5, height: 5, spike: true },
  { x: 630, y: 4495, width: 5, height: 5 },
  { x: 635, y: 4505, width: 5, height: 5 },
  { x: 640, y: 4515, width: 5, height: 5 },
  { x: 605, y: 4530, width: 5, height: 5 },
  { x: 605, y: 4535, width: 5, height: 5, spike: true },
  { x: 605, y: 4555, width: 5, height: 5 },
  { x: 605, y: 4560, width: 5, height: 5, spike: true },
  { x: 600, y: 4580, width: 15, height: 5 },
  { x: 605, y: 4585, width: 5, height: 5, spike: true },
  { x: 605, y: 4605, width: 5, height: 5 },
  { x: 605, y: 4610, width: 5, height: 5, spike: true },
  { x: 605, y: 4620, width: 5, height: 5 },
  { x: 605, y: 4625, width: 5, height: 5, spike: true },
  { x: 625, y: 4645, width: 20, height: 5 }
];
let platforms = basePlatforms;
const maxPlatformHeight = () => Math.max(...platforms.map((plat) => plat.y));

const baseCheckpoints = [
  { x: 0, y: 12.5, unlocked: false, visualOnly: true, name: "The Beginnings" },
  { x: 10, y: 532.5, unlocked: false, name: "Overshoot Land" },
  { x: 240, y: 792.5, unlocked: false, name: "Conveying A New Idea" },
  { x: 355, y: 1032.5, unlocked: false, name: "Ascension" },
  { x: 410, y: 1452.5, unlocked: false, name: "80 Seconds of Ice Platforming" },
  { x: 160, y: 1722.5, unlocked: false, name: "Speeeeeeeeeeeed" },
  { x: 100, y: 2582.5, unlocked: false, name: "The Cheese Jump" },
  { x: 30, y: 2762.5, unlocked: false, name: "That One Memory Part" },
  { x: 110, y: 4152.5, unlocked: false, name: "Reflects" },
  { x: 520, y: 4342.5, unlocked: false, name: "Leap Year" },
  { x: 625, y: 4657.5, unlocked: false, name: "???" },
];
let checkpoints = baseCheckpoints;
const checkpointSize = 4;

const queryAddress =
  location.hostname === "localhost" ? 
    "://localhost:1999" :
    "s://partykit.fibonnaci314.partykit.dev";
const queryLocation = "http" + queryAddress + "/parties/testplatform/my-new-room/?";
const rankInfo = {
  header: "???",
  displayTime: Infinity,
  rankString: "?",
  rankPercentage: "100.0%",
  realTime: 0
};

const keys = {};
const mouse = {};
addEventListener("keydown", (ev) => keys[ev.key] = true);
addEventListener("keyup", (ev) => keys[ev.key] = false);
addEventListener("mousemove", (ev) => { mouse.x = ev.clientX * devicePixelRatio; mouse.y = ev.clientY * devicePixelRatio; });

let gravity = -0.1;

let particles = [];

let staticTicks = 0;

let socket = null;
let socketID = Math.random().toString(16).slice(2, 18).padStart(16, "0");
let otherPlayers = {};

let warpMode = false;
let editmode = false;

let timer = 0;

function project() {}
project.coord = function(coordinate) {
  const deltaX = coordinate.x - camera.x;
  const deltaY = coordinate.y - camera.y;
  return {
    x: canvas.width / 2 + canvas.width * (deltaX / camera.width),
    y: canvas.height / 2 - canvas.width * (deltaY / camera.width)
  };
}
project.dist = function(distance) {
  return distance * canvas.width / camera.width;
}

function onKey(key, opts) {
  if (key === "q") {
    warpMode = !warpMode;
  }
  if ((key === "F4" || key === "z") && !(platforms === basePlatforms && checkpoints === baseCheckpoints)) {
    editmode = !editmode;
  }
  if (key === "p" && editmode) {
    const x = parseFloat(prompt("Enter the X coordinate of the center of the platform (visible using the grid lines):"));
    if (Number.isNaN(x)) return alert("Creation aborted!");
    const y = parseFloat(prompt("Enter the Y coordinate of the center of the platform (visible using the grid lines):"));
    if (Number.isNaN(y)) return alert("Creation aborted!");
    const width = parseFloat(prompt("Enter the width of the platform:"));
    if (Number.isNaN(width) || width <= 1) return alert("Platform too small!");
    const height = parseFloat(prompt("Enter the height of the platform:"));
    if (Number.isNaN(height) || height <= 1) return alert("Platform too small!");
    platforms.push({ x, y, width, height });
  }
  if (key === "r" && editmode) {
    const id = parseInt(prompt("Enter the ID of the platform to remove (the text on top of the platform):"));
    if (!platforms[id]) return alert("That platform doesn't exist!");
    platforms.splice(id, 1);
  }
  if (key === "y" && editmode) {
    const id = parseInt(prompt("Enter the ID of the platform to modify (the text on top of the platform):"));
    if (!platforms[id]) return alert("That platform doesn't exist!");
    const type = prompt("Enter the name of the property you want to enable.\nIf the platform already has this property the property will be disabled instead of enabled.\nThe accepted values are:\n- 'bounce'\n- 'ice'\n- 'oneway'\n -'walljump'");
    platforms[id][type] = !platforms[id][type];
  }
  if (key === "v" && editmode) {
    try {
      navigator.clipboard.writeText(btoa(JSON.stringify({ platforms, checkpoints })));
      alert("Saved map to clipboard!");
    } catch(e) {
      alert("Error during save process");
    }
  }
  if (key === "m" && opts.ctrlKey) {
    opts.preventDefault();
    const code = prompt("Enter your map code here, or leave it empty to return to the main level.\nNote: You can enter the code 'e30=' to create an entirely new level without any platforms or checkpoints.\nIn a custom level, you can press F4 or Z to enter editmode, which allows you to fly around and build platforms.");
    // if (!code) return;
    if (!code.length || !code) {
      platforms = basePlatforms;
      checkpoints = baseCheckpoints;
    } else {
      try {
        const object = JSON.parse(atob(code));
        platforms = object.platforms ?? [];
        checkpoints = object.checkpoints ?? [];
      } catch(e) {
        alert("This map code is invalid.");
      }
    }
    player.x = 0;
    player.y = 25;
    player.vx = 0;
    player.vy = 0;
    player.fallDist = 0;
  }
  if (warpMode) {
    const info = JSON.parse(localStorage.getItem("platformCheckpoints") ?? "{}");
    const unlocked = info[player.modifier] ?? {};
    const currentCheckpoint = checkpoints.findLastIndex((cp) => cp.unlocked);
    let goto = currentCheckpoint;
    if (key === "ArrowUp" || key === "w") {
      goto = Math.min(Math.max(...Object.keys(unlocked).map((i) => parseInt(i))), goto + 1);
    }
    if (key === "ArrowDown" || key === "s") {
      goto = Math.max(0, goto - 1);
    }
    if (goto !== currentCheckpoint) {
      checkpoints.forEach((cp) => { cp.unlocked = false; });
      player.x = checkpoints[goto].x;
      player.y = checkpoints[goto].y;
      if (location.hostname !== "localhost") timer = -Infinity;
    }
  }
}

addEventListener("keydown", (ev) => onKey(ev.key, ev));

function getPlayerColor() {
  return playerModifiedColors[player.modifier] ?? playerColor;
}

function multiplayerSend(packet) {
  if (socket.readyState !== WebSocket.OPEN) return;
  if (platforms !== basePlatforms || checkpoints !== baseCheckpoints) return;
  socket.send("platform-packet" + socketID + JSON.stringify(packet));
}

function multiplayerPacket(event) {
  const data = event.data;
  if (!data.startsWith("platform-packet")) return;
  if (!(platforms === basePlatforms && checkpoints === baseCheckpoints)) {
    otherPlayers = {};
    return;
  }
  try {
    const ignorer = data.slice(15, 31);
    if (ignorer === socketID) return;
    const content = data.slice(31);
    const packet = JSON.parse(content);
    if (packet.particle) {
      createParticle(packet.particle, true);
    }
    if (packet.player) {
      const lastLBIndex = otherPlayers[ignorer]?.lbIndex ?? Object.keys(otherPlayers).length;
      if ("number" !== typeof packet.player.x) packet.player.x = -1e10;
      if ("number" !== typeof packet.player.y) packet.player.y = 0;
      if ("number" !== typeof packet.player.vx) packet.player.vx = 0;
      if ("number" !== typeof packet.player.vy) packet.player.vy = 0;
      if ("number" !== typeof packet.player.fallDist) packet.player.fallDist = 0;
      if ("boolean" !== typeof packet.player.ground) packet.player.ground = false;
      if ("number" !== typeof packet.player.timer) packet.player.timer = "???";
      if ("string" !== typeof packet.player.name) packet.player.name = "";
      if ("string" !== typeof packet.player.modifier) packet.player.modifier = "none";
      otherPlayers[ignorer] = packet.player;
      otherPlayers[ignorer].lbIndex = lastLBIndex;
      otherPlayers[ignorer].lastSeen = performance.now();
    }
  } catch(err) {
    console.warn("Invalid packet: " + err);
  }
}

function multiplayerConnect() {
  socket = new WebSocket("https://partykit.fibonnaci314.partykit.dev/parties/pinger/my-new-room");
  socket.addEventListener("message", multiplayerPacket);
  socket.addEventListener("close", multiplayerConnect);
}
multiplayerConnect();

function createParticle(particle, noSend) {
  if (particle.size > 15) return;
  if (!noSend) multiplayerSend({ particle });
  particles.push(particle);
}

function createWalljumpParticles() {
  for (let i = 0; i < 6; i ++) {
    const angle = Math.PI * (i + 0.5) / 6 + Math.PI / 2;
    createParticle({ 
      x: player.x - playerSize * 0.5 * player.wallJumpSign, 
      y: player.y, 
      vx: Math.cos(angle) * -0.8 * player.wallJumpSign,
      vy: Math.sin(angle) * 0.8,
      color: getPlayerColor(),
      size: 1.5
    });
  }
  createParticle({ 
    size: 1 + player.fallDist / 60,
    x: player.x, y: player.y - playerSize / 2, 
    color: getPlayerColor(),
    vx: Math.random() * 0.3 * player.wallJumpSign, vy: Math.random() * 0.3 + 0.85 + player.fallDist / 400,
    text: (Math.round(player.fallDist / 5) * 5).toLocaleString(), 
    angle: Math.random() - 0.5, 
    gravity: true 
  });
}

function playerInputs() {
  if (warpMode) return;
  if (keys.d || keys.ArrowRight) {
    player.vx += player.ice ? playerAccelerationIce : playerAcceleration;
  }
  if (keys.a || keys.ArrowLeft) {
    player.vx -= player.ice ? playerAccelerationIce : playerAcceleration;
  }
  if ((keys.w || keys.ArrowUp) && (player.ground > 0)) {
    player.vy += playerJumpAcceleration;
    player.ground = 0;
    if (player.wallJumpSign) {
      player.vy = playerJumpAcceleration;
      player.vx += playerJumpAcceleration * player.wallJumpSign;
      createWalljumpParticles();
    }
  }
  if (keys.t && location.hostname === "localhost") {
    player.vy = 5.5;
    camera.y = player.y;
  }
  if (keys.x) {
    if (location.hostname === "localhost") checkpoints.forEach((cp) => cp.unlocked = true);
  }
}

function resetPlayer(checkpoint) {
  for (let i = 0; i < 12; i ++) {
    const angle = Math.PI * 2 * (i + 0.5) / 12;
    createParticle({ 
      x: player.x, 
      y: player.y, 
      vx: Math.cos(angle) * 0.55,
      vy: Math.sin(angle) * 0.55,
      color: getPlayerColor(),
      size: 1.5
    });
    createParticle({ 
      x: checkpoint.x, 
      y: checkpoint.y, 
      vx: Math.cos(angle) * 0.6,
      vy: Math.sin(angle) * 0.6,
      color: "#00ff00",
      size: 1.8
    });
  }
  player.x = checkpoint.x;
  player.y = checkpoint.y;
  player.vx = 0;
  player.vy = 0;
  player.fallDist = 0;
}

function playerPhysics() {
  if (editmode) return;
  if (!player.conveyor && !player.ice) player.vx *= playerFrictionX;
  if (player.ice) player.vx *= playerFrictionXIce;
  player.vy *= playerFrictionY;
  player.conveyor = false;
  if (player.ground > 0) player.ice = false;
  
  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  if (player.y > -1e4) {
    camera.x *= (100 - cameraInterpolationSharpness) * 0.01;
    camera.y *= (100 - cameraInterpolationSharpness) * 0.01;
    camera.x += 0.01 * cameraInterpolationSharpness * player.x;
    camera.y += 0.01 * cameraInterpolationSharpness * player.y;
    camera.y = Math.max(playerDeathThreshold, camera.y);
  }
  camera.goalWidth += (cameraRestWidth + (player.vx ** 2 + player.vy ** 2) * cameraMovementWidth) * 0.01;
  camera.goalWidth *= 0.99;
  if (camera.goalWidth > cameraDampWidth) {
    camera.goalWidth = cameraDampWidth + Math.sqrt(camera.goalWidth - cameraDampWidth);
  }
  camera.width += camera.goalWidth * 0.02;
  camera.width *= 0.98;

  if (Math.abs(player.vx) > 0.4 && player.ground > 0 && staticTicks % 5 === 0) {
    createParticle({ size: 1.5, x: player.x, y: player.y - playerSize / 2, color: getPlayerColor() });
  }

  if (player.y < playerDeathThreshold - camera.width) {
    player.x = 0;
    player.y = 25;
    player.vx = 0;
    player.vy = 0;
    player.fallDist = 0;
    timer = 0;
  }
  checkpoints.forEach((checkpoint) => {
    if (player.y < checkpoint.y - 25 && checkpoint.unlocked && !checkpoint.visualOnly) {
      resetPlayer(checkpoint);
    }
  });

  player.timer = timer;
}

function platformCollide(platform) {
  if (editmode) return;
  if (platform.hide) return;
  if ((platform.oneway || (player.modifier === "ice" && platform.width >= 15 && !platform.noIce)) && player.vy > 0) return;
  const width = platform.width - (platform.spike ? 0.05 : 0);
  const deltaX = player.x - platform.x;
  const deltaY = player.y - platform.y;
  if (Math.abs(deltaX) > (width + playerSize) / 2) return;
  if (Math.abs(deltaY) > (platform.height + playerSize) / 2) return;
  const bumpX = (width + playerSize) / 2 - Math.abs(deltaX);
  const bumpY = (platform.height + playerSize) / 2 - Math.abs(deltaY);
  if (platform.convey) {
    player.vx *= 0.8;
    player.vx += platform.convey * 0.1;
    player.conveyor = true;
  }
  if (platform.spike) {
    if (player.fallDist > 8) resetPlayer(checkpoints.findLast((cp) => cp.unlocked));
    return;
  }
  if (platform.onTouch) {
    platform.onTouch();
  }
  if (platform.ice || (player.modifier === "ice" && platform.width >= 15 && !platform.noIce)) player.ice = true;
  if (platform.bounce && deltaY > 0 && bumpY < bumpX) {
    player.vy = playerPlatformBounceAcceleration;
  }
  if (platform.walljump && bumpX < bumpY) {
    player.ground = 1;
    player.wallJumpSign = Math.sign(deltaX);
    player.wallJumpTick = staticTicks + 2;
  }
  if (bumpY < bumpX) {
    player.y += Math.sign(deltaY) * bumpY;
    if (deltaY > 0 && player.vy < 0 || deltaY < 0 && player.vy > 0) player.vy = 0;
    if (deltaY > 0) player.ground = 4;
  } else {
    player.x += Math.sign(deltaX) * bumpX;
    if (deltaX > 0 && player.vx < 0 || deltaX < 0 && player.vx > 0) player.vx = 0;
  }
}

function getRank(percentage) {
  return percentage <= 5 ? "X" :
    percentage <= 10 ? "SS" :
    percentage <= 25 ? "S" :
    percentage <= 50 ? "A" :
    percentage <= 75 ? "B" : "C";
}
function getRankColor(percentage) {
  return percentage <= 5 ? "#a31fd3" :
    percentage <= 10 ? "#881c14" :
    percentage <= 25 ? "#d35241" :
    percentage <= 50 ? "#289b20" :
    percentage <= 75 ? "#0792c0" : "#2a0e9c";
}

async function initSegmentQuery() {
  if (player.modifier !== "none") return;
  const response = await fetch(
    queryLocation +
    "read=only"
  );
  const json = await response.json();
  if (!response.ok || !json.ok) {
    console.error("Non-OK seg query");
  }

  const cindex = checkpoints.findLastIndex((cp) => cp.unlocked);
  const fixedTime = checkpoints[cindex].unlockTime - checkpoints[cindex - 1].unlockTime;

  if (cindex === checkpoints.length - 1) return;

  json.existing.forEach((data) => {
    data.time = (data.segments[cindex] - data.segments[cindex - 1]) || 1e6;
  });
  json.existing.push({ time: fixedTime });
  const sorted = json.existing.toSorted((a, b) => a.time - b.time);
  const index = sorted.findIndex(({ time }) => time === fixedTime);
  
  const percentage = 100 * (index + 0.5) / sorted.length;
  rankInfo.header = "Segment " + cindex;
  rankInfo.rank = index + 1;
  rankInfo.total = sorted.length;
  rankInfo.rankPercentage = percentage.toFixed(0) + "%";
  rankInfo.realTime = fixedTime;
  rankInfo.rankString = getRank(percentage);
  rankInfo.rankColor = getRankColor(percentage);
  rankInfo.displayTime = Date.now();
}
async function initRankQuery() {
  if (player.modifier !== "none") return;
  const fixedTime = timer;
  const response = await fetch(
    queryLocation +
    "name=" + player.name + 
    "&time=" + fixedTime + 
    "&segments=" + checkpoints.map((checkpoint) => checkpoint.unlockTime).join(",")
  );
  const json = await response.json();
  if (!response.ok || !json.ok) {
    console.error("Non-OK rank query");
  }
  const sorted = json.existing.toSorted((a, b) => a.time - b.time);
  const index = sorted.findIndex(({ time }) => time === fixedTime);
  
  const percentage = 100 * (index + 0.5) / sorted.length;
  rankInfo.header = "Full Game Run";
  rankInfo.rank = index + 1;
  rankInfo.total = sorted.length;
  rankInfo.rankPercentage = percentage.toFixed(0) + "%";
  rankInfo.realTime = fixedTime;
  rankInfo.rankString = getRank(percentage);
  rankInfo.rankColor = getRankColor(percentage);
  rankInfo.displayTime = Date.now();
}

function checkpointCollide(checkpoint, index) {
  if (editmode) return;
  const distance = Math.sqrt((player.x - checkpoint.x) ** 2 + (player.y - checkpoint.y) ** 2);
  if (distance > checkpointSize + playerSize) return;
  if (checkpoint.unlocked) return;
  for (let i = 0; i <= index; i ++) {
    if (!checkpoints[i].unlockTime) {
      checkpoints[i].unlockTime = timer;
      checkpoints[i].unlocked = true;
      if (i > 0) {
        const delta = checkpoints[i].unlockTime - checkpoints[i - 1].unlockTime;
        if (delta > 0.1) {
          const obj = JSON.parse(localStorage.getItem("platformSpeedrunDeltas") ?? "{}");
          obj[i] ??= [];
          obj[i].unshift(delta);
          obj[i].splice(10, 1);
          localStorage.setItem("platformSpeedrunDeltas", JSON.stringify(obj));
        }
      }
    }
  }
  checkpoint.unlockTime = timer;
  checkpoint.unlocked = true;
  if (index > 0) {
    if (timer > 0) {
      initSegmentQuery();
    }
  }
  if (checkpoints.at(-1).unlocked) {
    console.log("All unlocked!");
    if (timer > 0) {
      initRankQuery();
    }
  }
  for (let j = 0; j < 3; j ++) {
    setTimeout(() => {
      for (let i = 0; i < (8 + 8 * j); i ++) {
        const angle = Math.PI * 2 * (i + 0.5) / (8 + 8 * j);
        createParticle({ 
          x: checkpoint.x, 
          y: checkpoint.y, 
          vx: Math.cos(angle) * (0.5 + 0.3 * j),
          vy: Math.sin(angle) * (0.5 + 0.3 * j),
          color: "#00ff00",
          size: 2.2
        });
      }
    }, 400 * j);
  }
  const data = JSON.parse(localStorage.getItem("platformCheckpoints") ?? "{}");
  data[player.modifier] ??= {};
  data[player.modifier][index] = true;
  localStorage.setItem("platformCheckpoints", JSON.stringify(data));
}

function handleGroundHit() {
  if (player.fallDist > playerBounceThreshold) {
    player.vy = Math.sqrt(player.fallDist) * 0.45;
    player.ground = 0;
    for (let i = 0; i < 10; i ++) {
      const angle = Math.PI * (i + 0.5) / 5;
      createParticle({ 
        x: player.x, 
        y: player.y - playerSize / 2, 
        vx: Math.cos(angle) * 0.8,
        vy: Math.sin(angle) * 0.8,
        color: playerBounceColor,
        size: 2
      });
    }
  } else if (player.fallDist > 5) {
    const particleCount = player.fallDist > 20 ? 10 : player.fallDist > 12 ? 8 : 6;
    const particleVel = player.fallDist > 20 ? 0.4 : player.fallDist > 12 ? 0.3 : 0.25;
    const particleSize = player.fallDist > 20 ? 1.4 : player.fallDist > 12 ? 1 : 0.75;
    for (let i = 0; i < particleCount; i ++) {
      const angle = Math.PI * 2 * (i + 0.5) / particleCount;
      createParticle({ 
        x: player.x, 
        y: player.y - playerSize / 2, 
        vx: Math.cos(angle) * particleVel,
        vy: Math.sin(angle) * particleVel,
        color: getPlayerColor(),
        size: particleSize
      });
    }
  }
  if (player.fallDist > 0.1) createParticle({ 
    size: 1 + player.fallDist / 60, 
    x: player.x, y: player.y - playerSize / 2, 
    color: getPlayerColor(),
    vx: Math.random() * 0.4 - 0.2, vy: Math.random() * 0.3 + 0.85 + player.fallDist / 400,
    text: (Math.round(player.fallDist / 5) * 5).toLocaleString(), 
    angle: Math.random() - 0.5, 
    gravity: true 
  });
}

function playerCollisions() {
  player.ground --;
  player.wallJumpSign = 0;
  platforms.forEach(platformCollide);
  checkpoints.forEach(checkpointCollide);

  if (player.vy < 0) {
    player.fallDist -= player.vy;
  } else {
    if (staticTicks > player.wallJumpTick) handleGroundHit();
    player.fallDist = 0;
  }
}

function editmodeTick() {
  player.vx = 0;
  player.vy = 0;
  player.fallDist = 0;
  if (keys.w || keys.ArrowUp) player.y += (keys.Shift ? 15 : 2);
  if (keys.s || keys.ArrowDown) player.y -= (keys.Shift ? 15 : 2);
  if (keys.a || keys.ArrowLeft) player.x -= (keys.Shift ? 15 : 2);
  if (keys.d || keys.ArrowRight) player.x += (keys.Shift ? 15 : 2);
  camera.x = player.x;
  camera.y = player.y;
  camera.width = 400;
}

function particleTicks() {
  particles.forEach((particle) => {
    particle.size -= 0.015;
    if (particle.gravity) {
      particle.vy += -0.03;
    } else {
      particle.vy *= 0.925;
      particle.vx *= 0.925;
    }
    particle.x += particle.vx || 0;
    particle.y += particle.vy || 0;
  });
  particles = particles.filter((p) => p.size > 0);
}

function staticTick() {
  timer += 1 / 50;
  staticTicks ++;
  if (!editmode) {
    playerInputs();
    playerPhysics();
    playerCollisions();
  } else editmodeTick();
  particleTicks();
}

function updateCanvas() {
  const ratio = window.devicePixelRatio ?? 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  ctx.fillStyle = player.modifier === "ice" ? "#f2ffff" : "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearOldPlayers() {
  for (let key in otherPlayers) {
    if (performance.now() - otherPlayers[key].lastSeen > 10000) {
      delete otherPlayers[key];
    }
  }
}

function renderDarknessRay(x1, y1, x2, y2) {
  const playerLoc = project.coord(player);
  const dx1 = x1 - playerLoc.x;
  const dy1 = y1 - playerLoc.y;
  const dx2 = x2 - playerLoc.x;
  const dy2 = y2 - playerLoc.y;
  ctx.fillStyle = "#00000010";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(playerLoc.x + dx2 * 1000, playerLoc.y + dy2 * 1000);
  ctx.lineTo(playerLoc.x + dx1 * 1000, playerLoc.y + dy1 * 1000);
  ctx.lineTo(x1, y1);
  ctx.fill();
}

function renderPlatform(platform, index) {
  const projectedPosition = project.coord(platform);
  const projectedSize = {
    x: project.dist(platform.width),
    y: project.dist(platform.height)
  };
  const extension = project.dist(10 * platform.width);

  ctx.fillStyle = "#000000";
  if (platform.ice || (player.modifier === "ice" && platform.width >= 15 && !platform.noIce)) ctx.fillStyle = "#004040";
  if (platform.bounce) ctx.fillStyle = "#400000";
  if (platform.oneway) ctx.fillStyle = "#808080";
  if (platform.walljump) ctx.fillStyle = "#3e492c";
  if (platform.spike || platform.hide) ctx.fillStyle = "#00000000";
  ctx.fillRect(
    projectedPosition.x - projectedSize.x / 2,
    projectedPosition.y - projectedSize.y / 2,
    projectedSize.x, projectedSize.y
  );

  if (platform.text) {
    if (platform.hide) ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = project.dist(2) + "px sans-serif";
    ctx.fillText(
      platform.text,
      projectedPosition.x,
      projectedPosition.y - projectedSize.y / 2 - 3
    );
  }
  if (editmode) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = project.dist(4) + "px sans-serif";
    ctx.strokeText(
      index,
      projectedPosition.x,
      projectedPosition.y
    );
    ctx.fillText(
      index,
      projectedPosition.x,
      projectedPosition.y
    );
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    projectedPosition.x - projectedSize.x / 2,
    projectedPosition.y - projectedSize.y / 2,
    projectedSize.x, projectedSize.y
  );
  ctx.clip();

  ctx.fillStyle = "#4c4c4c";
  if (platform.convey) {
    const offset = (platform.convey * Date.now() / 40) % 10;
    for (let x = -10; x < platform.width + 10; x += 10) {
      const localX = project.coord({ x: x + platform.x - platform.width / 2 + offset, y: 0 }).x;
      const localW = project.dist(5);
      ctx.fillRect(localX, 0, localW, canvas.height);
    }
  }
  ctx.fillStyle = "#a42f27";
  if (platform.spike) {
    for (let x = 0; x < platform.width; x += 5) {
      const localX = project.coord({ x: x + platform.x - platform.width / 2, y: 0 }).x;
      const localW = project.dist(5);
      ctx.beginPath();
      ctx.moveTo(localX, projectedPosition.y + projectedSize.y / 2);
      ctx.lineTo(localX + localW, projectedPosition.y + projectedSize.y / 2);
      ctx.lineTo(localX + localW / 2, projectedPosition.y - projectedSize.y / 2);
      ctx.fill();
    }
  }

  ctx.restore();

  ctx.fillStyle = "#00000005";
  ctx.beginPath();
  ctx.moveTo(projectedPosition.x - projectedSize.x / 2, projectedPosition.y);
  ctx.lineTo(projectedPosition.x, projectedPosition.y + extension);
  ctx.lineTo(projectedPosition.x + projectedSize.x / 2, projectedPosition.y);
  ctx.lineTo(projectedPosition.x, projectedPosition.y - extension);
  ctx.lineTo(projectedPosition.x - projectedSize.x / 2, projectedPosition.y);
  ctx.fill();
}

function renderPlatformDarkness(platform) {
  if (player.modifier !== "dark") return;

  const projectedPosition = project.coord(platform);
  const projectedSize = {
    x: project.dist(platform.width),
    y: project.dist(platform.height)
  };

  renderDarknessRay(projectedPosition.x - projectedSize.x / 2, projectedPosition.y - projectedSize.y / 2, projectedPosition.x + projectedSize.x / 2, projectedPosition.y - projectedSize.y / 2);
  renderDarknessRay(projectedPosition.x - projectedSize.x / 2, projectedPosition.y - projectedSize.y / 2, projectedPosition.x - projectedSize.x / 2, projectedPosition.y + projectedSize.y / 2);
  renderDarknessRay(projectedPosition.x + projectedSize.x / 2, projectedPosition.y - projectedSize.y / 2, projectedPosition.x + projectedSize.x / 2, projectedPosition.y + projectedSize.y / 2);
  renderDarknessRay(projectedPosition.x - projectedSize.x / 2, projectedPosition.y + projectedSize.y / 2, projectedPosition.x + projectedSize.x / 2, projectedPosition.y + projectedSize.y / 2);
}

function renderCheckpoint(checkpoint) {
  const position = project.coord(checkpoint);
  const size = project.dist(checkpointSize);
  ctx.fillStyle = checkpoint.unlocked ? "#00ff0080" : "#00ff0030";
  ctx.beginPath();
  ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
  ctx.fill();
}

function renderParticle(particle) {
  const projectedPosition = project.coord(particle);
  const projectedSize = project.dist(particle.size) / 2;

  if (particle.text) {
    ctx.fillStyle = particle.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = (projectedSize * 5) + "px sans-serif";
    ctx.translate(projectedPosition.x, projectedPosition.y);
    ctx.rotate(particle.angle);
    ctx.fillText(particle.text, 0, 0);
    ctx.resetTransform();
  } else {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.moveTo(projectedPosition.x - projectedSize, projectedPosition.y);
    ctx.lineTo(projectedPosition.x, projectedPosition.y - projectedSize);
    ctx.lineTo(projectedPosition.x + projectedSize, projectedPosition.y);
    ctx.lineTo(projectedPosition.x, projectedPosition.y + projectedSize);
    ctx.lineTo(projectedPosition.x - projectedSize, projectedPosition.y);
    ctx.fill();
  }
}

function uri(name) {
  try {
    return decodeURIComponent(name);
  } catch(e) {
    return name;
  }
}

function renderPlayer(player) {
  const playerCenter = project.coord(player);
  const playerProjectedSize = project.dist(playerSize);
  const playerSkew = project.dist(player.vx * 1.5);
  
  ctx.fillStyle = playerModifiedColors[player.modifier] ?? playerColor;
  if (player.fallDist > playerBounceThreshold) ctx.fillStyle = playerBounceColor;
  ctx.beginPath();
  ctx.moveTo(playerCenter.x - playerProjectedSize / 2 + playerSkew, playerCenter.y - playerProjectedSize / 2);
  ctx.lineTo(playerCenter.x + playerProjectedSize / 2 + playerSkew, playerCenter.y - playerProjectedSize / 2);
  ctx.lineTo(playerCenter.x + playerProjectedSize / 2, playerCenter.y + playerProjectedSize / 2);
  ctx.lineTo(playerCenter.x - playerProjectedSize / 2, playerCenter.y + playerProjectedSize / 2);
  ctx.lineTo(playerCenter.x - playerProjectedSize / 2 + playerSkew, playerCenter.y - playerProjectedSize / 2);
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "20px sans-serif";
  ctx.fillText(uri(player.name).slice(0, 64), playerCenter.x + playerSkew, playerCenter.y - playerProjectedSize * 0.7 - 20);
  ctx.font = "15px sans-serif";
  if (performance.now() - player.lastSeen < 3000 || !player.lastSeen) {
    ctx.fillText(player.timer === -Infinity ? "(warped)" : (player.timer?.toFixed?.(2) ?? player.timer), playerCenter.x + playerSkew, playerCenter.y - playerProjectedSize * 0.7);
  } else {
    ctx.fillText("Disconnected (" + ((performance.now() - player.lastSeen) / 1000).toFixed(2) + " s)", playerCenter.x + playerSkew, playerCenter.y - playerProjectedSize * 0.7);
  }
}

function renderRankInfo() {
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const timeSinceUnlock = Date.now() - rankInfo.displayTime;

  if (timeSinceUnlock > 9000) return;

  ctx.fillStyle = rankInfo.rankColor;
  if (timeSinceUnlock > 3500) ctx.fillText(rankInfo.rankString, canvas.width / 5, canvas.height / 2);

  ctx.fillStyle = "#ff0000";
  ctx.font = "18px sans-serif";
  if (timeSinceUnlock > 100) ctx.fillText("Results for " + rankInfo.header, canvas.width / 5, canvas.height / 2 - 50);
  if (timeSinceUnlock > 1000) ctx.fillText("Your current rank is...", canvas.width / 5, canvas.height / 2 - 30);
  if (timeSinceUnlock > 4500) ctx.fillText("Top " + rankInfo.rankPercentage + " / #" + rankInfo.rank + " of " + rankInfo.total, canvas.width / 5, canvas.height / 2 + 30);
  if (timeSinceUnlock > 4500) ctx.fillText("Your time: " + rankInfo.realTime.toFixed(2) + " seconds", canvas.width / 5, canvas.height / 2 + 50);
}

function renderUI() {
  if (editmode) {
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let y = Math.round((camera.y - camera.width) / 10) * 10; y < camera.y + camera.width; y += 10) {
      ctx.fillStyle = "#0000001a";
      const pos = project.coord({ x: 0, y }).y;
      ctx.fillRect(0, pos - 1, canvas.width, 2);
      ctx.fillStyle = "#00000050";
      for (let x = Math.round((camera.x - camera.width - 5) / 100) * 100 + 5; x < camera.x + camera.width; x += 100) {
        const pos = project.coord({ x, y });
        ctx.fillText("y = " + y, pos.x, pos.y);
      }
    }
    ctx.fillStyle = "#0000001a";
    for (let x = Math.round((camera.x - camera.width) / 10) * 10; x < camera.x + camera.width; x += 10) {
      const pos = project.coord({ y: 0, x }).x;
      ctx.fillRect(pos - 1, 0, 2, canvas.height);
    }
    ctx.fillStyle = "#00000050";
    for (let x = Math.round((camera.x - camera.width) / 10) * 10; x < camera.x + camera.width; x += 10) {
      for (let y = Math.round((camera.y - camera.width - 5) / 100) * 100 + 5; y < camera.y + camera.width; y += 100) {
        const pos = project.coord({ x, y });
        ctx.translate(pos.x, pos.y);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("x = " + x, 0, 0);
        ctx.resetTransform();
      }
    }
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#ff0000";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Press Y to modify a platform", 3, canvas.height - 83);
    ctx.fillText("Press P to make a platform", 3, canvas.height - 63);
    ctx.fillText("Press R to remove a platform", 3, canvas.height - 43);
    ctx.fillText("Press V to save this map", 3, canvas.height - 23);
    ctx.fillText("Use WASD/Arrows to move around", 3, canvas.height - 3);
  }
  if (player.modifier === "dark" && platforms === basePlatforms && checkpoints === baseCheckpoints) {
    const canvas2 = document.createElement("canvas");
    const ctx2 = canvas2.getContext("2d");
    canvas2.width = canvas.width;
    canvas2.height = canvas.height;
    const playerLoc = project.coord(player);
    const angle = Math.atan2(mouse.y - playerLoc.y, mouse.x - playerLoc.x) || 0;
    ctx2.fillStyle = "#000000";
    ctx2.globalAlpha = 1;
    ctx2.beginPath();
    ctx2.arc(playerLoc.x, playerLoc.y, canvas.width, angle - 0.1, angle + 0.1);
    ctx2.lineTo(playerLoc.x, playerLoc.y);
    ctx2.fill();
    ctx2.beginPath();
    ctx2.arc(playerLoc.x, playerLoc.y, canvas.width * 0.35, angle - 0.2, angle + 0.2);
    ctx2.lineTo(playerLoc.x, playerLoc.y);
    ctx2.fill();
    ctx2.beginPath();
    ctx2.arc(playerLoc.x, playerLoc.y, canvas.width * 0.225, angle - 0.5, angle + 0.5);
    ctx2.lineTo(playerLoc.x, playerLoc.y);
    ctx2.fill();
    [player, ...Object.values(otherPlayers)].forEach((oplayer) => {
      const offset = oplayer === player ? 0 : 0.03;
      const playerLoc = project.coord(oplayer);
      ctx2.beginPath();
      ctx2.arc(playerLoc.x, playerLoc.y, canvas.width * (0.025 * Math.cos(performance.now() / 1500) + 0.09 - offset), 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalAlpha = oplayer === player ? 0.4 : 0.3;
      ctx2.beginPath();
      ctx2.arc(playerLoc.x, playerLoc.y, canvas.width * (0.025 * Math.cos(performance.now() / 1500) + 0.12 - offset), 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalAlpha = oplayer === player ? 0.15 : 0.1;
      ctx2.beginPath();
      ctx2.arc(playerLoc.x, playerLoc.y, canvas.width * (0.025 * Math.cos(performance.now() / 1500) + 0.15 - offset), 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalAlpha = oplayer === player ? 1 : 0.5;
    });
    ctx2.globalAlpha = 1;
    ctx2.globalCompositeOperation = "source-out";
    ctx2.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas2, 0, 0);
  }
  const scaledAngle = (camera.width - cameraRestWidth + 50) / (cameraDampWidth - cameraRestWidth + 50);
  ctx.fillStyle = "#ff0000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "18px sans-serif";
  ctx.beginPath();
  ctx.arc(50, 50, 40, Math.PI * 0.75, Math.PI * (0.75 + 2 * scaledAngle));
  ctx.lineTo(50, 50);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 20; i ++) {
    const angle = Math.PI * i / 10;
    ctx.beginPath();
    ctx.arc(50, 50, 41, angle, angle + Math.PI / 30);
    ctx.lineTo(50, 50);
    ctx.fill();
  }
  ctx.fillStyle = "#ff0000";
  ctx.fillText(Math.round(camera.width * 2 - 250), 50, 50);
  ctx.fillRect(canvas.width - 12, 4, 8, 125);
  const allPlayers = [player, ...Object.values(otherPlayers)];
  allPlayers.toReversed().forEach((player, i) => {
    ctx.fillStyle = i === Object.keys(otherPlayers).length ? "#ff0000" : "#ff000040";
    const height = Math.max(0, Math.min(1, player.y / maxPlatformHeight()));
    ctx.fillRect(canvas.width - 20, 125 - 121 * height, 12, 4);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(player.name + " - " + Math.round(player.y / 15) + " m", canvas.width - 24, 127 - 121 * height);
  });
  ctx.textAlign = "center";
  ctx.fillText(timer.toFixed(2), canvas.width / 2, 12);
  if (!(platforms === basePlatforms && checkpoints === baseCheckpoints)) return;
  allPlayers.sort((a, b) => b.y - a.y);
  ctx.textAlign = "left";
  ctx.fillText(allPlayers.length + " users online", 3, 100);
  allPlayers.forEach((player, index) => {
    ctx.fillStyle = playerModifiedColors[player.modifier] ?? playerColor;
    player.lbIndex ||= 0;
    player.lbIndex *= 0.85;
    player.lbIndex += 0.15 * index;
    ctx.fillText(player.name, 3, 125 + player.lbIndex * 20, 100);
    ctx.fillText(Math.round(player.y / 15) + " m", 110, 125 + player.lbIndex * 20);
  });
  
  if ((checkpoints[1].unlockTime < 150 || checkpoints.at(-1).unlocked) && timer !== -Infinity) {
    let pace = checkpoints[0].unlockTime, paceCount = 0;
    const deltas = JSON.parse(localStorage.getItem("platformSpeedrunDeltas") ?? "{}");
    ctx.textAlign = "right";
    checkpoints.forEach((cp, index) => {
      if (cp.unlockTime) {
          ctx.fillStyle = "#ff000040";
        ctx.fillText("(Checkpoint " + (index + 1) + ")", canvas.width - 400, 150 + 20 * index);
        ctx.fillStyle = "#ff0000";
        ctx.fillText((checkpoints[index - 1]?.name ?? "-"), canvas.width - 140, 150 + 20 * index);
        const minutes = Math.floor(cp.unlockTime / 60);
        const seconds = cp.unlockTime % 60;
        const str = minutes + (seconds < 10 ? ":0" : ":") + seconds.toFixed(1);
        ctx.fillText(str, canvas.width - 3, 150 + 20 * index);
      }
      if (index > 0 && deltas[index]) {
        const delta = cp.unlockTime - checkpoints[index - 1].unlockTime;
        const bestDelta = deltas[index].reduce((a, b) => a + b, 0) / deltas[index].length;
        paceCount ++;
        pace += (delta + 1e-9) || bestDelta;
        const renderedChange = delta - bestDelta;
        ctx.fillStyle = 
          renderedChange > 3 ? "#ff0000" :
          renderedChange > 0 ? "#ff8000" :
          renderedChange > -3 ? "#70aa00" :
          "#00aa00";
        if (!Number.isNaN(renderedChange)) ctx.fillText((renderedChange > 0 ? "+" : "") + renderedChange.toFixed(1), canvas.width - 80, 150 + 20 * index);
      }
    });
    ctx.fillStyle = "#ff00ff";
    const minutes = Math.floor(pace / 60);
    const seconds = pace % 60;
    const str = minutes + (seconds < 10 ? ":0" : ":") + seconds.toFixed(1);
    if (paceCount === checkpoints.length - 1) ctx.fillText("Current pace: " + str, canvas.width - 3, 150 + 20 * checkpoints.length);
  }

  if (warpMode) {
    ctx.fillStyle = "#000000b0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const info = JSON.parse(localStorage.getItem("platformCheckpoints") ?? "{}");
    const unlocked = info[player.modifier] ?? {};
    const currentCheckpoint = checkpoints.findLastIndex((cp) => cp.unlocked);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Warp Mode", canvas.width / 2, canvas.height * 0.3);
    ctx.fillText("Arrow Keys or W/S to move", canvas.width / 2, canvas.height * 0.3 + 20);
    for (let key in unlocked) {
      const index = parseInt(key);
      const baseText = "Checkpoint " + (index + 1) + " - " + Math.round(checkpoints[index].y / 15) + " m";
      const text = currentCheckpoint === index ? "[[ " + baseText + " ]]" : baseText;
      ctx.fillText(text, canvas.width / 2, canvas.height * 0.7 - index * 20);
    }
  }

  renderRankInfo();
}

function frame() {
  updateCanvas();
  clearOldPlayers();
  multiplayerSend({ player });

  platforms.filter(p => !p.spike).forEach(renderPlatform);
  checkpoints.forEach(renderCheckpoint);
  particles.forEach(renderParticle);
  Object.values(otherPlayers).forEach(renderPlayer);
  renderPlayer(player);
  platforms.filter(p => p.spike).forEach(renderPlatform);
  platforms.forEach(renderPlatformDarkness);
  renderUI();

  requestAnimationFrame(frame);
}

setInterval(staticTick, 20);
requestAnimationFrame(frame);
addEventListener("hashchange", () => player.name = location.hash.slice(1));

let apiEnabled = false;
window.platform = {
  enable() { apiEnabled = true; player.modifier = "cheat"; },
  player: {
    teleport(x, y) { if (!apiEnabled) return; player.x = x; player.y = y; },
    velocity(x, y) { if (!apiEnabled) return; player.vx = x; player.vy = y; },
    gravity(grav) { if (!apiEnabled) return; gravity = grav; },
  },
  camera: {
    base(width) { if (!apiEnabled) return; cameraRestWidth = width; },
    limit(width) { if (!apiEnabled) return; cameraDampWidth = width; },
    extend(width) { if (!apiEnabled) return; cameraMovementWidth = width; },
  },
};

}();