/* =========================================================
   RIVAL EDIT AI V8
   Automatic browser video editor
   ========================================================= */


/* =========================
   ELEMENTS
========================= */

const videoInput =
    document.getElementById("videoInput");

const videoPreview =
    document.getElementById("videoPreview");

const videoArea =
    document.getElementById("videoArea");

const videoInfo =
    document.getElementById("videoInfo");

const videoError =
    document.getElementById("videoError");

const fileName =
    document.getElementById("fileName");

const durationElement =
    document.getElementById("duration");

const resolutionElement =
    document.getElementById("resolution");

const fileSizeElement =
    document.getElementById("fileSize");


const editRequest =
    document.getElementById("editRequest");

const game =
    document.getElementById("game");

const music =
    document.getElementById("music");

const intensity =
    document.getElementById("intensity");

const format =
    document.getElementById("format");


const generateButton =
    document.getElementById("generateButton");

const planSection =
    document.getElementById("planSection");

const plan =
    document.getElementById("plan");

const editCount =
    document.getElementById("editCount");

const applyButton =
    document.getElementById("applyButton");


const editorSection =
    document.getElementById("editorSection");

const editCanvas =
    document.getElementById("editCanvas");

const playEdit =
    document.getElementById("playEdit");

const pauseEdit =
    document.getElementById("pauseEdit");

const restartEdit =
    document.getElementById("restartEdit");

const editorStatus =
    document.getElementById("editorStatus");

const renderProgress =
    document.getElementById("renderProgress");

const renderText =
    document.getElementById("renderText");

const exportButton =
    document.getElementById("exportButton");

const downloadLink =
    document.getElementById("downloadLink");


const timelineSection =
    document.getElementById("timelineSection");

const timeline =
    document.getElementById("timeline");

const timelineProgress =
    document.getElementById("timelineProgress");

const timelineMarkers =
    document.getElementById("timelineMarkers");

const timelinePlayhead =
    document.getElementById("timelinePlayhead");

const timelineTime =
    document.getElementById("timelineTime");

const timelineEnd =
    document.getElementById("timelineEnd");

const segmentList =
    document.getElementById("segmentList");


/* =========================
   VARIABLES
========================= */

let videoURL = null;

let videoDuration = 0;

let editSegments = [];

let editRunning = false;

let animationFrame = null;

let currentSegmentIndex = 0;

let exportURL = null;


/* =========================
   VIDEO UPLOAD
========================= */

videoInput.addEventListener(
    "change",
    function () {

        const file =
            videoInput.files &&
            videoInput.files[0];

        if (!file) {
            return;
        }


        /*
            Reset old state.
        */

        videoError.hidden = true;

        videoArea.hidden = false;

        videoInfo.hidden = true;

        planSection.hidden = true;

        editorSection.hidden = true;

        timelineSection.hidden = true;


        /*
            Revoke old object URL.
        */

        if (videoURL) {

            URL.revokeObjectURL(
                videoURL
            );

        }


        /*
            Create a NEW local URL.
        */

        videoURL =
            URL.createObjectURL(
                file
            );


        /*
            Important:
            reset src before loading.
        */

        videoPreview.pause();

        videoPreview.removeAttribute(
            "src"
        );

        videoPreview.load();


        /*
            Set the new video.
        */

        videoPreview.src =
            videoURL;


        fileName.textContent =
            file.name;


        fileSizeElement.textContent =
            formatFileSize(
                file.size
            );


        /*
            Ask the browser to load
            the video metadata.
        */

        videoPreview.load();


        videoPreview.onloadedmetadata =
            function () {

                videoDuration =
                    videoPreview.duration;


                if (
                    !isFinite(
                        videoDuration
                    ) ||
                    videoDuration <= 0
                ) {

                    showVideoError(
                        "The browser could not read the video duration."
                    );

                    return;

                }


                durationElement.textContent =
                    formatTime(
                        videoDuration
                    );


                resolutionElement.textContent =
                    videoPreview.videoWidth +
                    " × " +
                    videoPreview.videoHeight;


                timelineEnd.textContent =
                    formatTime(
                        videoDuration
                    );


                videoInfo.hidden = false;

                timelineSection.hidden = false;


                /*
                    Resize canvas.
                */

                setupCanvas();


                /*
                    Show first frame.
                */

                videoPreview.currentTime = 0;


                updateTimeline();


                renderTimeline();


                renderFirstFrame();

            };


        videoPreview.onerror =
            function () {

                showVideoError(
                    "This video could not be loaded. Try an MP4/H.264 video."
                );

            };

    }
);


