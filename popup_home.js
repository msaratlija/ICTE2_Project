// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * This class wraps the popup's form
 *
 * @constructor
 */
var PopupController = function () {
    var my_consents = document.getElementById("my-consents");
    my_consents.href = web_url.home

    this.log_out_btn = document.getElementById('log-out');
    this.log_username = document.getElementById('logged-user');
    this.extension_btn = document.getElementById("extension_checkbox");

    chrome.storage.local.get(['content_script_start'], function (result) {
        console.log('checkbox currently is ' + result.content_script_start);
        this.PC.extension_btn.checked = result.content_script_start
    });

    chrome.storage.local.get(['logged_username'], function (result) {
        this.PC.log_username.innerHTML = result.logged_username
        console.log('Value currently is ' + result.logged_username);
    });

    this.addListeners_();
};

PopupController.prototype = {
    /**
     * A cached reference to the button element.
     *
     * @type {Element}
     * @private
     */
    log_out_btn: null,

    /**
     * A cached reference to the button element.
     *
     * @type {Element}
     * @private
     */
    extension_btn: null,

    /**
     * Adds event listeners to the button in order to capture a user's click, and
     * perform some action in response.
     *
     * @private
     */
    addListeners_: function () {
        this.log_out_btn.addEventListener('click', this.handleClick_.bind(this))
        this.extension_btn.addEventListener('change', this.checkboxSwitch.bind(this))
        console.log("consent m. home page")
    },

    log_out_call: function () {
        var url = web_url.logout

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                chrome.storage.local.set({ "content_script_start": false}, function () {
                    console.log('checkbox is set to: ' + false);
                });
                console.log(this.responseText)
                window.location.href = "popup.html"; // update with new hmtl file
                chrome.browserAction.setPopup({ popup: "popup.html" }); //keep new window when popup is closed
            }
        };
    },


    /**
     * When a user clicks the button, this method is called
     * 
     * 
     * @private
     */
    handleClick_: function (e) {
        e.preventDefault()
        console.log("button clicked")
        this.log_out_call()
        return false;
    },

    set_chrome_storage_value: function(state){
        chrome.storage.local.set({ "content_script_start": state}, function () {
            console.log('checkbox is set to: ' + state);
        });
    },

    /**
     * When a user clicks the button, this method is called
     * 
     * 
     * @private
     */
    checkboxSwitch: function (e) {
        console.log(this.extension_btn.checked)
        this.set_chrome_storage_value(this.extension_btn.checked)
        return false;
    }

};

document.addEventListener('DOMContentLoaded', function () {
    window.PC = new PopupController();

});

