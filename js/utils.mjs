export function menuButton() {
    const hamButton = document.querySelector(".menu");
    const navigation = document.querySelector(".navigation");

    hamButton.addEventListener("touchend", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });
}