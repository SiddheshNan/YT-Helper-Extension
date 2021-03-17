document.addEventListener(
  "yt-navigate-finish",
  function navFinish() {
    const type = getPageType();

    if (type === "single_video_watch" || type == "playlist_watch")
      addMediaKeys();

    playlistLogic();
  },
  false
);

playlistLogic();

async function playlistLogic() {
  let interval = setInterval(async () => {
    let videos = [];
    let pageType = getPageType();
    let parent = "";

    if (pageType === "playlist_overview") {
      videos = Array.from(
        document.querySelectorAll("ytd-playlist-video-renderer")
      );
      if (videos.length > 0) parent = videos[0].parentElement;
      else return;
    } else {
      clearInterval(interval);

      if (pageType == "playlist_watch") playlistWatchPage();
      else if (pageType == "channel_videos_list") channelVideosPage();

      return;
    }

    let playlistLength = getPlaylistLength(pageType);

    // Determine if timestamps are loaded too
    let timestamps = parent.querySelectorAll(
      "ytd-thumbnail-overlay-time-status-renderer"
    );
    timestamps = Array.from(timestamps);

    // Determine number of videos in playlist that are unplayable
    let unplayableLength =
      parent.querySelectorAll("span[title='[Private video]']").length +
      parent.querySelectorAll("span[title='[Deleted video]']").length;

    let playableLength =
      unplayableLength > 0 ? videos.length - unplayableLength : videos.length;

    if (
      videos.length === timestamps.length ||
      playableLength === timestamps.length
    ) {
      if (playlistLength > 100 && videos.length >= 100) {
        createDurationElement(videos);
      } else if (videos.length === playlistLength) {
        createDurationElement(videos);
      }

      clearInterval(interval);
    }
  }, 1000);
}

function getPlaylistLength(pageType) {
  let playlistLength = 0;

  if (pageType === "playlist_overview") {
    let tag = "#stats.style-scope.ytd-playlist-sidebar-primary-info-renderer";
    playlistLength = document.querySelector(tag).children[0].innerText;
    playlistLength = playlistLength.split(" ")[0];
    playlistLength = playlistLength.replace(/\,+/, "");
  }

  return Number(playlistLength);
}

function createDurationElement(videos) {
  let parentElement = getPlaylistParentElement();

  let durationElement = document.createElement("div");
  durationElement.className = "playlistTotalDuration";
  durationElement.style.fontSize = "1.6rem";
  durationElement.style.fontWeight = 500;
  durationElement.style.color = "var(--google-blue-500)";

  durationElement.innerHTML = `<span style='color: var(--yt-spec-text-primary);'>Playlist Duration (1-${
    videos.length
  }):</span> ${calculateDuration(videos)}.`;

  let currentDurationElement = parentElement.querySelector(
    ".playlistTotalDuration"
  );

  if (currentDurationElement) {
    parentElement.replaceChild(durationElement, currentDurationElement);
  } else {
    parentElement.appendChild(durationElement);
  }
}

function getPlaylistParentElement() {
  let userPlaylist = document.querySelector("#title-form");
  let parentElementTag = "";

  if (userPlaylist) {
    parentElementTag = "#stats";
  } else {
    let stats = document.querySelector("#stats");
    let previousTotalDuration = stats.querySelector(".playlistTotalDuration");
    if (previousTotalDuration) stats.removeChild(previousTotalDuration);

    parentElementTag =
      "#title.style-scope.ytd-playlist-sidebar-primary-info-renderer";
  }

  return document.querySelector(parentElementTag);
}

const addMediaKeys = () => {
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

  var videoPlayer = document.querySelector("video");

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

    setInterval(() => {
      navigator.mediaSession.setActionHandler("previoustrack", prevVideo);
      navigator.mediaSession.setActionHandler("nexttrack", nextVideo);
    }, 3000);
  }
};
