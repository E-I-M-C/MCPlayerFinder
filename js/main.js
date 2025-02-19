import { menuButton, getParams, setParams, alertMessage, removeAllAlerts } from "./utils.mjs";
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
// Test to see if there's a list button
if (listButton) {
    displayPlayerList();
    // Toggle of visability of the saved player list if clicked off
    window.onclick = (ev) => {
        if (!ev.target.matches("#player-list")) {
            listElement.classList.remove("open");
        }
    }
}
// Toggle the visability of the saved player list
if (listButton) listButton.addEventListener("click", (ev) => {
    ev.stopImmediatePropagation();
    listElement.classList.toggle("open");
    
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
// If the input is valid run the corresponding display function
function displayValidated() {
    const playerValidate = displaySection.className !== "display server" && inputElement.validity.valid;
    const serverValidate = displaySection.className === "display server" && inputElement.validity.valid;
    if (playerValidate) {
        setParams("name", inputElement.value);
        displaySinglePlayer(displaySection, inputElement.value);
    } else if (serverValidate) {
        setParams("address", inputElement.value);
        displayMultiplePlayers(displaySection, inputElement.value);
    } else if (displaySection.className !== "display server" && inputElement.value.length < 3) {
        removeAllAlerts();
        alertMessage("Username must contain at least 3 characters");
    } else if (displaySection.className !== "display server") {
        removeAllAlerts();
        alertMessage("Username has invalid character(s)");
    } else if (displaySection.className === "display server" && inputElement.value.length < 5) {
        removeAllAlerts();
        alertMessage("Server address must contain at least 5 characters");
    } else if (displaySection.className === "display server") {
        removeAllAlerts();
        alertMessage("Server address has invalid character(s)");
    }
}
// If URL parameters are set fill the text input and click the search button
if (paramName !== null && displaySection.className !== "display server") {
    inputElement.value = paramName;
    searchButton.click();
} else if (paramAddress !== null && displaySection.className === "display server") {
    inputElement.value = paramAddress;
    searchButton.click();
}