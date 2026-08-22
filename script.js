/* =========================
   VIDEO
========================= */

const videoInput =
    document.getElementById("videoInput");

const video =
    document.getElementById("videoPreview");

const fileName =
    document.getElementById("fileName");

const videoInfo =
    document.getElementById("videoInfo");

const durationElement =
    document.getElementById("duration");

const resolution =
    document.getElementById("resolution");

const fileSize =
    document.getElementById("fileSize");


/* =========================
   EDITOR
========================= */

const editorSection =
    document.getElementById("editorSection");

const startRange =
    document.getElementById("startRange");

const endRange =
    document.getElementById("endRange");

const startTime =
    document.getElementById("startTime");

const endTime =
    document.getElementById("endTime");

const selectedDuration =
    document.getElementById("selectedDuration");

const rangeSelected =
    document.getElementById("rangeSelected");

const setStart =
    document.getElementById("setStart");

const setEnd =
    document.getElementById("setEnd");

const resetCut =
    document.getElementById("resetCut");

const previewEdit =
    document.getElementById("previewEdit");

const stopEdit =
    document.getElementById("stopEdit");

const editorStatus =
    document.getElementById("editorStatus");


let videoDuration = 0;

let cutStart = 0;

let cutEnd = 0;

let selectedStyle = "clean";

let editingPreview = false;


/* =========================
   TIMELINE
========================= */

const timelineSection =
    document.getElementById(
        "timelineSection"
    );

const timeline =
    document.getElementById("timeline");

const progress =
    document.getElementById("progress");

const playhead =
    document.getElementById("playhead");

const currentTimeElement =
    document.getElementById(
        "currentTime"
    );

const timelineEnd =
    document.getElementById(
        "timelineEnd"
    );

const markerType =
    document.getElementById(
        "markerType"
    );

const addMarkerButton =
    document.getElementById(
        "addMarker"
    );

const markersContainer =
    document.getElementById(
        "markers"
    );

const markerList =
    document.getElementById(
        "markerList"
    );


let selectedTime = 0;

let markers = [];

let draggingTimeline = false;


/* =========================
   UPLOAD
========================= */

videoInput.addEventListener(
    "change",
    function () {

        const file =
            videoInput.files[0];

        if (!file) return;


        fileName.textContent =
            file.name;


        video.src =
            URL.createObjectURL(file);


        video.hidden =
            false;


        videoInfo.hidden =
            false;


        editorSection.hidden =
            false;


        timelineSection.hidden =
            false;


        fileSize.textContent =
            formatFileSize(
                file.size
            );


        video.addEventListener(
            "loadedmetadata",
            function () {

                videoDuration =
                    video.duration;


                cutStart = 0;

                cutEnd =
                    videoDuration;


                startRange.max =
                    videoDuration;

                endRange.max =
                    videoDuration;


                startRange.value =
                    0;

                endRange.value =
                    videoDuration;


                durationElement.textContent =
                    formatTime(
                        videoDuration
                    );


                timelineEnd.textContent =
                    formatTime(
                        videoDuration
                    );


                resolution.textContent =
                    video.videoWidth
                    +
                    " × "
                    +
                    video.videoHeight;


                updateCutUI();

                updateTimeline();

            },
            {
                once: true
            }
        );

    }
);


/* =========================
   CUT RANGE
========================= */

startRange.addEventListener(
    "input",
    function () {

        cutStart =
            Number(
                startRange.value
            );


        if (
            cutStart >= cutEnd
        ) {

            cutStart =
                Math.max(
                    0,
                    cutEnd - 0.1
                );

            startRange.value =
                cutStart;

        }


        updateCutUI();

        video.currentTime =
            cutStart;

    }
);


endRange.addEventListener(
    "input",
    function () {

        cutEnd =
            Number(
                endRange.value
            );


        if (
            cutEnd <= cutStart
        ) {

            cutEnd =
                Math.min(
                    videoDuration,
                    cutStart + 0.1
                );

            endRange.value =
                cutEnd;

        }


        updateCutUI();

        video.currentTime =
            cutEnd;

    }
);


/* =========================
   UPDATE CUT UI
========================= */

