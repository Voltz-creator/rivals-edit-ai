/* =========================================
   RIVAL EDIT AI V7
   FREE BROWSER AUTO EDITOR
========================================= */


/* VIDEO */

const videoInput =
    document.getElementById(
        "videoInput"
    );

const videoPreview =
    document.getElementById(
        "videoPreview"
    );

const fileName =
    document.getElementById(
        "fileName"
    );

const videoInfo =
    document.getElementById(
        "videoInfo"
    );

const durationElement =
    document.getElementById(
        "duration"
    );

const resolution =
    document.getElementById(
        "resolution"
    );

const fileSize =
    document.getElementById(
        "fileSize"
    );

const videoStatus =
    document.getElementById(
        "videoStatus"
    );


/* REQUEST */

const editRequest =
    document.getElementById(
        "editRequest"
    );

const generateEdit =
    document.getElementById(
        "generateEdit"
    );

const generationStatus =
    document.getElementById(
        "generationStatus"
    );


/* SETTINGS */

const game =
    document.getElementById(
        "game"
    );

const format =
    document.getElementById(
        "format"
    );

const intensity =
    document.getElementById(
        "intensity"
    );

const music =
    document.getElementById(
        "music"
    );


/* TIMELINE */

const timelineCard =
    document.getElementById(
        "timelineCard"
    );

const timeline =
    document.getElementById(
        "timeline"
    );

const timelineProgress =
    document.getElementById(
        "timelineProgress"
    );

const timelinePlayhead =
    document.getElementById(
        "timelinePlayhead"
    );

const timelineMarkers =
    document.getElementById(
        "timelineMarkers"
    );

const timelineEnd =
    document.getElementById(
        "timelineEnd"
    );

const timelineDuration =
    document.getElementById(
        "timelineDuration"
    );

const editList =
    document.getElementById(
        "editList"
    );


/* PREVIEW */

const previewCard =
    document.getElementById(
        "previewCard"
    );

const previewButton =
    document.getElementById(
        "previewButton"
    );

const stopButton =
    document.getElementById(
        "stopButton"
    );

const previewStatus =
    document.getElementById(
        "previewStatus"
    );


/* EXPORT */

const exportCard =
    document.getElementById(
        "exportCard"
    );

const exportButton =
    document.getElementById(
        "exportButton"
    );

const exportProgress =
    document.getElementById(
        "exportProgress"
    );

const renderProgress =
    document.getElementById(
        "renderProgress"
    );

const renderText =
    document.getElementById(
        "renderText"
    );

const downloadButton =
    document.getElementById(
        "downloadButton"
    );


/* PLAN */

const planCard =
    document.getElementById(
        "planCard"
    );

const generatedPlan =
    document.getElementById(
        "generatedPlan"
    );


/* TEXT */

const textOverlay =
    document.getElementById(
        "textOverlay"
    );


/* STATE */

let videoFile = null;

let videoURL = null;

let duration = 0;

let editTimeline = [];

let currentTime = 0;

let previewRunning = false;

let previewAnimation = null;

let outputURL = null;


/* =========================================
   VIDEO UPLOAD
========================================= */

videoInput.addEventListener(
    "change",
    function () {

        const file =
            videoInput.files[0];

        if (!file) {
            return;
        }


        videoFile = file;


        if (videoURL) {

            URL.revokeObjectURL(
                videoURL
            );

        }


        videoURL =
            URL.createObjectURL(
                file
            );


        videoPreview.src =
            videoURL;


        videoPreview.hidden =
            false;


        fileName.textContent =
            file.name;


        fileSize.textContent =
            formatFileSize(
                file.size
            );


        videoInfo.hidden =
            false;


        videoStatus.textContent =
            "Video ready";


        videoPreview.addEventListener(
            "loadedmetadata",
            function () {

                duration =
                    videoPreview.duration;


                durationElement.textContent =
                    formatTime(
                        duration
                    );


                resolution.textContent =
                    videoPreview.videoWidth
                    +
                    " × "
                    +
                    videoPreview.videoHeight;


                timelineEnd.textContent =
                    formatTime(
                        duration
                    );


                timelineDuration.textContent =
                    formatTime(
                        duration
                    );

            },
            {
                once: true
            }
        );

    }
);


