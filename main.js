// import { defaultOptions, getOptions, setOptions } from './storage.js'

window.addEventListener("load", onLoad, false);

function onLoad() {
  getOptions((options) => {
    const url = window.location.href;
    const props = findProps(options, url);
    const sticky = appendSticky(props);
    keepItLowKeyOnHover(sticky);
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

function keepItLowKeyOnHover(sticky) {
  const hoverMargin = 8;

  document.addEventListener("mousemove", (event) => {
    const rect = sticky.getBoundingClientRect();
    const isHovered =
      event.clientX >= rect.left - hoverMargin &&
      event.clientX <= rect.right + hoverMargin &&
      event.clientY >= rect.top - hoverMargin &&
      event.clientY <= rect.bottom + hoverMargin;

    sticky.classList.toggle("site-env-recognizer-sticky--low-key", isHovered);
  });

  document.addEventListener("mouseleave", () => {
    sticky.classList.remove("site-env-recognizer-sticky--low-key");
  });
}
