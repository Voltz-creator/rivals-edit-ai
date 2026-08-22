const generateButton =
    document.getElementById("generate");

const montage =
    document.getElementById("montage");

const copyButton =
    document.getElementById("copy");


/* VIDEO */

const videoInput =
    document.getElementById("videoInput");

const videoPreview =
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


/* TIMELINE */

const timelineSection =
    document.getElementById("timelineSection");

const timeline =
    document.getElementById("timeline");

const progress =
    document.getElementById("progress");

const playhead =
    document.getElementById("playhead");

const currentTimeElement =
    document.getElementById("currentTime");

const timelineEnd =
    document.getElementById("timelineEnd");

const markerType =
    document.getElementById("markerType");

const addMarkerButton =
    document.getElementById("addMarker");

const markersContainer =
    document.getElementById("markers");

const markerList =
    document.getElementById("markerList");


/* V6.1 EFFECTS */

const zoomEffect =
    document.getElementById("zoomEffect");

const shakeEffect =
    document.getElementById("shakeEffect");

const slowEffect =
    document.getElementById("slowEffect");

const textEffect =
    document.getElementById("textEffect");

const textSettings =
    document.getElementById("textSettings");

const overlayText =
    document.getElementById("overlayText");

const textPosition =
    document.getElementById("textPosition");

const editTextOverlay =
    document.getElementById("editTextOverlay");

const previewEdit =
    document.getElementById("previewEdit");

const stopEdit =
    document.getElementById("stopEdit");

const editorStatus =
    document.getElementById("editorStatus");


let videoDuration = 0;

let selectedTime = 0;

let markers = [];

let timelineDragging = false;

let editingPreview = false;

let animationFrame = null;


/* =========================
   VIDEO UPLOAD
========================= */

videoInput.addEventListener(
    "change",
    function () {

        const file =
            videoInput.files[0];

        if (!file) {
            return;
        }


        fileName.textContent =
            file.name;


        const videoURL =
            URL.createObjectURL(file);


        videoPreview.src =
            videoURL;


        videoPreview.hidden =
            false;


        videoInfo.hidden =
            false;


        timelineSection.hidden =
            false;


        fileSize.textContent =
            formatFileSize(
                file.size
            );


        videoPreview.addEventListener(
            "loadedmetadata",
            function () {

                videoDuration =
                    videoPreview.duration;


                durationElement.textContent =
                    formatTime(
                        videoDuration
                    );


                timelineEnd.textContent =
                    formatTime(
                        videoDuration
                    );


                resolution.textContent =
                    videoPreview.videoWidth
                    +
                    " × "
                    +
                    videoPreview.videoHeight;


                markers = [];

                selectedTime = 0;

                updateTimeline();

                renderMarkers();

                resetEffects();

            },
            {
                once: true
            }
        );

    }
);


/* =========================
   VIDEO TIME
========================= */

videoPreview.addEventListener(
    "timeupdate",
    function () {

        if (!videoDuration) {
            return;
        }


        selectedTime =
            videoPreview.currentTime;


        updateTimeline();


        /* Stop preview at the end */

        if (
            editingPreview &&
            videoPreview.currentTime >=
            videoDuration
        ) {

            stopPreview();

        }

    }
);


/* =========================
   TIMELINE
========================= */

function updateTimeline() {

    if (!videoDuration) {
        return;
    }


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
   TIMELINE POINTER
========================= */

timeline.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        timelineDragging = true;

        timeline.setPointerCapture(
            event.pointerId
        );

        moveTimeline(event);

    }
);


timeline.addEventListener(
    "pointermove",
    function (event) {

        if (!timelineDragging) {
            return;
        }

        event.preventDefault();

        moveTimeline(event);

    }
);


timeline.addEventListener(
    "pointerup",
    function (event) {

        timelineDragging = false;

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

        timelineDragging = false;

    }
);


/* =========================
   MOVE TIMELINE
========================= */

