function getPageType() {
  let pageUrl = window.location.href;
  let type = "";

  if (pageUrl.startsWith("https://www.youtube.com/playlist")) {
    type = "playlist_overview";
  } else if (pageUrl.startsWith("https://www.youtube.com/watch")) {
    const urlParams = new URLSearchParams(window.location.search);
    const hasPlaylist = urlParams.get("list");
    if (hasPlaylist) type = "playlist_watch";
    else type = "single_video_watch";
  }

  return type;
}

function calculateDuration(videos) {
  let totalMinutes = 0;

  videos.forEach((video) => {
    let durationTag = "ytd-thumbnail-overlay-time-status-renderer";
    let durationElement = video.querySelector(durationTag);

    if (durationElement != undefined && durationElement != null) {
      let duration = durationElement.innerText;
      let minutes = 0;
      let seconds = 0;

      let timeSlices = duration.split(":");

      if (timeSlices.length === 2) {
        minutes = Number(timeSlices[0]);
        seconds = Number(timeSlices[1]);
        minutes += seconds / 60;
      } else if (timeSlices.length === 3) {
        let hours = Number(timeSlices[0]);
        minutes = Number(timeSlices[1]);
        seconds = Number(timeSlices[2]);
        minutes += hours * 60 + seconds / 60;
      }

      totalMinutes += minutes;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.trunc(totalMinutes % 60);
  const seconds = Math.trunc((totalMinutes - Math.trunc(totalMinutes)) * 60);

  let playlistDuration = `${hours}h ${minutes}m ${seconds}s`;

  return playlistDuration;
}