/* =========================================
   QUICK OPTIONS
========================================= */

document
    .querySelectorAll(
        ".quick-option"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    editRequest.value =
                        button.dataset.text;

                }
            );

        }
    );


/* =========================================
   GENERATE
========================================= */

generateEdit.addEventListener(
    "click",
    function () {

        if (!videoFile) {

            generationStatus.textContent =
                "⚠️ Choose a video first.";

            return;

        }


        if (!duration) {

            generationStatus.textContent =
                "⚠️ The video is still loading.";

            return;

        }


        generationStatus.textContent =
            "🤖 Building your automatic edit...";


        setTimeout(
            function () {

                buildAutomaticEdit();

            },
            300
        );

    }
);


/* =========================================
   BUILD AUTOMATIC EDIT
========================================= */

function buildAutomaticEdit() {

    const request =
        editRequest.value
            .trim()
            .toLowerCase();


    editTimeline = [];


    const strong =
        intensity.value === "high";


    const medium =
        intensity.value === "medium";


    /*
        Detect requested effects.
    */

    const wantsZoom =
        request.includes("zoom")
        ||
        request.includes("punch")
        ||
        request.includes("impact")
        ||
        strong;


    const wantsShake =
        request.includes("shake")
        ||
        request.includes("camera shake")
        ||
        strong;


    const wantsSlowmo =
        request.includes("slow")
        ||
        request.includes("slow-mo")
        ||
        request.includes("slow motion")
        ||
        request.includes("cinematic");


    const wantsText =
        request.includes("text")
        ||
        request.includes("caption")
        ||
        request.includes("title");


    const wantsCut =
        request.includes("cut")
        ||
        request.includes("fast")
        ||
        request.includes("aggressive");


    const wantsTransition =
        request.includes("transition")
        ||
        request.includes("smooth");


    /*
        Determine text.
    */

    let customText =
        extractQuotedText(
            editRequest.value
        );


    if (!customText) {

        if (
            request.includes(
                "insane"
            )
        ) {

            customText =
                "INSANE";

        } else if (
            request.includes(
                "headshot"
            )
        ) {

            customText =
                "HEADSHOT";

        } else {

            customText =
                "RIVALS";

        }

    }


    /*
        Automatic important moments.

        We distribute moments across
        the clip because this V7 does
        not yet use computer vision.
    */

    const moments =
        generateMoments(
            duration,
            strong
        );


    /*
        Intro.
    */

    editTimeline.push({

        time: 0,

        type: "cut",

        label:
            "Start / Hook",

        duration:
            Math.min(
                1.2,
                duration
            )

    });


    /*
        Main effects.
    */

    moments.forEach(
        function (time, index) {

            if (wantsCut) {

                editTimeline.push({

                    time:
                        Math.max(
                            0,
                            time - 0.4
                        ),

                    type:
                        "cut",

                    label:
                        "Fast Cut",

                    duration:
                        0.4

                });

            }


            if (wantsZoom) {

                editTimeline.push({

                    time:
                        time,

                    type:
                        "zoom",

                    label:
                        "Strong Zoom",

                    duration:
                        strong
                            ? 0.8
                            : 0.6

                });

            }


            if (wantsShake) {

                editTimeline.push({

                    time:
                        time,

                    type:
                        "shake",

                    label:
                        "Impact Shake",

                    duration:
                        0.45

                });

            }


            /*
                Slow motion is placed
                only around the final
                important moment.
            */

            if (
                wantsSlowmo
                &&
                index ===
                moments.length - 1
            ) {

                editTimeline.push({

                    time:
                        time,

                    type:
                        "slowmo",

                    label:
                        "Final Slow Motion",

                    duration:
                        1.5

                });

            }


            if (
                wantsText
                &&
                index === 0
            ) {

                editTimeline.push({

                    time:
                        time,

                    type:
                        "text",

                    label:
                        customText,

                    duration:
                        1.2,

                    text:
                        customText

                });

            }

        }
    );


    /*
        Transition near the middle.
    */

    if (wantsTransition) {

        editTimeline.push({

            time:
                duration * 0.5,

            type:
                "transition",

            label:
                "Smooth Transition",

            duration:
                0.5

        });

    }


    /*
        Final moment.
    */

    editTimeline.push({

        time:
            Math.max(
                0,
                duration - 1
            ),

        type:
            "cut",

        label:
            "Final Cut",

        duration:
            1

    });


    editTimeline.sort(
        function (a, b) {

            return a.time - b.time;

        }
    );


    renderAutomaticTimeline();


    renderPlan();


    timelineCard.hidden =
        false;

    previewCard.hidden =
        false;

    exportCard.hidden =
        false;

    planCard.hidden =
        false;


    generationStatus.textContent =
        "✅ Automatic edit generated.";

}