/* =========================
   VIDEO ERROR
========================= */

function showVideoError(message) {

    videoError.textContent =
        message;

    videoError.hidden = false;

}


/* =========================
   CANVAS
========================= */

function setupCanvas() {

    if (
        !videoPreview.videoWidth ||
        !videoPreview.videoHeight
    ) {
        return;
    }


    editCanvas.width =
        videoPreview.videoWidth;

    editCanvas.height =
        videoPreview.videoHeight;

}


/* =========================
   FIRST FRAME
========================= */

function renderFirstFrame() {

    const ctx =
        editCanvas.getContext("2d");

    if (
        !videoPreview.videoWidth
    ) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        editCanvas.width,
        editCanvas.height
    );


    drawVideoFrame(
        ctx,
        videoPreview,
        {
            zoom: 1,
            shake: false,
            text: ""
        }
    );

}


/* =========================
   GENERATE EDIT
========================= */

generateButton.addEventListener(
    "click",
    generateAutomaticEdit
);


function generateAutomaticEdit() {

    if (!videoDuration) {

        showVideoError(
            "Choose a video before creating an edit."
        );

        return;

    }


    const request =
        editRequest.value
            .trim()
            .toLowerCase();


    /*
        If the user gives no description,
        we still create a default edit.
    */

    editSegments =
        createAutomaticSegments(
            request
        );


    renderPlan();

    renderTimeline();

    planSection.hidden = false;

}


/* =========================
   AUTO SEGMENTS
========================= */

function createAutomaticSegments(
    request
) {

    const duration =
        videoDuration;


    const segments = [];


    /*
        Detect requested effects.
        English + French keywords.
    */

    const wantsSlowmo =
        containsAny(
            request,
            [
                "slow motion",
                "slowmo",
                "slow-mo",
                "slow",
                "ralenti"
            ]
        );


    const wantsZoom =
        containsAny(
            request,
            [
                "zoom",
                "zoom in",
                "punch zoom"
            ]
        );


    const wantsShake =
        containsAny(
            request,
            [
                "shake",
                "camera shake",
                "screen shake",
                "tremble"
            ]
        );


    const wantsText =
        containsAny(
            request,
            [
                "text",
                "caption",
                "subtitle",
                "texte",
                "sous-titre"
            ]
        );


    const wantsTransition =
        containsAny(
            request,
            [
                "transition",
                "transitions",
                "cut",
                "coupure"
            ]
        );


    const wantsFast =
        containsAny(
            request,
            [
                "fast",
                "quick",
                "rapid",
                "rapide",
                "dynamic"
            ]
        );


    const wantsStrong =
        containsAny(
            request,
            [
                "strong",
                "hard",
                "powerful",
                "intense",
                "insane",
                "fort",
                "puissant"
            ]
        );


    /*
        Base montage.

        We split the video into sections
        instead of putting effects on
        the whole clip.
    */

    const introEnd =
        Math.min(
            duration * 0.18,
            4
        );


    const middleStart =
        duration * 0.38;


    const middleEnd =
        duration * 0.62;


    const finalStart =
        Math.max(
            duration * 0.78,
            duration - 4
        );


    /*
        INTRO
    */

    segments.push({

        start: 0,

        end: introEnd,

        type: "hook",

        zoom:
            wantsZoom
                ? 1.25
                : 1.0,

        shake:
            false,

        slowmo:
            false,

        text:
            wantsText
                ? "WATCH THIS"
                : "",

        transition:
            false

    });


    /*
        MAIN ACTION
    */

    segments.push({

        start: introEnd,

        end: middleStart,

        type: "action",

        zoom:
            wantsZoom
                ? (
                    wantsStrong
                        ? 1.48
                        : 1.35
                )
                : 1,

        shake:
            wantsShake,

        slowmo:
            false,

        text:
            wantsText
                ? "CLUTCH"
                : "",

        transition:
            wantsTransition

    });


    /*
        SECOND ACTION
    */

    segments.push({

        start: middleStart,

        end: middleEnd,

        type: "action",

        zoom:
            wantsZoom
                ? (
                    wantsStrong
                        ? 1.55
                        : 1.4
                )
                : 1,

        shake:
            wantsShake,

        slowmo:
            false,

        text:
            wantsText
                ? "INSANE"
                : "",

        transition:
            wantsTransition

    });


    /*
        FINAL MOMENT
    */

    segments.push({

        start: middleEnd,

        end: finalStart,

        type: "build",

        zoom:
            wantsZoom
                ? 1.32
                : 1,

        shake:
            false,

        slowmo:
            false,

        text: "",

        transition:
            wantsTransition

    });


    /*
        FINAL KILL / MOMENT

        IMPORTANT:
        slow motion is ONLY here.

        It does NOT affect the whole video.
    */

    segments.push({

        start: finalStart,

        end: duration,

        type: "final",

        zoom:
            wantsZoom
                ? (
                    wantsStrong
                        ? 1.65
                        : 1.48
                )
                : 1,

        shake:
            wantsShake,

        slowmo:
            wantsSlowmo,

        text:
            wantsText
                ? "FINAL"
                : "",

        transition:
            false

    });


    /*
        Fast intensity makes the
        montage cuts more aggressive.
    */

    if (wantsFast) {

        segments.forEach(
            function (segment) {

                segment.zoom =
                    Math.min(
                        segment.zoom + 0.08,
                        1.75
                    );

            }
        );

    }


    return segments;

}


