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