/* 
ON THE ACTUAL PAGE
this is window dom
*/

var videoPlayer = document.querySelector("video");

window.onload = () => {
  navigator.mediaSession.setActionHandler("play", async function () {
    navigator.mediaSession.playbackState = "playing";
    await videoPlayer.play();
  });

  navigator.mediaSession.setActionHandler("pause", function () {
    console.log('> User clicked "Pause" icon.');
    navigator.mediaSession.playbackState = "paused";
    videoPlayer.pause();
  });

  navigator.mediaSession.setActionHandler("previoustrack", prevVideo);
  navigator.mediaSession.setActionHandler("nexttrack", nextVideo);

  // fucking youtube keeps removing the listeners if user-agent is found as desktop..
  // kinda hacky solution to make it work .
  setInterval(() => {
    navigator.mediaSession.setActionHandler("previoustrack", prevVideo);
    navigator.mediaSession.setActionHandler("nexttrack", nextVideo);
  }, 3000);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request?.type == "next") {
    nextVideo();
  } else if (request?.type == "prev") {
    prevVideo();
  } else if (request?.type == "pausePlay") {
    pausePlayVideo();
  }
});

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

const pausePlayVideo = () => {
  console.log("pressing K");
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
