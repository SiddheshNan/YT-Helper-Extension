/* 
ON THE ACTUAL PAGE
this is window dom
*/

var videoPlayer = document.querySelector("video");

window.onload = () => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", async () => {
      navigator.mediaSession.playbackState = "playing";
      await videoPlayer.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      navigator.mediaSession.playbackState = "paused";
      videoPlayer.pause();
    });

    navigator.mediaSession.setActionHandler("stop", () => {
      return false;
    });

    navigator.mediaSession.setActionHandler("previoustrack", prevVideo);
    navigator.mediaSession.setActionHandler("nexttrack", nextVideo);

    // fucking youtube keeps removing the listeners if user-agent is found as desktop..
    // kinda hacky solution to make it work .
    setInterval(() => {
      navigator.mediaSession.setActionHandler("previoustrack", prevVideo);
      navigator.mediaSession.setActionHandler("nexttrack", nextVideo);
    }, 3000);
  }
  // window.postMessage({"type": 'UPDATE_VIDEO_TITLE', "value": getVideoName()}, "*");
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.type == "next") {
    nextVideo();
  } else if (request?.type == "prev") {
    prevVideo();
  } else if (request?.type == "pausePlay") {
    pausePlayVideo();
  } else if (request?.type == "getVideoTitle") {
    sendResponse(getVideoName());
  }
});

// send shift + n keystroke for next video
const nextVideo = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "n",
      keyCode: 78,
      code: "KeyN",
      which: 78,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    })
  );
};

// send shift + p keystroke for prev video
const prevVideo = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "p",
      keyCode: 80,
      code: "KeyP",
      which: 80,
      shiftKey: true,
      ctrlKey: false,
      metaKey: false,
    })
  );
};

// send keypress k for pause/play
const pausePlayVideo = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "k",
      keyCode: 75,
      code: "KeyK",
      which: 75,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
    })
  );
};

const getVideoName = () => {
  if ("mediaSession" in navigator) {
    return (
      navigator.mediaSession.metadata.title.toString() +
      "<br />" +
      navigator.mediaSession.metadata.artist.toString()
    );
  } else {
    return document.querySelectorAll("h1 yt-formatted-string")[0].innerText;
  }
};