/* =========================
   RENDER PLAN
========================= */

function renderPlan() {

    plan.innerHTML = "";


    editCount.textContent =
        editSegments.length +
        " sections";


    editSegments.forEach(
        function (
            segment,
            index
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "edit-step";


            const effects =
                [];


            if (
                segment.zoom > 1
            ) {

                effects.push(
                    "🔥 Strong Zoom"
                );

            }


            if (
                segment.shake
            ) {

                effects.push(
                    "💥 Shake"
                );

            }


            if (
                segment.slowmo
            ) {

                effects.push(
                    "🐌 Slow Motion"
                );

            }


            if (
                segment.text
            ) {

                effects.push(
                    "📝 Animated Text"
                );

            }


            if (
                segment.transition
            ) {

                effects.push(
                    "🔄 Transition"
                );

            }


            if (
                effects.length === 0
            ) {

                effects.push(
                    "🎬 Normal footage"
                );

            }


            div.innerHTML = `

                <strong>
                    ${index + 1}.
                    ${capitalize(segment.type)}
                </strong>

                <p>
                    ${formatTime(segment.start)}
                    →
                    ${formatTime(segment.end)}
                    <br>
                    ${effects.join(" · ")}
                </p>

            `;


            plan.appendChild(div);

        }
    );

}


/* =========================
   APPLY EDIT
========================= */

applyButton.addEventListener(
    "click",
    function () {

        editorSection.hidden =
            false;

        editorStatus.textContent =
            "Edit ready";

        editorStatus.style.color =
            "#70df8a";

        currentSegmentIndex = 0;

        renderFirstFrame();

        editorSection.scrollIntoView(
            {
                behavior: "smooth"
            }
        );

    }
);


/* =========================
   PLAY AUTOMATIC EDIT
========================= */

playEdit.addEventListener(
    "click",
    playAutomaticEdit
);


async function playAutomaticEdit() {

    if (
        !editSegments.length
    ) {

        return;

    }


    if (editRunning) {

        return;

    }


    editRunning = true;


    currentSegmentIndex = 0;


    videoPreview.pause();


    await playCurrentSegment();


}


/* =========================
   PLAY SEGMENT
========================= */

