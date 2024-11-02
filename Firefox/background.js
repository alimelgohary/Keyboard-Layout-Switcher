chrome.commands.onCommand.addListener((command) => {
	if (command === "switch-layout") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {message: "gooo"})
		});
	}            
});

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {message: "gooo"})
});