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
    //this.button_.addEventListener('click', this.handleClick_.bind(this));
    this.submit_form_.addEventListener('submit', this.handleForm_.bind(this))
    console.log("exectuted MARKO")
  },

  authenticate_: function () {
    var url_test = "https://postman-echo.com/post"
    var params_test = "foo1=bar1&foo2=bar2"

    var url = "http://127.0.0.1:8000/login_extension"
    //var params = "username=ddd&password=ddd"
    //console.log(this.submit_form_["username"].value)
    var username = "username=" + this.submit_form_["username"].value;
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
      }
    };
  },

  /**
   * Handle a success/failure callback from the `browsingData` API methods,
   * updating the UI appropriately.
   *
   * @private
   */
  handleCallback_: function () {
    var success = document.createElement('div');
    success.classList.add('overlay');
    success.setAttribute('role', 'alert');
    success.textContent = 'Data has been cleared.';
    document.body.appendChild(success);

    setTimeout(function () { success.classList.add('visible'); }, 10);
    setTimeout(function () {
      if (close === false)
        success.classList.remove('visible');
      else
        window.close();
    }, 4000);
  },

  /**
   * When a user clicks the button, this method is called: it reads the current
   * state of `timeframe_` in order to pull a timeframe, then calls the clearing
   * method with appropriate arguments.
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