async function playCurrentSegment() {

    if (
        !editRunning
    ) {

        return;

    }


    if (
        currentSegmentIndex >=
        editSegments.length
    ) {

        stopAutomaticEdit();

        return;

    }


    const segment =
        editSegments[
            currentSegmentIndex
        ];


    /*
        Start at this segment only.
    */

    videoPreview.currentTime =
        segment.start;


    /*
        Slow motion ONLY inside
        this segment.
    */

    videoPreview.playbackRate =
        segment.slowmo
            ? 0.45
            : 1;


    try {

        await videoPreview.play();

    } catch (error) {

        console.log(
            "Playback waiting for user interaction."
        );

    }


    drawEditorLoop();

}


/* =========================
   EDITOR LOOP
========================= */

function drawEditorLoop() {

    if (
        !editRunning
    ) {

        return;

    }


    const segment =
        editSegments[
            currentSegmentIndex
        ];


    if (!segment) {

        stopAutomaticEdit();

        return;

    }


    /*
        Stop the current segment
        at its END.

        This is what makes
        slow motion local.
    */

    if (
        videoPreview.currentTime >=
        segment.end
    ) {

        videoPreview.pause();

        currentSegmentIndex++;

        playCurrentSegment();

        return;

    }


    drawVideoFrame(
        editCanvas.getContext("2d"),
        videoPreview,
        {

            zoom:
                segment.zoom,

            shake:
                segment.shake,

            text:
                segment.text

        }
    );


    updateEditorProgress(
        segment
    );


    animationFrame =
        requestAnimationFrame(
            drawEditorLoop
        );

}


/* =========================
   DRAW VIDEO
========================= */

function drawVideoFrame(
    ctx,
    video,
    effects
) {

    const canvas =
        ctx.canvas;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const zoom =
        effects.zoom || 1;


    const shake =
        effects.shake;


    let shakeX = 0;

    let shakeY = 0;


    /*
        Strong shake effect.
    */

    if (shake) {

        shakeX =
            (Math.random() - 0.5)
            * 35;

        shakeY =
            (Math.random() - 0.5)
            * 35;

    }


    const scale =
        Math.max(
            canvas.width /
                video.videoWidth,

            canvas.height /
                video.videoHeight
        );


    const width =
        video.videoWidth *
        scale *
        zoom;


    const height =
        video.videoHeight *
        scale *
        zoom;


    const x =
        (
            canvas.width -
            width
        ) / 2 +
        shakeX;


    const y =
        (
            canvas.height -
            height
        ) / 2 +
        shakeY;


    ctx.save();


    ctx.drawImage(
        video,
        x,
        y,
        width,
        height
    );


    ctx.restore();


    /*
        Text animation.
    */

    if (
        effects.text
    ) {

        const progress =
            video.currentTime %
            0.8;


        const alpha =
            Math.min(
                progress / 0.15,
                1
            );


        ctx.save();

        ctx.globalAlpha =
            alpha;

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.font =
            "900 70px Arial";


        /*
            Shadow.
        */

        ctx.shadowColor =
            "black";

        ctx.shadowBlur =
            15;


        ctx.fillStyle =
            "white";


        ctx.fillText(
            effects.text,
            canvas.width / 2,
            canvas.height * 0.18
        );


        ctx.restore();

    }

}


/* =========================
   PAUSE
========================= */

pauseEdit.addEventListener(
    "click",
    function () {

        videoPreview.pause();

        editRunning = false;

        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        editorStatus.textContent =
            "Paused";

    }
);


/* =========================
   RESTART
========================= */

restartEdit.addEventListener(
    "click",
    function () {

        videoPreview.pause();

        editRunning = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        currentSegmentIndex = 0;

        videoPreview.currentTime = 0;

        videoPreview.playbackRate = 1;

        renderFirstFrame();

        updateTimeline();

        editorStatus.textContent =
            "Ready";

    }
);


/* =========================
   STOP
========================= */

function stopAutomaticEdit() {

    editRunning = false;

    videoPreview.pause();

    videoPreview.playbackRate = 1;


    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    editorStatus.textContent =
        "Finished";

}


/* =========================
   EDITOR PROGRESS
========================= */

function updateEditorProgress(
    segment
) {

    const total =
        videoDuration;


    const percentage =
        (
            videoPreview.currentTime /
            total
        ) * 100;


    renderProgress.style.width =
        percentage + "%";


    renderText.textContent =
        "Editing " +
        formatTime(
            videoPreview.currentTime
        ) +
        " / " +
        formatTime(
            total
        );


    updateTimeline();

}


