const PAUSE_CMD = "M600"; // hopefully it's supported otherwise womp womp
const LAYER_IND = ";Layer height:";

document.getElementById("ok-btn").addEventListener("click", addPause)

function addPause() {
    const fIn = document.getElementById("in-file").files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        let content = event.target.result;

        let layerSize = -1;

        let lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if(lines[i].includes(LAYER_IND)) {
                layerSize = Number(lines[i].split(LAYER_IND)[1].trim());
            }
            
        }
        if(layerSize != -1) {
            const z_off = Math.round(layerSize * document.getElementById("layer").value * 1000)/1000;
            let newContent = [];
            for (let i = 0; i < lines.length; i++) {
                const reg = new RegExp(`G0\\b.*\\bZ${z_off}\\b`);
                if(reg.test(lines[i])) {
                    newContent.push(PAUSE_CMD);
                }
                newContent.push(lines[i]);
            }

            const blob = new Blob([newContent.join("\n")], { type: "text/plain" });

            const url = URL.createObjectURL(blob);
            const link = document.getElementById("download");

            link.href = url;
            link.download = "new_and_improved" + fIn.name;
            link.style.display = "inline";
            link.textContent = "Download Processed File";
        }
    };

    reader.readAsText(fIn);
}
