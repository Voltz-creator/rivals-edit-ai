                                                                                                                                                                                                                                const generateButton = document.getElementById("generate");
const montage = document.getElementById("montage");
const copyButton = document.getElementById("copy");


generateButton.addEventListener("click", generateEdit);


function generateEdit() {

    const clip = document.getElementById("clip").value.trim();

    const game = document.getElementById("game").value;

    const music = document.getElementById("music").value;

    const intensity = document.getElementById("intensity").value;

    const format = document.getElementById("format").value;


    const text = document.getElementById("text").checked;

    const kills = document.getElementById("kills").checked;

    const transitions = document.getElementById("transitions").checked;

    const camera = document.getElementById("camera").checked;

    const slowmo = document.getElementById("slowmo").checked;


    if (clip === "") {

        montage.innerHTML = `
            <p class="empty">
                ⚠️ Describe your clip first.
            </p>
        `;

        return;
    }


    let intensityText = "";

    if (intensity === "chill") {
        intensityText = "Use smooth cuts and subtle effects.";
    }

    if (intensity === "fast") {
        intensityText = "Use fast cuts and strong beat synchronization.";
    }

    if (intensity === "insane") {
        intensityText = "Use very fast cuts, aggressive effects and intense beat synchronization.";
    }


    let formatText = "";

    if (format === "short") {
        formatText = "Keep the edit vertical and optimized for YouTube Shorts.";
    }

    if (format === "tiktok") {
        formatText = "Keep the edit vertical and optimized for TikTok.";
    }

    if (format === "youtube") {
        formatText = "Use a wider YouTube format and give the clips more breathing room.";
    }


    let musicText = "";

    if (music === "phonk") {
        musicText = "Sync important actions with the bass and strongest beats.";
    }

    if (music === "trap") {
        musicText = "Sync cuts with the drums and bass hits.";
    }

    if (music === "drill") {
        musicText = "Use sharp cuts synchronized with the rhythm.";
    }

    if (music === "electronic") {
        musicText = "Use beat drops and electronic rhythm changes for transitions.";
    }

    if (music === "none") {
        musicText = "Focus on gameplay audio and sound effects.";
    }


    let steps = [];


    /* INTRO */

    steps.push(`
        <div class="step">
            <strong>00:00 — INTRO</strong><br>
            <span>Start immediately with the most interesting moment of the clip. Avoid a long intro.</span>
        </div>
    `);


    /* CUTS */

    steps.push(`
        <div class="step">
            <strong>00:01 — CUTS</strong><br>
            <span>${intensityText}</span>
        </div>
    `);


    /* KILL EFFECTS */

    if (kills) {

        steps.push(`
            <div class="step">
                <strong>💥 ON EACH KILL</strong><br>
                <span>Add a quick zoom, subtle shake and a short impact sound.</span>
            </div>
        `);

    }


    /* TEXT */

    if (text) {

        steps.push(`
            <div class="step">
                <strong>📝 TEXT</strong><br>
                <span>Use short animated text for important moments. Keep the text readable and on screen for a short time.</span>
            </div>
        `);

    }


    /* TRANSITIONS */

    if (transitions) {

        steps.push(`
            <div class="step">
                <strong>🔄 TRANSITIONS</strong><br>
                <span>Use fast transitions between major sections. Avoid using too many different transitions.</span>
            </div>
        `);

    }


    /* CAMERA */

    if (camera) {

        steps.push(`
            <div class="step">
                <strong>🎥 CAMERA EFFECTS</strong><br>
                <span>Add subtle zooms and movement during important gameplay moments.</span>
            </div>
        `);

    }


    /* SLOW MOTION */

    if (slowmo) {

        steps.push(`
            <div class="step">
                <strong>🐌 SLOW MOTION</strong><br>
                <span>Use slow motion briefly before or during the strongest moment, then return to normal speed.</span>
            </div>
        `);

    }


    /* MUSIC */

    steps.push(`
        <div class="step">
            <strong>🎵 MUSIC</strong><br>
            <span>${musicText}</span>
        </div>
    `);


    /* END */

    steps.push(`
        <div class="step">
            <strong>🏁 ENDING</strong><br>
            <span>End immediately after the final important action. Avoid unnecessary outro footage.</span>
        </div>
    `);


    montage.innerHTML = `

        <h3>⚡ Your ${game.toUpperCase()} Edit Plan</h3>

        ${steps.join("")}

        <div class="summary">

            <strong>🎯 Final settings</strong><br><br>

            🎮 Game: ${game.toUpperCase()}<br>

            🎵 Music: ${music}<br>

            ⚡ Intensity: ${intensity}<br>

            📱 Format: ${format}<br><br>

            ${formatText}

        </div>

    `;
}


/* COPY BUTTON */

copyButton.addEventListener("click", function () {

    const text = montage.innerText;

    if (!text.trim()) {
        return;
    }


    navigator.clipboard.writeText(text)
        .then(function () {

            copyButton.innerText = "Copied!";

            setTimeout(function () {
                copyButton.innerText = "Copy";
            }, 1500);

        })
        .catch(function () {

            copyButton.innerText = "Copy failed";

            setTimeout(function () {
                copyButton.innerText = "Copy";
            }, 1500);

        });

});                                                                                                                                                   
