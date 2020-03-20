from flask import Flask
from flask_login import LoginManager
from config import get_config
from web_module import db

login_manager = LoginManager()


def init_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
    login_manager.init_app(app)

    from .routes import login_usr
    app.register_blueprint(login_usr)
    db.mongoengine_connect_db()

    return app
