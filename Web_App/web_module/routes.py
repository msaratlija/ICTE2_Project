from datetime import datetime

from flask import render_template, request, Blueprint, url_for, jsonify
from flask_login import login_required, logout_user, login_user
from werkzeug.security import generate_password_hash
from werkzeug.utils import redirect

from .login import authenticate_user
from .model import User, UserDB
from config import Config

login_usr = Blueprint('login_usr', __name__, template_folder='templates', static_folder='static')


@login_usr.route('/')
@login_required
def hello_show():
    return render_template('home.html');


@login_usr.route('/login', methods=['GET', 'POST'])
def login_show():
    response = authenticate_user(request)
    if response is not None:
        return response
    return render_template('login.html')


@login_usr.route('/sign_up', methods=['GET', 'POST'])
def sign_up_show():
    return render_template('sign_up.html')


@login_usr.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_usr.login_show'))


@login_usr.route('/check_username')
def check_username():
    try:
        username = request.args.get('username', 0, type=str)
        user = User().get_by_username(username)
        if user is not None and username == user.db_user.username:
            return jsonify(result=True)
        else:
            return jsonify(result=False)
    except Exception as e:
        return str(e)


@login_usr.route('/sign_up_user', methods=['POST'])
def sign_up_user():
    try:
        new_user = UserDB()
        new_user.username = request.form['sign_username']
        new_user.first_name = request.form['first_name']
        new_user.last_name = request.form['last_name']
        new_user.email = request.form['email']
        new_usr_pass = request.form['sign_up_pass']
        new_user.password_hash = generate_password_hash(new_usr_pass, salt_length=Config.SALT_LENGTH)
        new_user.date_created = datetime.now()
        new_user.save()
        login_user(User(new_user))
        return jsonify(result=True)
    except Exception as e:
        return str(e)
