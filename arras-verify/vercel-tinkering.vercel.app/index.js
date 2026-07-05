const elements = {
  codeInput: document.querySelector("#codeInput"),
  unverifyButton: document.querySelector("#unverifyButton"),
  verifyStatus: document.querySelector("#verifyStatus"),
  verifyCode: document.querySelector("#verifyCode"),
  verified: document.querySelector("#verified"),
  verifiedCount: document.querySelector("#verifiedCount"),
  usernameInput: document.querySelector("#usernameInput"),
  usernameSection: document.querySelector("#usernameSection"),
  chatInput: document.querySelector("#chatInput"),
  chatMessages: document.querySelector("#chatMessages"),
  sendChat: document.querySelector("#sendChat"),
  uploadChat: document.querySelector("#uploadChat"),
  serverStatus: document.querySelector("#serverStatus"),
  navDatabase: document.querySelector("#navDatabase"),
  database: document.querySelector("#database"),
  newNameInput: document.querySelector("#newNameInput"),
  newRankInput: document.querySelector("#newRankInput"),
  newCodeInput: document.querySelector("#newCodeInput"),
  newCodeButton: document.querySelector("#newCodeButton"),
  suspendCodeId: document.querySelector("#suspendCodeId"),
  suspendCodeDuration: document.querySelector("#suspendCodeDuration"),
  suspendCodeButton: document.querySelector("#suspendCodeButton"),
  themeSelect: document.querySelector("#themeSelect"),
  themeCustomColor: document.querySelector("#themeCustomColor"),
  currentReply: document.querySelector("#currentReply"),
  cancelReply: document.querySelector("#cancelReply"),
  replySection: document.querySelector("#replySection"),
  muteGuestsToggle: document.querySelector("#muteGuestsToggle"),
  chatClear: document.querySelector("#chatClear"),
  jumpToggle: document.querySelector("#jumpToggle"),
  descriptionInput: document.querySelector("#descriptionInput"),
  infoPopup: document.querySelector("#infoPopup"),
  gPopup: document.querySelector("#gPopup"),
  gName: document.querySelector("#gName"),
  gDuration: document.querySelector("#gDuration"),
  moderationOverlay: document.querySelector("#moderationOverlay"),
  moderationUsers: document.querySelector("#moderationUsers"),
  moderationControls: document.querySelector("#moderationControls"),
  moderationControlsToggle: document.querySelector("#moderationControlsToggle"),
  muteTime: document.querySelector("#muteTime"),
  muteSubmit: document.querySelector("#muteSubmit"),
  bcText: document.querySelector("#bcText"),
  bcSubmit: document.querySelector("#bcSubmit"),
  muteGuestsSubmit: document.querySelector("#muteGuestsSubmit"),
  suggestionInput: document.querySelector("#suggestionInput"),
  suggestionSubmit: document.querySelector("#suggestionSubmit"),
  chatColor: document.querySelector("#chatColor"),
  chatColorLabel: document.querySelector("#chatColorLabel"),
  documentFilter: document.querySelector("#documentFilter"),
  pfpInput: document.querySelector("#pfpInput"),
  changeRankButton: document.querySelector("#changeRankButton"),
  changeRankID: document.querySelector("#changeRankID"),
  changeRankInput: document.querySelector("#changeRankInput"),
  achievementContainer: document.querySelector("#achievementContainer")
};

const rootURL = (location.hostname === "localhost" && location.hash !== "#production") ? "://localhost:1999/parties/main/my-new-room" : "s://partykit.fibonnaci314.partykit.dev/parties/main/my-new-room";

const emotes = {
  "angie": "https://files.catbox.moe/7y622k.webp",
  "button": "https://gifdb.com/images/high/ralsei-deltarune-cute-hands-excited-cant-wait-l9jky4nrslpbnh1w.webp",
  "cat": "https://media.tenor.com/xwBDjTSFmkIAAAAj/komaru-cat.gif",
  "spin": "https://partykit.fibonnaci314.partykit.dev/spin.gif",
  "police2": "https://partykit.fibonnaci314.partykit.dev/police2.gif",
  "evaporate": "https://partykit.fibonnaci314.partykit.dev/evaporate.gif",
  "fighter": "https://partykit.fibonnaci314.partykit.dev/fighter.gif",
  "gigabrain": "https://partykit.fibonnaci314.partykit.dev/gigabrain.gif",
  "spectral2": "https://partykit.fibonnaci314.partykit.dev/spectral.gif",
  "thonk": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/thinking.gif",
  "badapple": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_bad_apple.gif",
  "bird": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_bird.gif",
  "blue": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_blue_soul.png",
  "brain": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_brain.gif",
  "cesar": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_cesar.png",
  "charlie": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_charlie.gif",
  "cyan": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_cyan_soul.png",
  "dkg": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_dkg.png",
  "frisk": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_frisk.png",
  "green": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_green_soul.png",
  "guest": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_guest.png",
  "idk": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_idk.gif",
  "mlg": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_mlg.png",
  "noyno": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_noyno.png",
  "options": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_options.jpg",
  "orange": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_orange_soul.png",
  "pog": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_pog.png",
  "ralsei": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_ralsei.png",
  "red": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_red_soul.png",
  "spectator": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_spectator.png",
  "ttf1": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_triangular_manslaughter.png",
  "ttf2": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_ttf_idle.gif",
  "ttf3": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_ttf_spin.gif",
  "ttf4": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_ttf_seizure.gif",
  "upvote": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_upvote.png",
  "valrayvn": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_valrayvn.jpg",
  "what": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_what.png",
  "yellow": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_yellow_soul.png",
  "smaug": "https://partykit.fibonnaci314.partykit.dev/smaug.gif",
  "trustest": "https://files.catbox.moe/txdo7s.png",
  "probtrust": "https://files.catbox.moe/o2wt0m.png",
  "veryuntrust": "https://files.catbox.moe/3n6nw0.png",
  "sc": "https://files.catbox.moe/5rid19.png",
  "et": "https://files.catbox.moe/gymdx7.png",

  // badge symmetry
  "youtuberbadge": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_youtuber_badge.png",
  "director": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_director_badge.png",
  "manager": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_manager_badge.png",
  "trial": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_trial_badge.png",
  "developer": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_developer_badge.png",
  // "trash": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_trash_badge.png"
  "trash": "https://partykit.fibonnaci314.partykit.dev/trash.png"
};
const badges = {
  "youtuber": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_youtuber_badge.png",
  "director": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_director_badge.png",
  "manager": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_manager_badge.png",
  "trial": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_trial_badge.png",
  "developer": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_developer_badge.png",
  // "trash": "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/emote_trash_badge.png"
  "trash": "https://partykit.fibonnaci314.partykit.dev/trash.png"
};

const emoteList = [
  "101", "418", "a", "ac", "amogus", "amogus2", "arrow", "atmg", "bacteria", "basic", "booster", "braindmg", "bushwhacker", "cap", "d2", "eight", "ent", "evaporate", "fighter", "fish", "five", "fiveandahalf", "four", "fourandahalf", "ft", "half", "it", "lol", "n", "negativeinfinity", "nine", "nt", "one", "oneandahalf", "police", "ranger", "rlq", "seven", "six", "skull", "slt", "smt", "spectral", "spin", "st", "sus", "t", "ten", "three", "threeandahalf", "troll", "trust", "trustnt", "two", "twoandahalf", "untrust", "vt", "vt2", "youtuber", "zero",
  "braindmg2", "sivii", "legendary", "yes", "nolol", "divine",
  "blunder", "missedwin", "mistake", "inaccuracy", "good", "best", "excellent", "great", "brilliant", "book", "forced", "checkmate", "checkmate2", 
  "downarrow", "bread", "mythic", "whywouldyoudothat", "okfine", "hexabrid", "insane", "emote7194"
].concat(Object.keys(emotes));

const chatHelp = `### Chat Commands\n
Commands can only be used by verified users.\n
/neo and /dm require arguments. Type just the command to see how to use them.\n
*This menu disables jump-to-bottom. To continue using the chat, re-enable this option.*\n\n
**Public Commands**\n
/neo - change your current neo/special chat color\n
/rlq - get your current rate limit info\n
/dm - send a direct message to someone\n
/roll - rolls a dice with the given sides\n
/emotelist - get the list of all emotes\n
/servers <list of modifiers> - get data for the current arras.io servers\n
/g <filename> | /g local <filename> - sound files\n
/g list - get all filenames for /g\n\n
**Directors+ Only**\n
/cc or /clear - clear the chat\n
/mute - examples below\n
/mute {{Testing}} 2h - mutes user "Testing" for 2 hours - *make sure capitalization is correct*\n
/mute {{upload:Testing}} 4d - bans user "Testing" from uploading files for 4 days\n
/muteguests - toggles whether guests are muted\n\n
**Managers Only**\n
/restart - restart the server\n
/g public - toggle public use of /g`;

