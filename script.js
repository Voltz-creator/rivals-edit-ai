const generateButton = document.getElementById("generate");
const montage = document.getElementById("montage");

generateButton.addEventListener("click", function () {

    const clip = document.getElementById("clip").value.trim();
    const style = document.getElementById("style").value;

    if (clip === "") {
        montage.innerHTML = "<p>⚠️ Décris d'abord ton clip.</p>";
        return;
    }

    let title = "";
    let instructions = "";

    if (style === "dynamic") {
        title = "⚡ Montage dynamique";

        instructions = `
            <p>✂️ <strong>Coupures :</strong> garde uniquement les moments importants.</p>
            <p>💥 <strong>Kills :</strong> ajoute un petit zoom et un shake au moment de l'action.</p>
            <p>📝 <strong>Texte :</strong> ajoute un texte court après les moments importants.</p>
            <p>🔄 <strong>Transitions :</strong> utilise des transitions rapides entre les clips.</p>
            <p>🔊 <strong>Audio :</strong> synchronise les effets sonores avec les tirs et les kills.</p>
            <p>🎵 <strong>Musique :</strong> coupe les séquences sur les beats.</p>
        `;
    }

    if (style === "phonk") {
        title = "🔥 Montage Phonk";

        instructions = `
            <p>✂️ <strong>Coupures :</strong> fais des cuts rapides sur les beats.</p>
            <p>💥 <strong>Kills :</strong> zoom rapide + shake.</p>
            <p>⚡ <strong>Flash :</strong> ajoute un flash très court sur les actions importantes.</p>
            <p>📝 <strong>Texte :</strong> utilise des textes courts et rapides.</p>
            <p>🎵 <strong>Musique :</strong> synchronise les kills avec les basses.</p>
        `;
    }

    if (style === "clean") {
        title = "✨ Montage Clean";

        instructions = `
            <p>✂️ <strong>Coupures :</strong> garde uniquement les meilleures actions.</p>
            <p>💥 <strong>Kills :</strong> petit zoom discret.</p>
            <p>📝 <strong>Texte :</strong> peu de texte pour garder une image propre.</p>
            <p>🔄 <strong>Transitions :</strong> simples et rapides.</p>
            <p>🔊 <strong>Audio :</strong> ajoute quelques effets sonores précis.</p>
        `;
    }

    if (style === "cinematic") {
        title = "🎬 Montage Cinematic";

        instructions = `
            <p>✂️ <strong>Coupures :</strong> utilise des plans plus longs.</p>
            <p>🎥 <strong>Effets :</strong> ajoute quelques ralentis et mouvements de caméra.</p>
            <p>📝 <strong>Texte :</strong> utilise un texte minimaliste.</p>
            <p>🎵 <strong>Musique :</strong> fais monter l'intensité avant les moments importants.</p>
        `;
    }

    montage.innerHTML = `
        <h3>${title}</h3>
        ${instructions}
        <hr>
        <p>🎮 <strong>Ton clip :</strong> ${clip}</p>
    `;
});                                                                                                                                                                                                                                                                                                                                                                                                                                 
