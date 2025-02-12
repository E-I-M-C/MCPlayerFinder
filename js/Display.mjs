import { getData, getImage } from "./PlayerData.mjs";

// Create HTML code from obtained player data
async function playerInfoTemplate(data) {
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
    // Return HTML code
    return `<div>
        <h2>${username}</h2>
        <img src="${blob2URL(playerSkinBlob, "skin")}" alt="Player's skin" width="120" height="270">
        <button id="skin">Download Skin</button>
        <h3>Cape: ${capeText}</h3>
        <img src="${blob2URL(playerCapeBlob, "cape")}" alt="Player's cape" width="113" height="180">
        <button id="cape">Download Cape</button>
        <p><b>UUID:</b> <span id="uuid">${id}</span></p>
        <button id="save">Save Player</button>
    </div>`
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
        parentElement.innerHTML = await playerInfoTemplate(playerData.data);
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
        let elements = [];
        let count = 0;
        const waitPlayers = new Promise((resolve) => {
            count = 0;
            serverData.players.list.forEach(async (player) => {
                // Filters out Bedrock players (Have an "*" in the obtained name)
                if (!player.name.includes("*")) {
                    const playerData = await getData("https://playerdb.co/api/player/minecraft/", player.name);
                    elements.push(await playerInfoTemplate(playerData.data));
                }
                count++;
                // Resovle promise once each player has been iterated
                if (serverData.players.list.length === count) {
                    resolve();
                }
            });
        });
        waitPlayers.then(() => {
            parentElement.innerHTML = elements.join("");
        });
    } else {
        console.log("Cannot retrieve players from server");
    }
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