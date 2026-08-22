const generateButton = document.getElementById("generate");
const montage = document.getElementById("montage");

generateButton.addEventListener("click", generateMontage);

function generateMontage() {

    const clip = document.getElementById("clip").value;
        const style = document.getElementById("style").value;

            if (clip.trim() === "") {
                    montage.innerHTML = `
                                <p>⚠️ Décris d'abord ton clip.</p>
                                        `;
                                                return;
                                                    }

                                                        let result = "";

                                                            if (style === "dynamic") {

                                                                    result = `
                                                                                <h3>⚡ Montage dynamique</h3>

                                                                                            <p><strong>✂️ Coupures :</strong> Coupe les moments inutiles et garde uniquement l'action.</p>

                                                                                                        <p><strong>💥 Kill :</strong> Ajoute un léger zoom et un effet de shake au moment du kill.</p>

                                                                                                                    <p><strong>📝 Texte :</strong> Affiche un texte court juste après chaque action importante.</p>

                                                                                                                                <p><strong>🔄 Transition :</strong> Utilise une transition rapide entre les séquences.</p>

                                                                                                                                            <p><strong>🔊 Audio :</strong> Synchronise les effets sonores avec les tirs et les kills.</p>

                                                                                                                                                        <p><strong>🎵 Musique :</strong> Fais correspondre les changements de scène avec les beats.</p>
                                                                                                                                                                `;

                                                                                                                                                                    } else if (style === "phonk") {

                                                                                                                                                                            result = `
                                                                                                                                                                                        <h3>🔥 Montage Phonk</h3>

                                                                                                                                                                                                    <p><strong>✂️ Coupures :</strong> Coupe rapidement sur les beats.</p>

                                                                                                                                                                                                                <p><strong>💥 Kill :</strong> Ajoute un zoom rapide + shake.</p>

                                                                                                                                                                                                                            <p><strong>📝 Texte :</strong> Texte très court avec apparition rapide.</p>

                                                                                                                                                                                                                                        <p><strong>⚡ Effet :</strong> Ajoute un flash très court sur les actions importantes.</p>

                                                                                                                                                                                                                                                    <p><strong>🎵 Musique :</strong> Synchronise les kills avec les basses et les beats.</p>
                                                                                                                                                                                                                                                            `;

                                                                                                                                                                                                                                                                } else if (style === "clean") {

                                                                                                                                                                                                                                                                        result = `
                                                                                                                                                                                                                                                                                    <h3>✨ Montage Clean</h3>

                                                                                                                                                                                                                                                                                                <p><strong>✂️ Coupures :</strong> Garde uniquement les meilleures séquences.</p>

                                                                                                                                                                                                                                                                                                            <p><strong>📝 Texte :</strong> Utilise peu de texte pour garder l'écran propre.</p>

                                                                                                                                                                                                                                                                                                                        <p><strong>💥 Kill :</strong> Petit zoom discret.</p>

                                                                                                                                                                                                                                                                                                                                    <p><strong>🔄 Transition :</strong> Transition simple et rapide.</p>

                                                                                                                                                                                                                                                                                                                                                <p><strong>🔊 Audio :</strong> Ajoute quelques effets sonores propres.</p>
                                                                                                                                                                                                                                                                                                                                                        `;

                                                                                                                                                                                                                                                                                                                                                            } else if (style === "cinematic") {

                                                                                                                                                                                                                                                                                                                                                                    result = `
                                                                                                                                                                                                                                                                                                                                                                                <h3>🎬 Montage Cinematic</h3>

                                                                                                                                                                                                                                                                                                                                                                                            <p><strong>✂️ Coupures :</strong> Utilise des plans plus longs.</p>

                                                                                                                                                                                                                                                                                                                                                                                                        <p><strong>🎥 Effets :</strong> Ajoute des mouvements de caméra et des ralentis légers.</p>

                                                                                                                                                                                                                                                                                                                                                                                                                    <p><strong>📝 Texte :</strong> Texte minimaliste.</p>

                                                                                                                                                                                                                                                                                                                                                                                                                                <p><strong>🎵 Musique :</strong> Fais monter l'intensité avant les moments importants.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        `;
                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                                montage.innerHTML = result;
                                                                                                                                                                                                                                                                                                                                                                                                                                                }