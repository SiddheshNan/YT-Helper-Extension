// RUNS ON EXTENSION POPUP

window.onload = () => {
  getVideoTitleAndShow();
  document.getElementById("next").addEventListener("click", () => {
    queryTheThing("next", (resp) => {});
  });

  document.getElementById("prev").addEventListener("click", () => {
    queryTheThing("prev", (resp) => {});
  });

  document.getElementById("pausePlay").addEventListener("click", () => {
    queryTheThing("pausePlay", (resp) => {});
  });

  setInterval(() => {
    getVideoTitleAndShow();
  }, 1000);

  setTimeout(() => {
    const elemt = document.getElementById("videoTitle");
    if (!elemt.innerText || elemt.innerText == "Video Title Loading...")
      document.getElementById("videoTitle").innerHTML =
        "Failed to get YT Video Title! <br /> Make Sure Youtube is open..";
  }, 2000);
};

const queryTheThing = (query, fn) => {
  chrome.tabs.query({ audible: true }, (tabs) => {
    if (Array.isArray(tabs) && tabs.length) {
      chrome.tabs.sendMessage(
        tabs[tabs.length - 1].id, // last tab
        { type: query },
        (resp) => {
          fn(resp);
        }
      );
    }
  });
};

const getVideoTitleAndShow = () => {
  queryTheThing("getVideoTitle", (resp) => {
    document.getElementById("videoTitle").innerHTML = resp;
  });
};
// window.addEventListener(
//   "message",
//   function (event) {
//     if (event.source != window) return;

//     console.log("GOT EVENT");
//     if (event.data.type && event.data.type == "UPDATE_VIDEO_TITLE") {
//       document.getElementById("videoTitle").innerText = event.data.value;
//     }
//   },
//   false
// );
