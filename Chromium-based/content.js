function convert(text, layoutMap) {

    converted = text.split('').map(char => {
        return layoutMap[char] || char;
    }).join('');

    // There is issues with writing b,B,G (it writes 2 arabic characters)
    converted = converted.replace("gN", "B");
    converted = converted.replace("gH", "G");
	console.log(converted)
    return converted;
}
const getSelectedText = () => {
  const element = document.activeElement;
  const isInTextField = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
  const selectedText = isInTextField
    ? element.value.substring(element.selectionStart, element.selectionEnd)
    : window.getSelection()?.toString() ?? "";
  return selectedText;
};

function arabicExists(text) {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.minWidth = "200px";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "16px";
    toast.style.borderRadius = "5px";
    toast.style.textAlign = "center";
    toast.style.fontSize = "17px";
    toast.style.zIndex = "1000";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.fontWeight = "bold";
	

    // Append the toast to the body
    document.body.appendChild(toast);

    // Show the toast with fade-in effect
    setTimeout(() => {
        toast.style.opacity = "1";
    }, 0);

    // Hide and remove the toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500); // Wait for fade-out transition to complete before removing
    }, 3000);
}

function isActiveElementEditable() {
    activeElement = document.activeElement;
    return (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable
    );
}

function start(){
	layoutMapEnToAr = {
		"a": "ش",
		"b": "لا",
		"c": "ؤ",
		"d": "ي",
		"e": "ث",
		"f": "ب",
		"g": "ل",
		"h": "ا",
		"i": "ه",
		"j": "ت",
		"k": "ن",
		"l": "م",
		"m": "ة",
		"n": "ى",
		"o": "خ",
		"p": "ح",
		"q": "ض",
		"r": "ق",
		"s": "س",
		"t": "ف",
		"u": "ع",
		"v": "ر",
		"w": "ص",
		"x": "ء",
		"y": "غ",
		"z": "ئ",
		";": "ك",
		",": "و",
		"[": "ج",
		"]": "د",
		"`": "ذ",
		".": "ز",
		"/": "ظ",
		"'": "ط",
		"A": "ِ",
		"B": "لآ",
		"C": "}",
		"D": "]",
		"E": "ُ",
		"F": "[",
		"G": "لأ",
		"H": "أ",
		"I": "÷",
		"J": "ـ",
		"K": "،",
		"L": "/",
		"M": "’",
		"N": "آ",
		"O": "×",
		"P": "؛",
		"Q": "َ",
		"R": "ٌ",
		"S": "ٍ",
		"T": "لإ",
		"U": "‘",
		"V": "{",
		"W": "ً",
		"X": "ْ",
		"Y": "إ",
		"Z": "~"
	};

	layoutMapArToEn = {}
	for (const [key, value] of Object.entries(layoutMapEnToAr)) {
		layoutMapArToEn[value] = key;
	}
	layoutMapArToEn["success"] = "Converted text copied to clipboard"
	layoutMapEnToAr["success"] = "تم نسخ النص بعد التحويل"

	layoutMapArToEn["error"] = "Something went wrong, please try again"
	layoutMapEnToAr["error"] = "حدث خطأ ما، حاول مرة أخرى"

	layoutMapEnToAr["emptySelection"] = "من فضلك قم بتحديد النص المراد تحويله"

	selectedText = getSelectedText();
	if (selectedText.length > 0) {

		usedMap = layoutMapEnToAr
		if (arabicExists(selectedText)) {
			usedMap = layoutMapArToEn
		}
		convertedText = convert(selectedText, usedMap);

		navigator.clipboard.writeText(convertedText).then(() => {
			showToast(usedMap["success"]);
			if (isActiveElementEditable()) {
				element = document.activeElement;
				if (element.value !== undefined) {
					startPos = element.selectionStart;
					endPos = element.selectionEnd;
					original = element.value
					element.value =
						original.substring(0, startPos) +
						convertedText +
						original.substring(endPos, original.length);
					element.selectionStart = element.selectionEnd = startPos + convertedText.length;
				} else {
					range = window.getSelection().getRangeAt(0);
					startPos = range.startOffset;
					endPos = range.endOffset;
					element.textContent =
						element.textContent.toString().substring(0, startPos) +
						convertedText +
						element.textContent.toString().substring(endPos, element.textContent.toString().length);
				}
			}
		}).catch(err => {
			showToast(layoutMapEnToAr["error"]);
		});
	}
	else{
		showToast(layoutMapEnToAr["emptySelection"]);
	}
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "gooo") {
		start();
    }
});