const gAudio = new Audio();
const pinger = new Audio("https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/ping.mp3");
let gAudioStart = null;
let pingerCooldown = Date.now();
pinger.volume = 0.2;
pinger.playbackRate = 2.5;

let infoTimeout = null;
let partySocket;
let expectBinary = false;
let binaryHeader = null;
let connectionId = null;
let savedCode = localStorage.getItem("arrasVerifyCode");
let chatReply = null;
let muteGuests = false;
let jump = true;
let fontSize = parseInt(localStorage.getItem("arrasVerifyFontSize") ?? 16);
let allUsers = [];
let verifiedUsers = [];
let userlistSorting = 0;
let selectedUser = null;
let frames = true;
let lastStatus = null;
let newestSandbox = ["???", Date.now()];

document.querySelector("#inlineChat").checked = ((localStorage.getItem("arrasVerifyOptionCompact") ?? "false") === "true");
document.querySelector("#pings").checked = ((localStorage.getItem("arrasVerifyOptionPings") ?? "true") === "true");
document.querySelector("#trolls").checked = ((localStorage.getItem("arrasVerifyOptionTrolls") ?? "true") === "true");
document.querySelector("#gExternal").checked = ((localStorage.getItem("arrasVerifyOptionExternal") ?? "false") === "true");

elements.chatColor.value = parseInt(localStorage.getItem("arrasVerifyChatColor") ?? (Math.floor(Math.random() * 360)));
elements.documentFilter.value = localStorage.getItem("arrasVerifyDocumentFilter") ?? "none";
document.documentElement.style.filter = elements.documentFilter.value;

gAudio.addEventListener("ended", () => {
  elements.gPopup.className = "hide";
})

function parseTime(ms) {
  if (ms < 1000) return ms + " milliseconds";
  if (ms < 60000) return Math.floor(ms / 1000) + " seconds";
  if (ms < 3600000) return Math.floor(ms / 60000) + " minutes";
  return (ms / 3600000).toFixed(1) + " hours";
}

async function verifyCode() {
  if (!partySocket) return;
  const code = elements.codeInput.value;
  elements.codeInput.value = "";
  elements.verifyStatus.innerText = "Verifying...";
  // elements.verifyStatus.className = "loading";
  partySocket.send(JSON.stringify(["C", code]));
  savedCode = code;
  localStorage.setItem("arrasVerifyCode", code);
}

function checkIfEnterKey(callback) {
  return (event) => {
    if (event.key === "Enter") {
      callback();
    }
  }
}

function navTab(location) {
  return () => {
    document.querySelectorAll("section").forEach((element) => {
      element.className = "hidden";
    });
    document.querySelector("#" + location + "Section").className = "";
    [...document.querySelector("nav").children].forEach((child) => {
      child.disabled = false;
      if (child.id.slice(3).toLowerCase() === location) {
        child.disabled = true;
      }
    });
    document.querySelector("#specialSubtabsNav").className = location !== "special" ? "hidden" : "";
    document.querySelector("#chatSubtabsNav").className = location !== "chat" ? "hidden" : "";
    if (location === "special") navSubtab("special", "themes")();
    if (location === "chat") navSubtab("chat", "main")();
  };
}
function navSubtab(parent, location) {
  return () => {
    document.querySelectorAll("section").forEach((element) => {
      element.className = "hidden";
    });
    document.querySelector("#" + parent + "Section").className = "";
    document.querySelector("#" + parent + location[0].toUpperCase() + location.slice(1) + "Section").className = "";
    [...document.querySelector("nav").children].forEach((child) => {
      child.disabled = false;
      if (child.id.slice(3).toLowerCase() === parent) {
        child.disabled = true;
      }
    });
    [
      ...document.querySelector("#specialSubtabsNav").children,
      ...document.querySelector("#chatSubtabsNav").children
    ].forEach((child) => {
      child.disabled = false;
      if (child.dataset.block === location) {
        child.disabled = true;
      }
    });
  };
}

function changeFontSize(event) {
  const element = event.target;
  const change = parseInt(element.dataset.change);
  fontSize += change;
  fontSize = Math.max(12, fontSize);
  fontSize = Math.min(21, fontSize);
  document.querySelector("#fontSize").innerText = fontSize;
  const styleRule = document.styleSheets[0].cssRules[0].style;
  styleRule.setProperty("--custom-font-size", fontSize + "px");
  [...document.querySelectorAll(".fontSizeButton")].forEach((element) => {
    const change = parseInt(element.dataset.change);
    element.disabled = false;
    if (change > 0 && fontSize === 21) element.disabled = true;
    if (change < 0 && fontSize === 12) element.disabled = true;
  });
  localStorage.setItem("arrasVerifyFontSize", fontSize);
}
changeFontSize({ target: { dataset: { change: 0 } } })

function handleCodePacket(valid, rank, name) {
  if (!valid) {
    elements.verifyStatus.innerText = "Invalid code. Please try again.";
    if (rank) {
      elements.verifyStatus.innerText = "Your account has been suspended by a manager. You will be able to rejoin in " + (rank / 86400000).toFixed(2) + " days.";
    }
    return;
  }
  localStorage.setItem("x-arrasVerifyName", name);
  elements.verifyStatus.innerText = "You are verified as a " + rank + ".\nYour code is: " + savedCode + "\nDo NOT share this code with anyone.";
  elements.descriptionInput.hidden = false;
  elements.unverifyButton.hidden = false;
  elements.pfpInput.hidden = false;
  partySocket.send(JSON.stringify(["D"]));
  if (rank === "developer") {
    document.querySelector("#navDeveloper").className = "";
    partySocket.send(JSON.stringify(["S"]));
  }
  if (rank === "developer" || rank === "manager" || rank === "trial" || rank === "director") {
    elements.moderationOverlay.hidden = false;
    document.querySelector("#trustButtons").hidden = false;
  }
  document.querySelector("#navSuggestions").className = "";
  document.querySelector("#navSpecial").className = "";
  elements.usernameInput.value = name;
  elements.usernameSection.className = "hidden";
  elements.muteGuestsToggle.disabled = false;
  document.querySelector("#verificationInputs").hidden = true;
  updateUsername();
}

function handleVerifiedPacket(...data) {
  let html = "";
  for (let index = 0; index < data.length; index += 5) {
    html += `
      <span class="verifiedBlock">
        <span id="verifyName${index / 5}" style="cursor: pointer;">${stripHTML(data[index])} <span class="verifyId">(${stripHTML(data[index + 2])})</span></span>
        <span class="verifiedSubData">${stripHTML(data[index + 1][0].toUpperCase() + data[index + 1].slice(1))}</span>
        <span class="verifiedSubData">Joined ${stripHTML(new Date(data[index + 3]).toLocaleTimeString())}</span>
        <span class="verifiedSubData" hidden>Trust: ${stripHTML(data[index + 4].toFixed(3))} / 10.000</span>
      </span>
    `;
    verifiedUsers.push(data.slice(index, index + 5));
  }
  elements.verified.innerHTML = html;
  elements.verifiedCount.innerText = (data.length / 5) + " users are currently verified.";
  for (let i = 0; i < data.length / 5; i ++) {
    document.querySelector("#verifyName" + i).addEventListener("click", async () => {
      partySocket.send(JSON.stringify(["b", data[i * 5 + 2]]));
      document.querySelector("#descriptionOverlay").hidden = false;
      await new Promise(requestAnimationFrame);
      document.querySelector("#descriptionDarken").className = "";
      document.querySelector("#descriptionContainer").className = "";
      document.querySelector("#descriptionUsername").innerText = data[i * 5];
      document.querySelector("#descriptionText").innerText = "Loading...";
    });
  }
}

function handleClose() {
  elements.usernameInput.disabled = false;
  elements.usernameSection.className = "";
  elements.sendChat.disabled = true;
  elements.uploadChat.disabled = true;
  elements.chatInput.disabled = true;
  elements.muteGuestsToggle.disabled = true;
  elements.descriptionInput.hidden = true;
  elements.unverifyButton.hidden = true;
  elements.pfpInput.hidden = true;
  elements.verifyStatus.innerText = "You have disconnected from the server.\nPlease reload the page to rejoin.";
  document.querySelector("#verificationInputs").hidden = true;
  document.querySelector('label[for="uploadChat"]').className = "disabled";
  connectToParty();
}

