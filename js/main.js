import { menuButton } from "./utils.mjs";
import { getData, getImage } from "./PlayerData.mjs";
import { displaySinglePlayer, displayMultiplePlayers, displayYear } from "./Display.mjs";

menuButton();

const playerNameInput = document.getElementById("player-name");

const searchButton = document.getElementById("search");
searchButton.addEventListener("click", () => {
    const displaySection = document.querySelector(".display");
    if (displaySection.classList[1] !== "server" && playerNameInput.willValidate) {
        displaySinglePlayer(displaySection, playerNameInput.value);
    }

    const displayServerSection = document.querySelector(".display.server");
    if (displayServerSection !== null) {
        displayMultiplePlayers(displaySection);
    }
});

displayYear();