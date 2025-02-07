import { menuButton } from "./utils.mjs";
import { getData, getImage } from "./PlayerData.mjs";
import { displaySinglePlayer, displayMultiplePlayers, displayYear } from "./Display.mjs";

menuButton();

const inputElement = document.querySelector(".input-text");

const searchButton = document.getElementById("search");
searchButton.addEventListener("click", () => {
    const displaySection = document.querySelector(".display");
    if (displaySection.classList[1] !== "server" && inputElement.willValidate) {
        displaySinglePlayer(displaySection, inputElement.value);
    } else {
        displayMultiplePlayers(displaySection);
    }
});

displayYear();