console.log("baaaackgrouuund");


// this is listening messages from content script 
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("Received %o from %o, frame", msg, sender.tab, sender.frameId);

    if (typeof msg === 'string'){

        chrome.storage.local.get(['content_script_start'], function (result) {
            console.log('#1 CONTENT SCRIPT currently is ' + result.content_script_start);
            sendResponse(result.content_script_start)
        });

    }else{
        send_consent(msg)
        sendResponse("Gotcha!");
    }
    return true;
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(changeInfo.status)
    if (changeInfo.status == 'complete') {
        // do your things
    }
})


function send_consent(consent) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", web_url.send_data, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(consent));

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 && JSON.parse(this.response).result == true) {
            console.log(this.responseText)
        }
    };
}