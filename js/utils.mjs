// Add menu functionality to the ☰ button
export function menuButton() {
    const hamButton = document.querySelector(".menu");
    const navigation = document.querySelector(".navigation");
    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });
}

// Retrieve data from localstorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
  
// Save data to local storage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get parameters "?parameter=value" from url and return "value"
export function getParams(param) {
    const queryUrlString = window.location.search;
    const urlParams = new URLSearchParams(queryUrlString);
    return urlParams.get(param);
}

export function setParams(param, value) {
    const queryUrlString = window.location;
    const newUrlString = `${queryUrlString.origin+queryUrlString.pathname}?${param}=${value}`;
    window.history.pushState({}, null, newUrlString);
}

export function removeParams() {
    window.history.back();
}

export function alertMessage(message) {
    const alert = document.createElement("p");
    alert.className = "alert";
    alert.innerHTML = `${message}<span>✖</span>`;
    alert.addEventListener("click", (ev) => {
        if (ev.target.tagName === 'SPAN') displaySection.removeChild(alert);
    });
    const displaySection = document.querySelector(".display");
    displaySection.prepend(alert);
}

export function removeAllAlerts() {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => document.querySelector(".display").removeChild(alert));
}