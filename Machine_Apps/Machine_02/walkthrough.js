
(() => {
    const panel = document.getElementById("walkthroughContent");
    const intro = document.getElementById("walkthroughLock");
    const button = document.getElementById("walkthroughUnlock");
    const slot = document.getElementById("walkthroughViewer");
    const message = document.getElementById("walkthroughMessage");
    const closeButton = document.getElementById("walkthroughRelock");
    let reader;
    let opening;

    function close() {
        opening?.abort();
        opening = null;
        reader?.destroy();
        reader = null;
        slot.replaceChildren();
        panel.hidden = true;
        panel.style.display = "none";
        panel.classList.add("hidden");
        intro.classList.remove("hidden");
        intro.hidden = false;
        intro.style.display = "block";
        button.disabled = false;
        message.textContent = "";
    }

    async function open() {
        if (opening || reader) return;
        const request = new AbortController();
        opening = request;
        button.disabled = true;
        message.textContent = "Opening walkthrough…";
        try {
            const response = await fetch("walkthrough.pdf", {signal: request.signal});
            if (!response.ok) throw Error("Walkthrough unavailable");
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (request.signal.aborted) return;
            panel.hidden = false;
            panel.style.display = "block";
            panel.classList.remove("hidden");
            const currentReader = await window.DFIRPdfReader.open(bytes, slot);
            if (request.signal.aborted) {
                currentReader.destroy();
                return;
            }
            reader = currentReader;
            intro.hidden = true;
            intro.style.display = "none";
            intro.classList.add("hidden");
            message.textContent = "";
        } catch (error) {
            if (request.signal.aborted) return;
            close();
            message.textContent = "The walkthrough could not open. Refresh the page and try again.";
        } finally {
            if (opening === request) opening = null;
            if (!request.signal.aborted) button.disabled = false;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        close();
        button.addEventListener("click", open);
        closeButton.addEventListener("click", close);
        const reset = window.resetMachine;
        window.resetMachine = function (...args) {
            const confirmReset = window.confirm;
            let accepted = false;
            window.confirm = (...prompt) => (accepted = confirmReset(...prompt));
            try {
                return reset.apply(this, args);
            } finally {
                window.confirm = confirmReset;
                if (accepted) close();
            }
        };
    });
    window.WalkthroughGate = {unlock: open, lock: close};
    window.addEventListener("pagehide", close);
})();
