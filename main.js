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
        .length
  )[0];
}

function appendSticky(props) {
  const sticky = document.createElement("div");
  sticky.innerHTML = props.title;
  sticky.style.color = "white";
  sticky.style.backgroundColor = props.color;
  sticky.style.position = "fixed";
  sticky.style.width = "100vw";
  sticky.style.top = 0;
  sticky.style.left = 0;
  sticky.style.zIndex = 2147483647;
  sticky.style.textAlign = "center";
  sticky.style.padding = "8px";
  sticky.style.opacity = 0.8;
  sticky.style.pointerEvents = "none";
  document.querySelector("body").appendChild(sticky);
  return sticky;
}

function keepItLowKeyOnMouseMoving(sticky) {
  document.addEventListener("mousemove", (e) => {
    sticky.style.opacity = 0.2;

    clearTimeout(sticky._timeout);
    sticky._timeout = setTimeout(() => {
      sticky.style.opacity = 0.8;
    }, 250);
  });
}