/* =========================================
   GENERATE MOMENTS
========================================= */

function generateMoments(
    length,
    strong
) {

    if (length <= 3) {

        return [
            length * 0.5
        ];

    }


    if (length <= 10) {

        return [
            length * 0.35,
            length * 0.7
        ];

    }


    const result = [];


    const count =
        strong
            ? 5
            : 4;


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        result.push(
            (
                length *
                i /
                (count + 1)
            )
        );

    }


    return result;

}


/* =========================================
   RENDER TIMELINE
========================================= */

function renderAutomaticTimeline() {

    timelineMarkers.innerHTML =
        "";

    editList.innerHTML =
        "";


    editTimeline.forEach(
        function (item) {

            const percentage =
                (
                    item.time /
                    duration
                ) * 100;


            const marker =
                document.createElement(
                    "div"
                );


            marker.className =
                "auto-marker " +
                item.type;


            marker.style.left =
                percentage + "%";


            marker.title =
                item.label
                +
                " — "
                +
                formatTime(
                    item.time
                );


            timelineMarkers.appendChild(
                marker
            );


            const listItem =
                document.createElement(
                    "div"
                );


            listItem.className =
                "edit-item";


            listItem.innerHTML = `

                <div>

                    <strong>
                        ${getEmoji(item.type)}
                        ${item.label}
                    </strong>

                    <br>

                    <span>
                        ${formatTime(item.time)}
                    </span>

                </div>

                <span>
                    ${item.duration.toFixed(1)}s
                </span>

            `;


            editList.appendChild(
                listItem
            );

        }
    );

}


/* =========================================
   TIMELINE CLICK
========================================= */

timeline.addEventListener(
    "pointerdown",
    function (event) {

        if (!duration) {
            return;
        }


        const rect =
            timeline.getBoundingClientRect();


        const position =
            Math.max(
                0,
                Math.min(
                    rect.width,
                    event.clientX -
                    rect.left
                )
            );


        currentTime =
            (
                position /
                rect.width
            ) *
            duration;


        videoPreview.currentTime =
            currentTime;


        updatePlayhead();

    }
);


/* =========================================
   VIDEO TIME
========================================= */

videoPreview.addEventListener(
    "timeupdate",
    function () {

        if (!duration) {
            return;
        }


        currentTime =
            videoPreview.currentTime;


        updatePlayhead();

    }
);


/* =========================================
   PLAYHEAD
========================================= */

function updatePlayhead() {

    if (!duration) {
        return;
    }


    const percentage =
        (
            currentTime /
            duration
        ) * 100;


    timelinePlayhead.style.left =
        percentage + "%";


    timelineProgress.style.width =
        percentage + "%";


    applyPreviewEffects(
        currentTime
    );

}


/* =========================================
   PREVIEW
========================================= */

