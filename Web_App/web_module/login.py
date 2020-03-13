

from flask import url_for
from flask_login import current_user, login_user
from werkzeug.utils import redirect
from . import login_manager
from .model import User


new_usr = User('ddd', 1, True)


def authenticate_user(request):

    if request.method == 'POST':
        username = request.form['username']
        if current_user.is_authenticated:
            return redirect(url_for('login_usr.hello_show'))
        if username == new_usr.username:
            login_user(new_usr)
            return redirect(url_for('login_usr.hello_show'))
        else:
            return redirect(url_for('login_usr.login_show'))
    return None

@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        return new_usr
    return None


@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login_usr.login_show'))