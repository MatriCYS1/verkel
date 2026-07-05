let socket;
function connect() {
  socket = new WebSocket("https://partykit.fibonnaci314.partykit.dev/pinger-create/arras-binary");
  socket.binaryType = "arraybuffer";
  socket.addEventListener("close", connect);
  socket.addEventListener("message", incoming);
}

/**
 * HEADER CODES
 * 
 * 0000    ArcClockwise (f16 * 3, byte * 2)
 * 0001    ArcCcw (f16 * 3, byte * 2)
 * 0010    MoveTo (f16 * 2)
 * 0011    LineTo (f16 * 2)
 * 0100    FillRect (f16 * 4)
 * 0110    FillText
 * 
 * 1000    BeginPath
 * 1010    Fill
 * 1011    Stroke
 * 1100    SetFill (byte * 4)
 * 1101    SetStroke (byte * 4)
 * 1110    SetLineWidth (f16)
 * 1111    EndHeader
 */

const u16 = new Uint8Array(2);
const f16 = new Float16Array(u16.buffer);

function decode(packet) {
  packet = new Uint8Array(packet);

  let headers = [];
  let index = 0;
  while (true) {
    headers.push((packet[index] & 240) / 16, packet[index] & 15);
    index ++;
    if (headers[headers.length - 1] === 15) break;
  }

  const instructions = [];
  for (let header of headers) {
    switch (header) {
      case 0:
      case 1: {
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let x = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let y = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let rad = f16[0];
        instructions.push({ type: "arc", x, y, rad, ccw: header === 1 });
      } break;
      case 2: 
      case 3: {
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let x = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let y = f16[0];
        instructions.push({ type: header === 2 ? "moveTo" : "lineTo", x, y });
      } break;
      case 4:
      case 5: {
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let x = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let y = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let width = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let height = f16[0];
        instructions.push({ type: header === 4 ? "fillRect" : "strokeRect", x, y, width, height });
      } break;
      case 6: {
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let x = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let y = f16[0];
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let size = f16[0];
        let string = [];
        while (true) {
          if (packet[index] === 0) break;
          string.push(packet[index ++]);
        }
        index ++;
        instructions.push({ type: "text", x, y, size, text: String.fromCharCode(...string) })
      } break;
      case 8: {
        instructions.push({ type: "beginPath" });
      } break;
      case 10: {
        instructions.push({ type: "fill" });
      } break;
      case 11: {
        instructions.push({ type: "stroke" });
      } break;
      case 12: {
        instructions.push({ type: "setFill", r: packet[index ++], g: packet[index ++], b: packet[index ++], a: packet[index ++] });
      } break;
      case 13: {
        instructions.push({ type: "setStroke", r: packet[index ++], g: packet[index ++], b: packet[index ++], a: packet[index ++] });
      } break;
      case 14: {
        u16[0] = packet[index ++]; u16[1] = packet[index ++]; let width = f16[0];
        instructions.push({ type: "setWidth", width });
      } break;
    }
  }
  
  console.log(packet);

  const width = 256 * packet[index ++] + packet[index ++];
  const height = 256 * packet[index ++] + packet[index ++];

  return { instructions, width, height };
}

function display({ width, height, instructions }) {
  console.log(instructions);
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  instructions.forEach((inst) => {
    if (inst.type === "beginPath") ctx.beginPath();
    if (inst.type === "fill") ctx.fill();
    if (inst.type === "stroke") { ctx.closePath(); ctx.stroke(); }
    if (inst.type === "setFill") ctx.fillStyle = `rgba(${inst.r},${inst.g},${inst.b},${inst.a / 255})`;
    if (inst.type === "setStroke") ctx.strokeStyle = `rgba(${inst.r},${inst.g},${inst.b},${inst.a / 255})`;
    if (inst.type === "setWidth") ctx.lineWidth = inst.width;
    
    if (inst.type === "moveTo") ctx.moveTo(inst.x, inst.y);
    if (inst.type === "lineTo") ctx.lineTo(inst.x, inst.y);
    if (inst.type === "arc") ctx.arc(inst.x, inst.y, inst.rad, 0, Math.PI * 2, inst.ccw);

    if (inst.type === "fillRect") ctx.fillRect(inst.x, inst.y, inst.width, inst.height);
    if (inst.type === "strokeRect") ctx.strokeRect(inst.x, inst.y, inst.width, inst.height);
    if (inst.type === "text") {
      ctx.font = "700 " + inst.size + "px Ubuntu, sans-serif";
      const oldFill = ctx.fillStyle;
      const oldStroke = ctx.strokeStyle;
      const oldLW = ctx.lineWidth;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#484848";
      ctx.lineWidth = inst.size / 5;
      ctx.strokeText(inst.text, inst.x, inst.y);
      ctx.fillText(inst.text, inst.x, inst.y);
      ctx.fillStyle = oldFill;
      ctx.strokeStyle = oldStroke;
      ctx.lineWidth = oldLW;
    }
  });
}

function incoming(event) {
  const instructions = decode(event.data);
  display(instructions);
}

connect();