previewButton.addEventListener(
    "click",
    function () {

        if (!duration) {
            return;
        }


        stopPreview();


        previewRunning =
            true;


        videoPreview.currentTime =
            0;


        videoPreview.play();


        previewStatus.textContent =
            "▶ Playing automatic edit...";


        previewAnimation =
            requestAnimationFrame(
                previewLoop
            );

    }
);


/* =========================================
   PREVIEW LOOP
========================================= */

function previewLoop() {

    if (!previewRunning) {
        return;
    }


    const time =
        videoPreview.currentTime;


    applyPreviewEffects(
        time
    );


    if (
        time >=
        duration - 0.05
    ) {

        stopPreview();

        return;

    }


    previewAnimation =
        requestAnimationFrame(
            previewLoop
        );

}


/* =========================================
   EFFECT ENGINE
========================================= */

function applyPreviewEffects(
    time
) {

    let scale = 1;

    let x = 0;

    let y = 0;

    let rotation = 0;


    let playback =
        1;


    let text =
        "";


    editTimeline.forEach(
        function (item) {

            const distance =
                Math.abs(
                    time -
                    item.time
                );


            if (
                item.type ===
                "zoom"
                &&
                distance <=
                item.duration / 2
            ) {

                const strength =
                    1 -
                    (
                        distance /
                        (
                            item.duration /
                            2
                        )
                    );


                /*
                    Stronger zoom:
                    up to 1.45x.
                */

                scale =
                    Math.max(
                        scale,
                        1 +
                        (
                            0.45 *
                            strength
                        )
                    );

            }


            if (
                item.type ===
                "shake"
                &&
                distance <=
                item.duration / 2
            ) {

                const strength =
                    1 -
                    (
                        distance /
                        (
                            item.duration /
                            2
                        )
                    );


                x =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    20
                    *
                    strength;


                y =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    20
                    *
                    strength;


                rotation =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    4
                    *
                    strength;

            }


            /*
                Slow motion is ONLY
                active around its marker.
            */

            if (
                item.type ===
                "slowmo"
                &&
                distance <=
                item.duration / 2
            ) {

                playback =
                    0.4;

            }


            if (
                item.type ===
                "text"
                &&
                time >=
                item.time
                &&
                time <=
                item.time +
                item.duration
            ) {

                text =
                    item.text;

            }

        }
    );


    videoPreview.playbackRate =
        playback;


    videoPreview.style.transform =
        `
        translate(
            ${x}px,
            ${y}px
        )
        scale(
            ${scale}
        )
        rotate(
            ${rotation}deg
        )
        `;


    if (text) {

        textOverlay.hidden =
            false;

        textOverlay.textContent =
            text;

        textOverlay.style.top =
            "50%";

        textOverlay.style.transform =
            "translate(-50%, -50%)";

    } else {

        textOverlay.hidden =
            true;

    }

}


/* =========================================
   STOP PREVIEW
========================================= */

stopButton.addEventListener(
    "click",
    stopPreview
);


function stopPreview() {

    previewRunning =
        false;


    if (previewAnimation) {

        cancelAnimationFrame(
            previewAnimation
        );

        previewAnimation =
            null;

    }


    videoPreview.pause();


    videoPreview.playbackRate =
        1;


    videoPreview.style.transform =
        "translate(0,0) scale(1) rotate(0deg)";


    textOverlay.hidden =
        true;


    previewStatus.textContent =
        "Ready.";

}


/* =========================================
   RENDER PLAN
========================================= */

function renderPlan() {

    generatedPlan.innerHTML =
        "";


    editTimeline.forEach(
        function (item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "plan-item";


            div.innerHTML = `

                <strong>

                    ${getEmoji(item.type)}

                    ${item.label}

                </strong>

                <br>

                <span>

                    ${formatTime(item.time)}
                    →
                    ${formatTime(
                        item.time +
                        item.duration
                    )}

                </span>

            `;


            generatedPlan.appendChild(
                div
            );

        }
    );

}


/* =========================================
   EXPORT
========================================= */

exportButton.addEventListener(
    "click",
    renderEditedVideo
);