/* =========================
   TIMELINE CLICK
========================= */

timeline.addEventListener(
    "pointerdown",
    function (event) {

        if (!videoDuration) {
            return;
        }


        const rect =
            timeline.getBoundingClientRect();


        const position =
            event.clientX -
            rect.left;


        const percentage =
            Math.max(
                0,
                Math.min(
                    1,
                    position /
                    rect.width
                )
            );


        videoPreview.currentTime =
            percentage *
            videoDuration;


        videoPreview.pause();

        editRunning = false;

        videoPreview.playbackRate =
            1;


        updateTimeline();

        renderFirstFrame();

    }
);


/* =========================
   TIMELINE UPDATE
========================= */

function updateTimeline() {

    if (
        !videoDuration
    ) {

        return;

    }


    const percentage =
        (
            videoPreview.currentTime /
            videoDuration
        ) * 100;


    timelineProgress.style.width =
        percentage + "%";


    timelinePlayhead.style.left =
        percentage + "%";


    timelineTime.textContent =
        formatTime(
            videoPreview.currentTime
        );

}


/* =========================
   TIMELINE MARKERS
========================= */

function renderTimeline() {

    timelineMarkers.innerHTML =
        "";

    segmentList.innerHTML =
        "";


    editSegments.forEach(
        function (
            segment
        ) {

            const start =
                (
                    segment.start /
                    videoDuration
                ) * 100;


            const end =
                (
                    segment.end /
                    videoDuration
                ) * 100;


            const marker =
                document.createElement(
                    "div"
                );


            marker.className =
                "timeline-marker";


            if (
                segment.slowmo
            ) {

                marker.classList.add(
                    "slowmo"
                );

            }

            else if (
                segment.zoom > 1
            ) {

                marker.classList.add(
                    "zoom"
                );

            }

            else if (
                segment.text
            ) {

                marker.classList.add(
                    "text"
                );

            }

            else if (
                segment.shake
            ) {

                marker.classList.add(
                    "shake"
                );

            }


            marker.style.left =
                start + "%";


            marker.style.height =
                "calc(" +
                (
                    (end - start)
                ) +
                "%)";


            timelineMarkers.appendChild(
                marker
            );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "segment";


            item.innerHTML = `

                <span>
                    ${formatTime(segment.start)}
                    →
                    ${formatTime(segment.end)}
                </span>

                <span class="segment-type">
                    ${capitalize(segment.type)}
                </span>

            `;


            segmentList.appendChild(
                item
            );

        }
    );

}


/* =========================
   EXPORT
========================= */

exportButton.addEventListener(
    "click",
    exportEditedVideo
);


