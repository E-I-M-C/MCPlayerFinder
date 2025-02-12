import { menuButton, getParams } from "./utils.mjs";
import { displaySinglePlayer, displayMultiplePlayers, displayYear } from "./Display.mjs";

menuButton();
displayYear();

const inputElement = document.querySelector(".input-text");
const searchButton = document.getElementById("search");
const displaySection = document.querySelector(".display");
const playerValidate = displaySection.className !== "display server" && inputElement.willValidate;
const serverValidate = displaySection.className === "display server" && inputElement.willValidate;
const paramName = getParams("name");
const paramAddress = getParams("address");

if (paramName !== null && playerValidate) {
    inputElement.value = paramName;
    displaySinglePlayer(displaySection, inputElement.value);
} else if (paramAddress !== null && serverValidate) {
    inputElement.value = paramAddress;
    displayMultiplePlayers(displaySection, inputElement.value);
}

inputElement.addEventListener("keyup", (ev) => {
    if (ev.key === 'Enter' || ev.keyCode === 13) {
        if (playerValidate) {
            displaySinglePlayer(displaySection, inputElement.value);
        } else if (serverValidate) {
            displayMultiplePlayers(displaySection, inputElement.value);
        }
    }
});
searchButton.addEventListener("click", () => {
    if (playerValidate) {
        displaySinglePlayer(displaySection, inputElement.value);
    } else if (serverValidate) {
        displayMultiplePlayers(displaySection, inputElement.value);
    }
});