import { getData, getImage } from "./PlayerData.mjs";

async function playerInfoTemplate(data) {
    const { username, id } = data.player;
    const playerImageURL = "https://crafatar.com/renders/body/";
    const playerImageParams = "?overlay";
    const playerCapeURL = "https://crafthead.net/cape/"
    const playerCapeBlob = await getImage(playerCapeURL, username);
    let cape = null;
    if (playerCapeBlob !== null) {
        cape = window.URL.createObjectURL(playerCapeBlob);
    } else {
        cape = "";
    }
    return `<div>
        <h2>${username}</h2>
        <img src="${window.URL.createObjectURL(await getImage(playerImageURL, id, playerImageParams))}" alt="Player's skin">
        <button id="skin">Download Skin</button>
        <h3>Cape: None</h3>
        <img src="${cape}" alt="Player's cape">
        <button id="cape">Download Cape</button>
        <p><b>UUID:</b> <span id="uuid">${id}</span></p>
        <button id="save">Save Player</button>
    </div>`
    //00000000-0000-0000-0000-000000000000
}

export async function displaySinglePlayer(parentElement, name) {
    const playerData = await getData("https://playerdb.co/api/player/minecraft/", name);
    parentElement.innerHTML = await playerInfoTemplate(playerData.data);
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