function updateCutUI() {

    startTime.textContent =
        formatTime(cutStart);


    endTime.textContent =
        formatTime(cutEnd);


    selectedDuration.textContent =
        formatTime(
            cutEnd - cutStart
        );


    if (!videoDuration) return;


    const left =
        (
            cutStart /
            videoDuration
        ) * 100;


    const width =
        (
            (cutEnd - cutStart) /
            videoDuration
        ) * 100;


    rangeSelected.style.left =
        left + "%";


    rangeSelected.style.width =
        width + "%";

}


/* =========================
   SET START / END
========================= */

setStart.addEventListener(
    "click",
    function () {

        if (!videoDuration) return;


        cutStart =
            Math.min(
                video.currentTime,
                cutEnd - 0.1
            );


        startRange.value =
            cutStart;


        updateCutUI();


        editorStatus.textContent =
            "Start point updated.";

    }
);


setEnd.addEventListener(
    "click",
    function () {

        if (!videoDuration) return;


        cutEnd =
            Math.max(
                video.currentTime,
                cutStart + 0.1
            );


        cutEnd =
            Math.min(
                cutEnd,
                videoDuration
            );


        endRange.value =
            cutEnd;


        updateCutUI();


        editorStatus.textContent =
            "End point updated.";

    }
);


resetCut.addEventListener(
    "click",
    function () {

        cutStart = 0;

        cutEnd =
            videoDuration;


        startRange.value =
            0;

        endRange.value =
            videoDuration;


        updateCutUI();


        editorStatus.textContent =
            "Cut reset.";

    }
);


/* =========================
   STYLE
========================= */

document
    .querySelectorAll(".style-button")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".style-button"
                        )
                        .forEach(
                            function (b) {

                                b.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedStyle =
                        button.dataset.style;


                    editorStatus.textContent =
                        "Style selected: "
                        +
                        capitalize(
                            selectedStyle
                        );

                }
            );

        }
    );


/* =========================
   PREVIEW EDIT
========================= */

previewEdit.addEventListener(
    "click",
    function () {

        if (!videoDuration) return;


        editingPreview = true;


        video.currentTime =
            cutStart;


        video.play();


        editorStatus.textContent =
            "▶ Playing your selected edit...";

    }
);


/* =========================
   STOP
========================= */

stopEdit.addEventListener(
    "click",
    function () {

        editingPreview = false;

        video.pause();


        editorStatus.textContent =
            "Preview stopped.";

    }
);


/* =========================
   STOP AT CUT END
========================= */

video.addEventListener(
    "timeupdate",
    function () {

        selectedTime =
            video.currentTime;


        updateTimeline();


        if (
            editingPreview
            &&
            video.currentTime >= cutEnd
        ) {

            video.pause();

            editingPreview = false;

            video.currentTime =
                cutStart;


            editorStatus.textContent =
                "Preview finished.";

        }

    }
);


/* =========================
   TIMELINE
========================= */

timeline.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        draggingTimeline = true;

        timeline.setPointerCapture(
            event.pointerId
        );


        moveTimeline(event);

    }
);


timeline.addEventListener(
    "pointermove",
    function (event) {

        if (!draggingTimeline)
            return;


        event.preventDefault();

        moveTimeline(event);

    }
);


timeline.addEventListener(
    "pointerup",
    function (event) {

        draggingTimeline = false;


        try {

            timeline.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}

    }
);


timeline.addEventListener(
    "pointercancel",
    function () {

        draggingTimeline = false;

    }
);


/* =========================
   MOVE TIMELINE
========================= */

function moveTimeline(event) {

    if (!videoDuration) return;


    const rect =
        timeline.getBoundingClientRect();


    let position =
        event.clientX -
        rect.left;


    position =
        Math.max(
            0,
            Math.min(
                rect.width,
                position
            )
        );


    const percentage =
        position /
        rect.width;


    selectedTime =
        percentage *
        videoDuration;


    video.currentTime =
        selectedTime;


    updateTimeline();

}


/* =========================
   UPDATE TIMELINE
========================= */

function updateTimeline() {

    if (!videoDuration) return;


    const percentage =
        (
            selectedTime /
            videoDuration
        ) * 100;


    progress.style.width =
        percentage + "%";


    playhead.style.left =
        percentage + "%";


    currentTimeElement.textContent =
        formatTime(
            selectedTime
        );

}


/* =========================
   MARKERS
========================= */

