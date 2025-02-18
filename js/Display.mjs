import { getData, getImage } from "./PlayerData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

// Create HTML code from obtained player data
async function playerInfoTemplate(data) {
    const div = document.createElement("div");
    const { username, id } = data.player;
    const playerImageURL = "https://crafatar.com/renders/body/";
    const playerImageParams = "?overlay";
    const playerCapeURL = "https://crafthead.net/cape/";
    let playerSkinBlob = null;
    let playerCapeBlob = null;
    // Try to get player's skin
    try {
        playerSkinBlob = await getImage(playerImageURL, id, playerImageParams);
    } catch (err) {
        playerSkinBlob = null;
    }
    // Try to get player's cape
    try {
        playerCapeBlob = await getImage(playerCapeURL, username);
    } catch (err) {}
    let capeText = "None";
    // Call capeBlob2Name funtion to set "capeText" value
    if (playerCapeBlob !== null) {
        capeText = await capeBlob2Name(playerCapeBlob);
    }
    div.innerHTML = `<h2>${username}</h2>
        <img src="${blob2URL(playerSkinBlob, "skin")}" alt="Player's skin" width="120" height="270">
        <button class="skin">Download Skin</button>
        <h3>Cape: ${capeText}</h3>
        <img src="${blob2URL(playerCapeBlob, "cape")}" alt="Player's cape" width="113" height="180">
        <button class="cape">Download Cape</button>
        <p><b>UUID:</b> <span class="uuid">${id}</span></p>
        <button class="save">Save Player</button>`;
    addEventListeners2Elements(div, username, id);
    // Return HTML code
    return div;
}

// Return corresponding string from blob
async function capeBlob2Name(blob) {
    const data = new DataView(await blob.arrayBuffer());
    const firstByte = data.getUint8(256);
    const secondByte = data.getUint8(512);
    const thirdByte = data.getUint8(768);
    if (firstByte === 234 && secondByte === 213 && thirdByte === 255) {
        return "Mojang Studios";
    } else if (firstByte === 25 && secondByte === 213 && thirdByte === 51) {
        return "MineCon 2011";
    } else if (firstByte === 255 && secondByte === 234 && thirdByte === 0) {
        return "MineCon 2012";
    } else if (firstByte === 87 && secondByte === 0 && thirdByte === 244) {
        return "MineCon 2016";
    } else if (firstByte === 80 && secondByte === 239 && thirdByte === 85) {
        return "Migrator";
    } else if (firstByte === 111 && secondByte === 229 && thirdByte === 255) {
        return "Cherry Blossom";
    } else if (firstByte === 160 && secondByte === 0 && thirdByte === 102) {
        return "15th Anniversary";
    } else {
        return "None";
    }
}

// Takes a blob and returns it as an URL
function blob2URL(blob, type) {
    if (blob !== null) {
        return window.URL.createObjectURL(blob);
    } else if (type === "skin") {
        return "./images/no_skin.png";
    } else if (type === "cape") {
        return "./images/no_cape.png";
    }
}

// Adds player info on page
export async function displaySinglePlayer(parentElement, name) {
    const playerData = await getData("https://playerdb.co/api/player/minecraft/", name);
    if (playerData.code === "player.found") {
        parentElement.innerHTML = "";
        parentElement.appendChild(await playerInfoTemplate(playerData.data));
    } else {
        console.log("Username not found");
    }
}

// Adds mutiple players' info on page
export async function displayMultiplePlayers(parentElement, value) {
    const serverData = await getData("https://api.mcsrvstat.us/3/", value);
    // Test to see if names were obtained
    if (serverData.debug.query) {
        parentElement.innerHTML = "";
        serverData.players.list.forEach(async (player) => {
            // Filters out Bedrock players (Have an "*" in the obtained name)
            if (!player.name.includes("*")) {
                const playerData = await getData("https://playerdb.co/api/player/minecraft/", player.name);
                parentElement.appendChild(await playerInfoTemplate(playerData.data));
            }
        });
    } else {
        console.log("Cannot retrieve players from server");
    }
}

function addEventListeners2Elements(parentElement, playerName, uuid) {
    const skinDownload = parentElement.querySelector(".skin");
    const capeDownload = parentElement.querySelector(".cape");
    const savePlayer = parentElement.querySelector(".save");
    skinDownload.addEventListener("click", async (ev) => {
        ev.stopImmediatePropagation();
        const skinURL = window.URL.createObjectURL(await getImage("https://crafatar.com/skins/", uuid));
        addHiddenLink(skinDownload, skinURL, `${playerName}.png`);
    });
    capeDownload.addEventListener("click", async (ev) => {
        ev.stopImmediatePropagation();
        const capeURL = window.URL.createObjectURL(await getImage("https://crafatar.com/capes/", uuid));
        addHiddenLink(capeDownload, capeURL, "cape.png");
    });
    savePlayer.addEventListener("click", (ev) => {
        ev.stopImmediatePropagation();
        const players = getLocalStorage("players") || [];
        let playerExists = false;
        if (players.length > 0) players.forEach((player) => {
            if (player.name === playerName) playerExists = true;
        });

        if (!playerExists) {
            players.push({
                name: playerName,
                previewSite: `https://crafatar.com/avatars/${uuid}?overlay&size=64`
            });
            setLocalStorage("players", players);
            savePlayer.textContent = "Player Saved";
            if (document.getElementById("list-button")) {
                displayPlayerList();
            }
            setTimeout(() => {savePlayer.textContent = "Save Player";}, 1000);
        } else {
            savePlayer.textContent = "Player Already Saved";
            setTimeout(() => {savePlayer.textContent = "Save Player";}, 1000);
        }
    });
}

function addHiddenLink(parentElement, url, downloadText) {
    const a = document.createElement("a");
    parentElement.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = downloadText;
    a.addEventListener("click", () => {ev.stopImmediatePropagation()});
    a.click();
    window.URL.revokeObjectURL(url);
}

export function displayPlayerList() {
    const parentElement = document.getElementById("player-list");
    parentElement.innerHTML = "";
    const playerList = getLocalStorage("players") || [];
    if (playerList.length > 0) {
        parentElement.innerHTML = "";
        playerList.forEach((player) => {
            const li = document.createElement("li");
            li.innerHTML = `<img src="${player.previewSite}" alt="${player.name}" width="32" hight="32"><span>${player.name}</span><span class="remove-player">✖</span>`;
            parentElement.appendChild(li);
            li.addEventListener("click", () => {
                document.querySelector(".input-text").value = li.querySelector("span").textContent;
                document.getElementById("search").click();
            });
            addRemoveEventListener(li);
        });
    } else {
        parentElement.innerHTML = "<li>No saved players found</li>";
    }
}

function addRemoveEventListener(parentElement) {
    parentElement.querySelector(".remove-player").addEventListener("click", (ev) => {
        ev.stopImmediatePropagation();
        const playerList = getLocalStorage("players") || [];
        const playerName = parentElement.querySelector("span").textContent;
        let newPlayerList = playerList.filter((player) => player.name !== playerName);
        setLocalStorage("players", newPlayerList);
        displayPlayerList();
    });
}

// Adds the copyright year to the page
export function displayYear() {
    const currentYear = document.getElementById("currentyear");
    const year = new Date().getFullYear();
    if (year.toString() === "2025") {
        currentYear.innerHTML = year;
    } else {
        currentYear.innerHTML = `2025-${year}`;
    }
}