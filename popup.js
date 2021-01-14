// RUNS ON EXTENSION POPUP

window.onload = () => {
  document.getElementById("next").addEventListener("click", () => {
    queryTheThing("next");
  });

  document.getElementById("prev").addEventListener("click", () => {
    queryTheThing("prev");
  });

  document.getElementById("pausePlay").addEventListener("click", () => {
    queryTheThing("pausePlay");
  });
};

const queryTheThing = (query) => {
  chrome.tabs.query({ audible: true },  (tabs) => {
    if (Array.isArray(tabs) && tabs.length) {
      chrome.tabs.sendMessage(tabs[tabs.length - 1].id, { type: query }, (resp) => {});
    }
  });
};
