from flask import render_template, request, Blueprint, url_for, jsonify
from flask_login import login_required, logout_user, login_user, current_user
from werkzeug.security import generate_password_hash
from werkzeug.utils import redirect
from flask_paginate import Pagination, get_page_parameter

from .login import authenticate_user
from .model import User, UserDB, Consent
from .db_query import *
from config import Config

login_usr = Blueprint('login_usr', __name__, template_folder='templates', static_folder='static')


@login_usr.route('/')
@login_required
def hello_show():
    limit = 2
    buff = []
    consents = get_consents_by_user(current_user.db_user)
    count = consents.count()
    page = request.args.get(get_page_parameter(), type=int, default=1)
    start = (page - 1) * limit
    end = page * limit if count > page * limit else count
    pagination = Pagination(page=page,
                            total=count,
                            search=False,
                            record_name='consents',
                            per_page=limit,
                            css_framework="bootstrap4")
    con_data = consents[start:end] # get user consents
    for con in con_data:
        buff_item = {
            "id": con.id,
            "title": con.title,
            "url": con.url,
            "text_elements": con.text_elements,
            "click_elements": con.click_elements,
            "date_created": con.date_created
        }
        buff.append(buff_item)
    con_data = Consent.objects[start:end]
    return render_template('home.html',
                           len=len(con_data),
                           consents=con_data,
                           pagination=pagination,
                           buff=buff,
                           first_name=current_user.db_user.first_name);


@login_usr.route('/login', methods=['GET', 'POST'])
def login_show():
    response = authenticate_user(request)
    if response:
        return redirect(url_for('login_usr.hello_show'))
    return render_template('login.html')


@login_usr.route('/login_extension', methods=['POST'])
def login_extension():
    response = authenticate_user(request)
    if response:
        return jsonify(result=True)
    return jsonify(result=False)


@login_usr.route('/extension_data', methods=['POST'])
def extension_data():
    json = request.json
    update_or_modify_consent(json, current_user.db_user)
    return jsonify(result=False)


@login_usr.route('/delete_consent', methods=['POST'])
def delete_consent():
    con_id = request.form['id']
    consent = get_consent_by_id(con_id)
    consent.delete()
    if get_consent_by_id(con_id) is not None:
        return jsonify(result=False)
    return jsonify(result=True)


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


@login_usr.route('/text_elements', methods=['POST'])
def text_elements():
    txt_elems = get_consent_by_id(request.form['consent_id']).text_elements
    page = int(request.values["pageNumber"])
    limit = int(request.values["pageSize"])
    start = (page - 1) * limit
    end = page * limit if len(txt_elems) > page * limit else len(txt_elems)
    return jsonify(txt_elems[start:end])


@login_usr.route('/click_elements', methods=['POST'])
def click_elements():
    click_elems = get_consent_by_id(request.form['consent_id']).click_elements
    page = int(request.values["pageNumber"])
    limit = int(request.values["pageSize"])
    start = (page - 1) * limit
    end = page * limit if len(click_elems) > page * limit else len(click_elems)
    return jsonify(click_elems[start:end])


@login_usr.route('/text_total', methods=['POST']) # this is fine, since it is consent by id
def text_el_total_num():
    consent = get_consent_by_id(request.form['id'])
    return jsonify(len(consent.text_elements))


@login_usr.route('/click_total', methods=['POST']) # this is fine, since it is consent by id
def click_total():
    consent = get_consent_by_id(request.form['id'])
    return jsonify(len(consent.click_elements))


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
