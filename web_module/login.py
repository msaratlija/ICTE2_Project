from flask import url_for
from flask_login import current_user, login_user

from werkzeug.security import check_password_hash
from werkzeug.utils import redirect

from web_module import login_manager
from .model import User


def authenticate_user(request):
    if current_user.is_authenticated:
        return redirect(url_for('login_usr.hello_show'))

    if request.method == 'POST':
        username = request.form['username']  # test username "ddd"
        password = request.form['password']  # test password "ddd"
        user = User().get_by_username(username)

        if user is not None and check_password_hash(user.db_user.password_hash, password):
            login_user(user)
            return redirect(url_for('login_usr.hello_show'))
        else:
            return redirect(url_for('login_usr.login_show'))
    return None


@login_manager.user_loader
def load_user(user_id):
    return User().get_by_id(user_id)


@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login_usr.login_show'))
