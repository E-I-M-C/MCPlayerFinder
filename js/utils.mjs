export function menuButton() {
    const hamButton = document.querySelector(".menu");
    const navigation = document.querySelector(".navigation");

    hamButton.addEventListener("touchend", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });
}

export function base64toJson(base64text) {
    const decoded = atob(base64text);
    return JSON.parse(decoded);
}