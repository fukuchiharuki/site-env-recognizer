// import { defaultOptions, getOptions, setOptions } from './storage.js'

document.addEventListener('DOMContentLoaded', onLoad, false);

function onLoad() {
    getOptions((options) => {
        reflectOptions(options);
        registerEvents(defaultOptions);
    })
}

function reflectOptions(options) {
    document.querySelectorAll(".slot").forEach((element, index) => {
        const colorCodeInput = element.querySelector(".color-code input");
        colorCodeInput.value = options[index].color;
        const colorSample = element.querySelector(".color-sample");
        colorSample.style.backgroundColor = options[index].color;
        const titleInput = element.querySelector(".title input");
        titleInput.value = options[index].title;
        const listTextarea = element.querySelector(".list textarea");
        listTextarea.value = options[index].list;
    });
}

function registerEvents(defaultOptions) {
    registerSaveEvents();
    registerResetColorsEvents(defaultOptions);
}

function registerSaveEvents() {
    const saveButton = document.querySelector("#save");
    saveButton.addEventListener('click', () => {
        const options = [...document.querySelectorAll(".slot")].map((element) => ({
            color: element.querySelector(".color-code input").value,
            title: element.querySelector(".title input").value,
            list: element.querySelector(".list textarea").value,
        }));
        saveOptions(options);
    });
}

function registerResetColorsEvents(defaultOptions) {
    const resetColorsLink = document.querySelector("#reset-colors");
    resetColorsLink.addEventListener('click', () => {
        const options = [...document.querySelectorAll(".slot")].map((element, index) => ({
            color: defaultOptions[index].color,
            title: element.querySelector(".title input").value,
            list: element.querySelector(".list textarea").value,
        }));
        reflectOptions(options);
    });
}

function saveOptions(options) {
    setOptions(options);
    const message = document.querySelector("#message");
    message.innerHTML = "Saved successfully.";
    setTimeout(() => {
        message.innerHTML = "Don't forget to save it.";
    }, 1500);
}
