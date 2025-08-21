// Run once on page load
const url = window.location.href;


chrome.storage.sync.get("enabled", (data) => {
    if (!data.enabled) {
        return;
    }
    inject();
});

// Listen for toggle changes live
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && "enabled" in changes) {
        if (changes.enabled.newValue) {
            inject();
        } else {
            removeRefiner();
        }
    }
});





function removeRefiner() {
    document.querySelectorAll(".ask-better").forEach((btn) => btn.remove());
}





function inject() {
    attachListeners();
}





function attachListeners() {
    let inputs = [];
    if (url.includes("https://chatgpt.com") || url.includes("https://claude.ai")) {
        inputs = document.querySelectorAll(".ProseMirror");
    } else if (url.includes("https://gemini.google.com")) {
        inputs = document.querySelectorAll(".new-input-ui");
    }
    // attaching listeners to each input
    inputs.forEach((input) => {


        // Refine button next to the input
        const refineBtn = document.createElement("button");
        const icon = document.createElement("img");
        icon.src = "https://img.icons8.com/?size=100&id=12133&format=png&color=000000";
        icon.alt = "Refine";
        icon.style.width = "18px";
        icon.style.height = "18px";
        refineBtn.className = 'ask-better';
        refineBtn.type = "button";
        refineBtn.style.position = "absolute";
        refineBtn.style.cursor = "pointer";
        refineBtn.style.right = "0px";
        refineBtn.style.top = "5px";
        refineBtn.style.backgroundColor = "transparent";
        refineBtn.style.borderColor = "purple";
        refineBtn.style.borderWidth = "1px";
        refineBtn.style.borderStyle = "solid";
        refineBtn.style.borderRadius = "5px";
        refineBtn.style.padding = "3px 3px";
        refineBtn.appendChild(icon);
        // Place after input
        input.parentNode.style.position = "relative";
        input.parentNode.appendChild(refineBtn);

        // On click → replace with refined prompt
        refineBtn.addEventListener("click", async (e) => {
            e.preventDefault();        // stop form submit
            e.stopPropagation();
            const original = input.textContent;
            // Placeholder refinement (later API logic goes here)
            refineBtn.disabled = true; // Disable button to prevent multiple clicks
            refineBtn.style.cursor = "wait";
            const refined = await refinePrompt(original);
            refineBtn.style.cursor = "pointer";
            refineBtn.disabled = false; // Re-enable button after refinement

            // Replace text
            input.textContent = refined;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });

    });
}



//Request for better Prompt
async function refinePrompt(text) {
    if (!text.trim()) return text;

    try {
        const response = await fetch("https://ask-better-server.onrender.com/abhi-server", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "text": text
            })
          });

        const data = await response.json();
        if (data.refinedText === "0"){
            return text;
        }
        return data.refinedText;
    } catch (err) {
        console.error("Gemini API Error:", err);
        return text;
    }
}
