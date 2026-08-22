const generateButton =
    document.getElementById("generate");

const montage =
    document.getElementById("montage");

const copyButton =
    document.getElementById("copy");



/* VIDEO UPLOAD */


const videoInput =
    document.getElementById("videoInput");

const videoPreview =
    document.getElementById("videoPreview");

const fileName =
    document.getElementById("fileName");

const videoInfo =
    document.getElementById("videoInfo");

const duration =
    document.getElementById("duration");

const resolution =
    document.getElementById("resolution");

const fileSize =
    document.getElementById("fileSize");



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


        fileSize.textContent =
            formatFileSize(file.size);


        videoPreview.addEventListener(
            "loadedmetadata",
            function () {

                duration.textContent =
                    formatDuration(
                        videoPreview.duration
                    );


                resolution.textContent =
                    videoPreview.videoWidth +
                    " × " +
                    videoPreview.videoHeight;

            },
            {
                once: true
            }
        );

    }
);



function formatFileSize(bytes) {

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            + " KB"
        );

    }


    return (
        (bytes / 1024 / 1024).toFixed(1)
        + " MB"
    );

}



function formatDuration(seconds) {

    if (!isFinite(seconds)) {

        return "-";

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
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0")
    );

}



/* GENERATOR */


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



    let intensityText;


    if (intensity === "chill") {

        intensityText =
            "Use smooth cuts and subtle effects.";

    }


    if (intensity === "fast") {

        intensityText =
            "Use fast cuts and strong beat synchronization.";

    }


    if (intensity === "insane") {

        intensityText =
            "Use very fast cuts, aggressive effects and intense beat synchronization.";

    }



    let musicText;


    if (music === "phonk") {

        musicText =
            "Sync important actions with the bass and strongest beats.";

    }


    if (music === "trap") {

        musicText =
            "Sync cuts with the drums and bass hits.";

    }


    if (music === "drill") {

        musicText =
            "Use sharp cuts synchronized with the rhythm.";

    }


    if (music === "electronic") {

        musicText =
            "Use beat drops and electronic rhythm changes for transitions.";

    }


    if (music === "none") {

        musicText =
            "Focus on gameplay audio and sound effects.";

    }



    let formatText;


    if (format === "short") {

        formatText =
            "Keep the edit vertical and optimized for YouTube Shorts.";

    }


    if (format === "tiktok") {

        formatText =
            "Keep the edit vertical and optimized for TikTok.";

    }


    if (format === "youtube") {

        formatText =
            "Use a wider YouTube format.";

    }



    let steps = [];



    steps.push(`

        <div class="step">

            <strong>
                00:00 — HOOK
            </strong>

            <br>

            <span>
                Start immediately with the most interesting moment. Avoid a long intro.
            </span>

        </div>

    `);



    steps.push(`

        <div class="step">

            <strong>
                00:01 — CUTS
            </strong>

            <br>

            <span>
                ${intensityText}
            </span>

        </div>

    `);



    if (kills) {

        steps.push(`

            <div class="step">

                <strong>
                    💥 KILL EFFECTS
                </strong>

                <br>

                <span>
                    Add a quick zoom, subtle shake and a short impact sound on important kills.
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
                    Use short animated text for important moments. Keep it readable and fast.
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
                    Use fast transitions between major sections. Avoid excessive transitions.
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
                    Add subtle zooms and camera movement during important gameplay moments.
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
                    Use slow motion briefly before or during the strongest moment.
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
                ${musicText}
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
                End immediately after the final important action.
            </span>

        </div>

    `);



    montage.innerHTML = `

        <h3>
            ⚡ Your ${game.toUpperCase()} Edit Plan
        </h3>


        ${steps.join("")}


        <div class="summary">

            <strong>
                🎯 Final settings
            </strong>

            <br><br>

            🎮 Game:
            ${game.toUpperCase()}

            <br>

            🎵 Music:
            ${music}

            <br>

            ⚡ Intensity:
            ${intensity}

            <br>

            📱 Format:
            ${format}

            <br><br>

            ${formatText}

        </div>

    `;

}



/* COPY */


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
            .then(function () {


                copyButton.innerText =
                    "Copied!";


                setTimeout(
                    function () {

                        copyButton.innerText =
                            "Copy";

                    },
                    1500
                );

            });

    }
);