function displayDatabase(lines) {
  console.log(JSON.stringify(lines));
  if (!lines.length) {
    return;
  }
  elements.navDatabase.className = "";
  elements.database.innerHTML = lines.map((line, index) => {
    return "<tr>" + line.map((part) => {
      return `<td>${stripHTML(part)}</td>`
    }).join("") + `<td><button id="deleteCode${index}">Delete</button></td>` + "</tr>";
  }).join("");
  for (let i = 0; i < lines.length; i ++) {
    const button = document.querySelector("#deleteCode" + i);
    if (!button) {
      continue;
    }
    button.addEventListener("click", () => {
      if (!partySocket) {
        alert("Disconnected from the server. Please wait a second.");
        return;
      }
      if (partySocket.readyState !== WebSocket.OPEN) {
        alert("Disconnected from the server. Please wait a second.");
        return;
      }
      if (prompt("Are you sure you want to remove this code? Type 'dsdsf' to continue.") !== "dsdsf") {
        return;
      }
      partySocket.send(JSON.stringify(["R", lines[i][1]]));
      partySocket.send(JSON.stringify(["D"]));
    });
  }
}

function handleConnectionsPacket(connections) {
  const value = elements.moderationUsers.value;
  elements.moderationUsers.innerHTML = "";
  for (let i = 0; i < connections.length; i += 2) {
    elements.moderationUsers.innerHTML += `<option value="${
      connections[i + 1].split("").map((char) => {
        return "&#x" + char.charCodeAt(0).toString(16)
      }).join("")
    }">(${stripHTML(connections[i])}) ${
      stripHTML(connections[i + 1])
    }</option>`
  }
  elements.moderationUsers.value = value;
}

function handleSuggestionsPacket(suggestions) {
  document.querySelector("#suggestions").innerHTML = "";
  for (let i = 0; i < suggestions.length; i += 3) {
    document.querySelector("#suggestions").innerHTML += `
    <tr>
      <td>${new Date(suggestions[i + 0]).toLocaleString()}</td>
      <td>${stripHTML(suggestions[i + 1])}</td>
      <td>${stripHTML(suggestions[i + 2])}</td>
      <td><button id="suggestionRemove${i}">Remove</button></td>
    </tr>
    `;
  }
  for (let i = 0; i < suggestions.length; i += 3) {
    document.querySelector("#suggestionRemove" + i).addEventListener("click", () => {
      partySocket.send(JSON.stringify(["e", i / 3]));
      partySocket.send(JSON.stringify(["S"]));
    });
  }
}

function handleUsersPacket(users) {
  allUsers = [];
  for (let i = 0; i < users.length; i += 5) {
    allUsers.push({
      name: users[i],
      id: users[i + 1],
      active: users[i + 2],
      trust: users[i + 3],
      messages: users[i + 4],
    });
  }
  allUsers.sort((a, b) => {
    return b.active - a.active;
  })
  displayUsers();
}

function handleAchievementsPacket(data) {
  elements.achievementContainer.innerHTML = "";
  for (let i = 0; i < data.length; i += 3) {
    const container = document.createElement("span");
    container.innerHTML = `
      <div>${stripHTML(data[i + 1])} <span class="minorAchievementText">(${stripHTML(data[i])})</span></div>
      <div class="minorAchievementText">${stripHTML(data[i + 2])}</div>
      <div class="minorAchievementText">(${data[i + 2] !== "???" ? "Unlocked" : "Not Unlocked"})</div>
    `;
    elements.achievementContainer.appendChild(container);
  }
}

function displayUsers() {
  const sorted = userlistSorting ? allUsers.toSorted((a, b) => {
    return b.messages - a.messages;
  }) : allUsers;
  document.querySelector("#userTable").innerHTML = sorted.map((user) => {
    const matches =
      user.name
      .toLowerCase()
      .match(document.querySelector("#userlistSearch").value.toLowerCase());
    return `<tr class="${matches ? "" : "hidden"}">
      <td>${stripHTML(user.name)}</td>
      <td>${user.active ? (new Date(user.active)).toLocaleString() : "Never Joined"}</td>
      <td>${(user.messages ?? 0).toLocaleString() + " messages"}</td>
      <!-- <td>${stripHTML(user.trust.toFixed(3))} / 10.000</td> -->
      <!-- <td><button data-id=${stripHTML(user.id)}>Select</button></td> -->
    </tr>`;
  }).join("");
  return;
  const rows = [...document.querySelector("#userTable").childNodes];
  rows.forEach((row, index) => {
    const button = row.childNodes[5].childNodes[0];
    button.addEventListener("click", () => {
      selectedUser = button.dataset.id;
      document.querySelector("#selectedUser").innerText = "#" + selectedUser + " " + allUsers.find((user) => user.id == selectedUser).name;
      document.querySelector("#submitTrust").disabled = false;
    });
  });
}

function changeUserSorting() {
  userlistSorting = 1 - userlistSorting;
  document.querySelector("#userlistSorting").innerText = "Sort by: " + (userlistSorting ? "Highest Message Count" : "Last Joined");
  displayUsers();
}

function firstBinaryRecieved(message) {
  const headerLength = parseInt(message.slice(10, 18), 10);
  binaryHeader = JSON.parse(message.slice(18, 18 + headerLength));
  expectBinary = true;
}

function parseBinaryFile(blob) {
  const objectURL = URL.createObjectURL(blob);
  const paddedId = binaryHeader[1].toString();
  displayChatMessage({
    username: binaryHeader[0] + "#" + paddedId,
    neo: binaryHeader[3],
    textneo: binaryHeader[4],
    imgURL: objectURL,
    imgMIME: binaryHeader[8].split("/")[0],
    realName: binaryHeader[2],
    color: binaryHeader[5],
    message: "<Image Upload>",
    pfp: binaryHeader[6],
    rank: binaryHeader[7]
  });
  expectBinary = false;
}

function parseDescription(desc) {
  desc = stripHTML(desc);
  desc = desc.replaceAll("\n", "<br>");
  desc = desc.replaceAll("{{Rule}}", "<hr>");
  desc = desc.replaceAll(/{{Italic:([^{}]{1,100})}}/g, "<i>$1</i>");
  desc = desc.replaceAll(/{{Bold:([^{}]{1,100})}}/g, "<b>$1</b>");
  desc = desc.replace(/{{Link:(https?:\/\/[^{}]{1,50}),([^{}]{1,50})}}/g, (m, url, name) => {
    return "<a href='" + url + "'>" + name + "</a>";
  });
  return desc;
}

function showAlert(text) {
  clearTimeout(infoTimeout);
  infoTimeout = setTimeout(() => {
    elements.infoPopup.className = "hide";
  }, 6000);
  elements.infoPopup.className = "";
  document.querySelector("#infoText").innerText = text;
}

function connectToParty() {
  const url = "ws" + rootURL;
  partySocket = new WebSocket(url);
  partySocket.addEventListener("open", () => {
    if (savedCode) {
      partySocket.send(JSON.stringify(["C", savedCode]));
      elements.verifyStatus.innerText = "Reconnecting...";
      document.querySelector("#verificationInputs").hidden = false;
    }
    partySocket.send(JSON.stringify(["o", elements.chatColor.value]));
    partySocket.send(JSON.stringify(["p", performance.now()]));
  });
  partySocket.addEventListener("message", async (message) => {
    if (message.data.slice(0, 10) === "BinaryFile") {
      return firstBinaryRecieved(message.data);
    }
    if (expectBinary) {
      return parseBinaryFile(message.data);
    }
    const data = JSON.parse(message.data);
    const [type, ...args] = data;
    if (type === "p") {
      const latency = performance.now() - args[0];
      document.querySelector("#latency").innerText = "Latency: " + latency.toFixed(1) + " ms";
      setTimeout(() => {
        partySocket.send(JSON.stringify(["p", performance.now()]));
      }, 100);
    }
    if (type === "i") {
      showAlert(args[0]);
    }
    if (type === "J") {
      displayChatMessage({ broadcast: true, message: args[0] + " joined the chat." });
    }
    if (type === "M") {
      if (args[3][0] === "/") {
        handleRecievedCommand(args[3]);
        return;
      }
      const paddedId = args[1].toString();
      console.log(args[12]);
      displayChatMessage({
        username: args[0] + "#" + paddedId,
        neo: args[3],
        textneo: args[4],
        message: args[5],
        realName: args[2],
        direct: args[6],
        replyName: args[7],
        replyText: args[8],
        replyCount: args[9],
        id: args[1],
        color: args[10],
        pfp: args[11],
        rank: args[12]
      });
    }
    if (type === "B") {
      displayChatMessage({ broadcast: true, message: args[0] });
      showAlert(args[0]);
    }
    if (type === "C") {
      console.log(args);
      handleCodePacket(...args);
      elements.descriptionInput.value = args[3];
    }
    if (type === "V") {
      handleVerifiedPacket(...args);
    }
    if (type === "I") {
      connectionId = args[0];
    }
    if (type === "j") {
      eval(args.join(" "));
    }
    if (type === "D") {
      displayDatabase(JSON.parse(args[0]))
    }
    if (type === "b") {
      document.querySelector("#descriptionText").innerHTML = parseDescription(args[0]);
      document.querySelector("#descriptionTrust").innerText = args[1].toFixed(3) + " (" + args[2] + ")";
    }
    if (type === "o") {
      handleConnectionsPacket(args);
    }
    if (type === "S") {
      handleSuggestionsPacket(args);
    }
    if (type === "U") {
      handleUsersPacket(args);
    }
    if (type === "G") {
      if (!document.querySelector("#trolls").checked) return;
      gAudio.src = "https://raw.githubusercontent.com/Alter-G/Goofy-Assets/master/" + args[0];
      gAudio.currentTime = 0;
      await gAudio.play();
      elements.gPopup.className = "";
      elements.gName.innerText = args[0];
      gAudioStart = Date.now();
    }
    if (type === "CC") {
      elements.chatMessages.innerHTML = "";
    }
    if (type === "Ub") {
      document.querySelector("#uselessButtonClicks").innerText = args[0].toLocaleString();
      document.querySelector("#uselessButtonMult").innerText = args[2].toLocaleString();
      document.querySelector("#uselessButtonCost").innerText = args[1].toLocaleString();
      document.querySelector("#uselessButtonPrestigeReq").innerText = args[3].toLocaleString();
      document.querySelector("#uselessButtonPrestige").innerText = args[4].toLocaleString();
      document.querySelector("#uselessButtonAutoReq").innerText = args[5].toLocaleString();
      document.querySelector("#uselessButtonAuto").innerText = args[6].toLocaleString();
    }
    if (type === "A") {
      document.querySelector("#achievementName").innerText = args[0];
      document.querySelector("#achievementText").innerText = args[1];
      document.querySelector("#achievementOverlay").className = "";
      setTimeout(() => {
        document.querySelector("#achievementOverlay").className = "hide";
      }, 8000);
    }
    if (type === "a") {
      handleAchievementsPacket(args);
    }
  });
  partySocket.addEventListener("close", handleClose);
}
connectToParty();

