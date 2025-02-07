import { getData, getImage } from "./PlayerData.mjs";
import { base64toJson } from "./utils.mjs";

async function playerInfoTemplate(data) {
    const { username, id } = data.player;
    const playerImageURL = "https://crafatar.com/renders/body/";
    const playerImageParams = "?overlay";
    const playerCapeURL = "https://crafthead.net/cape/";
    let playerSkinBlob = null;
    let playerCapeBlob = null;
    try {
        playerSkinBlob = await getImage(playerImageURL, id, playerImageParams);
    } catch (err) {
        playerSkinBlob = null;
    }
    try {
        playerCapeBlob = await getImage(playerCapeURL, username);
    } catch (err) {}

    let capeText = "None";
    if (playerCapeBlob !== null) {
        capeText = await capeBlob2Name(playerCapeBlob);
    }

    return `<div>
        <h2>${username}</h2>
        <img src="${blob2URL(playerSkinBlob, "skin")}" alt="Player's skin">
        <button id="skin">Download Skin</button>
        <h3>Cape: ${capeText}</h3>
        <img src="${blob2URL(playerCapeBlob, "cape")}" alt="Player's cape">
        <button id="cape">Download Cape</button>
        <p><b>UUID:</b> <span id="uuid">${id}</span></p>
        <button id="save">Save Player</button>
    </div>`
}

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
    } else {
        return "None";
    }
}

function blob2URL(blob, type) {
    if (blob !== null) {
        return window.URL.createObjectURL(blob);
    } else if (type === "skin") {
        return "./images/no_skin.png";
    } else if (type === "cape") {
        return "./images/no_cape.png";
    }
}

export async function displaySinglePlayer(parentElement, name) {
    const playerData = await getData("https://playerdb.co/api/player/minecraft/", name);
    if (playerData.code === "player.found") {
        parentElement.innerHTML = await playerInfoTemplate(playerData.data);
    } else {
        console.log("Username not found");
    }
}

export function displayMultiplePlayers(parentElement) {
    parentElement.innerHTML = playerInfoTemplate();
}

export function displayYear() {
    const currentYear = document.getElementById("currentyear");
    const year = new Date().getFullYear();
    if (year.toString() === "2025") {
        currentYear.innerHTML = year;
    } else {
        currentYear.innerHTML = `2025-${year}`;
    }
}