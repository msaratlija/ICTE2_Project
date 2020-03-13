import os

from flask import Flask
from flask_login import LoginManager
from config import Config

login_manager = LoginManager()


def init_app():

    app = Flask(Config.FLASK_NAME)
    app.config.from_object('config.Config')
    login_manager.init_app(app)

    from .routes import login_usr
    app.register_blueprint(login_usr)

    return app
