chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {

        let popupFile = "";
        
        if (/^https:\/\/webbuilder\.localsearch\.com\.au\/home\/site\//.test(tab.url)) {
            popupFile = "";
        } else 
        if (/^https:\/\/webbuilder\.localsearch\.com\.au\/site\//.test(tab.url)) {
            popupFile = "preview.html";
        } else 
        if (/^https:\/\/.*\.webbuilder\.localsearch\.com\.au\//.test(tab.url)) {
            popupFile = "";
        } else 
        if (/^https:\/\/lsearch\.lightning\.force\.com\/lightning\//.test(tab.url)) {
            popupFile = "salesforce.html";
        }

        chrome.action.setPopup({ tabId: tabId, popup: popupFile });

        chrome.storage.sync.get("toggleState", (data) => {
            if (chrome.runtime.lastError) {
                console.error("Error retrieving toggle state from storage:", chrome.runtime.lastError.message);
                return;
            }

            if (data && typeof data.toggleState !== 'undefined') {
                console.log("Toggle State Data:", data.toggleState);
            } else {
                console.warn("toggleState is not set in storage.");
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("clickState", (result) => {
        if (result.clickState === undefined) {
            // Initialize clickState if not set
            chrome.storage.sync.set({ clickState: false }, () => {
                console.log("clickState initialized to false.");
            });
        } else {
            console.log("clickState:", result.clickState);
        }
    });
});