async function renderEditedVideo() {

    if (!videoFile) {

        return;

    }


    exportProgress.hidden =
        false;

    downloadButton.hidden =
        true;


    renderText.textContent =
        "Preparing video...";


    renderProgress.style.width =
        "0%";


    /*
        Canvas renderer.

        This creates a new video locally
        without uploading the user's clip.
    */

    const canvas =
        document.createElement(
            "canvas"
        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    setupCanvas(
        canvas
    );


    const stream =
        canvas.captureStream(
            30
        );


    /*
        Try to preserve audio.
    */

    try {

        if (
            typeof videoPreview
                .captureStream ===
            "function"
        ) {

            const sourceStream =
                videoPreview
                    .captureStream();


            sourceStream
                .getAudioTracks()
                .forEach(
                    function (track) {

                        stream.addTrack(
                            track
                        );

                    }
                );

        }

    } catch (error) {

        console.log(
            "Audio capture unavailable."
        );

    }


    const mimeType =
        getSupportedMimeType();


    if (!mimeType) {

        renderText.textContent =
            "Your browser does not support video export.";

        return;

    }


    const recorder =
        new MediaRecorder(
            stream,
            {
                mimeType:
                    mimeType,

                videoBitsPerSecond:
                    6000000
            }
        );


    const chunks = [];


    recorder.ondataavailable =
        function (event) {

            if (
                event.data.size >
                0
            ) {

                chunks.push(
                    event.data
                );

            }

        };


    const finished =
        new Promise(
            function (resolve) {

                recorder.onstop =
                    resolve;

            }
        );


    stopPreview();


    videoPreview.currentTime =
        0;


    videoPreview.muted =
        false;


    recorder.start(
        250
    );


    videoPreview.play();


    let lastFrame =
        -1;


    function drawFrame() {

        if (
            videoPreview.paused
            ||
            videoPreview.ended
        ) {

            recorder.stop();

            return;

        }


        const now =
            videoPreview.currentTime;


        if (
            Math.abs(
                now -
                lastFrame
            ) >
            0.02
        ) {

            drawVideoFrame(
                ctx,
                canvas,
                now
            );


            lastFrame =
                now;

        }


        const percentage =
            (
                now /
                duration
            ) * 100;


        renderProgress.style.width =
            percentage + "%";


        renderText.textContent =
            "Rendering " +
            Math.round(
                percentage
            ) +
            "%";


        requestAnimationFrame(
            drawFrame
        );

    }


    drawFrame();


    await finished;


    videoPreview.pause();

    videoPreview.currentTime =
        0;


    const blob =
        new Blob(
            chunks,
            {
                type:
                    mimeType
            }
        );


    if (outputURL) {

        URL.revokeObjectURL(
            outputURL
        );

    }


    outputURL =
        URL.createObjectURL(
            blob
        );


    downloadButton.href =
        outputURL;


    downloadButton.download =
        "rival-edit-v7.webm";


    downloadButton.hidden =
        false;


    renderProgress.style.width =
        "100%";


    renderText.textContent =
        "✅ Edit exported successfully!";

}


/* =========================================
   CANVAS
========================================= */

function setupCanvas(canvas) {

    const sourceWidth =
        videoPreview.videoWidth ||
        1920;


    const sourceHeight =
        videoPreview.videoHeight ||
        1080;


    if (
        format.value ===
        "vertical"
    ) {

        canvas.width =
            720;

        canvas.height =
            1280;

    } else if (
        format.value ===
        "square"
    ) {

        canvas.width =
            1080;

        canvas.height =
            1080;

    } else {

        canvas.width =
            1280;

        canvas.height =
            720;

    }

}


function drawVideoFrame(
    ctx,
    canvas,
    time
) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const sourceWidth =
        videoPreview.videoWidth;


    const sourceHeight =
        videoPreview.videoHeight;


    const canvasRatio =
        canvas.width /
        canvas.height;


    const sourceRatio =
        sourceWidth /
        sourceHeight;


    let drawWidth =
        canvas.width;


    let drawHeight =
        canvas.height;


    if (
        sourceRatio >
        canvasRatio
    ) {

        drawHeight =
            canvas.height;

        drawWidth =
            drawHeight *
            sourceRatio;

    } else {

        drawWidth =
            canvas.width;

        drawHeight =
            drawWidth /
            sourceRatio;

    }


    /*
        Center crop.
    */

    const baseX =
        (
            canvas.width -
            drawWidth
        ) / 2;


    const baseY =
        (
            canvas.height -
            drawHeight
        ) / 2;


    /*
        Calculate current effects.
    */

    let scale =
        1;


    let shakeX =
        0;


    let shakeY =
        0;


    let rotation =
        0;


    let text =
        "";


    editTimeline.forEach(
        function (item) {

            const distance =
                Math.abs(
                    time -
                    item.time
                );


            if (
                item.type ===
                "zoom"
                &&
                distance <=
                item.duration / 2
            ) {

                const strength =
                    1 -
                    distance /
                    (
                        item.duration /
                        2
                    );


                scale =
                    Math.max(
                        scale,
                        1 +
                        0.45 *
                        strength
                    );

            }


            if (
                item.type ===
                "shake"
                &&
                distance <=
                item.duration / 2
            ) {

                const strength =
                    1 -
                    distance /
                    (
                        item.duration /
                        2
                    );


                shakeX =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    20
                    *
                    strength;


                shakeY =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    20
                    *
                    strength;


                rotation =
                    (
                        Math.random()
                        -
                        0.5
                    )
                    *
                    0.04
                    *
                    strength;

            }


            if (
                item.type ===
                "text"
                &&
                time >=
                item.time
                &&
                time <=
                item.time +
                item.duration
            ) {

                text =
                    item.text;

            }

        }
    );


    ctx.save();


    ctx.translate(
        canvas.width / 2 +
        shakeX,
        canvas.height / 2 +
        shakeY
    );


    ctx.rotate(
        rotation
    );


    ctx.scale(
        scale,
        scale
    );


    ctx.drawImage(
        videoPreview,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );


    ctx.restore();


    /*
        Text.
    */

    if (text) {

        ctx.save();


        ctx.font =
            "900 64px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        const x =
            canvas.width / 2;


        const y =
            canvas.height / 2;


        const metrics =
            ctx.measureText(
                text
            );


        const padding =
            25;


        ctx.fillStyle =
            "rgba(0,0,0,0.65)";


        ctx.fillRect(
            x -
            metrics.width / 2 -
            padding,

            y - 45,

            metrics.width +
            padding * 2,

            90
        );


        ctx.fillStyle =
            "white";


        ctx.fillText(
            text,
            x,
            y
        );


        ctx.restore();

    }

}


/* =========================================
   MIME TYPE
========================================= */

function getSupportedMimeType() {

    const types = [

        "video/webm;codecs=vp9,opus",

        "video/webm;codecs=vp8,opus",

        "video/webm"

    ];


    for (
        const type of types
    ) {

        if (
            MediaRecorder
                .isTypeSupported(
                    type
                )
        ) {

            return type;

        }

    }


    return "";

}


/* =========================================
   HELPERS
========================================= */

function formatTime(
    seconds
) {

    if (
        !isFinite(seconds)
    ) {

        return "00:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(secs)
            .padStart(2, "0")
    );

}


function formatFileSize(
    bytes
) {

    if (
        bytes <
        1024 * 1024
    ) {

        return (
            (
                bytes /
                1024
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


function extractQuotedText(
    text
) {

    const match =
        text.match(
            /["“](.*?)["”]/
        );


    if (match) {

        return match[1];

    }


    return "";

}


function getEmoji(type) {

    const emojis = {

        cut: "✂️",

        zoom: "🔍",

        shake: "📳",

        slowmo: "🐌",

        text: "📝",

        transition: "🔄"

    };


    return (
        emojis[type]
        ||
        "✨"
    );

}
