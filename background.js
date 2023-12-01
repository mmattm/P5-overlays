console.log("Background script loaded");

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("Background script loaded");
  if (changeInfo.status == "complete") {
    // do your things

    console.log("Background script loaded");
  }
});
