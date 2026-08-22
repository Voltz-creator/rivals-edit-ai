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


/* EFFECTS */

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


/* STATE */

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


    selectedTime =
        (
            position /
            rect.width
        ) *
        videoDuration;


    videoPreview.currentTime =
        selectedTime;


    updateTimeline();

}


/* =========================
   ADD MARKER
========================= */

addMarkerButton.addEventListener(
    "click",
    function () {

        if (!videoDuration) {

            editorStatus.textContent =
                "Choose a video first.";

            return;
        }


        const type =
            markerType.value;


        markers.push({

            time:
                selectedTime,

            type:
                type,

            text:
                type === "text"
                    ? (
                        overlayText.value.trim()
                        ||
                        "TEXT"
                    )
                    : ""

        });


        markers.sort(
            function (a, b) {

                return a.time - b.time;

            }
        );


        renderMarkers();


        editorStatus.textContent =
            capitalize(type) +
            " added at " +
            formatTime(selectedTime);

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
                No effects yet.
            </p>

        `;

        return;
    }


    markers.forEach(
        function (marker, index) {

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
                capitalize(marker.type)
                +
                " — "
                +
                formatTime(marker.time);


            markerElement.addEventListener(
                "pointerdown",
                function (event) {

                    event.stopPropagation();

                    selectedTime =
                        marker.time;

                    videoPreview.currentTime =
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


            const label =
                marker.type === "text"
                    ? marker.text
                    : capitalize(marker.type);


            item.innerHTML = `

                <span>

                    ${getMarkerEmoji(
                        marker.type
                    )}

                    ${label}

                    —

                    ${formatTime(
                        marker.time
                    )}

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
   EFFECT SETTINGS
========================= */

textEffect.addEventListener(
    "change",
    function () {

        textSettings.hidden =
            !textEffect.checked;

        updateText();

    }
);


overlayText.addEventListener(
    "input",
    updateText
);


textPosition.addEventListener(
    "change",
    updateText
);


function updateText() {

    if (!textEffect.checked) {

        editTextOverlay.hidden =
            true;

        return;

    }


    const text =
        overlayText.value.trim();


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
        textPosition.value;

}


/* =========================
   PREVIEW
========================= */

previewEdit.addEventListener(
    "click",
    function () {

        if (!videoDuration) {

            editorStatus.textContent =
                "Choose a video first.";

            return;

        }


        editingPreview = true;


        videoPreview.currentTime =
            0;



        videoPreview.play();


        startEffects();


        editorStatus.textContent =
            "▶ Previewing your edit...";

    }
);


/* =========================
   STOP
========================= */

stopEdit.addEventListener(
    "click",
    stopPreview
);


function stopPreview() {

    editingPreview = false;

    videoPreview.pause();

    stopEffects();

    resetEffects();

    editorStatus.textContent =
        "Preview stopped.";

}


/* =========================
   EFFECT ENGINE
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


        const time =
            videoPreview.currentTime;


        /* GLOBAL ZOOM */

        if (zoomEffect.checked) {

            scale = 1.12;

        }


        /* GLOBAL SHAKE */

        if (shakeEffect.checked) {

            x =
                (
                    Math.random() -
                    0.5
                ) * 7;


            y =
                (
                    Math.random() -
                    0.5
                ) * 7;


            rotation =
                (
                    Math.random() -
                    0.5
                ) * 1.5;

        }


        /* TIMELINE EFFECTS */

        markers.forEach(
            function (marker) {

                const distance =
                    Math.abs(
                        time -
                        marker.time
                    );


                /*
                    Effects activate
                    for a short moment
                    around their marker.
                */

                if (distance <= 0.45) {

                    if (
                        marker.type ===
                        "zoom"
                    ) {

                        scale = 1.18;

                    }


                    if (
                        marker.type ===
                        "shake"
                    ) {

                        x =
                            (
                                Math.random()
                                -
                                0.5
                            ) * 15;


                        y =
                            (
                                Math.random()
                                -
                                0.5
                            ) * 15;


                        rotation =
                            (
                                Math.random()
                                -
                                0.5
                            ) * 3;

                    }

                }

            }
        );


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
   STOP EFFECTS
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
   RESET
========================= */

function resetEffects() {

    videoPreview.style.transform =
        "translate(0,0) scale(1) rotate(0deg)";

    videoPreview.playbackRate =
        1;

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


    if (!clip) {

        montage.innerHTML = `

            <p class="empty">
                ⚠️ Describe your clip first.
            </p>

        `;

        return;

    }


    let steps = [];


    steps.push(`
        <div class="step">

            <strong>
                00:00 — HOOK
            </strong>

            <br>

            <span>
                Start with the strongest
                part of the clip.
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


    if (kills) {

        steps.push(`
            <div class="step">

                <strong>
                    💥 KILL EFFECTS
                </strong>

                <br>

                <span>
                    Add quick zooms,
                    impact effects and
                    subtle shake on kills.
                </span>

            </div>
        `);

    }


    if (text) {

        steps.push(`
            <div class="step">

                <strong>
                    📝 TEXT
                </strong>

                <br>

                <span>
                    Add short animated
                    captions to important
                    moments.
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
                    between important sections.
                </span>

            </div>
        `);

    }


    if (camera) {

        steps.push(`
            <div class="step">

                <strong>
                    🎥 CAMERA
                </strong>

                <br>

                <span>
                    Use subtle zoom and
                    movement to emphasize
                    gameplay.
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
                    Slow the strongest moment
                    briefly before the final action.
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
                Use ${music} and synchronize
                important actions with the beat.
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
                Cut immediately after
                the strongest final moment.
            </span>

        </div>
    `);


    montage.innerHTML = `

        <h3>
            ⚡ ${game.toUpperCase()} Edit Plan
        </h3>

        ${steps.join("")}

        <div class="summary">

            <strong>
                🎯 Clip Information
            </strong>

            <br><br>

            🎮 Game:
            ${game}

            <br>

            ⏱️ Duration:
            ${
                videoDuration
                    ? formatTime(videoDuration)
                    : "Unknown"
            }

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

            📍 Timeline Effects:
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

                    copyButton.textContent =
                        "Copied!";


                    setTimeout(
                        function () {

                            copyButton.textContent =
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
        String(remainingSeconds)
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


function getMarkerEmoji(type) {

    const emojis = {

        kill: "💥",

        zoom: "🔍",

        shake: "📳",

        slowmo: "🐌",

        text: "📝",

        transition: "🔄",

        important: "⭐"

    };


    return emojis[type] || "📍";

}


function getMarkerInstruction(type) {

    const instructions = {

        kill:
            "Add a quick zoom, shake and impact effect at this moment.",

        zoom:
            "Zoom into this moment to make the action stand out.",

        shake:
            "Add a short camera shake around this moment.",

        slowmo:
            "Slow the footage briefly around this important moment.",

        text:
            "Add an animated text overlay here.",

        transition:
            "Use a fast transition into the next section.",

        important:
            "Make this moment visually stand out."

    };


    return (
        instructions[type]
        ||
        "Highlight this moment in the edit."
    );

}