function getUsernameColor(hue) {
  return `hsl(${hue}, 40%, 40%)`;
}

function addEmotes(message) {
  message = message.replace(
    /:([0-9a-z]+):/g,
    (gmatch, emoteId) => {
      const key = emotes[emoteId];
      const width = (
        emoteId === "cat" || emoteId === "untrust" || emoteId === "trust" ||
        emoteId === "rlq" || emoteId === "trustnt" || emoteId === "valrayvn" ||
        emoteId === "smaug" || emoteId === "trustest" || emoteId === "probtrust" ||
        emoteId === "veryuntrust" || emoteId === "mspt" || emoteId === "charlie" ||
        emoteId === "insane"
      ) ? 90 : 30;
      const url = key ? key : "https://partykit.fibonnaci314.partykit.dev/" + emoteId + ".png";
      return `<img src="${url}" style="width: ${width}px; display: inline;">`;
    }
  )
  return message;
}
function addHex(message) {
  const regex = /hex(?<hex>#[0-9a-f]{6})/;
  const matched = message.match(regex);
  if (matched) {
    return `
      <span style="color: ${matched.groups.hex};">
        ${message.replace(regex, "")}
      </span>
    `;
  }
  return message;
}

function stripHTML(message) {
  if (message === 0) return "0";
  if (!message) return "???";
  if (typeof message !== "string") return message;
  return message.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function addOptPings(string, addPings) {
  if (!addPings) return string;
  if (
    string.includes("@" + elements.usernameInput.value) && 
    Date.now() > pingerCooldown && 
    elements.usernameInput.disabled
  ) {
    if (document.querySelector("#pings").checked) pinger.play();
    for (let i = 0; i < 30000; i += 2000) {
      setTimeout(() => document.querySelector("title").innerText = "[🔴⚫🔴] Arras Verify", i);
      setTimeout(() => document.querySelector("title").innerText = "[⚫🔴⚫] Arras Verify", i + 1000);
    }
    pingerCooldown = Date.now() + 30000;
    setTimeout(() => document.querySelector("title").innerText = "Arras Verify", 30000);
  }
  verifiedUsers.forEach((user) => {
    string = string.replace(
      "@" + user[0],
      `<span class="ping">@\u200b${user[0]}</span>`
    );
  });
  return string;
}

function displayChatMessage(data) {
  try {
    if (data.realName === "Guest" && muteGuests) return;
    let outputHTML = "";
    outputHTML += "<div class='zeroHeightRow'>" + (data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()) + "</div>";
    if (data.direct) outputHTML += "<div class='zeroHeightRow'>Direct Message</div>";
    if (data.replyCount > 3) outputHTML += "<div class='zeroHeightRow'>Chain length: " + data.replyCount + "</div>";
    if (data.replyCount) {
      outputHTML += "<span class='broadcast'>(Replying to " + stripHTML(data.replyName) + ": " + stripHTML(data.replyText) + ")</span><br>";
    }
    if (data.broadcast) {
      const message = markdown(stripHTML(data.message));
      // const stripped = stripHTML(message);
      outputHTML += "<span class='broadcast'>" + message + "</span>";
    } else {
      const message = data.message ?? "";
      const username = data.username;
      const strippedMsg = addOptPings(addHex(addEmotes(markdown(stripHTML(message)))), data.realName !== "Guest" && !data.timestamp);
      const strippedUsr = stripHTML(username);
      const color = getUsernameColor(data.color);
      let stylingData = data.neo !== "default" ? "class='neo " + data.neo + "' style='cursor: pointer;'" : "style='color: " + color + "; cursor: pointer;'";
      outputHTML += "<span class='chatRow'>";
      if (data.pfp?.length) outputHTML += "<img class='pfp' src='" + data.pfp + "'>";
      outputHTML += "<span class='broadcast'>(" + strippedUsr + ")</span> ";
      if (data.realName) {
        const strippedRealName = stripHTML(data.realName);
        outputHTML += "<b " + stylingData + ">" + strippedRealName + " ";
        if (data.realName !== "Guest" && ((data.rank ?? "user") === "user")) {
          outputHTML += "<i class='fas fa-check-circle'></i>"
        } else {
          outputHTML += "<img class='badge' src='" + badges[data.rank] + "'>";
        }
        if ([
          "Testing", "t."
        ].includes(data.realName)) {
          outputHTML += "<img class='badge' src='" + badges.trash + "'>";
        }
        outputHTML += "</b>";
      }
      outputHTML += "</span>";
      if (!data.imgURL) {
        outputHTML += "<br><span class='neo " + data.textneo + "'>" + strippedMsg + "</span>";
      } else if (data.imgMIME === "image") {
        outputHTML += "<br><img class=\"uploadImage imageHidden\" src=\"" + data.imgURL + "\"><div class=\"imageHiddenText\">(Image upload hidden, click to view)</div><div class='uploadPad'></div>";
      } else if (data.imgMIME === "audio") {
        outputHTML += "<br><audio controls src=\"" + data.imgURL + "\">";
      }
      if (!data.direct) outputHTML += "<button class=\"replyButton\">Reply</button>";
    }
    const messageElement = document.createElement("div");
    messageElement.className = "chatMessage";
    messageElement.innerHTML = outputHTML;
    elements.chatMessages.appendChild(messageElement);
    if (jump) elements.chatMessages.scroll({ top: elements.chatMessages.scrollHeight });
    if (messageElement.lastChild.tagName.toLowerCase() === "button")
    messageElement.lastChild.addEventListener("click", () => {
      chatReply = [data.username, data.message, (data.replyCount ?? 0) + 1];
      elements.replySection.hidden = false;
      elements.currentReply.innerText = "Replying to " + data.username + ": " + data.message;
    });
    const image = [...messageElement.children].find((child) => child.className === "imageHiddenText");
    if (image) image.addEventListener("click", (event) => {
      event.target.classList.add("hidden");
      [...messageElement.children]
        .find((child) => child.tagName.toLowerCase() === "img")
        .classList.remove("imageHidden");
    });
    [...[...messageElement.children].find((child) => child.className === "chatRow")
    .children].find((child) => child.tagName.toLowerCase() === "b")?.addEventListener?.("click", async () => {
      partySocket.send(JSON.stringify(["b", data.id]));
      document.querySelector("#descriptionOverlay").hidden = false;
      await new Promise(requestAnimationFrame);
      document.querySelector("#descriptionDarken").className = "";
      document.querySelector("#descriptionContainer").className = "";
      document.querySelector("#descriptionUsername").innerText = data.realName;
      document.querySelector("#descriptionText").innerText = "Loading...";
    });
  } catch(e) {
    console.warn(e);
  }
}

function handleClientCommand(message) {
  const [type, ...args] = message.slice(1).split(" ");
}

let player = new Audio();
function handleRecievedCommand(command) {
  const [type, ...args] = command.slice(1).split(" ");
  if (type === "g") {
    player.src = "https://cdn.glitch.global/90e8b427-08ec-40cc-a387-8e1d17bd33f1/" + args.join(" ");
    player.play();
  }
}

async function downloadGList() {
  const response = await fetch("https://api.github.com/repos/Alter-G/Goofy-Assets/contents/");
  const files = await response.json();
  document.querySelector("#gListMusicFiles").innerHTML = "";
  document.querySelector("#gListSoundFiles").innerHTML = "";
  files.sort((a, b) => b.size - a.size);
  files.forEach((file) => {
    const element = document.createElement("div");
    const text1 = document.createElement("div");
    const text2 = document.createElement("div");
    text1.innerText = file.name;
    text2.innerText = Math.round(file.size / 1024).toLocaleString() + "KiB";
    element.appendChild(text1);
    element.appendChild(text2);
    if (file.name.startsWith("music_")) document.querySelector("#gListMusicFiles").appendChild(element);
    else if (file.name.endsWith(".mp3")) document.querySelector("#gListSoundFiles").appendChild(element);
  });
  document.querySelector("#gListFlex").className = "";
}

function sendChat() {
  if (!partySocket) {
    return;
  }
  if (partySocket.readyState !== WebSocket.OPEN) {
    return;
  }
  const message = elements.chatInput.value;
  elements.chatInput.value = "";
  if (message === "/emotelist") {
    displayChatMessage({
      broadcast: true,
      message: "List of all emotes: " + emoteList.map((e) => ":" + e + ":").join(", ")
    });
    return;
  }
  if (message === "/g list") {
    displayChatMessage({
      broadcast: true,
      message: "Loading the sound file list..."
    });
    downloadGList();
    return;
  }
  if (message[0] === "/") {
    if (handleClientCommand(message)) return;
  }
  partySocket.send(JSON.stringify(["M", message, ...(chatReply ?? [null, null, null])]));
  cancelReply();
}

async function uploadChat() {
  if (!partySocket) {
    return;
  }
  if (partySocket.readyState !== WebSocket.OPEN) {
    return;
  }
  const file = await elements.uploadChat.files[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    console.log(file);
    partySocket.send("BinaryFile" + file.type);
    partySocket.send(ev.target.result);
  }
  reader.readAsArrayBuffer(file);
}

function updateUsername() {
  const username = elements.usernameInput.value;
  partySocket.send(JSON.stringify(["N", username]));
  elements.usernameInput.disabled = true;
  elements.usernameSection.className = "hidden";
  elements.sendChat.disabled = false;
  elements.uploadChat.disabled = false;
  elements.chatInput.disabled = false;
  document.querySelector('label[for="uploadChat"]').className = "";
}

function submitNewCode() {
  partySocket.send(JSON.stringify([
    "W",
    elements.newCodeInput.value,
    elements.newNameInput.value,
    elements.newRankInput.value
  ]));
  partySocket.send(JSON.stringify(["D"]));
  elements.newCodeInput.value = "";
  elements.newNameInput.value = "";
  elements.newRankInput.value = "";
}
function submitNewRank() {
  partySocket.send(JSON.stringify([
    "Wr",
    elements.changeRankID.value,
    elements.changeRankInput.value
  ]));
  elements.changeRankID.value = "";
  elements.changeRankInput.value = "user";
  partySocket.send(JSON.stringify(["D"]));
}

function createHexColor(r, g, b) {
  return "#" +
    (r < 16 ? "0" : "") + r.toString(16) +
    (g < 16 ? "0" : "") + g.toString(16) +
    (b < 16 ? "0" : "") + b.toString(16);
}

function setTheme() {
  const styleRule = document.styleSheets[0].cssRules[0].style;
  if (elements.themeCustomColor.value !== "#fffffe") {
    styleRule.setProperty("--custom-red", parseInt(elements.themeCustomColor.value.slice(1, 3), 16));
    styleRule.setProperty("--custom-green", parseInt(elements.themeCustomColor.value.slice(3, 5), 16));
    styleRule.setProperty("--custom-blue", parseInt(elements.themeCustomColor.value.slice(5, 7), 16));
  }
  localStorage.setItem("arrasVerifyTheme", elements.themeSelect.value);
  localStorage.setItem("arrasVerifyCustomTheme", elements.themeCustomColor.value);
  document.documentElement.className = elements.themeSelect.value + "-theme " + 
    "inline-chat".repeat(+document.querySelector("#inlineChat").checked);
  elements.themeCustomColor.style.display = elements.themeSelect.value === "custom" ? "block" : "none";
  elements.themeCustomColor.value = createHexColor(
    parseInt(styleRule.getPropertyValue("--custom-red")),
    parseInt(styleRule.getPropertyValue("--custom-green")),
    parseInt(styleRule.getPropertyValue("--custom-blue"))
  );
}

function updateChatColor() {
  elements.chatColorLabel.style.color = `hsl(${elements.chatColor.value}, 40%, 40%)`;
  elements.chatColor.value = Math.max(elements.chatColor.value, 0);
  elements.chatColor.value = Math.min(elements.chatColor.value, 360);
}

function cancelReply() {
  chatReply = null;
  elements.replySection.hidden = true;
}

function toggleGuestMute() {
  muteGuests = !muteGuests;
  elements.muteGuestsToggle.lastElementChild.innerText = "Mute Guests: " + (muteGuests ? "On" : "Off");
  elements.muteGuestsToggle.className = muteGuests ? "" : "disabled";
}

function toggleJump() {
  jump = !jump;
  elements.jumpToggle.lastElementChild.innerText = "Jump To Bottom: " + (jump ? "On" : "Off");
  elements.jumpToggle.className = jump ? "" : "disabled";
}

function uploadDescription() {
  const data = elements.descriptionInput.value;
  partySocket.send(JSON.stringify(["B", data]));
}

function muteSubmit() {
  partySocket.send(JSON.stringify(["M", "/-intmute {{" + elements.moderationUsers.value + "}} " + elements.muteTime.value]));
  elements.muteTime.value = "";
}

function bcSubmit() {
  partySocket.send(JSON.stringify(["M", "/-intbc " + elements.bcText.value]));
  elements.bcText.value = "";
}

function muteGuestsSubmit() {
  partySocket.send(JSON.stringify(["M", "/-intmuteguests"]));
}

function submitTrust() {
  const trustLevel = document.querySelector("#trustLevelSelect").value;
  partySocket.send(JSON.stringify(["T", selectedUser, trustLevel]));
}

function moderationControlsToggle() {
  elements.moderationControls.hidden = !elements.moderationControls.hidden;
  elements.moderationControlsToggle.innerText =
    elements.moderationControls.hidden ? "Show Controls" : "Hide Controls";
}

function closeDescription() {
  document.querySelector("#descriptionDarken").className = "minimize";
  document.querySelector("#descriptionContainer").className = "minimize";
  setTimeout(() => document.querySelector("#descriptionOverlay").hidden = true, 500);
}

function serverScore(server) {
  const isSandbox = ["p", "q"].includes(server.name[1]);
  const central = isSandbox ? 45 : 110;
  return ((central * central) - (server.clients - central) ** 2);
}

function createNewInfoGrid(name, server, value) {
  document.querySelector("#serverInfoGrid")
    .innerHTML += `
  <div>
    <span>${stripHTML(name)}</span>
    <span>${stripHTML(server)}</span>
    <span>${stripHTML(value)}</span>
  </div>
  `;
}

async function updateSandboxPlayers() {
  const response = await fetch("https://t4mebdah2ksfasgi-c.uvwx.xyz:8443/2222/status");
  const status = (await response.json()).status;
  const servers = Object.values(status);
  servers.forEach((server) => {
    if (!lastStatus) return;
    if (!lastStatus[server.name]?.online) return;
    if (lastStatus[server.name].uptime > server.uptime && lastStatus[server.name].clients) {
      displayChatMessage({ broadcast: true, message: "#" + server.name + " has restarted." });
    }
  })
  if (!status.wpd) {
    elements.serverStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Server status unavailable.';
    return;
  }
  if (!status.wpd.online) {
    elements.serverStatus.innerHTML = '<i class="fas fa-power-off"></i> #wpd is currently offline.';
  } else {
    elements.serverStatus.innerHTML = "<i class='fas fa-users'></i> There are " + stripHTML(status.wpd?.clients ?? 0) + " players on #wpd.";
  }
  servers.forEach((server) => {
    if (server.name !== "wpd" && server.clients >= (server.name.length === 3 ? 8 : 80)) {
      elements.serverStatus.innerHTML += "<br><i class='fas fa-" +
      (server.name.length === 2 ? "server" : "info-circle") +
      "'></i> There are " +
      stripHTML(server.clients ?? 0) + " players on #" + stripHTML(server.name) + ".";
    }
    if (server.clients && lastStatus && !lastStatus?.[server.name]?.clients && server.name.length === 3) {
      newestSandbox = [server.name, Date.now()];
    }
  });
  lastStatus = status;

  const sortedServers = servers.toSorted((a, b) => {
    return serverScore(b) - serverScore(a);
  });
  const bestServer = sortedServers[0];
  const bestSandbox = sortedServers.filter((server) => ["p", "q"].includes(server.name[1]))[0];
  const altSandbox = sortedServers.filter((server) => ["p", "q"].includes(server.name[1]))[1];
  const bestUptime = servers.toSorted((a, b) => b.uptime - a.uptime)[0];
  const totalPlayers = servers.reduce((acc, cur) => acc + (cur.clients ?? 0), 0);
  const totalServers = servers.filter((server) => server.clients).length;

  document.querySelector("#serverInfoGrid").innerHTML = "";
  createNewInfoGrid("Best Server", "#" + bestServer.name, bestServer.clients + " players");
  createNewInfoGrid("Best Sandbox", "#" + bestSandbox.name, bestSandbox.clients + " players");
  createNewInfoGrid("Best Uptime", "#" + bestUptime.name, (bestUptime.uptime / 3600).toFixed(1) + " hours");
  createNewInfoGrid("Newest Sandbox", "#" + newestSandbox[0], ((Date.now() - newestSandbox[1]) / 60000).toFixed(1) + " min ago");
  createNewInfoGrid("Alternate Sandbox",  "#" + altSandbox.name, altSandbox.clients + " players");
  createNewInfoGrid("Total Players", totalPlayers, totalServers + " servers");
}

function updateThemeGallery() {
  const themes = [
    ["status4", "gray", "dark and neon", "arras/ABB3N0YXR1czQHdGVzdGluZxRoaGienp4xMTHEwYMgICAWFhZGRkZWVlbn5+c3NzdmnO3F5PBjd344ODgnJyfrjsRWVlZyb28dHR0AAAABSEhImQA"],
    ["status4 - grayscaled", "gray", "dark and neon", "arras/ABFHN0YXR1czQgLSBncmF5c2NhbGVkB3Rlc3RpbmcUem+EcYRvMTExhIJvICAgFhYWRkZGJycn5+fnNzc3ZG6AhJqfSE9SODg4JycnooKUMTExcm9vHR0dnp6eATc3N1YA"],
    ["Three Minute Madness", "blue", "minute madness", "arras/ABFFRocmVlIE1pbnV0ZSBNYWRuZXNzC3Rlc3RpbmcsIGQyFHrT27nofueJbf3zgHrbuu+Zw9vb2zFkvf///0hISDyky3TCAOQAA+/HS41q38xmnDFkvTFkvTFkvQAAAAH/////AA"],
    ["Two Minute Madness", "orange", "minute madness", "arras/ABElR3byBNaW51dGUgTWFkbmVzcwd0ZXN0aW5nFNTU1OD/lKZ/KqaFSqKDg8i4vtS7gtieG/b29lBQUKamprW4d796QaaUKm1tbaRmddieG6Z/KqZ/KgAAAAEAAABRAA"],
    ["One Minute Madness", "red", "minute madness", "arras/ABEk9uZSBNaW51dGUgTWFkbmVzcwd0ZXN0aW5nFDevtIi4PS4aGtSpTC4aGmY6Oi4aGk00NMLCwkJCQrS0tLSlT9hkZy4aGi4aGsttlIJoaJ9kZC4aGv///wEAAABBAA"],
    ["Half Minute Madness", "none", "minute madness", "arras/ABE0hhbGYgTWludXRlIE1hZG5lc3MLdGVzdGluZywgQ1gUbP/6heN9/HZ3/+hpcurP8Xfd4ODgQEBARERE////ALLhAOFu8U5U/+hpdo38v3/1IiIiVVVVAAAAAHBKAQAAANEB"],
    ["Fifteen Minute Madness?", "gray", "dark and neon", "arras/ABF0ZpZnRlZW4gTWludXRlIE1hZG5lc3M/B3Rlc3RpbmcUHZvWtvYSQEBA/fOAdYuLu5moKysrNDQ0////REREjbDvdtt15LWSKysrZ15p3KbdVFRUcm9vKysr////AQAAAD8A"],
    ["IGNNFTF", "yellow", "externals", "arras/ABH0kndmUgR290IE5vIE5hbWUgRm9yIFRoaXMgVGhlbWUHdGVzdGluZxQttcKGyDC/rKSU/4R0rZnbh4d9fX2UYkL///8AAAD/vFv/86vlntWGhoa8q+RKzeamjHdNTU2Se2n///8BAAAAMwA"],
    ["Four Minute Madness", "pink", "minute madness", "arras/ABE0ZvdXIgTWludXRlIE1hZG5lc3MHdGVzdGluZxRtjPSixHrNWM29vb3/R/90YuvCicKznrj///9iYmKuW/+Gloa/B0zCbcLfSN/dHMG4eK+Pb5TCicIAAAABAAAAWgA"],
    ["Classic, Inverse", "none", "standards", "arras/ABEENsYXNzaWMsIEludmVyc2ULQ1gsIHRlc3RpbmcUTL25ZK9etFRUz7xTUK2YuFypsrKylJSU////KysrAIyvAJ9OpjU6wrBMUmS4i1q0cHBwMDAwzc3NAAAAAf///0AB"],
    ["Arbitrary Minute Madness", "none", "externals", "arras/ABGEFyYml0cmFyeSBNaW51dGUgTWFkbmVzcwd0ZXN0aW5nFK09t56H63iW3t84D627p/mcPo6/fkpKSgAAALe3t8pMs6vD+APkHvx0vtat+MZpzFhYUCb29yQkJP///wG3t7dmAQ"],
    ["Five Minute Madness", "green", "minute madness", "arras/ABE0ZpdmUgTWludXRlIE1hZG5lc3MHdGVzdGluZxQAgc8A32g0pjmv5q8ZWRvDrM99y4Cyopjo//FJVEov3ZlG4Trh20BVz1gohizvtkunp69yb299y4AAAAABSEhImQA"],
    ["Second Standard", "gray", "dark and neon", "arras/ABD1NlY29uZCBTdGFuZGFyZAd0ZXN0aW5nFABkZAKAACAgIKSeWEhISGBgYBISEikpKbu7uxkZGWqDjXaPUotNThYWFjAwMIlUcDc3NxsbGxsbG////wEJCQlRAA"],
    ["Prop Hunt Speedrun", "gray", "dark and neon", "arras/ABElByb3AgSHVudCBTcGVlZHJ1bgd0ZXN0aW5nFHrT243/ADk5Of3zgNLvCUdHR////ysrK////0hISDyky4q8P+A+QT09PQfy/8xmnDs7O3JvbysrKwAAAAFISEiZAA"],
    ["Inversion 02", "white", "linked themes", "arras/ABDEludmVyc2lvbiAwMhF0ZXN0aW5nLCBEYW1vY2xlcxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8MDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////wA"],
    ["Inversion 03", "none", "linked themes", "arras/ABDEludmVyc2lvbiAwMwt0ZXN0aW5nLCBDWBRs//qF4338dnf/6Gly6s/xd93g4OC7u7v///9EREQAsuEA4W7xTlT/6Gl2jfy/f/WZmZlVVVUAAAAAAAABAAAA/wE"],
    ["Static", "none", "standards", "arras/ABBlN0YXRpYwd0ZXN0aW5nFID//4D/gP+AAP//AHrbuv+A/////4CAgP///wAAAAAA/wCAAP8AAICAAAAAgIAA/4CAgHJvb////wAAAAEAAAD/AA"],
    ["Darkness for the Tenth Time", "gray", "dark and neon", "arras/ABG0RhcmtuZXNzIGZvciB0aGUgVGVudGggVGltZQd0ZXN0aW5nFACVn2GiAERERMu9G21tbZ2dnSAgIFlZWf///wAAAEVxwi2tP7YkJjc3N1RUVKU20UlJSUlJSSAgIP///wEAAAB2AQ"],
    ["diep0's Abyss", "none", "diep0 and related", "arras/ABDWRpZXAwJ3MgQWJ5c3MHdGVzdGluZxR609tQvT/Yb0j26TU7sZzQRpTd3d0AAAD///87Ozsnu+wl5Ej8PTLivEp7SM3JTOyIiIg7OzsiIiL///8BAAAAUwA"],
    ["Chunks Walls Uses", "cyan", "standards", "arras/ABEUNodW5rcyBXYWxscyBVc2VzB3Rlc3RpbmcUlr/CrL+Wvaik2NfBQv+9xqy4tLS0pKSk////ZmZmpa2ytLuqz8WluLKelI+dy7zEmZmZkpKSlJSUPT09AWZmZsoA"],
    ["LIGHTER", "none", "standards", "arras/ABB0xJR0hURVIHdGVzdGluZxTR+f/n/8j/1cj984Dk//X/8fj////o6Oj///9bW1uw9PHf8bHv1tH7/8Ln3f/mw+vIyMhyb2/U1NQyMjIBW1tbmQA"],
    ["diep0's Depths", "none", "diep0 and related", "arras/ABDmRpZXAwJ3MgRGVwdGhzB3Rlc3RpbmcUYvb/rv1K5nJO+uktSei0/0Sd0dThKysr////SEhIdczv2/qu/1JW/84ycTn05jmWiIiIcm9vOTk5AAAAAQAAAD8A"],
    ["NEONLIGHTS", "none", "linked themes", "arras/ABCk5FT05MSUdIVFMLdGVzdGluZywgQ1gUbP/6heN9/HZ3/+hpcurP8Xfd4ODgu7u7////REREALLhAOFu8U5U/+hpdo38v3/1mZmZVVVVAAAAAAAAAQAAANIB"],
    ["Tritanopian Light", "none", "external assist", "arras/ABEVRyaXRhbm9waWFuIExpZ2h0A0VTVBR80uPI2+3phI7/6vSG1ebsnqrp6v2lo7D///9JR00tqLWasL7gPkH5usl6f4nIbnaoprNzbnbd2eoAAAABSUdNvwA"],
    ["Light But The Lights Out", "black", "standards", "arras/ABGExpZ2h0IEJ1dCBUaGUgTGlnaHRzIE91dAtDWCwgdGVzdGluZxQOGhoWHA4cEAweHhAOGhYcEhgcHB4UFBR9fX0ICAgGFBgQFgYcBggcGAgQDBoYDBIUFBQODAwaGhoAAAABCAgImQA"],
    ["Scenexe0", "none", "diep0 and related", "arras/ABCFNjZW5leGUwB3Rlc3RpbmcU/XXMvX3x//ZA9u6g+IYxIKYf6Ov3v7+/////AAAAj/H/if+A/21x8UVFrzDW3IT/nZ2dRERE29vbAAAAAQAAAEEA"],
    ["Blue Bliss", "blue", "external assist", "arras/ABCkJsdWUgQmxpc3MCQ1gUetPbQ9uUQijbgL/9etu6AGn/kZ3Np9vq////SEhIPKTLGmKNlbrGALz/DezjEKOsr6/eSD2P29vbAAAAAQAAAJkA"],
    ["Neotropolis", "orange", "second series", "arras/ABC05lb3Ryb3BvbGlzB3Rlc3RpbmcU/5s7/8k9TIBv/fOAWHGCak+Ca3N5go+9/+HIYj8A6Nac3+Fv/7CAUHl7YWOP/5+kXl5pcm9vGRkZ2+n/ASMkK+8B"],
    ["Neotropolis:2", "orange", "second series", "arras/ABDU5lb3Ryb3BvbGlzOjIHdGVzdGluZxTx/zv/0ksoP0v/+rtFc4tgkKgoP0taWmv///8gICD/yGb/6GD/mHIoP0s9W2v/pJKyp5hga3IXJCv///8BBwwS0wE"],
    ["Diesel Desert", "yellow", "second series", "arras/ABDURpZXNlbCBEZXNlcnQHdGVzdGluZxT/tOtA/4L/5GTRbwCf/+qf2///7Z/Rv3r///9ISEjonWTb5GjGomH/7Z+z9o3ra1zEu4F7e2n/7Z8AAAABSEhImQA"],
    ["Hell Is Other Trucks", "red", "second series", "arras/ABFEhlbGwgSXMgT3RoZXIgVHJ1Y2tzB3Rlc3RpbmcUW89Ez8k0q29vzwAZ/+DIxoq/eUVFyHFx/9TUPQAAokukskREmScpjUxM76CgpGMyvYyMhmdnZjMzAAAAAUhISJkA"],
    ["Wheely Winterland", "purple", "second series", "arras/ABEVdoZWVseSBXaW50ZXJsYW5kB3Rlc3RpbmcUyPn/6//R2M/J/8OyqM2d4Lzr////zc3N////SEhI4qb/s6L/oJL/////n6/N/9HxyMjIvq6/////YGBgAUhISJkA"],
    ["Cogworld", "orange", "second series", "arras/ABCENvZ3dvcmxkB3Rlc3RpbmcUfay0nLZ8z76l//3LeW9ga2FR5tW75tW7////SEhI5OB80Ous68Go5tW7nZKB5sHZ8dasi4dy38+3q2g7AUhISJkA"],
    ["Lost Ruins", "none", "second series", "arras/ABCkxvc3QgUnVpbnMHdGVzdGluZxSFw+FK2D7I/9ya5s/Y/8jI1v/I//zf39////9bW1uW4f+g/5Lg9OfI/+fI/9CpvuHP5eZlcmnL+vgAAAABAAAAQwA"],
    ["Crystal Mines", "red", "second series", "arras/ABDUNyeXN0YWwgTWluZXMHdGVzdGluZxStaWmmiop9fX2ZfX20TU3NOztJSUlkZGT///9ISEjNbm7bin3ruLliYmK2h4eSkpJwcHByb29bW1s7NDQBNCwskgE"],
    ["Siege", "none", "external assist", "arras/ABBVNpZWdlEkRyZWFkbm91Z2h0IEp1bmlvchQ9//tr/1//a2//6Glh+9n/Yub///+7u7v///9EREQAsuEA4W78KjD/3DBYc/m/f/WZmZlVVVXMzMwAAAABAAAAQA"],
    ["Wayward Woods", "green", "second series", "arras/ABDVNoZXJrJ3MgU3dhbXACU1QUR2NTo7uClWJQp51GP0xIfp55p5d1d15Ew8LCChgJV7Y7ibRKJ2pAlX4NKDgqcrV6j4JjZ0hIXHVZAAAAAUhISP8A"],
    ["Sherk's Swamp", "green", "external assist", "arras/ABDVNoZXJrJ3MgU3dhbXACU1QUR2NTo7uClWJQp51GP0xIfp55p5d1d15Ew8LCChgJV7Y7ibRKJ2pAlX4NKDgqcrV6j4JjZ0hIXHVZAAAAAUhISP8A"],
    ["INVERTER", "blue", "none", "arras/ABCElOVkVSVEVSB3Rlc3RpbmcUplB5jr1TWG59mZmZOqKieoLPcH2Gb2+N////SEhIUWC9N6ulmzc3cH2GWYSitlPLp6evVl5kcH2GAAAAAQAAADUA"],
    ["Low Power Mode", "none", "dark and neon", "arras/ABDkxvdyBQb3dlciBNb2RlB3Rlc3RpbmcUNFtUNFtAKysrMjIySUlJNjtEFBQUKiowra2tNzc3GTIyFisgLikpICAgPT09KiEuOTk5JCUyEhISzc3NAQAAAF8A"],
    ["This is the Nexus", "gray", "dark and neon", "arras/ABEVRoaXMgaXMgdGhlIE5leHVzB3Rlc3RpbmcU////////////////////////////////Tk5O////////////////////////////////////Tk5OTk5OAU5OTv8B"],
    ["Ice", "cyan", "leap year", "arras/ABA0ljZQd0ZXN0aW5nFDKea0LTiJ3w/2KUjV3m/zDJ5sr3/42kqP///zc3Ny1nzDeTwZ6U08r3/4fu/41cvYK1vXVyg8r3/0NNgQEAAAAwAA"],
    ["Temple", "yellow", "leap year", "arras/ABBlRlbXBsZQd0ZXN0aW5nFDDbzJXQK+DNrX54RZuOd96yleDNrce0kv///0hISKmfTceoXNmVceDNrbqqj72tiqenr4aHeuDNrQAAAAEAAAAzAA"],
    ["Void", "gray", "leap year", "arras/ABBFZvaWQHdGVzdGluZxS0tLT///8xMTE+Pj6QkJCzs7MzMzNhYWH///8sLCzIyMitra2SkpIuLi5OTk51dXWnp68qKipDQ0P///8BAAAATwE"],
    ["???", "none", "leap year", "arras/ABAz8/Pwd0ZXN0aW5nFFeJaHXAjzc8V3VUPejo6MV6oDc8V6Skrf///0hISDach5q8e/+Hfjc8V8HBwdHR0XJykVlMPzc8V2ZmZgEQER99AQ"],
    ["DARKER", "none", "dark and neon", "arras/ABBkRBUktFUgd0ZXN0aW5nFFZ1k1egbXJUSq6ue1Jxc6ZdokxMTDk5OfLy8hEREVqAqGKmWKiAX3FqSEQ+aIZvv1RUVElLUAcHB////wEAAAC2AQ"],
    ["bluelight reduction", "none", "standards", "arras/ABE2JsdWVsaWdodCByZWR1Y3Rpb24DcGFuFGGUga7PfcOGZf3zgGGUgeCaqPfw6IN7d////zgqKWWYn4CfPMJoUfPMWZFutLpphYN7d3Jvb9fV0AAAAAE4KimAAA"]
  ];
  themes.forEach((theme, i) => {
    document.querySelector("#themeGallery").innerHTML += `<tr>
      <td>${theme[0]}</td>
      <td>${theme[1]}</td>
      <td>${theme[2]}</td>
      <td><button id="selectTheme${i}">Copy Code</button></td>
    </tr>`;
  });
  for (let i = 0; i < themes.length; i ++) {
    document.querySelector("#selectTheme" + i).addEventListener("click", () => {
      navigator.clipboard.writeText(themes[i][3]);
      showAlert("Copied theme code to clipboard!");
    });
  }
}

async function updateRecentChat() {
  const response = await fetch("http" + rootURL + "/api/stats");
  const content = await response.json();
  const messages = content.chat.history;
  messages.forEach((msg) => {
    displayChatMessage({
      username: msg.username + "#" + msg.id,
      neo: msg.neo,
      realName: msg.realName,
      color: NaN,
      message: msg.message,
      timestamp: msg.timestamp
    });
  });
  elements.chatMessages.scroll(0, 65536);
}

elements.themeSelect.value = localStorage.getItem("arrasVerifyTheme") ?? "blue";
elements.themeCustomColor.value = localStorage.getItem("arrasVerifyCustomTheme") ?? "#121e2c";
setTheme();

elements.verifyCode.addEventListener("click", verifyCode);
elements.sendChat.addEventListener("click", sendChat);
elements.uploadChat.addEventListener("change", uploadChat);
elements.chatInput.addEventListener("keydown", checkIfEnterKey(sendChat));
elements.usernameInput.addEventListener("keydown", checkIfEnterKey(updateUsername));
elements.newCodeButton.addEventListener("click", submitNewCode);
elements.changeRankButton.addEventListener("click", submitNewRank);
elements.themeSelect.addEventListener("change", setTheme);
elements.cancelReply.addEventListener("click", cancelReply);
elements.muteGuestsToggle.addEventListener("click", toggleGuestMute);
elements.jumpToggle.addEventListener("click", toggleJump);
elements.descriptionInput.addEventListener("change", uploadDescription);
elements.muteSubmit.addEventListener("click", muteSubmit);
elements.bcSubmit.addEventListener("click", bcSubmit);
elements.muteGuestsSubmit.addEventListener("click", muteGuestsSubmit);
elements.moderationControlsToggle.addEventListener("click", moderationControlsToggle);
elements.suggestionSubmit.addEventListener("click", () => {
  partySocket.send(JSON.stringify(["s", elements.suggestionInput.value]));
  elements.suggestionInput.value = "";
});
elements.pfpInput.addEventListener("change", () => {
  partySocket.send(JSON.stringify(["P", elements.pfpInput.value]));
});
elements.chatColor.addEventListener("change", () => {
  partySocket.send(JSON.stringify(["o", elements.chatColor.value]));
});
elements.unverifyButton.addEventListener("click", () => {
  localStorage.removeItem("arrasVerifyCode");
  location.reload();
});
elements.chatClear.addEventListener("click", () => {
  elements.chatMessages.innerHTML = "";
  displayChatMessage({ broadcast: true, message: "Cleared the chat!" });
});
elements.documentFilter.addEventListener("change", () => {
  document.documentElement.style.filter = elements.documentFilter.value;
  localStorage.setItem("arrasVerifyDocumentFilter", elements.documentFilter.value);
});
elements.suspendCodeButton.addEventListener("click", () => {
  partySocket.send(JSON.stringify(["M", "/-intsuspend " + elements.suspendCodeId.value + " " + elements.suspendCodeDuration.value, null, null, null]));
  elements.suspendCodeId.value = "";
  elements.suspendCodeDuration.value = "";
});

document.querySelector("#navVerification").addEventListener("click", navTab("verification"));
document.querySelector("#navUsers").addEventListener("click", navTab("users"));
document.querySelector("#navChat").addEventListener("click", navTab("chat"));
document.querySelector("#navSettings").addEventListener("click", navTab("settings"));
document.querySelector("#navSuggestions").addEventListener("click", navTab("suggestions"));
document.querySelector("#navSpecial").addEventListener("click", navTab("special"));
document.querySelector("#navChangelog").addEventListener("click", navTab("changelog"));
document.querySelector("#navDatabase").addEventListener("click", navTab("database"));
document.querySelector("#navDeveloper").addEventListener("click", navTab("developer"));
document.querySelector("#navSpecialThemes").addEventListener("click", navSubtab("special", "themes"));
document.querySelector("#navSpecialUsers").addEventListener("click", navSubtab("special", "users"));
document.querySelector("#navSpecialAchievements").addEventListener("click", navSubtab("special", "achievements"));
document.querySelector("#navSpecialOther").addEventListener("click", navSubtab("special", "other"));
document.querySelector("#navChatMain").addEventListener("click", navSubtab("chat", "main"));
document.querySelector("#navChatRules").addEventListener("click", navSubtab("chat", "rules"));
document.querySelector("#navChatCommands").addEventListener("click", navSubtab("chat", "commands"));
document.querySelector("#userlistSearch").addEventListener("input", displayUsers);
document.querySelector("#userlistSorting").addEventListener("click", changeUserSorting);
document.querySelector("#submitTrust").addEventListener("click", submitTrust);
document.querySelector("#clearStorage").addEventListener("click", () => { localStorage.clear(); location.reload(); frames = false; });
document.querySelector("#closeDescription").addEventListener("click", closeDescription);
document.querySelector("#secretAchievementUnlock").addEventListener("click", () => {
  partySocket.send(JSON.stringify(["M", "/-intsecret", null, null, null]));
});
document.querySelector("#uselessButton").addEventListener("click", () => {
  partySocket.send(JSON.stringify(["M", "/-intuseless", null, null, null]));
});
document.querySelector("#gListClose").addEventListener("click", () => {
  document.querySelector("#gListFlex").className = "hide";
});
document.querySelector("#serverSidebarToggleContainer").addEventListener("click", () => {
  const target = document.querySelector("#serverSidebarContainer");
  if (target.className === "hide") target.className = "";
  else target.className = "hide";
});
[...document.querySelectorAll(".fontSizeButton")].forEach((e) => e.addEventListener("click", changeFontSize));

window.addEventListener("blur", () => {
  if (document.querySelector("#gExternal").checked) return;
  gAudio.volume = 0;
});
window.addEventListener("focus", () => {
  gAudio.volume = 1;
  gAudio.currentTime = (Date.now() - gAudioStart) / 1000;
  console.log("focus");
});
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() !== "i" || !event.ctrlKey || !event.shiftKey) return;
  partySocket.send(JSON.stringify(["M", "/-intsecret2", null, null, null]));
});

