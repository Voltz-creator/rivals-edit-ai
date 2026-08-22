const videoInput = document.getElementById("videoInput");
const video = document.getElementById("videoPreview");
const fileName = document.getElementById("fileName");
const videoInfo = document.getElementById("videoInfo");

const durationElement = document.getElementById("duration");
const resolution = document.getElementById("resolution");
const fileSize = document.getElementById("fileSize");

const editorSection = document.getElementById("editorSection");
const timelineSection = document.getElementById("timelineSection");

let videoDuration = 0;


/* =========================
   VIDEO SELECTION
========================= */

videoInput.addEventListener("change", function (event) {

    const files = event.target.files;

    if (!files || files.length === 0) {
        fileName.textContent = "No video selected.";
        return;
    }

    const file = files[0];

    console.log("Video selected:", file.name);

    /* File name */
    fileName.textContent = file.name;

    /* File size */
    fileSize.textContent = formatFileSize(file.size);

    /* Create video URL */
    const videoURL = URL.createObjectURL(file);

    video.src = videoURL;

    video.hidden = false;

    videoInfo.hidden = false;
    editorSection.hidden = false;
    timelineSection.hidden = false;

    /* Load video */
    video.load();

});


/* =========================
   VIDEO METADATA
========================= */

video.addEventListener("loadedmetadata", function () {

    videoDuration = video.duration;

    durationElement.textContent =
        formatTime(videoDuration);

    resolution.textContent =
        video.videoWidth +
        " × " +
        video.videoHeight;

    console.log("Video loaded!");
    console.log("Duration:", videoDuration);
    console.log("Resolution:",
        video.videoWidth,
        "x",
        video.videoHeight
    );

});


/* =========================
   VIDEO ERRORS
========================= */

video.addEventListener("error", function () {

    fileName.textContent =
        "Unable to load this video.";

    console.log(
        "Video loading error:",
        video.error
    );

});


/* =========================
   FORMAT TIME
========================= */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsPart =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secondsPart).padStart(2, "0")
    );
}


/* =========================
   FORMAT FILE SIZE
========================= */

function formatFileSize(bytes) {

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }

    return (
        (bytes / 1024 / 1024).toFixed(1) +
        " MB"
    );
}
