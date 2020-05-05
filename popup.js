// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



/**
 * This class wraps the popup's form
 *
 * @constructor
 */
var PopupController = function () {
  var sign_up_link = document.getElementById("sign_a");
  sign_up_link.href = web_url.sing_up

  this.button_ = document.getElementById('submit_btn');
  this.submit_form_ = document.getElementById('submit_form')
  this.timeframe_ = document.getElementById('timeframe');
  
  this.addListeners_();
};

PopupController.prototype = {
  /**
   * A cached reference to the button element.
   *
   * @type {Element}
   * @private
   */
  button_: null,

  /**
   * A cached reference to the button element.
   *
   * @type {Element}
   * @private
   */
  submit_form_: null,


  /**
   * A cached reference to the select element.
   *
   * @type {Element}
   * @private
   */
  timeframe_: null,

  /**
   * Adds event listeners to the button in order to capture a user's click, and
   * perform some action in response.
   *
   * @private
   */
  addListeners_: function () {
    this.submit_form_.addEventListener('submit', this.handleForm_.bind(this))
    console.log("exectuted MARKO")
  },

  authenticate_: function () {

    var url = web_url.login // URL REPLACE

    var us_name = this.submit_form_["username"].value
    var username = "username=" + us_name
    var password = "password=" + this.submit_form_["password"].value
    var params = username + "&" + password


    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200 && JSON.parse(this.response).result == true) {
        console.log(this.responseText)
        window.location.href = "home.html"; // update with new hmtl file
        chrome.browserAction.setPopup({ popup: "home.html" }); //keep new window when popup is closed

        chrome.storage.local.set({ "logged_username": us_name }, function () {
          console.log('Value is set to: ' + us_name);
        });
      }
    };
  },

  /**
   * When a user clicks the button, this method is called.
   *
   * @private
   */

  handleClick_: function () {
    console.log("button clicked")
    this.authenticate_()
  },

  handleForm_: function (e) {
    console.log("form submited")
    e.preventDefault()
    this.authenticate_()
    return false;
  }

};

document.addEventListener('DOMContentLoaded', function () {
  window.PC = new PopupController();
});
