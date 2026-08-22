                                                                                                                                                                                                                                                                                                                                                                                                                             const generateButton = document.getElementById("generate");
const montage = document.getElementById("montage");

generateButton.addEventListener("click", function () {

    const clip = document.getElementById("clip").value.trim();
    const style = document.getElementById("style").value;

    if (clip === "") {
        montage.innerHTML = "<p>⚠️ Describe your clip first.</p>";
        return;
    }

    let title = "";
    let instructions = "";

    if (style === "dynamic") {
        title = "⚡ Dynamic Edit";

        instructions = `
            <p>✂️ <strong>Cuts:</strong> keep only the important moments.</p>
            <p>💥 <strong>Kills:</strong> add a small zoom and shake when the action happens.</p>
            <p>📝 <strong>Text:</strong> add short text after important moments.</p>
            <p>🔄 <strong>Transitions:</strong> use fast transitions between clips.</p>
            <p>🔊 <strong>Audio:</strong> sync sound effects with shots and kills.</p>
            <p>🎵 <strong>Music:</strong> cut the footage on the beats.</p>
        `;
    }

    if (style === "phonk") {
        title = "🔥 Phonk Edit";

        instructions = `
            <p>✂️ <strong>Cuts:</strong> make fast cuts on the beats.</p>
            <p>💥 <strong>Kills:</strong> add a quick zoom + shake.</p>
            <p>⚡ <strong>Flash:</strong> add a very short flash on important actions.</p>
            <p>📝 <strong>Text:</strong> use short and fast text animations.</p>
            <p>🎵 <strong>Music:</strong> sync kills with the bass.</p>
        `;
    }

    if (style === "clean") {
        title = "✨ Clean Edit";

        instructions = `
            <p>✂️ <strong>Cuts:</strong> keep only the best moments.</p>
            <p>💥 <strong>Kills:</strong> add a subtle zoom.</p>
            <p>📝 <strong>Text:</strong> use minimal text to keep the video clean.</p>
            <p>🔄 <strong>Transitions:</strong> use simple and fast transitions.</p>
            <p>🔊 <strong>Audio:</strong> add precise sound effects.</p>
        `;
    }

    if (style === "cinematic") {
        title = "🎬 Cinematic Edit";

        instructions = `
            <p>✂️ <strong>Cuts:</strong> use longer shots.</p>
            <p>🎥 <strong>Effects:</strong> add slow motion and subtle camera movements.</p>
            <p>📝 <strong>Text:</strong> use minimal text.</p>
            <p>🎵 <strong>Music:</strong> build intensity before important moments.</p>
        `;
    }

    montage.innerHTML = `
        <h3>${title}</h3>
        ${instructions}
        <hr>
        <p>🎮 <strong>Your clip:</strong> ${clip}</p>
    `;
});
