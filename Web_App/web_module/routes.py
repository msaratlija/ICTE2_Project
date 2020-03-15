from flask import render_template, request, Blueprint, url_for
from flask_login import login_required, logout_user
from werkzeug.utils import redirect
from .login import authenticate_user

login_usr = Blueprint('login_usr', __name__, template_folder='templates', static_folder='static')


@login_usr.route('/')
@login_required
def hello_show():
    return render_template('main_page.html')


@login_usr.route('/login', methods=['GET', 'POST'])
def login_show():
    response = authenticate_user(request)
    if response is not None:
        return response
    return render_template('login.html')


@login_usr.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_usr.login_show'))

