(function () {
  'use strict';
  window.addEventListener('load', function () {
    var forms = document.getElementsByClassName('needs-validation');
    var pass = forms[0]["sign_up_pass"]
    var confirmPass = forms[0]["repeat_pass"]
    var sing_username = forms[0]["sign_username"]
    var inv_fed = document.getElementById("pass_inv1");
    var inv_fed2 = document.getElementById("pass_inv2");
    var usr_inv = document.getElementById("usr_inv");

    pass.onchange = validatePassword;
    confirmPass.onkeyup = validatePassword;
    sing_username.onchange = checkUsername;

    function validatePassword() {
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/;
      confirmPass.setCustomValidity('');
      pass.setCustomValidity('');
      if (pass.value != confirmPass.value) {
        inv_fed2.innerHTML = "Passwords do not match."
        confirmPass.setCustomValidity('Passwords do not match.');
      }

      if (!pass.value.match(passw)) {
        inv_fed.innerHTML = "Password needs to have 6 to 50 characters which " +
          "contain at least one numeric digit, one uppercase and one lowercase letter."
        pass.setCustomValidity('Password incorrect.');
      }

      if (pass.value === "") {
        inv_fed.innerHTML = "Please provide a valid password"
      }
    }

    function checkUsername() {
      $.getJSON('/check_username', {
        username: sing_username.value,
      }, function (data) {
        sing_username.setCustomValidity('');

        if (data.result === true) {
          sing_username.setCustomValidity('The username already exists.');
          usr_inv.innerHTML = "The username already exists"
        } else {
          usr_inv.innerHTML = "Please provide a valid username."
        }

      });
      return false;
    }

    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
          hide_element($("#sing_form"))
          unhidden_element($("#spinner_wait"))

          setTimeout(function () {
            hide_element($("#spinner_wait"))
            unhidden_element($("#sing_form"))
          }, 1000);

          $.post("/sign_up_user", form_to_JSON($(this)), function (data) {
            if (data.result === true) {
              window.location.href = "/";
            }

          });
        }

        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


function form_to_JSON($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

function hide_element($el) {
  $el.removeClass('unhidden');
  $el.addClass('hidden');
}

function unhidden_element($el) {
  $el.removeClass('hidden');
  $el.addClass('unhidden');
}