function moveTimeline(event) {

    if (!videoDuration) {
        return;
    }


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


    videoPreview.currentTime =
        selectedTime;


    updateTimeline();

}


/* =========================
   MARKERS
========================= */

addMarkerButton.addEventListener(
    "click",
    function () {

        if (!videoDuration) {
            return;
        }


        markers.push({

            time:
                selectedTime,

            type:
                markerType.value

        });


        markers.sort(
            function (a, b) {

                return (
                    a.time -
                    b.time
                );

            }
        );


        renderMarkers();

    }
);


/* =========================
   RENDER MARKERS
========================= */

function renderMarkers() {

    markersContainer.innerHTML =
        "";

    markerList.innerHTML =
        "";


    if (markers.length === 0) {

        markerList.innerHTML = `

            <p class="empty">

                No markers yet.

            </p>

        `;

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
                "marker " +
                marker.type;


            markerElement.style.left =
                percentage + "%";


            markerElement.title =
                capitalize(
                    marker.type
                )
                +
                " - "
                +
                formatTime(
                    marker.time
                );


            markerElement.addEventListener(
                "pointerdown",
                function (event) {

                    event.stopPropagation();

                    videoPreview.currentTime =
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

                    ${getMarkerEmoji(
                        marker.type
                    )}

                    ${capitalize(
                        marker.type
                    )}

                    —

                    ${formatTime(
                        marker.time
                    )}

                </span>


                <button>

                    Remove

                </button>

            `;


            const removeButton =
                item.querySelector(
                    "button"
                );


            removeButton.addEventListener(
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
   EFFECT SETTINGS
========================= */

if (textEffect) {

    textEffect.addEventListener(
        "change",
        function () {

            if (textSettings) {

                textSettings.hidden =
                    !textEffect.checked;

            }

            updateText();

        }
    );

}


if (overlayText) {

    overlayText.addEventListener(
        "input",
        updateText
    );

}


if (textPosition) {

    textPosition.addEventListener(
        "change",
        updateText
    );

}


/* =========================
   TEXT
========================= */

function updateText() {

    if (
        !textEffect ||
        !textEffect.checked
    ) {

        if (editTextOverlay) {
            editTextOverlay.hidden = true;
        }

        return;
    }


    const text =
        overlayText
            ? overlayText.value.trim()
            : "";


    if (!text) {

        editTextOverlay.hidden =
            true;

        return;
    }


    editTextOverlay.hidden =
        false;


    editTextOverlay.textContent =
        text;


    editTextOverlay.className =
        "edit-text-overlay " +
        (
            textPosition
                ? textPosition.value
                : "center"
        );

}


/* =========================
   PREVIEW EDIT
========================= */

if (previewEdit) {

    previewEdit.addEventListener(
        "click",
        function () {

            if (!videoDuration) {

                if (editorStatus) {

                    editorStatus.textContent =
                        "Choose a video first.";

                }

                return;
            }


            editingPreview = true;


            videoPreview.currentTime =
                0;


            applySpeed();


            videoPreview.play();


            startEffects();


            if (editorStatus) {

                editorStatus.textContent =
                    "▶ Playing edit preview...";

            }

        }
    );

}


/* =========================
   STOP PREVIEW
========================= */

if (stopEdit) {

    stopEdit.addEventListener(
        "click",
        stopPreview
    );

}


function stopPreview() {

    editingPreview = false;


    videoPreview.pause();


    stopEffects();


    resetEffects();


    if (editorStatus) {

        editorStatus.textContent =
            "Preview stopped.";

    }

}


/* =========================
   SLOW MOTION
========================= */

if (slowEffect) {

    slowEffect.addEventListener(
        "change",
        applySpeed
    );

}


function applySpeed() {

    if (
        slowEffect &&
        slowEffect.checked
    ) {

        videoPreview.playbackRate =
            0.55;

    } else {

        videoPreview.playbackRate =
            1;

    }

}


/* =========================
   EFFECT ANIMATION
========================= */

function startEffects() {

    stopEffects();


    function animate() {

        if (!editingPreview) {
            return;
        }


        let scale = 1;

        let x = 0;

        let y = 0;

        let rotation = 0;


        /* ZOOM */

        if (
            zoomEffect &&
            zoomEffect.checked
        ) {

            const progress =
                videoDuration > 0
                    ? videoPreview.currentTime /
                      videoDuration
                    : 0;


            scale =
                1 +
                (
                    Math.min(
                        progress,
                        1
                    ) * 0.15
                );

        }


        /* SHAKE */

        if (
            shakeEffect &&
            shakeEffect.checked
        ) {

            const strength = 5;


            x =
                (
                    Math.random() -
                    0.5
                ) *
                strength;


            y =
                (
                    Math.random() -
                    0.5
                ) *
                strength;


            rotation =
                (
                    Math.random() -
                    0.5
                ) *
                1.5;

        }


        videoPreview.style.transform =
            `
            translate(${x}px, ${y}px)
            scale(${scale})
            rotate(${rotation}deg)
            `;


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    animate();

}


/* =========================
   STOP EFFECT ANIMATION
========================= */

function stopEffects() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }

}


/* =========================
   RESET EFFECTS
========================= */

function resetEffects() {

    videoPreview.style.transform =
        "translate(0, 0) scale(1) rotate(0deg)";


    videoPreview.playbackRate =
        1;


    updateText();

}


/* =========================
   GENERATOR
========================= */

generateButton.addEventListener(
    "click",
    generateEdit
);


function generateEdit() {

    const clip =
        document
        .getElementById("clip")
        .value
        .trim();


    const game =
        document
        .getElementById("game")
        .value;


    const music =
        document
        .getElementById("music")
        .value;


    const intensity =
        document
        .getElementById("intensity")
        .value;


    const format =
        document
        .getElementById("format")
        .value;


    const text =
        document
        .getElementById("text")
        .checked;


    const kills =
        document
        .getElementById("kills")
        .checked;


    const transitions =
        document
        .getElementById("transitions")
        .checked;


    const camera =
        document
        .getElementById("camera")
        .checked;


    const slowmo =
        document
        .getElementById("slowmo")
        .checked;


    if (clip === "") {

        montage.innerHTML = `

            <p class="empty">

                ⚠️ Describe your clip first.

            </p>

        `;

        return;

    }


    const durationText =
        videoDuration
            ? formatTime(videoDuration)
            : "Unknown";


    let steps = [];


    steps.push(`

        <div class="step">

            <strong>
                00:00 — HOOK
            </strong>

            <br>

            <span>

                Start with the most interesting
                moment and avoid a long intro.

            </span>

        </div>

    `);


    markers.forEach(
        function (marker) {

            steps.push(`

                <div class="step">

                    <strong>

                        ${formatTime(
                            marker.time
                        )}

                        —

                        ${getMarkerEmoji(
                            marker.type
                        )}

                        ${capitalize(
                            marker.type
                        )}

                    </strong>

                    <br>

                    <span>

                        ${getMarkerInstruction(
                            marker.type
                        )}

                    </span>

                </div>

            `);

        }
    );


    if (
        markers.length === 0
        &&
        videoDuration
    ) {

        const quarter =
            videoDuration / 4;


        steps.push(`

            <div class="step">

                <strong>

                    ${formatTime(
                        quarter
                    )}

                    — FIRST SECTION

                </strong>

                <br>

                <span>

                    Introduce the first important
                    gameplay moment.

                </span>

            </div>

        `);


        steps.push(`

            <div class="step">

                <strong>

                    ${formatTime(
                        quarter * 2
                    )}

                    — MAIN ACTION

                </strong>

                <br>

                <span>

                    Increase the intensity and
                    synchronize the action
                    with the music.

                </span>

            </div>

        `);


        steps.push(`

            <div class="step">

                <strong>

                    ${formatTime(
                        quarter * 3
                    )}

                    — FINAL BUILD

                </strong>

                <br>

                <span>

                    Build toward the strongest
                    moment of the clip.

                </span>

            </div>

        `);

    }


    if (kills) {

        steps.push(`

            <div class="step">

                <strong>
                    💥 KILL EFFECTS
                </strong>

                <br>

                <span>

                    Add a quick zoom,
                    subtle shake and
                    impact sound on important kills.

                </span>

            </div>

        `);

    }


    if (text) {

        steps.push(`

            <div class="step">

                <strong>
                    📝 TEXT ANIMATIONS
                </strong>

                <br>

                <span>

                    Use short animated text
                    for important moments.

                </span>

            </div>

        `);

    }


    if (transitions) {

        steps.push(`

            <div class="step">

                <strong>
                    🔄 TRANSITIONS
                </strong>

                <br>

                <span>

                    Use fast transitions
                    between major sections.

                </span>

            </div>

        `);

    }


    if (camera) {

        steps.push(`

            <div class="step">

                <strong>
                    🎥 CAMERA EFFECTS
                </strong>

                <br>

                <span>

                    Add subtle zooms and
                    camera movement during
                    important moments.

                </span>

            </div>

        `);

    }


    if (slowmo) {

        steps.push(`

            <div class="step">

                <strong>
                    🐌 SLOW MOTION
                </strong>

                <br>

                <span>

                    Use slow motion briefly
                    around the strongest moment.

                </span>

            </div>

        `);

    }


    steps.push(`

        <div class="step">

            <strong>
                🎵 MUSIC
            </strong>

            <br>

            <span>

                Synchronize important actions
                with the strongest beats.

                Selected style:
                ${music}.

            </span>

        </div>

    `);


    steps.push(`

        <div class="step">

            <strong>
                🏁 ENDING
            </strong>

            <br>

            <span>

                End immediately after
                the final important action.

            </span>

        </div>

    `);


    montage.innerHTML = `

        <h3>

            ⚡ Your
            ${game.toUpperCase()}
            Edit Plan

        </h3>


        ${steps.join("")}


        <div class="summary">

            <strong>
                🎯 Clip information
            </strong>

            <br><br>

            🎮 Game:
            ${game.toUpperCase()}

            <br>

            ⏱️ Duration:
            ${durationText}

            <br>

            🎵 Music:
            ${music}

            <br>

            ⚡ Intensity:
            ${intensity}

            <br>

            📱 Format:
            ${format}

            <br>

            📍 Markers:
            ${markers.length}

        </div>

    `;

}


/* =========================
   COPY
========================= */

copyButton.addEventListener(
    "click",
    function () {

        const text =
            montage.innerText;


        if (!text.trim()) {
            return;
        }


        navigator.clipboard
            .writeText(text)
            .then(
                function () {

                    copyButton.innerText =
                        "Copied!";


                    setTimeout(
                        function () {

                            copyButton.innerText =
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

    if (!isFinite(seconds)) {

        return "00:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(
            remainingSeconds
        ).padStart(2, "0")

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


function getMarkerEmoji(type) {

    if (type === "kill") {
        return "💥";
    }

    if (type === "text") {
        return "📝";
    }

    if (type === "transition") {
        return "🔄";
    }

    if (type === "slowmo") {
        return "🐌";
    }

    if (type === "important") {
        return "⭐";
    }

    return "📍";

}


function getMarkerInstruction(type) {

    if (type === "kill") {

        return "Add a quick zoom, shake and impact sound at this moment.";

    }


    if (type === "text") {

        return "Add a short animated text overlay at this moment.";

    }


    if (type === "transition") {

        return "Use a fast transition to move into the next section.";

    }


    if (type === "slowmo") {

        return "Slow the footage down briefly around this moment.";

    }


    if (type === "important") {

        return "Treat this as a key moment and make it visually stand out.";

    }


    return "Highlight this moment in the edit.";

}
