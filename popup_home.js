// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * This class wraps the popup's form, and performs the proper clearing of data
 * based on the user's selections. It depends on the form containing a single
 * select element with an id of 'timeframe', and a single button with an id of
 * 'button'. When you write actual code you should probably be a little more
 * accepting of variance, but this is just a sample app. :)
 *
 * Most of this is boilerplate binding the controller to the UI. The bits that
 * specifically will be useful when using the BrowsingData API are contained in
 * `parseMilliseconds_`, `handleCallback_`, and `handleClick_`.
 *
 * @constructor
 */
var PopupController = function () {
    this.log_out_btn = document.getElementById('log-out');
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
     * Adds event listeners to the button in order to capture a user's click, and
     * perform some action in response.
     *
     * @private
     */
    addListeners_: function () {
        this.log_out_btn.addEventListener('click', this.handleClick_.bind(this))
        console.log("consent m. home page")
    },

    log_out_call: function () {

        var url = "http://127.0.0.1:8000/logout"

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
                window.location.href = "popup.html"; // update with new hmtl file
                chrome.browserAction.setPopup({ popup: "popup.html" }); //keep new window when popup is closed
            }
        };
    },


    /**
     * When a user clicks the button, this method is called: it reads the current
     * state of `timeframe_` in order to pull a timeframe, then calls the clearing
     * method with appropriate arguments.
     *
     * @private
     */

    handleClick_: function (e) {
        e.preventDefault()
        console.log("button clicked")
        this.log_out_call()

        return false;
    }

};

document.addEventListener('DOMContentLoaded', function () {
    window.PC = new PopupController();
});
