// import { defaultOptions, getOptions, setOptions } from './storage.js'

window.addEventListener("load", onLoad, false);

function onLoad() {
  getOptions((options) => {
    const url = window.location.href;
    const props = findProps(options, url);
    const sticky = appendSticky(props);
    keepItLowKeyOnMouseMoving(sticky);
  });
}

function findProps(options, url) {
  return options.filter(
    (option) =>
      option.list.split("\n").filter((item) => item && url.startsWith(item))
        .length,
  )[0];
}

function appendSticky(props) {
  const sticky = document.createElement("div");
  sticky.innerHTML = props.title;
  sticky.classList.add("site-env-recognizer-sticky");
  sticky.style.backgroundColor = props.color;
  document.querySelector("body").appendChild(sticky);
  return sticky;
}

function keepItLowKeyOnMouseMoving(sticky) {
  document.addEventListener("mousemove", () => {
    sticky.classList.add("site-env-recognizer-sticky--low-key");

    clearTimeout(sticky._timeout);
    sticky._timeout = setTimeout(() => {
      sticky.classList.remove("site-env-recognizer-sticky--low-key");
    }, 250);
  });
}
