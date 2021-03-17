function getPageType() {
  // let pageUrl = window.location.href;

  let pageUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    window.location.pathname;

  let type = "";

  if (pageUrl.startsWith("https://www.youtube.com/playlist")) {
    type = "playlist_overview";
  } else if (pageUrl.startsWith("https://www.youtube.com/watch")) {
    const urlParams = new URLSearchParams(window.location.search);
    const hasPlaylist = urlParams.get("list");
    if (hasPlaylist) type = "playlist_watch";
    else type = "single_video_watch";
  } else if (pageUrl.endsWith("/videos")) {
    type = "channel_videos_list";
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

const playlistWatchPage = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const playlist_id = urlParams.get("list");

  const APIKEY = "";

  const _apicall = await fetch(
    `https://yt-helpers.siddhesh.workers.dev/playlist/get_time?key=${APIKEY}&playlist_id=${playlist_id}`
  );
  const _apidata = await _apicall.json();

  if (!_apidata.playlist_duration) return;

  const containr = document
    .getElementById("header-description")
    .querySelector("h3");

  if (containr.childElementCount > 1) containr.removeChild(containr.lastChild);

  let durationElement = document.createElement("div");
  durationElement.className = "playlistTotalDuration";
  durationElement.style.fontSize = "1.4rem";
  durationElement.style.fontWeight = 500;
  durationElement.style.marginTop = "0.58rem";
  durationElement.style.marginBottom = "0.6rem";

  durationElement.innerHTML = `<span style='color: var(--yt-spec-text-primary);'>Playlist Duration: <span style='color: #5896fd;'>${_apidata.playlist_duration}</span></span>`;

  containr.appendChild(durationElement);
};

// const onChangeSortByVid = () => {
//   const val = document.getElementById("sortByVidSelector").value;

// };

const channelVideosPage = async () => {
  const type = getPageType();
  if (type != "channel_videos_list") return;

  const sortMenu = document.getElementById("sort-menu");

  if (sortMenu.hasChildNodes()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const isSort = urlParams.get("sort");



  sortMenu.innerHTML = `
  <select name="sortByVidSelector" id="sortByVidSelector">
    <option value="dd" ${isSort == 'dd' && 'selected'}>Date Added (newest)</option>
    <option value="da" ${isSort == 'da' && 'selected'}>Date Added (oldest)</option>
    <option value="p" ${isSort == 'p' && 'selected'}>Most Popular</option>
  </select>`;

  document
    .getElementById("sortByVidSelector")
    .addEventListener("change", (e) => {
      const val = e.target.value;
      // const url = window.location.href.split("?")[0];
      const url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        window.location.pathname;
      window.location.href = `${url}?view=0&sort=${val}`;
    });
};
