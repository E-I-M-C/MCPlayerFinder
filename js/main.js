import { menuButton, getParams, setParams } from "./utils.mjs";
import { displaySinglePlayer, displayMultiplePlayers, displayPlayerList, displayYear } from "./Display.mjs";

menuButton();
displayYear();

const listButton = document.getElementById("list-button");
const listElement = document.getElementById("player-list");
const inputElement = document.querySelector(".input-text");
const searchButton = document.getElementById("search");
const displaySection = document.querySelector(".display");
const paramName = getParams("name");
const paramAddress = getParams("address");

if (listButton) {
    displayPlayerList();
    // Toggle of visability of the saved player list if clicked off
    window.onclick = (ev) => {
        if (!ev.target.matches("#player-list") && listElement.classList[0] !== "closed") {
            listElement.classList.add("closed");
        }
    }
}

if (paramName !== null && displaySection.className !== "display server") {
    inputElement.value = paramName;
    searchButton.click();
} else if (paramName !== null && displaySection.className === "display server") {
    inputElement.value = paramAddress;
    searchButton.click();
}
// Toggle the visability of the saved player list
if (listButton) listButton.addEventListener("click", (ev) => {
    ev.stopImmediatePropagation();
    if (listElement.classList[0] === "closed") {
        listElement.classList.remove("closed");
    } else {
        listElement.classList.add("closed");
    }
});
// Button to search for specified name
searchButton.addEventListener("click", displayValidated);
// Allow the user to press enter instead of pressing the search button
inputElement.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter" || ev.keyCode === 13) displayValidated();
});
inputElement.addEventListener("keydown", (ev) => {
    if (ev.key === "Space" || ev.keyCode === 32) ev.preventDefault();
});
function displayValidated() {
    const playerValidate = displaySection.className !== "display server" && inputElement.validity.valid;
    const serverValidate = displaySection.className === "display server" && inputElement.validity.valid;
    if (playerValidate) {
        setParams("name", inputElement.value);
        displaySinglePlayer(displaySection, inputElement.value);
    } else if (serverValidate) {
        setParams("address", inputElement.value);
        displayMultiplePlayers(displaySection, inputElement.value);
    }
}