addMarkerButton.addEventListener(
    "click",
    function () {

        if (!videoDuration)
            return;


        markers.push({

            time: selectedTime,

            type:
                markerType.value

        });


        markers.sort(
            function (a, b) {

                return a.time - b.time;

            }
        );


        renderMarkers();

    }
);


function renderMarkers() {

    markersContainer.innerHTML = "";

    markerList.innerHTML = "";


    if (!markers.length) {

        markerList.innerHTML =
            `<p class="empty">
                No markers yet.
            </p>`;

        return;

    }


    markers.forEach(
        function (
            marker,
            index
        ) {

            const percentage =
                (
                    marker.time /
                    videoDuration
                ) * 100;


            const markerElement =
                document.createElement(
                    "div"
                );


            markerElement.className =
                "marker "
                +
                marker.type;


            markerElement.style.left =
                percentage + "%";


            markerElement.addEventListener(
                "pointerdown",
                function (event) {

                    event.stopPropagation();


                    video.currentTime =
                        marker.time;


                    selectedTime =
                        marker.time;


                    updateTimeline();

                }
            );


            markersContainer.appendChild(
                markerElement
            );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "marker-item";


            item.innerHTML = `

                <span>

                    ${getEmoji(marker.type)}

                    ${capitalize(marker.type)}

                    —

                    ${formatTime(marker.time)}

                </span>

                <button>
                    Remove
                </button>

            `;


            item
                .querySelector("button")
                .addEventListener(
                    "click",
                    function () {

                        markers.splice(
                            index,
                            1
                        );


                        renderMarkers();

                    }
                );


            markerList.appendChild(
                item
            );

        }
    );

}


/* =========================
   OLD AI PLANNER
========================= */

const generate =
    document.getElementById(
        "generate"
    );

const montage =
    document.getElementById(
        "montage"
    );

const copy =
    document.getElementById(
        "copy"
    );


generate.addEventListener(
    "click",
    function () {

        const description =
            document
                .getElementById("clip")
                .value
                .trim();


        if (!description) {

            montage.innerHTML =
                `<p class="empty">
                    Describe your clip first.
                </p>`;

            return;

        }


        montage.innerHTML = `

            <div class="step">

                <strong>
                    🎬 ${capitalize(selectedStyle)}
                    Edit
                </strong>

                <br><br>

                Your selected clip:

                <strong>
                    ${formatTime(cutStart)}
                    →
                    ${formatTime(cutEnd)}
                </strong>

                <br><br>

                ${description}

            </div>


            <div class="step">

                <strong>
                    ✨ Suggested workflow
                </strong>

                <br><br>

                Start with the strongest moment,
                sync important actions with the beat,
                then use zooms and transitions
                between major moments.

            </div>


            <div class="summary">

                🎯 Selected duration:
                ${formatTime(
                    cutEnd - cutStart
                )}

                <br>

                🎨 Style:
                ${capitalize(
                    selectedStyle
                )}

                <br>

                📍 Markers:
                ${markers.length}

            </div>

        `;

    }
);


/* =========================
   COPY
========================= */

copy.addEventListener(
    "click",
    function () {

        navigator.clipboard
            .writeText(
                montage.innerText
            )
            .then(
                function () {

                    copy.textContent =
                        "Copied!";


                    setTimeout(
                        function () {

                            copy.textContent =
                                "Copy";

                        },
                        1500
                    );

                }
            );

    }
);


/* =========================
   HELPERS
========================= */

function formatTime(seconds) {

    if (!isFinite(seconds))
        return "00:00";


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(secondsPart)
            .padStart(2, "0")
    );

}


function formatFileSize(bytes) {

    if (
        bytes <
        1024 * 1024
    ) {

        return (
            (
                bytes / 1024
            ).toFixed(1)
            +
            " KB"
        );

    }


    return (
        (
            bytes /
            1024 /
            1024
        ).toFixed(1)
        +
        " MB"
    );

}


function capitalize(text) {

    return (
        text.charAt(0).toUpperCase()
        +
        text.slice(1)
    );

}


function getEmoji(type) {

    const emojis = {

        kill: "💥",

        text: "📝",

        transition: "🔄",

        slowmo: "🐌",

        important: "⭐"

    };


    return emojis[type] || "📍";

}