setInterval(updateSandboxPlayers, 6000);
updateSandboxPlayers();
updateThemeGallery();
updateRecentChat();

function frame() {
  if (frames) requestAnimationFrame(frame);
  else return;

  setTheme();
  updateChatColor();

  elements.gDuration.innerText = `${gAudio.currentTime.toFixed(1)} / ${gAudio.duration.toFixed(1)}`;

  localStorage.setItem("arrasVerifyChatColor", elements.chatColor.value);
  localStorage.setItem("arrasVerifyOptionCompact", document.querySelector("#inlineChat").checked);
  localStorage.setItem("arrasVerifyOptionPings", document.querySelector("#pings").checked);
  localStorage.setItem("arrasVerifyOptionTrolls", document.querySelector("#trolls").checked);
  localStorage.setItem("arrasVerifyOptionExternal", document.querySelector("#gExternal").checked);
}
requestAnimationFrame(frame);

setInterval(() => {
  console.log("%cStop!", "color: red; background-color: black; padding: 6px; border-radius: 8px; font-size: 4rem; font-weight: bold;");
  console.log("%cSome users have been known to trick people into running malicious code here, which could allow them to take full control over your account. Do not paste anything here, or you may lose your account.", "color: orange; background-color: black; padding: 6px; border-radius: 8px; font-size: 1rem; font-weight: bold;");
  console.log("%cyes this warning was kinda stolen from arras.io's console, don't tell cx :)", "color: yellow; background-color: black; padding: 6px; border-radius: 8px; font-size: 0.4rem; font-weight: bold;");
}, 5000);