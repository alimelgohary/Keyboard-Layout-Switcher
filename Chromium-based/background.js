chrome.commands.onCommand.addListener((command) => {
	console.log("command pressed");
	if (command === "switch-layout") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {message: "gooo"})
		});
	}            
});

chrome.action.onClicked.addListener((tab) => {
    console.log("icon clicked");
    chrome.tabs.sendMessage(tab.id, {message: "gooo"})
});