async function exportEditedVideo() {

    if (
        !editSegments.length
    ) {

        alert(
            "Create an automatic edit first."
        );

        return;

    }


    if (
        !editCanvas.captureStream
    ) {

        alert(
            "Your browser does not support video export."
        );

        return;

    }


    exportButton.disabled =
        true;


    downloadLink.hidden =
        true;


    renderText.textContent =
        "Preparing export...";


    renderProgress.style.width =
        "0%";


    /*
        Canvas video stream.
    */

    const canvasStream =
        editCanvas.captureStream(
            30
        );


    /*
        Try to capture the video's
        audio stream too.
    */

    let finalStream =
        canvasStream;


    try {

        if (
            videoPreview.captureStream
        ) {

            const sourceStream =
                videoPreview.captureStream();


            const audioTracks =
                sourceStream.getAudioTracks();


            audioTracks.forEach(
                function (track) {

                    canvasStream.addTrack(
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


    /*
        Select supported codec.
    */

    const mimeTypes = [

        "video/webm;codecs=vp9,opus",

        "video/webm;codecs=vp8,opus",

        "video/webm"

    ];


    let mimeType =
        "";


    for (
        const type
        of mimeTypes
    ) {

        if (
            MediaRecorder.isTypeSupported(
                type
            )
        ) {

            mimeType =
                type;

            break;

        }

    }


    if (!mimeType) {

        alert(
            "Your browser does not support video recording."
        );

        exportButton.disabled =
            false;

        return;

    }


    const recorder =
        new MediaRecorder(
            finalStream,
            {
                mimeType
            }
        );


    const chunks = [];


    recorder.ondataavailable =
        function (event) {

            if (
                event.data &&
                event.data.size > 0
            ) {

                chunks.push(
                    event.data
                );

            }

        };


    recorder.onstop =
        function () {

            const blob =
                new Blob(
                    chunks,
                    {
                        type: mimeType
                    }
                );


            if (
                exportURL
            ) {

                URL.revokeObjectURL(
                    exportURL
                );

            }


            exportURL =
                URL.createObjectURL(
                    blob
                );


            downloadLink.href =
                exportURL;


            downloadLink.download =
                "rival-edit-v8.webm";


            downloadLink.hidden =
                false;


            renderText.textContent =
                "Export finished!";


            renderProgress.style.width =
                "100%";


            exportButton.disabled =
                false;

        };


    /*
        Start recording.
    */

    recorder.start();


    /*
        Render every segment.
    */

    await renderExportSegments();


    recorder.stop();

}


/* =========================
   RENDER EXPORT SEGMENTS
========================= */

async function renderExportSegments() {

    videoPreview.pause();

    videoPreview.playbackRate =
        1;


    for (
        let i = 0;
        i < editSegments.length;
        i++
    ) {

        const segment =
            editSegments[i];


        currentSegmentIndex =
            i;


        videoPreview.currentTime =
            segment.start;


        await waitForSeek();


        videoPreview.playbackRate =
            segment.slowmo
                ? 0.45
                : 1;


        await playExportSegment(
            segment
        );


        videoPreview.pause();

    }


    videoPreview.playbackRate =
        1;

}


/* =========================
   EXPORT SEGMENT
========================= */

function playExportSegment(
    segment
) {

    return new Promise(
        async function (resolve) {

            try {

                await videoPreview.play();

            } catch (error) {

                console.log(
                    error
                );

            }


            function draw() {

                if (
                    videoPreview.currentTime >=
                    segment.end
                ) {

                    cancelAnimationFrame(
                        frame
                    );

                    resolve();

                    return;

                }


                drawVideoFrame(
                    editCanvas.getContext(
                        "2d"
                    ),
                    videoPreview,
                    {
                        zoom:
                            segment.zoom,

                        shake:
                            segment.shake,

                        text:
                            segment.text
                    }
                );


                const percentage =
                    (
                        videoPreview.currentTime /
                        videoDuration
                    ) * 100;


                renderProgress.style.width =
                    percentage + "%";


                renderText.textContent =
                    "Exporting: " +
                    Math.round(
                        percentage
                    ) +
                    "%";


                frame =
                    requestAnimationFrame(
                        draw
                    );

            }


            let frame;

            draw();

        }
    );

}


/* =========================
   SEEK WAIT
========================= */

function waitForSeek() {

    return new Promise(
        function (resolve) {

            if (
                !videoPreview.seeking
            ) {

                resolve();

                return;

            }


            videoPreview.addEventListener(
                "seeked",
                function () {

                    resolve();

                },
                {
                    once: true
                }
            );

        }
    );

}


/* =========================
   KEYWORDS
========================= */

function containsAny(
    text,
    words
) {

    return words.some(
        function (word) {

            return text.includes(
                word
            );

        }
    );

}


/* =========================
   CAPITALIZE
========================= */

function capitalize(
    text
) {

    return (
        text.charAt(0)
            .toUpperCase() +
        text.slice(1)
    );

}


/* =========================
   FORMAT TIME
========================= */

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


    const remaining =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(remaining)
            .padStart(2, "0")
    );

}


/* =========================
   FILE SIZE
========================= */

function formatFileSize(
    bytes
) {

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


/* =========================
   VIDEO TIME UPDATE
========================= */

videoPreview.addEventListener(
    "timeupdate",
    function () {

        updateTimeline();

    }
);


/* =========================
   CLEANUP
========================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (
            videoURL
        ) {

            URL.revokeObjectURL(
                videoURL
            );

        }


        if (
            exportURL
        ) {

            URL.revokeObjectURL(
                exportURL
            );

        }

    }
);
