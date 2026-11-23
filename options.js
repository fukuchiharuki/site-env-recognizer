// import { defaultOptions, getOptions, setOptions } from './storage.js'

document.addEventListener("DOMContentLoaded", onLoad, false);

let savedOptionsSnapshot;
let savedDisplaySettingsSnapshot;

function onLoad() {
  getOptions((options) => {
    getDisplaySettings((displaySettings) => {
      savedOptionsSnapshot = serializeOptions(options);
      savedDisplaySettingsSnapshot = serializeDisplaySettings(displaySettings);
      renderDisplaySettings(displaySettings);
      renderOptions(options);
      registerEvents(defaultOptions, defaultDisplaySettings);
      updateSaveState();
    });
  });
}

function renderDisplaySettings(displaySettings) {
  document.querySelector('[name="sticky"]').checked = displaySettings.sticky;
  document.querySelector('[name="border"]').checked = displaySettings.border;
}

function renderOptions(options) {
  const settings = document.querySelector("#settings");
  settings.replaceChildren(...options.map(createEnvironmentCard));
  updateCardMetadata();
}

function createEnvironmentCard(option) {
  const template = document.querySelector("#environment-template");
  const card = template.content.firstElementChild.cloneNode(true);

  card.querySelector('[name="color"]').value = option.color;
  card.querySelector('[name="title"]').value = option.title;
  card.querySelector('[name="list"]').value = option.list;

  updateColorSample(card);
  updateCardName(card);
  return card;
}

function registerEvents(defaultOptions, defaultDisplaySettings) {
  const settings = document.querySelector("#settings");

  document
    .querySelector("#display-settings")
    .addEventListener("change", updateSaveState);

  settings.addEventListener("input", (event) => {
    const card = event.target.closest(".slot");
    if (!card) {
      return;
    }

    if (event.target.name === "color") {
      updateColorSample(card);
    }
    if (event.target.name === "title") {
      updateCardName(card);
    }
    updateSaveState();
  });

  settings.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    updateCardOrder(button.closest(".slot"), button.dataset.action);
  });

  document.querySelector("#add-environment").addEventListener("click", () => {
    addEnvironment(defaultOptions);
  });
  document.querySelector("#reset-defaults").addEventListener("click", () => {
    resetSettings(defaultOptions, defaultDisplaySettings);
  });
  document
    .querySelector("#save")
    .addEventListener("click", saveCurrentSettings);
}

function addEnvironment(defaultOptions) {
  const settings = document.querySelector("#settings");
  const index = settings.children.length;
  const defaultColor = defaultOptions[index % defaultOptions.length].color;
  const card = createEnvironmentCard({
    color: defaultColor,
    title: "",
    list: "",
  });

  settings.appendChild(card);
  updateCardMetadata();
  updateSaveState();
  card.querySelector('[name="title"]').focus();
}

function updateCardOrder(card, action) {
  const settings = document.querySelector("#settings");

  if (action === "move-up" && card.previousElementSibling) {
    settings.insertBefore(card, card.previousElementSibling);
  } else if (action === "move-down" && card.nextElementSibling) {
    settings.insertBefore(card.nextElementSibling, card);
  } else if (action === "delete") {
    card.remove();
  } else {
    return;
  }

  updateCardMetadata();
  updateSaveState();
}

function updateCardMetadata() {
  const cards = [...document.querySelectorAll(".slot")];

  cards.forEach((card, index) => {
    const position = index + 1;
    const upButton = card.querySelector('[data-action="move-up"]');
    const downButton = card.querySelector('[data-action="move-down"]');

    card.querySelector(".slot__number").textContent = position;
    upButton.disabled = index === 0;
    downButton.disabled = index === cards.length - 1;
    upButton.setAttribute("aria-label", `Move environment ${position} up`);
    downButton.setAttribute("aria-label", `Move environment ${position} down`);
    card
      .querySelector('[data-action="delete"]')
      .setAttribute("aria-label", `Delete environment ${position}`);
  });

  document.querySelector("#empty-state").hidden = cards.length !== 0;
}

function updateCardName(card) {
  const title = card.querySelector('[name="title"]').value.trim();
  card.querySelector(".slot__name").textContent =
    title || "Untitled environment";
}

function updateColorSample(card) {
  const color = card.querySelector('[name="color"]').value;
  const sample = card.querySelector(".color-sample");
  const isValid = CSS.supports("color", color);

  sample.style.backgroundColor = isValid ? color : "transparent";
  sample.classList.toggle("color-sample--invalid", !isValid);
}

function resetSettings(defaultOptions, defaultDisplaySettings) {
  renderDisplaySettings(defaultDisplaySettings);
  renderOptions(defaultOptions);
  updateSaveState();
}

function readDisplaySettings() {
  return {
    sticky: document.querySelector('[name="sticky"]').checked,
    border: document.querySelector('[name="border"]').checked,
  };
}

function readOptions() {
  return [...document.querySelectorAll(".slot")].map((card) => ({
    color: card.querySelector('[name="color"]').value,
    title: card.querySelector('[name="title"]').value,
    list: card.querySelector('[name="list"]').value,
  }));
}

function saveCurrentSettings() {
  const options = readOptions();
  const displaySettings = readDisplaySettings();

  setOptions(options);
  setDisplaySettings(displaySettings);
  savedOptionsSnapshot = serializeOptions(options);
  savedDisplaySettingsSnapshot = serializeDisplaySettings(displaySettings);
  updateSaveState();
}

function updateSaveState() {
  const hasUnsavedOptions =
    serializeOptions(readOptions()) !== savedOptionsSnapshot;
  const hasUnsavedDisplaySettings =
    serializeDisplaySettings(readDisplaySettings()) !==
    savedDisplaySettingsSnapshot;
  const isUnsaved = hasUnsavedOptions || hasUnsavedDisplaySettings;

  setSaveStatus(isUnsaved ? "Unsaved changes" : "All changes saved", isUnsaved);
}

function serializeDisplaySettings(displaySettings) {
  return JSON.stringify([
    Boolean(displaySettings.sticky),
    Boolean(displaySettings.border),
  ]);
}

function serializeOptions(options) {
  return JSON.stringify(
    options.map((option) => [
      normalizeOptionValue(option.color),
      normalizeOptionValue(option.title),
      normalizeOptionValue(option.list),
    ]),
  );
}

function normalizeOptionValue(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n");
}

function setSaveStatus(message, isUnsaved) {
  document.querySelector("#message").textContent = message;
  document.querySelector("#save").disabled = !isUnsaved;
  document
    .querySelector(".save-status")
    .classList.toggle("save-status--unsaved", isUnsaved);
}
