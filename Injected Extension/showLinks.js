const toggleCheckbox = document.getElementById("toggleLinks");

chrome.storage.sync.get("toggleState", (data) => {
    toggleCheckbox.checked = data.toggleState || false;
    sendToggleState(toggleCheckbox.checked);
});

toggleCheckbox.addEventListener("change", function () {
    const isChecked = this.checked;

    chrome.storage.sync.set({ toggleState: isChecked });

    sendToggleState(isChecked);
});

function sendToggleState(isChecked) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: isChecked ? "show" : "hide" });
    });
}